"""Page-specific markup changes before prep.py: data attributes for the site script
(filters, accordions, toggles), so canvas state logic becomes plain Webflow + JS.

  fixups.py <page>   (rewrites conv/<page>.html in place, idempotent)
"""
import re, sys, unicodedata
from pathlib import Path
from bs4 import BeautifulSoup


def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def tabs(soup, tab_sel, group, label_of=lambda t: t.contents[0]):
    """Filter tabs: data-filter on each tab (slug of its label, 'all' for Visi)."""
    for i, t in enumerate(soup.select(tab_sel)):
        label = str(label_of(t)).strip()
        t["data-filter-group"] = group
        t["data-filter"] = "all" if label == "Visi" else slug(label)
        for c in t.select("[class$=_count]"):
            c["data-filter-count"] = t["data-filter"]


def rental(soup):
    tabs(soup, ".rental-list_tab", "noma")
    soup.select_one(".rental-list_list")["data-filter-list"] = "noma"


def projects(soup):
    tabs(soup, ".portfolio-list_filter", "projekti", label_of=lambda t: t.get_text(strip=True))
    soup.select_one(".portfolio-list_list")["data-filter-list"] = "projekti"
    # work-type buttons after "Visi" come from the Darba veidi collection
    if not soup.select_one(".portfolio-list_filter-list"):
        btns = soup.select(".portfolio-list_filter")[1:]
        box = soup.new_tag("div")
        box["class"] = ["portfolio-list_filter-list"]
        btns[0].insert_before(box)
        for b in btns:
            box.append(b.extract())


def about(soup):
    items = soup.select(".about-team_item")
    full = next(i for i in items if i.select_one(".about-team_text-3"))
    if full is not items[0]:
        items[0].insert_before(full.extract())
    photo = full.select_one(".about-team_photo")
    if not photo.find("img"):
        img = soup.new_tag("img", attrs={"class": "about-team_image img-cover", "alt": "", "loading": "lazy",
                                         "src": "asset:site-team.jpg"})
        photo.append(img)


CALC = [(150, 350, "150–350+ €/m² atkarībā no projekta"), (110, 140, "No 110 €/m², vidēji 140 €/m²"),
        (45, 60, "No 45 €/m², vidēji 60 €/m², materiāli atsevišķi"), (120, 160, "No 120 €/m², vidēji 160 €/m²"),
        (280, 400, "No 280 €/m², vidēji 400 €/m²"), (450, 650, "No 450 €/m², vidēji 650 €/m²")]


def services(soup):
    # group tabs filter on the Grupa option name (bound to data-filter-value on each item)
    for t in soup.select(".services-list_tab"):
        label = str(t.contents[0]).strip()
        t["data-filter-group"] = "pakalpojumi"
        t["data-filter"] = "all" if label == "Visi" else label
        for c in t.select(".services-list_count"):
            c["data-filter-count"] = t["data-filter"]
    soup.select_one(".services-list_list")["data-filter-list"] = "pakalpojumi"
    # accordion: first item is the CMS template; the script opens/closes items
    item = soup.select_one(".services-list_item")
    item["class"] = ["services-list_item"]
    item.select_one(".services-list_trigger")["data-accordion-trigger"] = ""
    item.select_one(".services-list_more-text").string = "Skatīt cenas"
    # Rich Text fields replace the canvas loops (Cenā iekļauts list, price rows)
    for sel, field in ((".services-list_includes", "ieklauts"), (".services-list_prices", "cenas")):
        el = item.select_one(sel)
        new = soup.new_tag("div")
        new["class"] = el.get("class", [])
        new["data-richtext"] = field
        new.string = field
        el.replace_with(new)
    btn = item.select_one(".button-group .button")
    btn["data-calc-apply"] = ""
    # calculator
    t1, t2 = soup.select(".calc_toggle-option")
    t1["data-calc-toggle"], t2["data-calc-toggle"] = "calc", "form"
    f1, f2 = soup.select("form.calc_mode")
    f1["data-calc-mode"], f2["data-calc-mode"] = "calc", "form"
    for i, o in enumerate(soup.select(".calc_option")):
        o["data-calc-option"] = str(i)
        o["data-min"], o["data-max"], o["data-note"] = str(CALC[i][0]), str(CALC[i][1]), CALC[i][2]
    dec, inc = soup.select(".calc_stepper")
    dec["data-calc-step"], inc["data-calc-step"] = "-10", "10"
    soup.select_one(".calc_total.is-alt")["data-calc-area"] = ""
    rng = soup.select_one("input.calc_range")
    holder = soup.new_tag("div")
    holder["data-embed"] = "range"
    holder.string = "range"
    rng.replace_with(holder)
    total = soup.select_one(".calc_total.is-alt-2")
    total["data-calc-total"] = ""
    total.find_next_sibling("span")["data-calc-note"] = ""


