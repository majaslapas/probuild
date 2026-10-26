"""Prepare Webflow WHTML payloads from an authored page (HTML + CSS).

Webflow's WHTML importer creates a style for every class rule it is given, renames the
class (button -> button-1) when the style already exists, and drops classes that have no
rule and no existing style. So each style must be sent exactly once, in the first
fragment that uses it, and never again. This script tracks that in registry.json.

  wfbuild.py build <page.html> <page.css> <out.json>   split + attach CSS + validate
  wfbuild.py commit <out.json> <index>                  mark fragment styles as created
  wfbuild.py show <out.json> <index>                    print one fragment payload
"""
import json, re, sys
from html.parser import HTMLParser
from pathlib import Path

HERE = Path(__file__).parent
REG = HERE / "registry.json"
BLOB = json.loads((HERE.parent / "blob2wf.json").read_text())
UPL = json.loads((HERE.parent / "wf-uploaded.json").read_text())
MEDIA = {
    "": "",
    "screen and (max-width: 991px)": "@media screen and (max-width: 991px)",
    "screen and (max-width: 767px)": "@media screen and (max-width: 767px)",
    "screen and (max-width: 479px)": "@media screen and (max-width: 479px)",
}
LINKS = {
    "site-01-sakums.dc.html": "/", "site-02-pakalpojumi.dc.html": "/pakalpojumi",
    "site-03-noma.dc.html": "/noma", "site-05-portfolio.dc.html": "/projekti",
    "site-07-par-mums.dc.html": "/par-mums", "site-08-kontakti.dc.html": "/kontakti",
}


def s3(url):
    """Webflow's importer only links images given as the S3 asset URL."""
    return url.replace("https://cdn.prod.website-files.com/", "https://s3.amazonaws.com/webflow-prod-assets/")


def img_url(src):
    m = re.match(r"/_blob/([0-9a-f]{32})", src)
    if m:
        return s3(BLOB[m.group(1)]["url"])
    if src.startswith("asset:"):
        return s3(UPL[src[6:]]["url"])
    return src


def load_reg():
    return set(json.loads(REG.read_text())) if REG.exists() else set()


def parse_css(text):
    """-> list of (media, selector, body, key) in source order."""
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    rules, i = [], 0

    def take_block(t, start):
        depth, j = 0, start
        while j < len(t):
            if t[j] == "{":
                depth += 1
            elif t[j] == "}":
                depth -= 1
                if depth == 0:
                    return j
            j += 1
        raise ValueError("unbalanced braces")

    def rules_in(t, media):
        out, k = [], 0
        while True:
            a = t.find("{", k)
            if a < 0:
                break
            sel = t[k:a].strip()
            b = t.find("}", a)
            body = t[a + 1:b].strip()
            for s in [x.strip() for x in sel.split(",")]:
                if not re.fullmatch(r"(\.[a-zA-Z0-9_-]+)+(:[a-z-]+(\([a-z0-9]+\))?)?", s):
                    raise ValueError(f"unsupported selector {s!r} (class chains + one pseudo only)")
                key = ".".join(re.findall(r"\.([a-zA-Z0-9_-]+)", s.split(":")[0]))
                out.append((media, s, body, key))
            k = b + 1
        return out

    while i < len(text):
        if text[i:].lstrip().startswith("@media"):
            j = text.index("@media", i)
            a = text.index("{", j)
            media = text[j + 6:a].strip()
            if media not in MEDIA:
                raise ValueError(f"media query not allowed: {media}")
            b = take_block(text, a)
            rules += rules_in(text[a + 1:b], media)
            i = b + 1
        else:
            a = text.find("@media", i)
            chunk = text[i:a] if a >= 0 else text[i:]
            rules += rules_in(chunk, "")
            i = a if a >= 0 else len(text)
    return rules


