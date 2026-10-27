"""Rising-bars brand pattern, from logo mark F: equal-width bars whose slanted tops share one
roof line at the mark's slope (0.6, about 31 deg), so each bar is taller than the last.
Writes the SVGs used as CSS masks (photo cutout, orange-card glyph, list marker) and bars.json
with the CSS-ready data URIs that go into site/site-head.css (--pb-cut, --pb-glyph, --pb-mark).

    python3 bars.py   # run from an output folder
"""
import json, urllib.parse

SLOPE = 0.6

def bar(x, w, top_right, base):
    # polygon: bottom-left, top-left (lower), top-right, bottom-right
    tl = top_right + w * SLOPE
    return f"M{x:g} {base:g}L{x:g} {tl:g}L{x + w:g} {top_right:g}L{x + w:g} {base:g}Z"

def group(n, w, gap, H, top=0, trail_gap=False):
    """n bars on one roof line, the last bar's top-right corner at y=top."""
    W = n * w + (n - 1) * gap + (gap if trail_gap else 0)
    d = ''.join(bar(i * (w + gap), w, top + (n - 1 - i) * (w + gap) * SLOPE, H) for i in range(n))
    return W, H, d

def svg(W, H, d):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:g} {H:g}"><path d="{d}"/></svg>'

def uri(s):
    return 'url("data:image/svg+xml,' + urllib.parse.quote(s, safe=' =:/"<>.,-').replace('"', "'") + '")'

out = {
    # Photo cutout: 3 thick bars and a trailing gap; the photo continues full height to the right.
    'cut': group(3, 48, 14, 132, trail_gap=True),
    # Orange cards: 3 thick bars rising from the bottom edge, tone on tone.
    'glyph': group(3, 22, 8, 72),
    # List marker: 2 bars (3 small bars read as a phone-signal icon).
    'mark': group(2, 5, 2, 14),
}
for k, (W, H, d) in out.items():
    open(f'{k}.svg', 'w').write(svg(W, H, d))
json.dump({k: {'w': W, 'h': H, 'uri': uri(svg(W, H, d))} for k, (W, H, d) in out.items()}, open('bars.json', 'w'), indent=1)
for k, (W, H, d) in out.items():
    print(k, W, H)
