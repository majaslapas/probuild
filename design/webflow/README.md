# ProBuild Group in Webflow (2026-10-26)

The Claude Design canvas pages, rebuilt in Webflow with Finsweet Client-First classes, CMS collections and template pages.

- **Site:** "Probuild Group", site id `6adf4142414584038f9dbb34`
- **Published:** https://probuild-group.webflow.io (Webflow subdomain; a custom domain needs a site plan)
- **Style Guide:** https://probuild-group.webflow.io/style-guide (Relume-style: colours, typography, buttons, forms, utilities)

## Pages

| Page | Slug | Canvas source | Notes |
|---|---|---|---|
| Sākums | `/` | `site-01-sakums` | Services: one card per service group, linking to that group's tab on Pakalpojumi (`/pakalpojumi?grupa=buvnieciba#pakalpojumi`), with tags linking to single services. Rental cards are a Nomas produkti Collection List (3 items, sorted by `seciba`) |
| Kalkulators | `/kalkulators` | `site-02-pakalpojumi` | Called Pakalpojumi (`/pakalpojumi`) until 2 November 2026. Opens with the price calculator ([calculator/](calculator/README.md)) under a short header (`services-calc_head`, in the calculator section), then "Kas notiek pēc aprēķina" (4 steps), benefits, reviews (the GoHighLevel widget, as on Sākums) and contacts („Jautājumi par pakalpojumiem?“ names Jānis Ādamsons only, since 3 November 2026). New pieces: `pages/services.sections.html` |
| Pakalpojumi | `/pakalpojumi` | none (2026-10-28) | Called Cenas (`/cenas`) until 2 November 2026. Services and prices: the Pakalpojumi Collection List accordion with group tabs (moved here from the calculator page, without per-service buttons) under a header whose call to action goes to the calculator; each service's „Vairāk par pakalpojumu“ opens its own page; then "Kā veidojas cena", questions (details/summary) and an orange call to action. Markup and CSS: `pages/prices.sections.*`, page head: `page-code/prices.head.html` |
| Noma | `/noma` | `site-03-noma` | Nomas produkti list with Tehnika / Instrumenti tabs |
| Projekti | `/projekti` | `site-05-portfolio` | Projekti list, no filters (removed 2 November 2026). The six projects and their photos are the client's own; a card's tags (area, price, time) hide when the field is empty |
| Par mums | `/par-mums` | `site-07-par-mums` | No team section (removed 3 November 2026); the Komanda collection stays in the CMS, but no page shows it. „Strādāsim kopā“ speaks of „Mūsu komanda“: Jānis is named only where a person is the contact (Kontakti, Kalkulators, project pages) |
| Kontakti | `/kontakti` | `site-08-kontakti` | Contact form with interest chips (radio group). The header's rating card is the Sākums hero's block (`home-hero_proof`). „Ar jums sazināsies“ lists Jānis Ādamsons only. The operating region is Vidzeme, here and in the footer, the Kalkulators contact card and the SEO texts |
| Privātuma politika | `/privatuma-politika` | none (2026-11-03) | Privacy policy, see [Privacy and cookie policy](#privacy-and-cookie-policy-2026-11-03) |
| Sīkdatņu politika | `/sikdatnu-politika` | none (2026-11-03) | Cookie policy, same section |
| Style Guide | `/style-guide` | `StyleGuide` | |
| Nomas produkts | `/nomas-produkts/[slug]` | `site-04-nomas-produkts` | CMS template |
| Projekts | `/projekts/[slug]` | `site-06-projekts` | CMS template with gallery lightbox and YouTube modal |
| Pakalpojums | `/pakalpojums/[slug]` | none (built from site tokens) | CMS template: description, included items, prices, calculator link |
| Blogs | `/blogs` | none (2026-11-04) | Article list (Blogs Collection List, newest first), see [Blog and About videos](#blog-and-about-videos-2026-11-04). Linked from the footer (Lapas) |
| Raksts | `/raksts/[slug]` | none (2026-11-04) | CMS template for one article: breadcrumb, date, title, summary, photo, text, calculator call to action |
| Video | `/video/[slug]` | none | Template Webflow creates for the Video par uzņēmumu collection: `noindex` and a redirect to `/par-mums` |

The Navbar and Footer are Webflow components on every page. Komanda, Darba veidi, Nomas kategorijas and Video par uzņēmumu also get template pages, because Webflow creates one for every collection. Those pages are `noindex` and redirect to `/par-mums`, `/projekti`, `/noma` and `/par-mums`.

## CMS collections

| Collection | Template | Main fields |
|---|---|---|
| Nomas produkti | `/nomas-produkts` | kategorija (ref), virsraksts, cena, īss apraksts, parametri, apraksts, titulbilde, **bilžu galerija** (rich text), fakts 1–3 (nosaukums + vērtība), sadaļa 1–3 (virsraksts + rich text), secība |
| Nomas kategorijas | (redirect) | name |
| Projekti | `/projekts` | darba veids (ref), īss apraksts, termiņš, platība, darbu veids, cena, papildu punkts 1–3, detalizēts apraksts (rich text), titulbilde, **bilžu galerija** (rich text), YouTube video, secība |
| Darba veidi | (redirect) | name, secība (filter order) |
| Komanda | (redirect) | amats, apraksts, iniciāļi, bilde, telefons, secība |
| Pakalpojumi | `/pakalpojums` | grupa (option: Būvniecība / Remonts un apdare / Teritorija un uzturēšana), cena no, apraksts, cenas (rich text: `label **value**` per paragraph), iekļauts (bullet list), piezīme, kalkulatora veids (no longer used: the calculator maps services by name), titulbilde, **bilžu galerija** (rich text), secība |
| Blogs (items: Raksts) | `/raksts` | virsraksts (Name), datums, galvenā bilde, īss apraksts, saturs (rich text), SEO virsraksts, SEO apraksts; all required |
| Video par uzņēmumu | `/video` (redirect) | virsraksts (Name), YouTube saite (link, required), apraksts, secība |

Every list sorts by `seciba` (lowest first), except the blog lists (newest `datums` first). Empty optional fields hide their block: facts, sections, stats, highlights, galleries and the video button.

**Galleries are a rich text field ("Bilžu galerija"), not multi-image.** The Webflow API cannot point a nested Collection List at a multi-image field, so editors add images to the rich text field instead, one per line. The site script turns the figures into product thumbnails or the project gallery and lightbox. The first 4 project images are shown, and the 4th tile reads "+N bildes".

## Custom code

| Where | File | What it does |
|---|---|---|
| Site head | `site/site-head.html` (built from `site-head-links.html` + `<style>` `site-head.css` + `<script>` `site-head.js`) | Favicon, touch icon, theme colour; base resets over Webflow defaults, focus rings, reduced motion, rich-text clearfix removal; brand pattern, motion and intro styles (below); the intro's on/off switch; the GoHighLevel reviews widget fix (no white edge, no neighbouring cards peeking in at the sides) and the Latvian review grid styles |
| Site footer | `site/site.js` (wrapped in `<script>`) | Phone and tablet menu, filters, accordion, calculator service buttons, CMS card links, galleries, lightboxes, form fixes (below); brand bars, reveals, counters, photo drift |
| Page head | `page-code/<page>.head.html` | Per-page CSS that Webflow classes cannot express: descendant hovers, pseudo-elements, hero entrance keyframes, `:has()` empty-state rules |
| Page footer | `page-code/legal.footer.html` | Privātuma politika and Sīkdatņu politika only: builds the „Saturs“ list from the policy headings |
| Page footer | `page-code/about.footer.html` | Par mums: the YouTube video cards (cover image, player only after a click) |
| Page footer | `page-code/blog.footer.html`, `page-code/home.footer.html` | Blogs, Raksts and Sākums: the article dates in Latvian (Webflow writes them in English); Sākums also has the blog card hover styles there |

`site.js` features, all driven by data attributes in the markup:

- **Menu on phones and tablets (2026-11-03):** up to 991 px the Navbar component's links, phone number and „Sazināties“ button move into a panel under the bar (`.navbar_panel` > `.navbar_sheet`, built by `site.js`), opened with a round menu button (`.navbar_toggle`, `aria-expanded`, label „Izvēlne“). From 480 px a copy of „Sazināties“ (`.navbar_button.is-bar`) stays in the bar. Escape, a tap on the dimmed page, a link in the panel or focus leaving the navigation closes it; the page does not scroll while it is open. From 992 px the panel is `display: contents`, so the bar is exactly the Designer's. The Designer itself still shows every link at the tablet and phone breakpoints, because the panel only exists once the script runs; without the script the bar wraps and shows every link, as before. 992–1279 px: smaller gaps, and the phone number only from 1200 px, so the bar never takes two rows. Styles in the site head.
- **Filters:** `[data-filter-group][data-filter]` tabs filter `[data-filter-value]` items inside `[data-filter-list]`, and `[data-filter-count]` shows the counts. `?grupa=<tab name without accents, hyphens for spaces>` opens a tab (`buvnieciba`, `remonts-un-apdare`, `teritorija-un-uzturesana`), and picking a tab keeps the address in step.
- **Accordion:** `[data-accordion-trigger]` opens its `.services-list_item`, one at a time.
- **Calculator:** the first section of Kalkulators: the page's own header, one Code Embed with the price table and page custom code (see [calculator/README.md](calculator/README.md)). Links with `data-pbc-ask` (the header's "Pieteikums bez aprēķina", the contacts card "Pieteikums") open its plain request form. `[data-service]` buttons, if a page has them again, open it at that service's works (`pbCalc.show`) or its request form (`pbCalc.request`); the button on service pages (`data-calc-link`, a page link to Kalkulators) gets `/kalkulators?pakalpojums=<name>#kalkulators`, which opens the calculator at that service's works, and the Pakalpojumi page's calls to action go to `/kalkulators`. Webflow's default placeholder text ("Example text") is removed from all inputs.
- **CMS card links:** `a[data-cms-slug]` becomes `data-cms-base + slug`, for example `/projekts/jaunbuve-doles-sala`. The static href is the listing page. Pakalpojumi's „Vairāk par pakalpojumu“ works the same way (`/pakalpojums/<slug>`).
- **Galleries:** product thumbnails, the project photo lightbox (arrows, ←/→, Esc) and the YouTube modal.
- **Reviews (2026-11-02):** the GoHighLevel reviews widget (`iframe.lc_reviews_widget`, a Code Embed on Sākums and Kalkulators) shows its „Load More“ button and dates in English, and the CRM cannot translate them. When the widget is set to the **grid** layout in GoHighLevel, `site.js` reads the same reviews from the widget's public data API (`services.leadconnectorhq.com/reputation/widgets/data`, no key, CORS open) and replaces the iframe with the design's `.home-reviews_card` cards: Latvian dates (02.11.2026), „Google atsauksme“, long texts cut at 6 lines with „Lasīt vairāk“, and an „Ielādēt vairāk“ button that adds two rows at a time. The CRM's settings still apply (minimum rating, text-only reviews, date and avatar on/off, maximum count); new reviews show up by themselves. Reviews with a text come first (since 3 November 2026), the rest in the CRM's order. The dates are the day each review reached the CRM (the import), not when it was written on Google; switch the date off in the widget's settings in GoHighLevel to hide them. Any other layout, or no answer from the API, leaves GoHighLevel's own widget in place. Styles: `.pb-reviews*` in the site head.
- **Forms:** removes Webflow's "Example Text" placeholders. Groups radio buttons by their Group Name and selects the first choice. Fills hidden `[data-product-name]` inputs from the page's h1.
- **Spam check line (2026-10-28):** Webflow's spam protection (Cloudflare Turnstile, invisible) keeps every form's send button disabled until the visitor's browser passes the check. In a normal browser that takes 1–4 s after the form comes into view (in the calculator: after its dialog opens). When the check fails (blocked script, strict privacy settings, or a browser driven by a tool such as Claude's browser or a headless test), Webflow leaves the button disabled without a word. So `.form_check` under each button says „Notiek drošības pārbaude…“ while it runs, and on failure says why, offers „Mēģināt vēlreiz“ (`turnstile.reset`) and the phone and e-mail from the page. The styles are in the site head. Check it with `tools/formcheck.mjs pass|fail|real`, which swaps in Cloudflare's test keys in its own browser only and never sends a form.

