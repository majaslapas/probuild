# ProBuild Group brand kit (generator)

Builds the brand kit zip for the client and the team: a short brand guide PDF (logo, logo rules, colours, fonts, brand bars, company details), logo files (SVG, PNG, favicons), colours (CSS, JSON, .ase, TXT), fonts, the brand bars, photos, 20 banner layouts (social and Google Display, PNG plus editable HTML), a business card (print PDF) and an e-mail signature. Everything in the kit is Latvian, including folder and file names (without diacritics).

```bash
node design/brand-kit/build.mjs [out-dir]     # default: design/brand-kit/out/
BANNERS_ONLY=1 node design/brand-kit/build.mjs [out-dir]   # only render and check the banners
```

Needs Node 18+, Playwright with Chromium, `curl` and `zip`. The fonts (Google Fonts, OFL) and the site's photos (Webflow CDN) are downloaded once into `.cache/` (git-ignored). The output is git-ignored too: send the zip, don't commit it.

| File | What it holds |
|---|---|
| `build.mjs` | The build: logo variants from `design/logo/`, colours, pattern SVGs, renders (PNG, PDF), README for the kit, zip |
| `banners.mjs` | Banner copy, layouts and CSS; the calculator banners show how the calculator works and what it gives (no amounts). `layoutCheck` runs in each banner and fails the build if key blocks overlap, leave the safe area or overflow |
| `guide.mjs` | Brand guide pages, business card, e-mail signature and the kit's README (`LASIMANI.md`) |

Copy and prices come from the site (30 October 2026: the pages now called Pakalpojumi, Noma and Kalkulators). The services banners print `probuildgroup.lv/pakalpojumi` (until 2 November 2026 `/cenas`). When they change, change `COPY`, `UI` and `BEN` in `banners.mjs`, then rebuild.
