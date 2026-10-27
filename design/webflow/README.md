# ProBuild Group in Webflow (2026-10-26)

The Claude Design canvas pages, rebuilt in Webflow with Finsweet Client-First classes, CMS collections and template pages.

- **Site:** "Probuild Group", site id `6adf4142414584038f9dbb34`
- **Published:** https://probuild-group.webflow.io (Webflow subdomain; a custom domain needs a site plan)
- **Style Guide:** https://probuild-group.webflow.io/style-guide (Relume-style: colours, typography, buttons, forms, utilities)

## Pages

| Page | Slug | Canvas source | Notes |
|---|---|---|---|
| Sākums | `/` | `site-01-sakums` | Rental cards are a Nomas produkti Collection List (3 items, sorted by `seciba`) |
| Pakalpojumi | `/pakalpojumi` | `site-02-pakalpojumi` | Calculator and request form; the services accordion is a Pakalpojumi Collection List with group tabs |
| Noma | `/noma` | `site-03-noma` | Nomas produkti list with Tehnika / Instrumenti tabs |
| Projekti | `/projekti` | `site-05-portfolio` | Projekti list; filter buttons are a Darba veidi Collection List |
| Par mums | `/par-mums` | `site-07-par-mums` | Team from the Komanda collection |
| Kontakti | `/kontakti` | `site-08-kontakti` | Contact form with interest chips (radio group) |
| Style Guide | `/style-guide` | `StyleGuide` | |
| Nomas produkts | `/nomas-produkts/[slug]` | `site-04-nomas-produkts` | CMS template |
| Projekts | `/projekts/[slug]` | `site-06-projekts` | CMS template with gallery lightbox and YouTube modal |
| Pakalpojums | `/pakalpojums/[slug]` | none (built from site tokens) | CMS template: description, included items, prices, calculator link |

The Navbar and Footer are Webflow components on every page. Komanda, Darba veidi and Nomas kategorijas also get template pages, because Webflow creates one for every collection. Those pages are `noindex` and redirect to `/par-mums`, `/projekti` and `/noma`.

## CMS collections

| Collection | Template | Main fields |
|---|---|---|
| Nomas produkti | `/nomas-produkts` | kategorija (ref), virsraksts, cena, īss apraksts, parametri, apraksts, titulbilde, **bilžu galerija** (rich text), fakts 1–3 (nosaukums + vērtība), sadaļa 1–3 (virsraksts + rich text), secība |
| Nomas kategorijas | (redirect) | name |
| Projekti | `/projekts` | darba veids (ref), īss apraksts, termiņš, platība, darbu veids, cena, papildu punkts 1–3, detalizēts apraksts (rich text), titulbilde, **bilžu galerija** (rich text), YouTube video, secība |
| Darba veidi | (redirect) | name, secība (filter order) |
| Komanda | (redirect) | amats, apraksts, iniciāļi, bilde, telefons, secība |
| Pakalpojumi | `/pakalpojums` | grupa (option: Būvniecība / Remonts un apdare / Teritorija un uzturēšana), cena no, apraksts, cenas (rich text: `label **value**` per paragraph), iekļauts (bullet list), piezīme, kalkulatora veids (0–5, empty opens the request form), titulbilde, **bilžu galerija** (rich text), secība |

Every list sorts by `seciba` (lowest first). Empty optional fields hide their block: facts, sections, stats, highlights, galleries and the video button.

**Galleries are a rich text field ("Bilžu galerija"), not multi-image.** The Webflow API cannot point a nested Collection List at a multi-image field, so editors add images to the rich text field instead, one per line. The site script turns the figures into product thumbnails or the project gallery and lightbox. The first 4 project images are shown, and the 4th tile reads "+N bildes".

## Custom code

| Where | File | What it does |
|---|---|---|
| Site head | `site/site-head.html` (built from `site-head-links.html` + `site-head.css`) | Favicon, touch icon, theme colour; base resets over Webflow defaults, focus rings, reduced motion, rich-text clearfix removal; brand pattern and motion styles (below) |
| Site footer | `site/site.js` (wrapped in `<script>`) | Filters, accordion, calculator, CMS card links, galleries, lightboxes, form fixes (below); brand bars, reveals, counters, photo drift |
| Page head | `page-code/<page>.head.html` | Per-page CSS that Webflow classes cannot express: descendant hovers, pseudo-elements, hero entrance keyframes, `:has()` empty-state rules |

