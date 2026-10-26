"""Every ProBuild mark iteration, rebuilt with the first option's 12-unit uprights.

Grid units. P stem is x 56..72, baseline y=112. Uprights are 12 wide, 4 apart, right edges at
52, 36, 20, 4. All slants are 1:2. Lines are y = c - x/2 (rising right) or c + x/2 (falling).
"""

W, GAP, BASE = 12, 4, 112
COLS = [(40, 52), (24, 36), (8, 20), (-8, 4)]  # right to left
P = [(56, 8), (104, 32), (104, 80), (72, 64), (72, BASE), (56, BASE)]
COUNTER = [(72, 32), (88, 40), (88, 56), (72, 48)]


def up(c, x):  # rising-right line
    return c - x / 2


def bar(a, b, c):
    return [(a, up(c, a)), (b, up(c, b)), (b, BASE), (a, BASE)]


def band(a, b, top, bot):
    return [(a, up(top, a)), (b, up(top, b)), (b, up(bot, b)), (a, up(bot, a))]


def p_with_roof(left):
    """P whose roof continues left to x=left (16 thick, the P's own thickness)."""
    return [(left, up(36, left)), (56, 8), (104, 32), (104, 80), (72, 64), (72, BASE),
            (56, BASE), (56, 24), (left, up(52, left))]


def d(poly):
    pts = [f"{x:g} {y:g}" for x, y in poly]
    return "M" + "L".join(pts) + "Z"


def mark(orange, dark):
    """orange/dark: lists of polygons. P + counter are added to dark by the caller."""
    xs = [x for poly in orange + dark for x, _ in poly]
    ys = [y for poly in orange + dark for _, y in poly]
    box = (min(xs), min(ys), max(xs) - min(xs), max(ys) - min(ys))
    return dict(bars=[d(p) for p in orange], p_shape=" ".join(d(p) for p in dark), box=box)


def staggered(T, G, ov=0, strip=True, n=3, S=None):
    """Bars step up by S (default T+G); a cap of thickness T sits G above each bar; the last
    cap is the P roof."""
    S = S or T + G
    c = [58 + S * i for i in range(n)]  # c[0] = tallest (rightmost) bar
    orange = [bar(*COLS[i], c[i]) for i in range(n)]
    dark = [p_with_roof(COLS[0][0] - ov), COUNTER]
    for i in range(1, n):
        a, b = COLS[i]
        dark.append(band(a - ov, b, c[i] - G - T, c[i] - G))
    if strip:
        a, b = COLS[n]
        dark.append(bar(a, b, c[n - 1]))
    return orange, dark


def versions():
    v = {}
    # 01 first redraw: gable, bar tops on y = 48 - x/2
    v["01"] = mark([bar(a, b, 48) for a, b in COLS[:3]], [P, COUNTER])
    # 02 bar tops fall right (parallel to P roof); tallest top-left level with counter top
    v["02"] = mark([[(a, y0), (b, y0 + W / 2), (b, BASE), (a, BASE)]
                    for (a, b), y0 in zip(COLS[:3], (32, 40.5, 49))], [P, COUNTER])
    # 03 / A: tops rise right on one line through the counter-top peak
    v["03"] = mark([bar(a, b, 58) for a, b in COLS[:3]], [P, COUNTER])
    # 04 continuous roof band over all bars
    v["04"] = mark([bar(a, b, 58) for a, b in COLS[:3]], [p_with_roof(COLS[2][0]), COUNTER])
    # 05 first staggered: overhanging caps
    v["05"] = mark(*staggered(T=12, G=5, ov=6))
    # 07 flush caps, thinner
    v["07"] = mark(*staggered(T=10, G=6))
    # 08 / B: caps as thick as the P
    v["08"] = mark(*staggered(T=16, G=6, S=16))
    # 09 / C: two orange bars, dark strip on the left sharing the first orange bar's line
    o, dk = staggered(T=16, G=6, strip=False, n=2, S=16)
    dk.append(bar(*COLS[2], 58 + 16))
    v["09"] = mark(o, dk)
    # 10 / D: two orange bars only
    v["10"] = mark(*staggered(T=16, G=6, strip=False, n=2, S=16))
    # 11 / E1: orange, dark upright with roof over the orange, orange, P
    (a1, b1), (a2, b2), (a3, b3) = COLS[2], COLS[1], COLS[0]
    e_top, e_bot = 52, 68
    v["11"] = mark([bar(a1, b1, 74), bar(a3, b3, 58)],
                   [p_with_roof(a3), COUNTER,
                    [(a1, up(e_top, a1)), (b2, up(e_top, b2)), (b2, BASE), (a2, BASE),
                     (a2, up(e_bot, a2)), (a1, up(e_bot, a1))]])
    # 12 / E2: dark upright on the left with roof over the middle orange bar
    v["12"] = mark([bar(a2, b2, 74), bar(a3, b3, 58)],
                   [p_with_roof(a3), COUNTER,
                    [(a1, up(e_top, a1)), (b2, up(e_top, b2)), (b2, up(e_bot, b2)),
                     (b1, up(e_bot, b1)), (b1, BASE), (a1, BASE)]])
    return v


LABELS = {
    "01": "First redraw", "02": "Bars parallel to roof", "03": "A: mirrored slope",
    "04": "B: continuous roof", "05": "B: staggered", "07": "B: flush caps",
    "08": "B: P-thick caps", "09": "C: two orange + black strip", "10": "D: two orange bars",
    "11": "E1: black upright in middle", "12": "E2: black upright on left (latest)",
}
