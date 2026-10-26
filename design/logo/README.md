# ProBuild Group logo (2026)

A redraw of the old logo using the website's colours and fonts.

- **Orange:** `#F2600C`, the site's accent colour.
- **Dark parts:** `#000000` in the `-black` variants (use on light backgrounds) or `#FFFFFF` in the `-white` variants (use on dark backgrounds such as `#000` or `#191919`).
- **Fonts:** Martian Mono SemiExpanded ExtraBold for "PROBUILD" and Martian Mono SemiExpanded Medium for "GROUP". The text is converted to outlines, so the SVGs display correctly without the fonts installed.

| File | Use |
|---|---|
| `probuild-logo-stacked-{black,white}.svg` | Main logo: mark above the wordmark |
| `probuild-logo-horizontal-{black,white}.svg` | Navigation bar and footer (one line) |
| `probuild-icon-{black,white}.svg` | Mark only |
| `probuild-app-icon-{orange,black}.svg` | Square tile for favicons, social avatars and Google Business (512×512) |

**Five versions of the mark.** All uprights other than the P stem are 12 units wide (the P stem is 16), as in the first redraw. Geometry for every iteration is in `marks.py`.
- **A** (files without `-roof`): the tops of the bars rise to the right at the same angle the P's roof falls, as a mirror image. The tallest bar's peak is level with the top of the P's inner opening.
- **B** (files with `-roof`, e.g. `probuild-logo-stacked-roof-black.svg`): the same idea, staggered like the old logo. Dark and orange pieces step up left to right in pairs that share one top line: a dark strip left of the first bar, a dark cap over each bar (no wider than the bar and as thick as the P), and over the tallest bar the P's own roof mirrored to the left, so the top reads as a pitched roof.
- **C** (files with `-c`, e.g. `probuild-logo-stacked-c-black.svg`): like B, but with two orange bars. The left-most upright is a dark strip in place of the first orange bar.
- **E** (files with `-e`, PNGs in `png/`): a dark left-most upright whose top runs right over the middle orange bar, then the tallest orange bar and the P. The dark top line continues the underside of the P’s roof.
- **D** (files with `-d`): C without the left-most dark strip. Two orange bars with their caps and the P; the most compact mark.

Previews: `preview.png` (A), `preview-roof.png` (B), `preview-c.png` (C), `preview-d.png` (D).

**Minimum size:** the horizontal logo stays readable down to 40px tall. For anything smaller, use the icon only.

**Regenerating:** `python3 build.py` needs `fonttools` and the Martian Mono TTF files (from Google Fonts, `wdth 112.5`, weights 500 and 800) in `fonts/`.