`site.js` features, all driven by data attributes in the markup:

- **Filters:** `[data-filter-group][data-filter]` tabs filter `[data-filter-value]` items inside `[data-filter-list]`, and `[data-filter-count]` shows the counts.
- **Accordion:** `[data-accordion-trigger]` opens its `.services-list_item`, one at a time.
- **Calculator:** `.calc_panel` with `[data-calc-option]` (`data-min`/`data-max`/`data-note` in €/m²), `[data-calc-step]`, `[data-calc-range]` and `[data-calc-toggle]` / `[data-calc-mode]`. Hidden `[data-calc-field]` inputs submit the work type and estimate with the form. Service buttons (`[data-service]`, `data-calc-apply` = Kalkulatora veids) preselect the calculator or the request form.
- **CMS card links:** `a[data-cms-slug]` becomes `data-cms-base + slug`, for example `/projekts/koka-karkasa-privatmaja`. The static href is the listing page.
- **Galleries:** product thumbnails, the project photo lightbox (arrows, ←/→, Esc) and the YouTube modal.
- **Forms:** removes Webflow's "Example Text" placeholders. Groups radio buttons by their Group Name and selects the first choice. Fills hidden `[data-product-name]` inputs from the page's h1.

## Brand pattern and motion (2026-10-27)

The pattern is built from the logo's rising bars (mark F), kept brutalist: two to five thick bars of equal width whose slanted tops share one roof line at the mark's slope (0.6, about 31°), so each bar is a step taller than the last. Bars take the colour of the surface they rise from (the black panel, the orange section, the footer black, the darker orange of an orange card). Where they cover a photo they are partly transparent (80–85% black). Uses:

| Use | Where | How |
|---|---|---|
| Bars rising from an edge | Sākums: 3 bars from the hero stats panel into the photo (≥1240px), 4 orange bars from the orange section into the black above, 4 bars from the footer into the call-to-action photo (≥992px). Noma and Projekti: 3 dark bars on the filter divider (≥768px) | `.brand-bars` element (below) |
| Background | Footer on every page: 4 tone-on-tone bars behind the links | `.brand-bars.is-footer` in the Footer component |
| Photo cutout | Sākums about photo, Pakalpojumi "Viens partneris" photo, Par mums values photo, project header photo: the top-left corner opens into 3 bars | CSS mask on the class, `--pb-cut` |
| Orange card glyph | Kontakti "Zvanīt", Pakalpojumi contact card, Par mums "Strādāsim kopā": 3 darker-orange bars | `::after` mask, `--pb-glyph` |
| List marker | "Cenā iekļauts" lists (Pakalpojumi and the service template): 2 bars | `::before` mask, `--pb-mark` |

**`.brand-bars` elements** are empty divs in the Designer (class `brand-bars` + `is-hero`, `is-edge`, `is-cta`, `is-rule` or `is-footer`). `site.js` adds the bars. Attributes: `data-bars` (how many, 2–5) and `data-bars-scrub` (grow with the scroll instead of rising once). Size, colour and position per variant are custom properties in `site/site-head.css` (`--bb-w` bar width, `--bb-gap`, `--bb-base` height of the first bar, `--bb-color`). To move one, move or delete the div; to add one, copy an existing div and give it a position in the site head CSS.

`tools/bars.py` regenerates the three mask SVGs (`pattern/`) and their data URIs.

**Motion** (all in `site.js` and the site head, nothing in Webflow Interactions):

- Sections, cards and footer columns below the first screen rise in as they enter, staggered in reading order. Content already on screen at load is never hidden, and nothing is hidden when the script doesn't run.
- Bars rise from the ground when seen; `data-bars-scrub` bars follow the scroll.
- Whole numbers ("17+", "100+", "14") count up once when seen.
- The hero, call-to-action and Par mums photos drift slightly slower than the page.
- Buttons press in (scale 0.97); arrows nudge on hover; orange-card glyphs lift on hover; filter changes bring the remaining cards back in.
- `prefers-reduced-motion: reduce` turns all of it off: bars are shown full height and nothing moves.