## Phones and tablets (2026-11-03)

Every page checked at 320, 360 and 390 px with `tools/mobilecheck.mjs` (below): no sideways scrolling, no text under 12 px, no input under 16 px (iOS would zoom), every heading word fits. The Sākums hero and the menu also at 600, 768, 991, 1024, 1180, 1200 and 1440 px, the calculator at its usual widths (`calc_test.mjs`).

- **Sākums hero:** up to 991 px the stats bar (`.home-hero_bar.abs`) is in the page flow under the rating card instead of absolute at the bottom, where it covered the card. Phones: the three stats are content-sized columns with 13 px labels, the partner logos a size smaller (page head code), three to a row.
- **Navigation:** the menu above. The logo link is 44 px tall.
- **Footer:** up to 767 px Lapas and Pakalpojumi sit side by side, the brand and Kontakti full width (`.footer_link-list:last-child`); every link row is 44 px. Site head CSS.
- **Tap targets on touch screens:** the service tags on Sākums and the underlined text links (`.prices-cta_phone`, `.prices-faq_link`, `.services-calc_link`) and the breadcrumbs on project, service and rental pages (`.project-header_link`, `.service-detail_link`, `.rental-product_link`) get an invisible hit area of about 40–45 px (`::before` / `::after`), so the layout does not change.
- **Headings:** `heading-style-h1` is `min(2.5rem, 10vw)` on phones (`is-display` `min(2.75rem, 11vw)`, the Sākums title `min(2.5rem, 10.5vw)`): the display font is wide, and single words like „Profesionāli.“ or „Sazināsimies“ ran off small screens.
- **Grids:** `rental-list_header`, `portfolio-list_wrapper-2`, `about-story_wrapper-2` and `project-header_wrapper-2` use `minmax(20rem, 1fr)` columns, which cannot shrink below 320 px; on phones they are set to one shrinkable column.
- **Par mums:** on phones the „100+“ card spans the full width; the „Strādāsim kopā“ contacts stack the label over the value and the e-mail shrinks with the screen (never under 12 px), so it stays inside the orange panel.
- **Kontakti:** the contact cards' values shrink with the screen (`min(1.25rem, 4.4vw)`), so the e-mail stays on one line.
- **Project pages:** the gallery's first photo takes the full width on phones (it left an empty cell), the contact panel's stats shrink so „100+“ and „5,0“ never touch, Jānis's phone number does not break, and the request form is one column. Rental pages: the request form is one column, so the date field is full width.
Second round, 3 November 2026 (all breakpoints unless a width is named):

