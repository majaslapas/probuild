"""Convert a rendered canvas page (render.mjs --marks output) to Client-First HTML + CSS.

  convert.py <rendered.html> <page-prefix> <out-dir>

Writes <out-dir>/<prefix>.html (body markup, imports left as <div data-import> markers),
<prefix>.css (class rules WHTML accepts), <prefix>.custom.css (everything WHTML cannot take:
descendant/tag selectors, pseudo-elements, keyframes, other media queries) and
<prefix>.report.txt (where the page's own copy of a global class differs from globals.css).

Inline styles move to classes: onto the element's own Client-First class when every element
with that class carries the same inline style, otherwise into [component]_[role] classes
named after the nearest ancestor component (repeated identical styles share one class).
Hex colours, fonts and the canvas --scheme-* vars become the site's Webflow variables.
"""
import json, re, sys
from collections import Counter, OrderedDict, defaultdict
from pathlib import Path
from bs4 import BeautifulSoup, Tag

HERE = Path(__file__).parent
GLOBAL = set(re.findall(r"^\.([A-Za-z0-9_-]+)", (HERE / "globals.css").read_text(), flags=re.M))
GLOBAL |= set(re.findall(r"^\s+\.([A-Za-z0-9_-]+)", (HERE / "globals.css").read_text(), flags=re.M))
GLOBAL |= {"hide-tablet", "hide-mobile-landscape", "hide-mobile-portrait", "form_component"}

COLORS = {
    "#ffffff": "neutral--white", "#fff": "neutral--white", "#f2f2f2": "neutral--lightest",
    "#d8d8d8": "neutral--lighter", "#b2b2b2": "neutral--light", "#7f7f7f": "neutral--neutral",
    "#4c4c4c": "neutral--dark", "#191919": "neutral--darker", "#000000": "neutral--darkest",
    "#000": "neutral--darkest", "#fdefe6": "christine--lightest", "#fcdfce": "christine--lighter",
    "#f58f54": "christine--light", "#f2600c": "christine--primary", "#c14c09": "christine--dark",
    "#602604": "christine--darker", "#481c03": "christine--darkest",
    "rgba(255,255,255,.1)": "opacity--white-10", "rgba(255,255,255,.2)": "opacity--white-20",
    "rgba(0,0,0,.2)": "opacity--black-20",
}
SCHEME = {"--scheme-muted": "--_color-schemes---text-muted", "--scheme-border": "--_color-schemes---border"}
WF_MEDIA = {"(max-width:991px)": "991", "(max-width:767px)": "767", "(max-width:479px)": "479",
            "screenand(max-width:991px)": "991", "screenand(max-width:767px)": "767",
            "screenand(max-width:479px)": "479"}
MEDIA_OUT = {"991": "@media screen and (max-width: 991px)", "767": "@media screen and (max-width: 767px)",
             "479": "@media screen and (max-width: 479px)"}
CUSTOM_PROPS = re.compile(r"^(-webkit-|-moz-|animation|content$|--)")
SIMPLE = re.compile(r"^((?:\.[A-Za-z0-9_-]+)+)(:hover|:focus|:active)?$")
ROLE = {"p": "text", "span": "text", "h1": "heading", "h2": "heading", "h3": "heading", "h4": "heading",
        "h5": "heading", "h6": "heading", "img": "image", "a": "link", "ul": "list", "ol": "list",
        "li": "item", "figure": "figure", "figcaption": "caption", "blockquote": "quote",
        "button": "button", "svg": "icon", "label": "label", "input": "input", "select": "input",
        "textarea": "input", "form": "form", "section": "section", "header": "header",
        "footer": "footer", "nav": "nav", "article": "card", "aside": "aside", "dl": "list",
        "dt": "term", "dd": "detail", "table": "table", "strong": "strong", "small": "small"}


# Where a canvas page redefines a global class, map its elements onto a global variant instead.
# page prefix -> [(class, add-class, extra CSS for the variant)]
PAGE_FIX = {
    "home": [("tag", "is-overlay", "")],
    "contact": [("button", "is-accent", ""),
                ("heading-style-h1", "is-display",
                 ".heading-style-h1.is-display { font-size: clamp(2.75rem,5vw,4.5rem); line-height: 1.05; letter-spacing: -0.035em }")],
    "about": [("grid-2", "is-center", ".grid-2.is-center { align-items: center }")],
}
# Readable names for generated classes on shared components
RENAME = {
    "footer": {"footer_wrapper": "footer_content", "footer_wrapper-2": "footer_social-list",
               "footer_wrapper-3": "footer_link-list", "footer_wrapper-4": "footer_bottom",
               "footer_wrapper-5": "footer_legal-list"},
}
DEFAULT_DISPLAY = {"span": "inline", "a": "inline", "strong": "inline", "small": "inline", "img": "inline-block",
                   "button": "inline-block", "li": "list-item", "svg": "inline"}