The per-page scroll-timeline reveals (`animation-timeline: view()`) and list load animations were removed from the page heads, because the script now handles them. Hero entrance animations stay in the page heads.

`tools/motioncheck.mjs` scrolls every page with motion on (desktop and phone) and reports anything still hidden, the bars, the counters and script errors.

## Things to finish in the Webflow Designer

1. **Native CMS links (optional).** Through the API, a Link inside a Collection List can only point to the template root, so the cards get their item URL from `site.js`. In the Designer, set the card links on Sākums (rental cards), Noma and Projekti to "Current Nomas produkts" / "Current Projekts". `data-cms-slug` can then be removed.
2. **Forms.** All forms post to Webflow Forms (Kontaktforma, Kalkulators, Pakalpojuma pieteikums, Nomas pieprasījums, Līdzīgs projekts). Set the notification e-mail, or connect them to a CRM, in Site settings → Forms.
3. **Hidden templates.** Exclude the Komanda, Darba veidi and Nomas kategorijas template pages from the sitemap (Page settings → Sitemap).
4. **Plan and domain.** The site is on the free plan. It shows the "Made in Webflow" badge until a site plan is added, and a custom domain also needs that plan.
5. **Placeholders from the design** are still in place: Google rating `[4,9]` / `[xx]`, review texts, project placeholders `[x nedēļas]` and similar. The footer's Privātuma politika and Sīkdatņu iestatījumi links point to `#`.

## How it was built (tools/)

The pipeline, run from a working folder that holds the canvas export (`canvas/project/*.dc.html`) and `blobmap.json`, which maps canvas `/_blob/` ids to local image files:

1. `node render.mjs <page.dc.html> rendered/<page>.html --marks` renders a canvas page to static HTML. Loop items are tagged `data-for`, conditionals `data-if`.
2. `python3 convert.py rendered/<page>.marks.html <prefix> conv` produces Client-First markup and CSS. Inline styles become page classes (`[section]_[element]`, combos `is-alt`), colours map to variables, and anything Webflow can't hold goes to `<prefix>.custom.css`.
3. `python3 fixups.py <prefix>` adds data attributes for the site script (filters, calculator, accordion, galleries, lightboxes).
4. `python3 prep.py conv/<prefix>.html build/<prefix>.sections.html "<loop selector>=<slot>"` splits the page into insert fragments. It cuts CMS loops into slots plus item templates and restructures forms for Webflow.
5. `python3 wfbuild.py build …` / `commit …` produces the WHTML payloads. Each style is sent only once; `site/registry.json` tracks the classes that already exist in Webflow.
6. `python3 pagecss.py <prefix>` builds the page head CSS (`page-code/`).
7. Verification: `shot.mjs` (screenshots), `textdiff.py` (canvas vs published text), `filtertest.mjs`, `calctest.mjs`, `tpltest.mjs`, `overflow.mjs` (390px overflow), `finalcheck.mjs` (status, errors and links on every page) and `motioncheck.mjs` (motion on, nothing left hidden).

`pages/` holds the converted markup and CSS for each page, `rendered/` the static canvas renders, and `styleguide/` the Style Guide, Navbar and Footer payloads. `screenshots/` has design vs Webflow comparisons, with the canvas on the left and Webflow on the right.

### Webflow import quirks found along the way

- WHTML accepts only `:hover`, `:focus` and `:active`, and media queries at 991, 767 and 479px. Everything else goes into page custom code.
- `<button>` becomes a Link with `type=button` and gets the `w-button` class, so buttons need `display`, `padding` and centering set explicitly.
- `<span>` cannot be bound to CMS fields, so bound texts are divs. Image elements drop data attributes.
- Radio inputs need the Radio field wrapper (the builder's `FormRadioInput` creates it). Their `name` stays `radio-N`, so the script regroups them.
- Webflow's `.w-richtext::before/::after` clearfix becomes a grid or flex item. It is removed for every rich text that has a Client-First class.
- Reusing another page's class names with different styles silently keeps the first style. Pakalpojumi reviews therefore use `services-reviews_*`.
