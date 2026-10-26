"""Split a converted page into WHTML insert fragments.

  prep.py <conv/page.html> <out/page.sections.html> [list-selector=slot ...]

Output top-level elements, in insert order: every child of <main> (one section per
fragment), then one template per CMS slot. For each `selector=slot` argument the element
matched by selector (the canvas loop container) is replaced by <div data-cms-slot=slot>,
and its first child is emitted at the end with data-cms-template=slot. The container's
classes are written to out/page.slots.json so they can go on the Collection List.

Forms are restructured for Webflow's importer: the <form> keeps only `form_component`
(the importer puts form classes on the wrapper) and its own classes move to an inner
div; `<label class="form_field">Text<input></label>` becomes a div with a separate label;
checkboxes and radios are reduced to a bare <input> whose name/value carries the label
text; submit buttons become type=submit (their text is listed in slots.json for later).
"""
import json, re, sys, unicodedata
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString, Tag


def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-") or "lauks"


def fix_forms(soup, meta):
    for n, form in enumerate(soup.find_all("form")):
        cls = form.get("class", [])
        inner = soup.new_tag("div")
        inner["class"] = cls
        for c in list(form.contents):
            inner.append(c.extract())
        form.append(inner)
        form["class"] = ["form_component"]
        name = form.get("aria-label") or f"Forma {n + 1}"
        form["name"] = name
        for a in ("aria-label", "data-if", "data-if-init", "data-calc-mode"):
            if form.get(a) is not None:
                inner[a] = form[a]
                del form[a]
        # label-wrapped fields
        for lab in inner.find_all("label"):
            ctl = lab.find(["input", "select", "textarea"])
            if ctl is None or ctl.get("type") in ("checkbox", "radio"):
                continue
            text = "".join(t for t in lab.contents if isinstance(t, NavigableString)).strip()
            if not text:
                continue
            fid = ctl.get("id") or f"{slug(name)}-{slug(text)}"
            ctl["id"] = fid
            if not ctl.get("name"):
                ctl["name"] = text
            box = soup.new_tag("div")
            box["class"] = lab.get("class", [])
            newlab = soup.new_tag("label")
            newlab["for"] = fid
            newlab.string = text
            box.append(newlab)
            box.append(ctl.extract())
            lab.replace_with(box)
        for ctl in inner.find_all(["input", "select", "textarea"]):
            if ctl.get("type") not in ("checkbox", "radio", "range") and not ctl.get("name"):
                ctl["name"] = ctl.get("placeholder") or ctl.get("id") or "Lauks"
        # choice inputs: the importer labels them with their name (checkbox) / value (radio)
        for lab in inner.find_all("label"):
            ctl = lab.find("input", type=["checkbox", "radio"])
            if ctl is None:
                continue
            text = lab.get_text(" ", strip=True)
            new = soup.new_tag("input")
            new["type"] = ctl["type"]
            new["class"] = lab.get("class", [])
            if ctl["type"] == "checkbox":
                new["name"] = text
            else:
                new["name"] = ctl.get("name", "izvele")
                new["value"] = text
                if ctl.has_attr("checked"):
                    new["checked"] = ""
            lab.replace_with(new)
        for b in inner.find_all("button"):
            if b.get("type") == "submit" or (b.find_parent("form") is form and "is-accent" in b.get("class", [])
                                              and not b.get("aria-label")):
                for s in b.find_all("svg"):
                    s.decompose()
                b["type"] = "submit"
                meta.setdefault("submits", []).append({"form": name, "text": b.get_text(" ", strip=True)})
                break


def main(src, out, *slots):
    soup = BeautifulSoup(Path(src).read_text(), "lxml")
    meta = {"slots": {}}
    templates = []
    for spec in slots:
        sel, name = spec.split("=")
        box = soup.select_one(sel)
        if box is None:
            raise SystemExit(f"no element for {sel}")
        first = next(c for c in box.children if isinstance(c, Tag))
        meta["slots"][name] = {"list_class": box.get("class", []), "item_tag": first.name}
        tpl = first.extract()
        tpl["data-cms-template"] = name
        for sp in tpl.find_all("span"):  # only text blocks (divs) can bind to CMS fields
            if not sp.find(True) and sp.get_text(strip=True):
                sp.name = "div"
        templates.append(tpl)
        slot = soup.new_tag("div")
        slot["data-cms-slot"] = name
        box.replace_with(slot)
    fix_forms(soup, meta)
    main_el = soup.find("main")
    meta["main"] = {k: v for k, v in main_el.attrs.items()}
    parts = [str(c) for c in main_el.children if isinstance(c, Tag)] + [str(t) for t in templates]
    Path(out).write_text("\n".join(parts))
    Path(out.replace(".sections.html", ".slots.json")).write_text(json.dumps(meta, ensure_ascii=False, indent=1))
    print(f"{len(parts)} fragments ({len(templates)} templates); slots: {list(meta['slots'])}")
    if meta.get("submits"):
        print("submits:", meta["submits"])


if __name__ == "__main__":
    main(*sys.argv[1:])