# ---------------------------------------------------------------- CSS helpers
def strip_comments(t):
    return re.sub(r"/\*.*?\*/", "", t, flags=re.S)


def parse_blocks(t):
    """-> list of ('rule', sel, body) | ('at', prelude, children) | ('raw', text)."""
    out, i, n = [], 0, len(t)
    while i < n:
        j = t.find("{", i)
        if j < 0:
            break
        pre = t[i:j].strip()
        depth, k = 1, j + 1
        while k < n and depth:
            depth += {"{": 1, "}": -1}.get(t[k], 0)
            k += 1
        inner = t[j + 1:k - 1]
        if pre.startswith("@media") or pre.startswith("@supports"):
            out.append(("at", pre, parse_blocks(inner)))
        elif pre.startswith("@"):
            out.append(("raw", f"{pre}{{{inner}}}"))
        elif pre:
            out.append(("rule", pre, inner.strip()))
        i = k
    return out


def split_top(s, sep=","):
    parts, depth, cur = [], 0, ""
    for ch in s:
        if ch in "([":
            depth += 1
        elif ch in ")]":
            depth -= 1
        if ch == sep and depth == 0:
            parts.append(cur)
            cur = ""
        else:
            cur += ch
    parts.append(cur)
    return [p.strip() for p in parts if p.strip()]


def decls(body):
    out = OrderedDict()
    for d in split_top(body, ";"):
        if ":" not in d:
            continue
        k, v = d.split(":", 1)
        out[k.strip().lower()] = v.strip()
    return out


def norm_color(v):
    def rgba(m):
        s = re.sub(r"\s+", "", m.group(0)).replace("0.", ".").replace(",.0)", ",0)")
        return f"var(--{COLORS[s]})" if s in COLORS else m.group(0)

    if "url(" in v:
        return v
    v = re.sub(r"rgba?\([^)]*\)", rgba, v)
    v = re.sub(r"#[0-9a-fA-F]{3,6}\b", lambda m: f"var(--{COLORS[m.group(0).lower()]})"
               if m.group(0).lower() in COLORS else m.group(0), v)
    for a, b in SCHEME.items():
        v = v.replace(f"var({a})", f"var({b})")
    return v


def norm_decl(k, v):
    """-> list of (k, v) for WHTML, list of (k, v) for custom code."""
    v = re.sub(r"\s*!important\s*$", "", v)
    if CUSTOM_PROPS.match(k):
        return [], [(k, v)]
    if k == "font-family":
        if "Martian Mono" in v:
            return [(k, "var(--font--heading)")], []
        if "Noto Sans" in v:
            return [(k, "var(--font--body)")], []
        return [(k, v)], []
    v = norm_color(v)
    if k in ("border", "border-top", "border-right", "border-bottom", "border-left") and v in ("0", "none"):
        sides = ["top", "right", "bottom", "left"] if k == "border" else [k.split("-")[1]]
        return [(f"border-{s}-style", "none") for s in sides], []
    if k == "background" and not re.search(r"gradient|url\(", v):
        return [("background-color", v)], []
    if k == "background" and "url(" in v:
        return [], [(k, v)]
    return [(k, v)], []


def body_str(pairs):
    return "; ".join(f"{k}: {v}" for k, v in pairs)


