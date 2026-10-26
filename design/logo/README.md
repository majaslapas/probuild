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

**Minimum size:** the horizontal logo stays readable down to 40px tall. For anything smaller, use the icon only.

**Regenerating:** `python3 build.py` needs `fonttools` and the Martian Mono TTF files (from Google Fonts, `wdth 112.5`, weights 500 and 800) in `fonts/`.
