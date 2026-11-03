# ProBuild Group brand kit (generator)

Builds the brand kit zip for the client and the team: a short brand guide PDF (logo, logo rules, colours, fonts, brand bars, photos, company details), logo files (SVG, PNG, favicons), colours (CSS, JSON, .ase, TXT), fonts, the brand bars, the client's own photos, 20 banner layouts (social and Google Display, PNG plus editable HTML), 93 Facebook / Instagram ads with their ad texts, a business card (print PDF) and an e-mail signature. Everything in the kit is Latvian, including folder and file names (without diacritics).

```bash
node design/brand-kit/build.mjs [out-dir]                    # default: design/brand-kit/out/
BANNERS_ONLY=1 node design/brand-kit/build.mjs [out-dir]     # only render and check the banners and ads
ADS_ONLY=1 node design/brand-kit/build.mjs [out-dir]         # only the Facebook ads (fast, for layout work)
```

Needs Node 18+, Playwright with Chromium, `curl` and `zip`. The fonts (Google Fonts, OFL) and the client's photos (the CMS images of the site's project and rental pages, 2000 px) are downloaded once into `.cache/` (git-ignored). The output is git-ignored too: send the zips, don't commit them. Two zips come out: `ProBuild-Group-zimola-komplekts.zip` (everything) and `ProBuild-Group-facebook-reklama.zip` (the ads, their texts and overview sheets, for whoever runs the ads).

| File | What it holds |
|---|---|
| `build.mjs` | The build: logo variants from `design/logo/`, colours, pattern SVGs, the client's photos (`OWN`), renders (PNG, JPG, PDF), README for the kit, zips |
| `banners.mjs` | Shared banner CSS, the heading-fit script (`.fit` shrinks to its line count), helpers, and the 20 kit banners. The calculator mock-up shows real works of Būvniecība › Pamati and no amounts. `layoutCheck` runs in each banner and ad and fails the build if key blocks overlap, leave the safe area or overflow |
| `fb-ads.mjs` | Facebook / Instagram ads: 31 concepts (14 services, 4 calculator angles, 5 rental, 4 projects, experience, reviews, one partner, contact), each 1080×1080, 1080×1350 and 1080×1920 (text inside Meta's reels safe zone: top 270, bottom 672, sides 65 px), plus the ad texts (`reklamu-teksti.md` / `.csv`) with UTM-tagged links |
| `guide.mjs` | Brand guide pages, business card, e-mail signature and the kit's README (`LASIMANI.md`) |

Copy, prices and numbers come from the published site (checked 3 November 2026: Sākums, Pakalpojumi and the service pages, Kalkulators, Noma and the product pages, Projekti and the project pages, Par mums, Kontakti). The one derived number is „380+ darbu cenas“: the calculator's 384 works, which the page shows per area (143 + 127 + 43 + 34 + 37). Photos are only the client's own (projects and machines); the stock pictures the site still uses elsewhere are not in the kit. When the site's copy or prices change, change `COPY`, `UI` and `BEN` in `banners.mjs` and `CONCEPTS` in `fb-ads.mjs`, then rebuild. Photo ads are exported as JPEG (quality 92), flat ones as PNG.