# ---------------------------------------------------------------- conversion
class Page:
    def __init__(self, path, prefix):
        self.prefix = prefix
        soup = BeautifulSoup(Path(path).read_text(), "lxml")
        self.soup = soup
        css = "\n".join(s.get_text() for s in soup.find_all("style"))
        for s in soup.find_all("style"):
            s.decompose()
        self.body = soup.body
        self.rules = OrderedDict()   # (media, selector) -> OrderedDict(decls)
        self.custom = []             # raw css text chunks (keyframes, rewritten rules)
        self.custom_rules = []       # (ctx, selector, [(k, v)])
        self.inline = []             # (element, selector holding its inline props, {k: v})
        self.global_diffs = defaultdict(list)
        self.known = set(GLOBAL)
        self.collect_css(parse_blocks(strip_comments(css)), ())

    # ---- helmet css
    def collect_css(self, nodes, ctx):
        for node in nodes:
            if node[0] == "raw":
                self.custom.append(node[1])
            elif node[0] == "at":
                self.collect_css(node[2], ctx + (node[1],))
            else:
                _, sel, body = node
                for s in split_top(sel):
                    self.add_rule(ctx, s, body)

    def wrap(self, ctx, text):
        for pre in reversed(ctx):
            text = f"{pre}{{{text}}}"
        return text

    def add_rule(self, ctx, sel, body):
        d = decls(body)
        m = SIMPLE.match(sel)
        media = None
        if not ctx:
            media = ""
        elif len(ctx) == 1 and ctx[0].startswith("@media"):
            media = WF_MEDIA.get(re.sub(r"\s", "", ctx[0][6:]))
        if not m or media is None:
            if re.match(r"^(body|html|:root|\*|a|a:hover|img|p|h[1-6]|ul|figure|blockquote)\b", sel) and not ctx:
                return  # base resets live in the site head code
            self.custom_rules.append((ctx, sel, [(k, norm_color(v)) for k, v in d.items()]))
            return
        classes = re.findall(r"\.([A-Za-z0-9_-]+)", m.group(1))
        for c in classes:
            self.known.add(c)
        if classes[0] in GLOBAL:
            self.global_diffs[(media, sel)].append(body)
            return
        key = (media, sel)
        tgt = self.rules.setdefault(key, OrderedDict())
        for k, v in d.items():
            wf, cu = norm_decl(k, v)
            for a, b in wf:
                tgt[a] = b
            if cu:
                self.custom_rules.append((ctx, sel, cu))

    # ---- elements
    def component_of(self, el):
        for p in [el] + list(el.parents):
            if not isinstance(p, Tag):
                continue
            for c in p.get("class", []):
                if c.startswith("section_"):
                    return c[8:]
                if c in GLOBAL or c.startswith("is-"):
                    continue
                return c.split("_")[0]
        return self.prefix

    def convert(self):
        for imp in self.body.find_all(attrs={"data-import": True}):
            imp.clear()
        for el in self.body.select(".navbar_link.is-current"):
            el["class"].remove("is-current")
            del el["aria-current"]
        self.rules.pop(("", ".navbar_link.is-current"), None)
        for cls, add, css in PAGE_FIX.get(self.prefix, []):
            for el in self.body.find_all(class_=cls):
                if not any(c.startswith("is-") for c in el["class"]):
                    el["class"] = el["class"] + [add]
            for m in re.finditer(r"(\.[\w.-]+) \{ ([^}]*) \}", css):
                self.rules[("", m.group(1))] = decls(m.group(2))
        owned = defaultdict(list)
        loose = []
        for el in self.body.find_all(True):
            if el.find_parent(attrs={"data-import": True}) is not None:
                continue
            st = el.get("style")
            if st is None:
                continue
            del el["style"]
            cls = el.get("class", [])
            own = [c for c in cls if c not in GLOBAL and not c.startswith("is-")]
            if own:
                i = cls.index(own[0])
                chain = [cls[i]] + [c for c in cls[i + 1:] if c.startswith("is-")]
                owned[".".join(chain)].append((el, st))
            else:
                st = self.minus_globals(cls, st)
                if st:
                    loose.append((el, st))
        for key, items in owned.items():
            chain = key.split(".")
            bare = [el for el in self.body.find_all(class_=chain[0])
                    if el.get("style") is None and [c for c in el.get("class", []) if c == chain[0] or
                        (c.startswith("is-") and c in chain)] == chain and not any(el is i for i, _ in items)]
            styles = Counter(norm_style(s) for _, s in items)
            if bare:
                styles[""] = len(bare)
                styles = Counter({s: n for s, n in styles.items()})
                for n, (s, _) in enumerate([x for x in styles.most_common() if x[0]], 1):
                    combo = "is-alt" if n == 1 else f"is-alt-{n}"
                    for el, st in items:
                        if norm_style(st) == s:
                            el["class"] = el.get("class", []) + [combo]
                            self.inline.append((el, f".{key}.{combo}", wf_decls(st)))
                    self.merge(("", f".{key}.{combo}"), s)
                print(f"  partial inline style on .{key}: {len(items)} of {len(items) + len(bare)} elements -> combos")
                continue
            sel = "." + key.replace(".", ".")
            if len(styles) == 1:
                self.merge(("", "." + key), items[0][1])
                for el, st in items:
                    self.inline.append((el, "." + key, wf_decls(st)))
            else:
                for n, (s, _) in enumerate(styles.most_common(), 1):
                    combo = "is-alt" if n == 1 else f"is-alt-{n}"
                    for el, st in items:
                        if norm_style(st) == s:
                            el["class"] = el.get("class", []) + [combo]
                            self.inline.append((el, f".{key}.{combo}", wf_decls(st)))
                    self.merge(("", f".{key}.{combo}"), s)
        names = {}
        for el, st in loose:
            comp = self.component_of(el.parent if isinstance(el.parent, Tag) else el)
            role = ROLE.get(el.name, "wrapper" if el.name == "div" else el.name)
            sig = (comp, role, norm_style(st))
            if sig not in names:
                base, n = f"{comp}_{role}", 1
                name = base
                while name in self.known:
                    n += 1
                    name = f"{base}-{n}"
                self.known.add(name)
                names[sig] = name
                self.merge(("", "." + name), st)
            el["class"] = [names[sig]] + el.get("class", [])
            self.inline.append((el, "." + names[sig], wf_decls(st)))
        self.resolve_conflicts()

    def minus_globals(self, cls, style):
        """Drop inline declarations the element's global classes already set to the same value."""
        g = {}
        for (media, gsel), gd in GLOBAL_RULES.items():
            if media or ":" in gsel or not set(gsel[1:].split(".")) <= set(cls):
                continue
            for k, v in gd.items():
                g.update(longhands(k, v))
        keep = []
        for k, v in decls(style).items():
            wf, _ = norm_decl(k, v)
            if wf and all(all(n in g and same(g[n], x) for n, x in longhands(a, b).items()) for a, b in wf):
                continue
            keep.append(f"{k}: {v}")
        return "; ".join(keep)

    def merge(self, key, style):
        tgt = self.rules.setdefault(key, OrderedDict())
        for k, v in decls(style).items():
            wf, cu = norm_decl(k, v)
            for a, b in wf:
                tgt.pop(a, None)
                tgt[a] = b
            if cu:
                self.custom_rules.append(((), key[1], cu))

    def resolve_conflicts(self):
        """Inline styles beat every rule on the canvas; keep that true after they become classes."""
        # (a) global combos with more classes than the inline-holding selector
        for el, sel, props in self.inline:
            cls = el.get("class", [])
            own_len = sel.count(".")
            hits = OrderedDict()
            for (media, gsel), gd in GLOBAL_RULES.items():
                if media or ":" in gsel:
                    continue
                chain = gsel[1:].split(".")
                if len(chain) <= own_len or not set(chain) <= set(cls):
                    continue
                gkeys = set().union(*(keyset(k) for k in gd)) if gd else set()
                for k, v in props.items():
                    if keyset(k) & gkeys:
                        hits[k] = v
            if hits:
                full = "." + ".".join(cls)
                tgt = self.rules.setdefault(("", full), OrderedDict())
                tgt.update(hits)
        # (b) custom (descendant/tag) rules that hit an element whose inline style sets the same property
        for ctx, csel, pairs in self.custom_rules:
            if re.search(r":(?!not|is|where)[a-z-]+", csel):
                continue
            try:
                matches = self.body.select(csel)
            except Exception:
                continue
            keys = set().union(*(keyset(k) for k, _ in pairs)) if pairs else set()
            for el, sel, props in self.inline:
                if any(el is m for m in matches):
                    over = [(k, v) for k, v in props.items() if keyset(k) & keys]
                    if over:
                        self.custom.append(self.wrap(ctx, f"{csel}{sel}{{{body_str(over)}}}"))

    # ---- output
    def css_text(self):
        base = [f"{sel} {{ {body_str(d.items())} }}" for (m, sel), d in self.rules.items() if m == "" and d]
        out = "\n".join(base)
        for m in ("991", "767", "479"):
            rs = [f"{sel} {{ {body_str(d.items())} }}" for (mm, sel), d in self.rules.items() if mm == m and d]
            if rs:
                out += f"\n{MEDIA_OUT[m]} {{ " + " ".join(rs) + " }"
        return out

    def report(self):
        lines = []
        for (m, sel), bodies in self.global_diffs.items():
            lines.append(f"[{m or 'base'}] {sel} {{ {' | '.join(bodies)} }}")
        return "\n".join(lines)


