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

**Two versions of the mark**
- **A** (files without `-roof`): the tops of the bars rise to the right at the same angle the P's roof falls, as a mirror image. The tallest bar's peak is level with the top of the P's inner opening.
- **B** (files with `-roof`, e.g. `probuild-logo-stacked-roof-black.svg`): the same idea, staggered like the old logo. Dark and orange pieces step up left to right in pairs that share one top line: a dark strip left of the first bar, a dark cap over each bar, and over the tallest bar the P's own roof mirrored to the left, so the top reads as a pitched roof.

Previews: `preview.png` (A), `preview-roof.png` (B).

**Minimum size:** the horizontal logo stays readable down to 40px tall. For anything smaller, use the icon only.

**Regenerating:** `python3 build.py` needs `fonttools` and the Martian Mono TTF files (from Google Fonts, `wdth 112.5`, weights 500 and 800) in `fonts/`.
