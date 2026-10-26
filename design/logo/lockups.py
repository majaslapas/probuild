"""Wordmark combinations for mark F. The ProBuild name is always Martian Mono (the site's
heading font); "Group" is in Martian Mono or Noto Sans (the body font).

Text is outlined. Each lockup is placed items (mark, text runs, rules) and the SVG is cropped
to their ink bounds. Run: python3 lockups.py -> out/lockups/*.svg + lockups.html
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from marks import original

HERE = Path(__file__).parent
OUT = HERE / "out" / "lockups"
OUT.mkdir(parents=True, exist_ok=True)
ORANGE = "#F2600C"
_fonts = {}


def font(name):
    if name not in _fonts:
        _fonts[name] = TTFont(HERE / "fonts" / f"{name}.ttf")
    return _fonts[name]


def fmt(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")


class Run:
    """One line of text. cap = cap height in px; track = extra letter spacing as a share of cap.
    colors: list of (n_chars, color) segments; the last colour fills the rest."""

    def __init__(self, fname, text, cap, track=0.0, colors=(("ink",),)):
        f = font(fname)
        self.f, self.text, self.cap = f, text, cap
        self.s = cap / f["OS/2"].sCapHeight
        self.track = track * cap
        gs, cmap = f.getGlyphSet(), f.getBestCmap()
        self.gs = gs  # needed to draw composite glyphs
        self.glyphs = [(gs[cmap[ord(c)]], f["hmtx"][cmap[ord(c)]][0]) for c in text]
        seg = []
        for part in colors:
            n, col = (part if len(part) == 2 else (len(text), part[0]))
            seg += [col] * n
        self.cols = (seg + [seg[-1]] * len(text))[: len(text)]
        # ink bounds
        xs, y0, y1, cur = [], [], [], 0.0
        for g, adv in self.glyphs:
            bp = BoundsPen(gs)
            g.draw(bp)
            if bp.bounds:
                a, b, c, d = bp.bounds
                xs += [cur + a * self.s, cur + c * self.s]
                y0.append(b)
                y1.append(d)
            cur += adv * self.s + self.track
        self.left, self.width = min(xs), max(xs) - min(xs)
        self.top = cap - max(y1) * self.s      # ink top relative to cap top (<0 for ascenders)
        self.bottom = cap - min(y0) * self.s   # ink bottom relative to cap top

    def paths(self, x, y, ink):
        """x = ink left, y = cap top. Returns svg <path>s, one per colour."""
        by = {}
        cur = x - self.left
        for (g, adv), col in zip(self.glyphs, self.cols):
            pen = by.setdefault(col, SVGPathPen(self.gs))
            g.draw(TransformPen(pen, (self.s, 0, 0, -self.s, cur, y + self.cap)))
            cur += adv * self.s + self.track
        out = ""
        for col, pen in by.items():
            fill = ink if col == "ink" else ORANGE if col == "orange" else col
            out += f'<path fill="{fill}" d="{pen.getCommands()}"/>'
        return out


def track_to(fname, text, cap, width, colors=(("ink",),)):
    r = Run(fname, text, cap, 0, colors)
    return Run(fname, text, cap, (width - r.width) / (len(text) - 1) / cap, colors)


MARK = original()


class Lockup:
    def __init__(self):
        self.items = []  # (svg-producing fn(ink), x0, y0, x1, y1)

    def mark(self, x, y, h, mono=False):
        bx, by, bw, bh = MARK["box"]
        s = h / bh

        def draw(ink):
            o = ink if mono else ORANGE
            return (f'<g transform="translate({fmt(x)} {fmt(y)}) scale({fmt(s)}) translate({fmt(-bx)} {fmt(-by)})">'
                    + "".join(f'<path fill="{o}" d="{b}"/>' for b in MARK["bars"])
                    + f'<path fill="{ink}" fill-rule="evenodd" d="{MARK["p_shape"]}"/></g>')
        self.items.append((draw, x, y, x + bw * s, y + h))
        return bw * s

    def text(self, run, x, y):
        self.items.append((lambda ink: run.paths(x, y, ink), x, y + run.top, x + run.width, y + run.bottom))

    def rect(self, x, y, w, h, color="orange"):
        def draw(ink):
            fill = ink if color == "ink" else ORANGE
            return f'<rect x="{fmt(x)}" y="{fmt(y)}" width="{fmt(w)}" height="{fmt(h)}" fill="{fill}"/>'
        self.items.append((draw, x, y, x + w, y + h))

    def svg(self, ink, pad=0):
        x0 = min(i[1] for i in self.items) - pad
        y0 = min(i[2] for i in self.items) - pad
        x1 = max(i[3] for i in self.items) + pad
        y1 = max(i[4] for i in self.items) + pad
        body = "".join(i[0](ink) for i in self.items)
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{fmt(x0)} {fmt(y0)} {fmt(x1-x0)} {fmt(y1-y0)}" '
                f'width="{fmt(x1-x0)}" height="{fmt(y1-y0)}" role="img" aria-label="ProBuild Group">'
                f'<title>ProBuild Group</title>{body}</svg>\n')


MARK_RATIO = MARK["box"][2] / MARK["box"][3]
VARIANTS = []


def variant(label):
    def deco(fn):
        VARIANTS.append((label, fn))
        return fn
    return deco


def rules_around(L, run, x, y, total_w, gap, thick):
    """Orange rules either side of a centred run inside total_w starting at x."""
    rx = x + (total_w - run.width) / 2
    rule_w = (total_w - run.width) / 2 - gap
    ry = y + (run.cap - thick) / 2
    L.rect(x, ry, rule_w, thick)
    L.rect(rx + run.width + gap, ry, rule_w, thick)
    L.text(run, rx, y)


@variant("Martian Mono, stacked, rules (current)")
def v1():
    L = Lockup()
    top = Run("mm-wide-800", "PROBUILD", 40)
    mw = top.width * 0.429
    mh = mw / MARK_RATIO
    L.mark((top.width - mw) / 2, 0, mh)
    y = mh + 40 * 0.34
    L.text(top, 0, y)
    sub = track_to("mm-wide-500", "GROUP", 40 * 0.56, top.width * 0.53, (("orange",),))
    rules_around(L, sub, 0, y + 40 * 1.22, top.width, top.width * 0.04, 40 * 0.56 * 0.17)
    return L


@variant("Stacked, BUILD in orange, GROUP in Noto Sans")
def v2():
    L = Lockup()
    top = Run("mm-wide-800", "PROBUILD", 40, 0, ((3, "ink"), (5, "orange")))
    mw = top.width * 0.42
    mh = mw / MARK_RATIO
    L.mark((top.width - mw) / 2, 0, mh)
    y = mh + 16
    L.text(top, 0, y)
    sub = track_to("noto-600", "GROUP", 16, top.width)
    L.text(sub, 0, y + 40 + 14)
    return L


@variant("Martian Mono, one line, GROUP in orange")
def v3():
    L = Lockup()
    cap = 30
    a = Run("mm-wide-800", "PROBUILD", cap)
    b = Run("mm-wide-800", "GROUP", cap, 0, (("orange",),))
    mh = cap * 2.1
    mw = L.mark(0, 0, mh)
    x = mw + cap * 0.75
    y = mh - cap  # baseline on the mark's base
    L.text(a, x, y)
    L.text(b, x + a.width + cap * 0.6, y)
    return L


@variant("Martian Mono, two lines, flush left")
def v4():
    L = Lockup()
    cap = 36
    a = Run("mm-wide-800", "PROBUILD", cap)
    b = track_to("mm-wide-500", "GROUP", cap * 0.5, a.width, (("orange",),))
    block = cap + cap * 0.4 + b.cap
    mh = block * 1.25
    mw = L.mark(0, 0, mh)
    x = mw + cap * 0.7
    y = mh - block
    L.text(a, x, y)
    L.text(b, x, y + cap * 1.4)
    return L


@variant("Mixed case, Build in orange, GROUP in Noto Sans")
def v5():
    L = Lockup()
    cap = 40
    a = Run("mm-wide-800", "ProBuild", cap, 0, ((3, "ink"), (5, "orange")))
    b = track_to("noto-600", "GROUP", cap * 0.36, a.width)
    block = cap + cap * 0.38 + b.cap
    mh = block * 1.3
    mw = L.mark(0, 0, mh)
    x = mw + cap * 0.6
    y = mh - block
    L.text(a, x, y)
    L.text(b, x, y + cap * 1.38)
    return L


@variant("Lowercase, one line, group in Noto Sans")
def v6():
    L = Lockup()
    cap = 40
    a = Run("mm-wide-800", "probuild", cap, 0)
    b = Run("noto-400", "group", cap, -0.01, (("orange",),))
    mh = cap * 1.75
    mw = L.mark(0, 0, mh)
    x = mw + cap * 0.55
    y = mh - cap  # baseline on the mark's base
    L.text(a, x, y)
    L.text(b, x + a.width + cap * 0.5, y)
    return L


@variant("Martian Mono, stacked, flush left")
def v7():
    L = Lockup()
    cap = 34
    a = Run("mm-wide-800", "PROBUILD", cap)
    b = track_to("mm-wide-500", "GROUP", cap * 0.5, a.width, (("orange",),))
    mh = cap * 3.4
    L.mark(0, 0, mh)
    y = mh + cap * 0.6
    L.text(a, 0, y)
    L.text(b, 0, y + cap * 1.4)
    return L


@variant("Divider, PROBUILD over GROUP")
def v8():
    L = Lockup()
    cap = 34
    a = Run("mm-wide-800", "PROBUILD", cap)
    b = track_to("mm-wide-500", "GROUP", cap * 0.5, a.width, (("orange",),))
    block = cap + cap * 0.4 + b.cap
    mh = block * 1.25
    mw = L.mark(0, 0, mh)
    L.rect(mw + cap * 0.7, 0, 2, mh, "ink")
    x = mw + cap * 1.4
    y = (mh - block) / 2
    L.text(a, x, y)
    L.text(b, x, y + cap * 1.4)
    return L


@variant("Martian Mono, PRO in orange, GROUP flush left")
def v9():
    L = Lockup()
    cap = 36
    a = Run("mm-wide-800", "PROBUILD", cap, 0, ((3, "orange"), (5, "ink")))
    b = Run("mm-wide-500", "GROUP", cap * 0.46, 0.3)
    block = cap + cap * 0.4 + b.cap
    mh = block * 1.25
    mw = L.mark(0, 0, mh)
    x = mw + cap * 0.7
    y = mh - block
    L.text(a, x, y)
    L.text(b, x, y + cap * 1.4)
    return L


@variant("Stacked, ProBuild + Group in Noto Sans")
def v10():
    L = Lockup()
    cap = 40
    a = Run("mm-wide-800", "ProBuild", cap, 0)
    b = Run("noto-400", "Group", cap, -0.01, (("orange",),))
    gap = cap * 0.5
    w = a.width + gap + b.width
    mw = w * 0.46
    mh = mw / MARK_RATIO
    L.mark((w - mw) / 2, 0, mh)
    y = mh + cap * 0.55
    L.text(a, 0, y)
    L.text(b, a.width + gap, y)
    return L


@variant("GROUP in Noto Sans with a rule")
def v11():
    L = Lockup()
    cap = 42
    a = Run("mm-wide-800", "PROBUILD", cap, 0)
    b = Run("noto-600", "GROUP", cap * 0.4, 0.25, (("orange",),))
    block = cap + cap * 0.42 + b.cap
    mh = block * 1.25
    mw = L.mark(0, 0, mh)
    x = mw + cap * 0.6
    y = mh - block
    L.text(a, x, y)
    yb = y + cap * 1.42
    L.text(b, x, yb)
    gap = cap * 0.35
    L.rect(x + b.width + gap, yb + (b.cap - 3) / 2, a.width - b.width - gap, 3)
    return L


@variant("Martian Mono, compact, wide tracking")
def v12():
    L = Lockup()
    cap = 26
    a = Run("mm-800", "PROBUILD", cap, 0.35)
    b = Run("mm-400", "GROUP", cap, 0.35, (("orange",),))
    mh = cap * 2.4
    mw = L.mark(0, 0, mh)
    x = mw + cap * 0.9
    y = (mh - cap) / 2
    L.text(a, x, y)
    L.text(b, x + a.width + cap * 0.9, y)
    return L


if __name__ == "__main__":
    tiles = []
    dark = {1, 5, 8, 11}  # zero-based tiles shown again on the site's dark background
    for i, (label, fn) in enumerate(VARIANTS, 1):
        L = fn()
        for name, ink in (("black", "#000000"), ("white", "#FFFFFF")):
            (OUT / f"probuild-lockup-{i:02d}-{name}.svg").write_text(L.svg(ink))
        tiles.append((i, label))
    open(HERE / "lockups-tiles.txt", "w").write("\n".join(f"{i}|{l}" for i, l in tiles))
    print(len(tiles), "lockups")