SIDES = ["top", "right", "bottom", "left"]
SHORT = {
    "padding": [f"padding-{s}" for s in SIDES], "margin": [f"margin-{s}" for s in SIDES],
    "inset": SIDES, "gap": ["row-gap", "column-gap", "grid-row-gap", "grid-column-gap"],
    "border-radius": [f"border-{a}-{b}-radius" for a in ("top", "bottom") for b in ("left", "right")],
    "background": ["background-color", "background-image"], "flex": ["flex-grow", "flex-shrink", "flex-basis"],
    "outline": ["outline-color", "outline-style", "outline-width"],
    "border-color": [f"border-{s}-color" for s in SIDES], "border-width": [f"border-{s}-width" for s in SIDES],
    "border-style": [f"border-{s}-style" for s in SIDES],
    "border": [f"border-{s}{p}" for s in SIDES for p in ("", "-color", "-style", "-width")],
}
for _s in SIDES:
    SHORT[f"border-{_s}"] = [f"border-{_s}-color", f"border-{_s}-style", f"border-{_s}-width"]


def longhands(k, v):
    p = v.split()
    if k in ("margin", "padding", "inset") and 1 <= len(p) <= 4:
        t = p * 4 if len(p) == 1 else [p[0], p[1], p[0], p[1]] if len(p) == 2 else \
            [p[0], p[1], p[2], p[1]] if len(p) == 3 else p
        names = SIDES if k == "inset" else [f"{k}-{s}" for s in SIDES]
        return dict(zip(names, t))
    if k == "gap" and 1 <= len(p) <= 2:
        return {"row-gap": p[0], "column-gap": p[-1]}
    if k == "border-radius" and len(p) == 1:
        return {n: v for n in SHORT["border-radius"]}
    return {k: v}