- **Sākums hero:** up to 991 px the photo is cropped on the worker (`object-position: 68% 35%`; its left part is a blurred wall) and on phones it drifts with less zoom (1.06 instead of 1.14, `site.js`). Up to 767 px the rating card is a one-line note under the buttons (5,0, stars, „Verificētas atsauksmes Google“; the quote is hidden), the stats bar is compact (20 px numbers, 12 px labels) and the partner logos run as one scrolling line: `site.js` wraps them in `.pb-logos_track` and copies the set once for a seamless loop (copies hidden from screen readers); hover or a tap pauses it, reduced motion makes it a row you can swipe. These rules are in the page head, scoped to `.home-hero_main`, because the rating card's classes are shared with Kontakti. The hero went from 911 to 639 px tall at 390 px.
- **Sākums orange section:** the title („Uzticams un stabils partneris būvniecībā“) has the combo `heading-style-h2.is-compact` (`clamp(1.75rem, 2.9vw, 2.5rem)`; tablets 3 rem; phones `min(2.5rem, 6.6vw)`, `min(2.25rem, 7.7vw)` under 480 px), so it fills its column in two lines on desktop instead of a narrow stack.
- **Par mums:** the title is smaller (`about-hero_title` `clamp(2.5rem, 4.6vw, 4rem)`, phones `clamp(1.75rem, 8.4vw, 2.5rem)`). The photo strip: on phones the „100+“ card, then one photo across the full width with the „17+“ badge 1 rem from its corner; the second photo (`about-hero_photo.is-second`) is hidden on phones and full width on tablets. The marquee under the hero is shorter (1.25 rem padding, phones 0.875 rem) with tighter spacing (2 rem, phones 1.25 rem and smaller dots). The partners section is black (`section_about-partners.color-scheme-2` → Neutral/Darkest) with #191919 logo tiles (hover: Neutral/Charcoal), so it no longer blends with the values section (#191919). „Strādāsim kopā“ on phones: the orange contact panel on top and the photo below it (16 rem tall), no grid behind the panel.
- **Kalkulators reviews:** the section is Neutral/Charcoal (#262626, a new colour variable) so the black review cards stand out; the contacts section after it stays #191919. The contact card values are 1 rem, so the e-mail fits on one line on desktop.
- **Date fields (Noma, rental pages):** iOS Safari draws its own date control (no height while empty, centred text, wider than the column). The site head gives `input[type="date"].form_input` the other inputs' height and alignment (`appearance: none`, 3 rem, left aligned); other browsers keep their calendar icon. On phones the Noma form's „No“ and „Līdz“ stack. This was checked in Chromium only: there is no WebKit in the build environment, so look at it once on an iPhone.
- **Checks:** `tools/mobilecheck.mjs` audits every page at 320, 360 and 390 px (sideways scrolling, headings wider than their box, text under 12 px, inputs under 16 px, small tap targets without a larger hit area) and taps through the menu on four page types, the accordion, a question, „Ielādēt vairāk“, rental thumbnails, the project lightbox and the contact topic chips. It blocks every non-GET request, so no form is ever sent.

## Privacy and cookie policy (2026-11-03)

Two pages in Latvian, linked from the footer on every page: **Privātuma politika** (`/privatuma-politika`, 13 sections) and **Sīkdatņu politika** (`/sikdatnu-politika`, 6 sections). Both are in effect from 3 November 2026 (the date is in each page's header).

- **Editing:** each policy's text is one Rich Text element (`.legal_rich-text`), so it is edited like a document in the Designer or the Editor. Numbered h2 headings become the „Saturs“ list beside the text on desktop by themselves (`page-code/legal.footer.html`; each heading also gets an address, e.g. `/privatuma-politika#jusu-tiesibas`). A cookie entry is an h3 with its name followed by a bulleted list, which the page styles as a card. When a policy changes, change the „Spēkā no …“ date in its header too. Sources in the repo: `pages/legal-*.html` (frame), `pages/legal-*.text.html` (text), `pages/legal.css`, `page-code/legal.head.html` (text styles; the same on both pages).
- **What the texts rest on:** company details as on the site (SIA “Probuild”, reg. no. 54103137871, VAT LV54103137871, address, phone, e-mail); the forms and their fields (`crm/forms-inventory.md`) and the context the CRM script adds to every sign-up (page, previous page on the site, language, time, UTM tags, referring site or ad network; no click IDs, nothing stored on the device; `crm/generated/site-footer-crm.html`); the recipients the site really uses (Webflow, HighLevel/LeadConnector for the CRM and the reviews, Cloudflare for Turnstile and the widget's bot check, Google for Gmail and the widget's fonts); the Data State Inspectorate's address and phone from dvi.gov.lv (3 November 2026). Retention is given as criteria, not periods, because none were agreed. Left out because nobody stated them: a data protection officer, the agency's legal name, subcontractor and accountant names.
- **What the site stores (measured with `tools/storagecheck.mjs`, 3 November 2026):** `pb-intro` in session storage (the intro played once per visit, value "1"); `cf.turnstile.u` in Cloudflare's own storage on pages with forms (Turnstile); the `__cf_bm` cookie (30 minutes) on `reputationhub.site`, set by Cloudflare for the HighLevel reviews widget on Sākums and Kalkulators. No analytics, advertising or social cookies, no maps embed, and no project or Par mums video yet (Par mums videos load YouTube only after a click, see [Blog and About videos](#blog-and-about-videos-2026-11-04)). That is why there is no cookie banner. One thing depends on timing: the reviews widget's frame (`iframe.lc_reviews_widget`) starts loading before `site.js` replaces it with the Latvian cards, so on some visits it also pulls in Google Fonts, images from storage.googleapis.com and Cloudflare's Web Analytics beacon (no cookies). Both policies say so. Loading the frame only when the reviews API does not answer would stop all of that and the `__cf_bm` cookie (not built: it changes the two Code Embeds).
- **Keep them true:** run `tools/storagecheck.mjs` after adding any script, embed, chat widget, analytics, pixel, map or new form field, and update both pages. Analytics or advertising cookies also need a consent banner before they load. A YouTube link in a project's „YouTube video“ field loads YouTube when the page opens (Webflow's Video element), not on a click; the cookie policy mentions YouTube, but if strict consent matters, the video should load only after a click (not built).

## Blog and About videos (2026-11-04)

Editing steps for the client, in Latvian: [`docs/instrukcija-blogs-un-video.md`](../../docs/instrukcija-blogs-un-video.md). The same text is in a Claude Docs document for the client, [Kā pievienot video un rakstus mājaslapā](https://claude.ai/artifact/TzNWggU4SY7mmTjJS4oKrY); it is private until it is shared from its Share menu. Keep the two the same when either changes.

- **Blogs** (`/blogs`): header like Projekti (`section_blog-list`, `blog-list_header`) and a Collection List of the Blogs collection (`blog-list_list`, two columns, one on phones), sorted by `datums`, newest first, at most 100 items (pagination is off: switching it on through the API broke the list once; turn it on in the Designer if there are ever more). Empty state: „Raksti drīzumā būs lasāmi.“
- **Cards** (`blog-card_*`, shared by Blogs and Sākums): photo 3:2, date, title, summary and the round arrow, like the project cards. The link gets its address from `site.js` (`data-cms-base="/raksts/"` + `data-cms-slug`, like the other CMS cards). Hover: photo zoom and orange arrow (page code, pointer devices only).
- **Sākums**: „Noderīgi raksti“ (`section_home-blog`) before the call to action: the 3 newest articles and „Visi raksti“. The section hides itself when there is no article (page footer code).
- **Article** (`/raksts/[slug]`, `section_blog-post`): breadcrumb „Blogs / title“, date, h1, summary, photo 16:9, the text (`blog-post_rich-text`, one Rich Text field, styled in the page head like the policy texts: h2/h3 in Martian Mono, orange list markers, blockquote as a grey card) and the call to action „Sāciet ar aprēķinu“ (calculator, phone). SEO title and description come from the article's SEO fields; the share image is the site default (in the Designer it can be bound to „Galvenā bilde“).
- **Dates**: Webflow writes CMS dates in English; `page-code/blog.footer.html` turns `.blog-card_date` and `.blog-post_date` into „2026. gada 4. novembris“ (the same code on Blogs, Sākums and Raksts).
- **The two articles** (4 November 2026): „Kā veidojas būvdarbu cena un kā to aprēķināt kalkulatorā“ and „Jumta nomaiņa: no vecā šīfera līdz valcprofila jumtam“. Every price and step is from the site: Pakalpojumi („Kā veidojas cena“, questions), Kalkulators (steps, notes) and `calculator/prices.json`; the roof article from the Jumts Tukumā project and the Jumta darbi service. The example sums were computed from the price table (80 m² × 12 = 960 €, 150 m² × 7 = 1 050 €, range 1 315–3 250 €). Sources of the texts: `pages/blog/*.html`.
- **About videos** (Par mums, under Mērķis and Vīzija): a Collection List of Video par uzņēmumu (`about-video_*`) inside the story section. No item, no section (page head: `:not(:has(.w-dyn-item))`), so the page looks as before until the client adds a video. One video: a wide card, video and text side by side; more: two columns. The card link is the YouTube address (bound to the Link field); `page-code/about.footer.html` puts YouTube's cover image in (`i.ytimg.com`, no cookies) and loads the player from `youtube-nocookie.com` only after a click, with autoplay; without the script the link opens YouTube. Watch, youtu.be, Shorts, live and embed links all work; the video must be public or unlisted. Tested by putting one and two cards into the page in a test browser (`/par-mums` itself stays empty).
- **Privacy**: both policies mention the Par mums videos (effective date 4 November 2026).
- **CMS limit**: without a site plan Webflow allows 50 CMS items in all; the site has 38 (2 articles, no video). The 3 Komanda items are not shown anywhere.

## Brand pattern and motion (2026-10-27)

The pattern is **two bold bars** with slanted tops, in the bottom-right corner of a card or photo, as a translucent tint of whatever is underneath. It is built from **regular Webflow elements**, so it can be edited, moved, copied or deleted in the Designer:

```
pattern-bars                      (div, absolute, bottom-right, overflow hidden)
  pattern-bars_bar is-first       (left bar, 68% high)
  pattern-bars_bar is-second      (right bar, full height)
```

- **Shape:** each bar is a rectangle with Transform → Skew Y −19° (origin bottom-right), which slants its top; the wrapper clips the bottom. Change the bar width, heights or skew on the classes.
- **Size of the block** (combo on `pattern-bars`): default 60% × 86% of the card; `is-wide` 46% × 72% (Sākums hero); `is-tall` 46% × 96% (Sākums call to action); `is-photo` (above the photo instead of behind content); `is-edge` 18 × 8 rem, sits on top of its section (Sākums orange section, `data-bars-scrub` makes it follow the scroll); `is-footer` 30 rem wide; `is-rule` 6.5 × 5 rem (Noma/Projekti divider, hidden on phones). Tablet/phone sizes are set on the breakpoints.
- **Tone** (combo on each bar, after `is-first` / `is-second`): default white 28% (orange cards), `is-dark` black 20%, `is-subtle` white 12% (dark cards), `is-glass` white 20%, `is-strong` white 50% (light photos), `is-shade` black 60% (busy photos), `is-orange`, `is-faint` white 7% (footer), `is-line` white 14%.
- **Where:** Kontakti contact cards; Pakalpojumi contact cards and "Viens partneris" photo; Par mums "100+" card, hero photos, value cards, story blocks and "Strādāsim kopā"; Sākums hero, about photo, orange section edge and call to action; the project page header (on the section, behind the photo and texts, since 3 November 2026); Noma and Projekti filter dividers; the Footer component.
- **To add one:** copy an existing `pattern-bars` element into a card or photo. The card needs `position: relative` and `overflow: hidden`; for cards listed in the site head CSS that is already set (with `isolation: isolate`, so a `z-index: -1` block stays behind the text). For a new card, add its class to that list or set those three properties on it.

The site head CSS only keeps the hosts clipping and stacking, plus the list marker (`--pb-mark`, regenerate with `tools/bars.py`).

**Motion** (all in `site.js` and the site head, nothing in Webflow Interactions):

- **Intro (2026-10-28):** plays on the first page of a visit only, never with reduced motion. Black fades to dark grey (`--neutral--darker`), thick bars in 15% white (about 12% of the screen width each, half a bar apart; the brand bars' `skewY(-19deg)`) rise through the whole screen from left to right, the logo (the navbar's) rises in, and everything fades out. That's 2.55 s from when the page's script runs, about 2.9 s after the page opens. Any click, key or scroll skips it. `site-head.js` decides (sessionStorage `pb-intro`) and keeps the page black from the first paint; `site.js` builds `.pb-intro`, removes it, and only then starts the counters. If the script never runs, the black cover fades by itself after 3 s; a page that took over 2.5 s to load or opened in a background tab skips it. Add `?intro` to any URL to see it again.
- Sections, cards and footer columns below the first screen rise in as they enter, staggered in reading order. Content already on screen at load is never hidden, and nothing is hidden when the script doesn't run.
- Pattern bars slide up from their edge when seen (bars already on screen at load are shown as they are); `data-bars-scrub` bars follow the scroll.
- Whole numbers ("17+", "100+", "14") count up once when seen.
- The hero, call-to-action and Par mums photos drift slightly slower than the page.
- Buttons press in (scale 0.97); arrows nudge on hover; orange-card glyphs lift on hover; filter changes bring the remaining cards back in.
- `prefers-reduced-motion: reduce` turns all of it off: bars are shown full height and nothing moves.

The per-page scroll-timeline reveals (`animation-timeline: view()`) and list load animations were removed from the page heads, because the script now handles them. Hero entrance animations stay in the page heads.

`tools/motioncheck.mjs` scrolls every page with motion on (desktop and phone) and reports anything still hidden, the bars, the counters and script errors.

## Things to finish in the Webflow Designer

1. **Native CMS links (optional).** Through the API, a Link inside a Collection List can only point to the template root, so the cards get their item URL from `site.js`. In the Designer, set the card links on Sākums (rental cards), Noma and Projekti to "Current Nomas produkts" / "Current Projekts", and Pakalpojumi's „Vairāk par pakalpojumu“ to "Current Pakalpojums". `data-cms-slug` can then be removed.
2. **Forms.** All forms post to Webflow Forms (Kontaktforma, Kalkulators, Pakalpojuma pieteikums, Nomas pieprasījums, Līdzīgs projekts). Set the notification e-mail, or connect them to a CRM, in Site settings → Forms.
3. **Hidden templates.** Exclude the Komanda, Darba veidi, Nomas kategorijas and Video par uzņēmumu template pages from the sitemap (Page settings → Sitemap).
4. **Plan and domain.** The site is on the free plan. It shows the "Made in Webflow" badge until a site plan is added, and a custom domain also needs that plan.
5. **Placeholders from the design:** none left (all 31 published pages checked on 2 November 2026). Since 3 November 2026 the footer's legal links go to Privātuma politika and Sīkdatņu politika (the second link was „Sīkdatņu iestatījumi“; there are no cookie settings to open, see below).
6. **Favicon and web clip.** Upload `design/logo/favicon/probuild-favicon-32.png` (Favicon, 32×32) and `probuild-webclip-256.png` (Webclip, 256×256) in Site settings → General, then publish. Both are logo mark F, like the brand kit's icons. The site head code links the same two files and an SVG of the mark (`site/site-head-links.html`), so the icon is right before and after the upload.
7. **Old addresses.** `/cenas` no longer exists, and `/pakalpojumi` is now the services list instead of the calculator. Both were only ever on the staging domain; if either was shared, add a 301 redirect `/cenas` → `/pakalpojumi` in Site settings → Publishing.
8. **Article share image (optional).** On the Raksts template, Page settings → Open Graph image → „Galvenā bilde“, so each article is shared with its own photo (the API could only set the site default).

## How it was built (tools/)

The pipeline, run from a working folder that holds the canvas export (`canvas/project/*.dc.html`) and `blobmap.json`, which maps canvas `/_blob/` ids to local image files:

1. `node render.mjs <page.dc.html> rendered/<page>.html --marks` renders a canvas page to static HTML. Loop items are tagged `data-for`, conditionals `data-if`.
2. `python3 convert.py rendered/<page>.marks.html <prefix> conv` produces Client-First markup and CSS. Inline styles become page classes (`[section]_[element]`, combos `is-alt`), colours map to variables, and anything Webflow can't hold goes to `<prefix>.custom.css`.
3. `python3 fixups.py <prefix>` adds data attributes for the site script (filters, calculator, accordion, galleries, lightboxes).
4. `python3 prep.py conv/<prefix>.html build/<prefix>.sections.html "<loop selector>=<slot>"` splits the page into insert fragments. It cuts CMS loops into slots plus item templates and restructures forms for Webflow.
5. `python3 wfbuild.py build …` / `commit …` produces the WHTML payloads. Each style is sent only once; `site/registry.json` tracks the classes that already exist in Webflow.
6. `python3 pagecss.py <prefix>` builds the page head CSS (`page-code/`).
7. Verification: `shot.mjs` (screenshots), `textdiff.py` (canvas vs published text), `filtertest.mjs`, `tpltest.mjs`, `overflow.mjs` (390px overflow), `finalcheck.mjs` (status, errors and links on every page), `motioncheck.mjs` (motion on, nothing left hidden), `formcheck.mjs` (every form's send button and spam-check line, never sends) `mobilecheck.mjs` (phones: layout audit at 320/360/390 px and tap tests, never sends; the blog pages since 4 November 2026) and `storagecheck.mjs` (cookies, browser storage and outside hosts per page, for the two policies).

`pages/` holds the converted markup and CSS for each page, `rendered/` the static canvas renders, and `styleguide/` the Style Guide, Navbar and Footer payloads. These are the build's snapshots (26–28 October 2026): later changes were made in Webflow (Designer or API), which holds the current markup; `pages/*.sections.html` are the sections inserted later. `screenshots/` has design vs Webflow comparisons, with the canvas on the left and Webflow on the right.

### Webflow import quirks found along the way

- WHTML accepts only `:hover`, `:focus` and `:active`, and media queries at 991, 767 and 479px. Everything else goes into page custom code.
- `<button>` becomes a Link with `type=button` and gets the `w-button` class, so buttons need `display`, `padding` and centering set explicitly.
- `<span>` cannot be bound to CMS fields, so bound texts are divs. Image elements drop data attributes.
- Radio inputs need the Radio field wrapper (the builder's `FormRadioInput` creates it). Their `name` stays `radio-N`, so the script regroups them.
- Webflow's `.w-richtext::before/::after` clearfix becomes a grid or flex item. It is removed for every rich text that has a Client-First class.
- Reusing another page's class names with different styles silently keeps the first style. Pakalpojumi reviews therefore use `services-reviews_*`.
- The WHTML builder drops an element's whole class list when its first class has no CSS rules (a section class used only as a name): create that class first (`create_style`, plus its `color-scheme-*` combo) and apply it with `set_style`.
- WHTML media queries must be written exactly `@media screen and (max-width: 991px)` (767px, 479px).