def product(soup):
    # thumbs: a nested Collection List of the Galerija multi-image field
    for i, t in enumerate(soup.select(".rental-product_thumb")):
        t["class"] = ["rental-product_thumb"]
        t["data-thumb"] = ""
        t.attrs.pop("aria-label", None)
    soup.select_one(".rental-product_main-image")["data-main-image"] = ""
    # three CMS sections (Sadaļa 1-3): summary text + rich text; empty ones are hidden by CSS
    acc = soup.select_one(".rental-product_accordion")
    if acc.select_one(".rental-product_spec") is not None:
        summary = acc.find("summary")
        label = summary.get_text(strip=True)
        summary.clear()
        st = soup.new_tag("div")
        st["class"] = ["rental-product_summary-text"]
        st.string = label
        summary.append(st)
        spec = acc.select_one(".rental-product_spec")
        new = soup.new_tag("div")
        new["class"] = spec.get("class", [])
        new["data-richtext"] = "sadala-1-saturs"
        new.string = "sadala-1-saturs"
        spec.replace_with(new)
        note = acc.select_one(".rental-product_text-6")
        if note:
            note.decompose()
        for n in (2, 3):
            clone = BeautifulSoup(str(acc), "lxml").details
            del clone["open"]
            clone.select_one("[data-richtext]")["data-richtext"] = f"sadala-{n}-saturs"
            acc.parent.append(clone)


def placeholder(soup, el, field):
    new = soup.new_tag("div")
    new["class"] = el.get("class", [])
    new["data-richtext"] = field
    new.string = field
    el.replace_with(new)


def project(soup):
    # bound texts must be text blocks, not spans
    for sp in soup.select(".project-header_text, .project-header_wrapper-3 > .text-style-tagline, .project-header_stat > span"):
        sp.name = "div"
    soup.select_one(".project-header_play")["data-video-open"] = ""
    placeholder(soup, soup.select_one("article.project-content_rich-text"), "detalizets-apraksts")
    placeholder(soup, soup.select_one(".project-gallery_list"), "bilzu-galerija")
    video, photo = soup.select(".lightbox_component")
    video["data-lightbox"] = "video"
    wrap = video.select_one(".lightbox_wrapper")
    slot = soup.new_tag("div")
    slot["class"] = ["lightbox_video"]
    slot["data-video-slot"] = ""
    slot.string = "video"
    wrap.replace_with(slot)
    photo["data-lightbox"] = "photo"
    for lb in (video, photo):
        lb.select_one(".lightbox_btn.is-alt")["data-lightbox-close"] = ""
    prev, nxt = [b for b in photo.select(".lightbox_btn") if "is-alt" not in b.get("class", [])]
    prev["data-lightbox-prev"], nxt["data-lightbox-next"] = "", ""
    photo.select_one(".lightbox_image")["data-lightbox-image"] = ""
    photo.select_one(".lightbox_caption")["data-lightbox-count"] = ""


FIX = {"rental": rental, "projects": projects, "about": about, "services": services, "product": product,
       "project": project}

if __name__ == "__main__":
    page = sys.argv[1]
    p = Path(f"conv/{page}.html")
    soup = BeautifulSoup(p.read_text(), "lxml")
    if page in FIX:
        FIX[page](soup)
    p.write_text("".join(str(c) for c in soup.body.contents).strip())
