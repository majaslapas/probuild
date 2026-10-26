"""ProBuildGroup logo generator: mark + Martian Mono wordmark, text converted to paths."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

HERE = Path(__file__).parent
OUT = HERE / "out"
OUT.mkdir(exist_ok=True)

ORANGE = "#F2600C"
INKS = {"black": "#000000", "white": "#FFFFFF"}

# --- Mark (grid units). Bars are as wide as the P stem (16), 4 apart. All slants are 1:2. Bar tops rise to the right, mirroring the
# P's roof and counter (which fall to the right). Tallest bar's peak sits level with the
# counter's top corner (y=32). ---
P_SHAPE = "M56 8L104 32V80L72 64V112H56Z M72 32L88 40V56L72 48Z"
BARS = [
    "M-4 60L12 52V112H-4Z",
    "M16 50L32 42V112H16Z",
    "M36 40L52 32V112H36Z",
]
# Roof variant (staggered, like the old logo): dark and orange pieces step up in
# pairs that share one top line. A dark strip stands left of the first bar, a dark cap as wide as
# each bar and as thick as the P (16) sits over it, each step rising by one thickness, and the last cap is the P's own roof mirrored to the left.
P_SHAPE_ROOF = "M36 18L56 8L104 32V80L72 64V112H56V24L36 34Z M72 32L88 40V56L72 48Z"
ROOF_DARK = "M-24 102L-8 94V112H-24Z M-4 70L12 62V78L-4 86Z M16 44L32 36V52L16 60Z"
BARS_ROOF = [
    "M-4 92L12 84V112H-4Z",
    "M16 66L32 58V112H16Z",
    "M36 40L52 32V112H36Z",
]
# Version C: two orange bars; the left-most upright is a dark strip sharing the first
# orange bar's top line (as the far-left strip does in the roof variant).
C_DARK = "M-4 76L12 68V112H-4Z M16 44L32 36V52L16 60Z"
BARS_C = [
    "M16 66L32 58V112H16Z",
    "M36 40L52 32V112H36Z",
]
MARK_BOX = (-4, 8, 108, 104)  # x, y, w, h
VARIANTS = {
    "": dict(p_shape=P_SHAPE, bars=BARS, box=MARK_BOX),
    "-roof": dict(p_shape=P_SHAPE_ROOF + " " + ROOF_DARK, bars=BARS_ROOF, box=(-24, 8, 128, 104)),
    "-c": dict(p_shape=P_SHAPE_ROOF + " " + C_DARK, bars=BARS_C, box=MARK_BOX),
}


def mark_group(ink, dx=0.0, dy=0.0, scale=1.0, m=None):
    m = m or VARIANTS[""]
    box = m["box"]
    t = f'translate({fmt(dx)} {fmt(dy)}) scale({fmt(scale)}) translate({fmt(-box[0])} {fmt(-box[1])})'
    bars = "".join(f'<path d="{b}"/>' for b in m["bars"])
    p_shape = m["p_shape"]
    return (f'<g transform="{t}">'
            f'<g fill="{ORANGE}">{bars}</g>'
            f'<path fill="{ink}" fill-rule="evenodd" d="{p_shape}"/></g>')


def fmt(v):
    return f"{v:.3f}".rstrip("0").rstrip(".")


class Word:
    """Text set in a font, outlined. Origin at left of cap-top; height = cap height."""

    def __init__(self, font_file, text, cap_height, tracking=0.0):
        self.font = TTFont(HERE / "fonts" / font_file)
        self.text = text
        self.cap = self.font["OS/2"].sCapHeight
        self.scale = cap_height / self.cap
        self.tracking = tracking  # in output units
        gs = self.font.getGlyphSet()
        cmap = self.font.getBestCmap()
        self.glyphs = [(gs[cmap[ord(c)]], self.font["hmtx"][cmap[ord(c)]]) for c in text]
        # ink bounds of first/last glyph so width is optical, not advance-based
        self.lsb_first = self.glyphs[0][1][1] * self.scale
        last_adv, last_lsb = self.glyphs[-1][1]
        bounds = self._glyph_bounds(cmap[ord(text[-1])])
        self.rsb_last = (last_adv - bounds[2]) * self.scale
        adv = sum(a for _, (a, _) in self.glyphs) * self.scale
        self.width = adv + tracking * (len(text) - 1) - self.lsb_first - self.rsb_last
        self.height = cap_height

    def _glyph_bounds(self, name):
        g = self.font["glyf"][name]
        g.recalcBounds(self.font["glyf"])
        return g.xMin, g.yMin, g.xMax, g.yMax

    def path(self, x, y):
        pen = SVGPathPen(None)
        cursor = x - self.lsb_first
        for glyph, (adv, _) in self.glyphs:
            tp = TransformPen(pen, (self.scale, 0, 0, -self.scale, cursor, y + self.height))
            glyph.draw(tp)
            cursor += adv * self.scale + self.tracking
        return pen.getCommands()


def tracked_to(font_file, text, cap, target_width):
    w = Word(font_file, text, cap)
    track = (target_width - w.width) / (len(text) - 1)
    return Word(font_file, text, cap, track)


def svg(w, h, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(w)} {fmt(h)}" '
            f'width="{fmt(w)}" height="{fmt(h)}" role="img" aria-label="{title}">'
            f'<title>{title}</title>{body}</svg>\n')


def wordmark(ink, x, y, cap, gap_ratio=0.42, group_ratio=0.5):
    top = Word("mm-wide-800.ttf", "PROBUILD", cap)
    sub_cap = cap * group_ratio
    sub = Word("mm-wide-500.ttf", "GROUP", sub_cap, tracking=sub_cap * 0.55)
    gap = cap * gap_ratio
    sub_x = x + (top.width - sub.width) / 2
    sub_y = y + cap + gap
    rule_gap = sub_cap * 0.9
    rule_w = (top.width - sub.width) / 2 - rule_gap
    rule_h = max(sub_cap * 0.14, 1.5)
    rule_y = sub_y + (sub_cap - rule_h) / 2
    rules = (f'<rect x="{fmt(x)}" y="{fmt(rule_y)}" width="{fmt(rule_w)}" height="{fmt(rule_h)}"/>'
             f'<rect x="{fmt(sub_x + sub.width + rule_gap)}" y="{fmt(rule_y)}" width="{fmt(rule_w)}" height="{fmt(rule_h)}"/>')
    body = (f'<path fill="{ink}" d="{top.path(x, y)}"/>'
            f'<g fill="{ORANGE}">{rules}<path d="{sub.path(sub_x, sub_y)}"/></g>')
    return body, top.width, cap + gap + sub.height


def build():
    files = []
    for v, m in VARIANTS.items():
        files.extend(build_variant(v, m))
    return files


def build_variant(v, m):
    files = []
    MARK_BOX = m["box"]
    for name, ink in INKS.items():
        # 1) Stacked: mark centred above wordmark
        cap = 40
        wm_w = Word("mm-wide-800.ttf", "PROBUILD", cap).width
        mark_h = 150
        mark_s = mark_h / MARK_BOX[3]
        mark_w = MARK_BOX[2] * mark_s
        gap = 36
        width = max(wm_w, mark_w)
        wm_body, _, wm_h = wordmark(ink, (width - wm_w) / 2, mark_h + gap, cap)
        body = mark_group(ink, (width - mark_w) / 2, 0, mark_s, m) + wm_body
        files.append((f"probuild-logo-stacked{v}-{name}.svg", svg(width, mark_h + gap + wm_h, body, "ProBuild Group")))

        # 2) Horizontal: mark left, two-line wordmark right (navbar / footer)
        cap = 40
        wm_tmp_h = cap + cap * 0.42 + cap * 0.5
        mark_h = wm_tmp_h * 1.32
        mark_s = mark_h / MARK_BOX[3]
        mark_w = MARK_BOX[2] * mark_s
        gap = mark_w * 0.28
        wm_body, wm_w, wm_h = wordmark(ink, mark_w + gap, (mark_h - wm_tmp_h) / 2, cap)
        body = mark_group(ink, 0, 0, mark_s, m) + wm_body
        files.append((f"probuild-logo-horizontal{v}-{name}.svg", svg(mark_w + gap + wm_w, mark_h, body, "ProBuild Group")))

        # 3) Icon only
        s = 2.0
        files.append((f"probuild-icon{v}-{name}.svg",
                      svg(MARK_BOX[2] * s, MARK_BOX[3] * s, mark_group(ink, 0, 0, s, m), "ProBuild Group")))

    # Favicon / avatar: square tiles with background
    for name, (bg, ink) in {"orange": (ORANGE, "#000000"), "black": ("#000000", "#FFFFFF")}.items():
        size = 512
        s = size * 0.62 / MARK_BOX[3]
        mw, mh = MARK_BOX[2] * s, MARK_BOX[3] * s
        mark = mark_group(ink, (size - mw) / 2, (size - mh) / 2, s, m)
        if bg == ORANGE:  # orange bars would vanish on orange: whole mark goes to ink
            mark = mark.replace(f'fill="{ORANGE}"', f'fill="{ink}"')
        body = f'<rect width="{size}" height="{size}" rx="{size*0.22:.0f}" fill="{bg}"/>' + mark
        files.append((f"probuild-app-icon{v}-{name}.svg", svg(size, size, body, "ProBuild Group")))

    return files


def write(files):
    for fn, content in files:
        (OUT / fn).write_text(content)
        print(fn, len(content))


if __name__ == "__main__":
    write(build())