def same(a, b):
    f = lambda x: re.sub(r"\s+", "", x).replace("0.", ".").lower()
    return f(a) == f(b)


def keyset(k):
    out = {k} | set(SHORT.get(k, []))
    for big, small in SHORT.items():
        if k in small:
            out.add(big)
    return out


def wf_decls(style):
    out = OrderedDict()
    for k, v in decls(style).items():
        for a, b in norm_decl(k, v)[0]:
            out[a] = b
    return out


def load_globals():
    out = OrderedDict()
    def walk(nodes, media):
        for n in nodes:
            if n[0] == "at" and n[1].startswith("@media"):
                m = WF_MEDIA.get(re.sub(r"\s", "", n[1][6:]))
                if m:
                    walk(n[2], m)
            elif n[0] == "rule":
                for s in split_top(n[1]):
                    d = out.setdefault((media, s), OrderedDict())
                    for k, v in decls(n[2]).items():
                        for a, b in norm_decl(k, v)[0]:
                            d[a] = b
    walk(parse_blocks(strip_comments((HERE / "globals.css").read_text())), "")
    return out


def norm_style(s):
    return "; ".join(f"{k}: {v}" for k, v in decls(s).items())


def main(path, prefix, out_dir):
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    p = Page(path, prefix)
    p.convert()
    ren = RENAME.get(prefix, {})
    if ren:
        for el in p.body.find_all(True):
            if el.get("class"):
                el["class"] = [ren.get(c, c) for c in el["class"]]
        p.rules = OrderedDict(((m, re.sub(r"\.([\w-]+)", lambda x: "." + ren.get(x.group(1), x.group(1)), s)), d)
                              for (m, s), d in p.rules.items())
    html = "".join(str(c) for c in p.body.contents).strip()
    (out / f"{prefix}.html").write_text(html)
    (out / f"{prefix}.css").write_text(p.css_text())
    rules = [p.wrap(ctx, f"{sel}{{{body_str(pairs)}}}") for ctx, sel, pairs in p.custom_rules]
    (out / f"{prefix}.custom.css").write_text("\n".join(rules + p.custom))
    (out / f"{prefix}.report.txt").write_text(p.report())
    used = set()
    for el in p.body.find_all(True):
        used.update(el.get("class", []))
    defined = {re.findall(r"\.([A-Za-z0-9_-]+)", sel)[-1] for (_, sel) in p.rules} | GLOBAL
    combos = {c for c in used if c.startswith("is-")}
    undefined = sorted(c for c in used - defined - combos)
    for c in undefined:  # WHTML drops classes that have no rule: give them a declaration that changes nothing
        p.rules[("", "." + c)] = OrderedDict([("text-decoration-skip-ink", "auto")])
    (out / f"{prefix}.css").write_text(p.css_text())
    print(f"{prefix}: {len(p.rules)} rules, {len(p.custom)} custom chunks, {len(p.global_diffs)} global overrides")
    if undefined:
        print("  classes without a rule:", " ".join(undefined))


GLOBAL_RULES = load_globals()

if __name__ == "__main__":
    main(*sys.argv[1:])