class Splitter(HTMLParser):
    VOID = {"img", "input", "br", "hr", "meta", "source", "path", "circle", "rect", "line", "polyline", "polygon", "ellipse"}

    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.depth, self.frags, self.cur, self.keys = 0, [], None, None

    def _start_frag(self):
        if self.depth == 0:
            self.cur, self.keys = [], []
            self.frags.append((self.cur, self.keys))

    def handle_starttag(self, tag, attrs):
        self._start_frag()
        self.cur.append(self._tag(tag, attrs, False))
        if tag not in self.VOID:
            self.depth += 1

    def handle_startendtag(self, tag, attrs):
        self._start_frag()
        self.cur.append(self._tag(tag, attrs, True))

    def _tag(self, tag, attrs, selfclose):
        out = []
        for k, v in attrs:
            if k.startswith(("data-for", "data-if", "data-import")):
                continue
            if k == "style":
                raise ValueError(f"inline style on <{tag}>: {v}")
            if k == "class" and v:
                cls = v.split()
                for n in range(1, len(cls) + 1):
                    self.keys.append(".".join(cls[:n]))
            if k == "src" and tag == "img":
                v = img_url(v)
            if k == "href" and v in LINKS:
                v = LINKS[v]
            out.append(f' {k}="{v}"' if v is not None else f" {k}")
        svg_shape = tag in ("path", "circle", "rect", "line", "polyline", "polygon", "ellipse")
        return f"<{tag}{''.join(out)}{' /' if svg_shape or (selfclose and tag not in self.VOID) else ''}>"

    def handle_endtag(self, tag):
        if tag not in self.VOID:
            self.depth -= 1
            self.cur.append(f"</{tag}>")

    def handle_data(self, data):
        if self.depth == 0:
            if data.strip():
                raise ValueError(f"text outside a fragment: {data.strip()[:40]}")
            return
        self.cur.append(data)

    def handle_entityref(self, name):
        self.cur.append(f"&{name};")

    def handle_charref(self, name):
        self.cur.append(f"&#{name};")

    def handle_comment(self, data):
        pass


def build(html_path, css_path, out_path):
    reg = load_reg()
    rules = parse_css(Path(css_path).read_text()) if css_path != "-" else []
    defined = {r[3] for r in rules}
    p = Splitter()
    p.feed(re.sub(r">\s+<", "><", Path(html_path).read_text().strip()))
    emitted, frags, errors = set(), [], []
    for idx, (parts, keys) in enumerate(p.frags):
        need = []
        for k in keys:
            if "." in k and k not in defined and k not in reg:
                # stacked global classes (Client-First utilities): some suffix chain must exist on its own
                segs = k.split(".")
                k = next((".".join(segs[i:]) for i in range(1, len(segs))
                          if ".".join(segs[i:]) in reg or ".".join(segs[i:]) in defined), segs[-1])
            if k not in reg and k not in emitted and k not in need:
                if k not in defined:
                    errors.append(f"fragment {idx}: class .{k} has no CSS rule and does not exist yet")
                need.append(k)
        css_by_media = {}
        for media, sel, body, key in rules:
            if key in need:
                css_by_media.setdefault(media, []).append(f"{sel} {{ {body} }}")
        css = "\n".join(css_by_media.get("", []))
        for m in list(MEDIA)[1:]:
            if css_by_media.get(m):
                css += f"\n{MEDIA[m]} {{ " + " ".join(css_by_media[m]) + " }"
        emitted.update(need)
        html = "".join(parts)
        frags.append({"index": idx, "html": html, "css": css.strip(), "new_styles": need,
                      "size": len(html) + len(css)})
    unused = sorted(defined - emitted - reg)
    json.dump({"fragments": frags, "unused_rules": unused}, open(out_path, "w"), ensure_ascii=False, indent=1)
    for f in frags:
        print(f"[{f['index']}] {f['size']:6d} chars, {len(f['new_styles'])} new styles, starts {f['html'][:70]!r}")
    if unused:
        print("rules never used (not sent):", ", ".join(unused))
    if errors:
        print("ERRORS:\n" + "\n".join(errors))
        sys.exit(1)


def commit(out_path, index):
    reg = load_reg()
    frag = json.load(open(out_path))["fragments"][int(index)]
    reg.update(frag["new_styles"])
    REG.write_text(json.dumps(sorted(reg), indent=0))
    print(f"registry: {len(reg)} styles")


def show(out_path, index):
    frag = json.load(open(out_path))["fragments"][int(index)]
    print(json.dumps({"html": frag["html"], "css": frag["css"]}, ensure_ascii=False))


if __name__ == "__main__":
    {"build": build, "commit": commit, "show": show}[sys.argv[1]](*sys.argv[2:])
