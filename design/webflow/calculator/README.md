# Price calculator (Pakalpojumi)

The calculator is the first section of Pakalpojumi (`#kalkulators`), under the page's own short header (`services-calc_head`: heading, one line, "Pieteikums bez aprēķina" and "Pakalpojumu cenas" links). Visitors pick works in five
areas, enter amounts and see an approximate total with its range. To get a precise price offer they open the
offer form, which sends their contact details together with the calculation.

Prices come from the client's five 2026 price workbooks (Google Drive, copies in `source/`). 384 works.

## Where everything is in Webflow

| Where | What | Source in this folder |
|---|---|---|
| Section "Cenu kalkulators" → Code Embed **"Kalkulators · CENAS (labot šeit)"** | every price as a plain-text table, with instructions for the admin at its top; the calculator renders here | `cenas.html` |
| same section → Form "Kalkulators" (`data-pbc-form`) | the offer form; the calculator moves it into its dialog | Webflow form |
| same section → Form "Pakalpojuma pieteikums" (`data-pbc-request`) | the plain request form ("Pieteikums bez aprēķina") | Webflow form |
| Page settings → Custom code → Inside `<head>` | page CSS and the calculator's styles | `dist/page-head.html` (= `../page-code/services.head.html` + `kalkulators-stils.html`) |
| Page settings → Custom code → Before `</body>` | texts, units and service links (`PBC_SETTINGS`, readable) and the calculator code (minified) | `dist/page-footer.html`, built from `kalkulators.html` |
| Site settings → Custom code → Footer | the site script; `[data-service]` buttons (none on the site at the moment) call `pbCalc.show` / `pbCalc.request` | `../site/site.js` |

Webflow allows at most 50 000 characters per Code Embed and per custom code block. `tools/calc_build.mjs`
prints how much room is left in each.

## Price table format (`cenas.html`)

```
=== Būvniecība                      area (its id for links is the name without diacritics: buvnieciba)
Apraksts: …                         shown under the area name
Piezīme: …                          disclaimer shown at the total
Īsā piezīme: …                      optional; used at the total when works from several areas are picked
--- Pamati                          type of work (group)
   2.5 |      4 |      7 | m2   | Sagatavošanas darbi, … [| note for the customer]
    NO     CENA     LĪDZ   unit   name
```

Lines starting with `#` are comments (the instructions at the top are all comments). A `#` in front of a
`---` or `===` heading hides that whole type of work or area. Rows must stand above `=== BEIGAS`. Numbers
accept a comma or a point; cells may also be split by tabs (pasted from a spreadsheet). A row with a mistake
is skipped and logged with its line number (`[Kalkulators] …` in the console); with `?pbc-check` in the
address the errors are listed above the calculator (at most 30). More than one table block
(`<script type="text/plain" data-pbc-cenas>`) may be used if one embed gets too long: the blocks are read in
page order and areas and types of work with the same name are merged. The instructions must never contain
the text `</script>` (it would end the block).

Units are defined in `PBC_SETTINGS.units` (page footer code): `price` (text after the price), `qty` (word after
the amount; singular/plural), `hint` (help shown on a ticked row), `visits` (price × amount × visits) and
`monthly` (summed separately as a monthly fee). An unknown unit still shows as written and is reported as an
error (no visits, no monthly fee).

If the calculator code cannot start (a typo in `PBC_SETTINGS`, the table or its `<div data-pbc>` deleted),
the page puts the two Webflow forms back in place (`html.pbc-off`), and `data-pbc-ask` links stay ordinary links to `#kalkulators`.

## How it calculates

- Line = amount × price (× visits for `m2 reizē`). Totals add the lines with an amount above 0.
- Monthly units (`m2 mēnesī`, `mēnesī`) are summed separately as a monthly fee.
- The headline is the recommended total; the range is the sum of the from and to prices.

## Request form fields

Webflow field names (the keys a CRM maps):

| Name | Content |
|---|---|
| `vards`, `telefons`, `epasts` | name (required), phone (required), e-mail |
| `vieta`, `zina` | object address or town, comment (optional) |
| `aprekins` | the whole calculation as text: every work, amount, unit price, sum and range, totals |
| `aprekins_joma` | service areas used, e.g. `Remontdarbi, Metālapstrāde` |
| `aprekins_darbi` | number of works |
| `aprekins_summa`, `aprekins_no`, `aprekins_lidz` | one-off total: recommended, from, to (whole euros, ASCII digits, `-` when negative) |
| `aprekins_menesi` | monthly fees total, if any |

The calculator creates the `aprekins*` fields inside the form and fills them on every change and on submit.
The plain request form sends `Pakalpojums`, `vards`, `telefons`, `epasts`, `zina`.

## Links into the calculator

- `?pakalpojums=<service name | area | 'Area > Type of work'>` and optional `&grupa=<type of work>`;
  with `#kalkulators` the page lands on the calculator. Service pages link here (site.js).
- `window.pbCalc`: `has(name)`, `show(target)`, `reset()`, `request(name)` (opens the plain request form with
  that service selected). `PBC_SETTINGS.services` maps the service names (CMS Pakalpojumi) to `Area > Type of work`;
  a name that no longer resolves is logged at load.
- Any link with `data-pbc-show="…"` opens that target; any link with `data-pbc-ask` opens the plain request form (with
  `data-pbc-ask="<service>"` that service is selected, empty: the service of the type of work on screen).
- `PBC_SETTINGS.title` / `intro` are empty: the heading is part of the page. Text there brings back the calculator's own
  header.

## Changes made to the client's data

- **Remontdarbi:** the workbook has two price sheets that differ on 7 rows (tiling, ceiling painting,
  plasterboard ceilings, board painting, concrete floors, click parquet). The calculator uses the first sheet,
  "Darbu cenas 2026"; the summary sheet's averages match the other one. Confirm with the client.
- Names: 75 spelling and punctuation fixes (`RENAME` and the dash rule in `tools/calc_data.py`;
  `calc_verify.py -v` lists them). Prices and units are unchanged.
- Four maintenance notes quoted other companies' price lists (Rīgas Meži, Valmieras Namsaimnieks); reworded
  without the names (`NOTE` in `calc_data.py`).
- Left out: "Ziemas ārkārtas darbi / brīvdienu piemaksa" (a coefficient 1–2, not a price); the maintenance note
  mentions it.
- Notes shown to visitors come only from the metalwork, woodwork and maintenance sheets; the construction and
  repair sheets' notes are internal checks and stay out.
- The short disclaimers (`Īsā piezīme`) are new drafts for the client to approve.

## Tools

```bash
python3 -I tools/calc_data.py      # rebuild cenas.html and prices.json from source/*.xlsx (overwrites edits made in Webflow)
python3 -I tools/calc_verify.py    # every price in cenas.html against the workbooks, cell by cell
node tools/calc_build.mjs          # dist/page-head.html and dist/page-footer.html, with the size of every block
node tools/calc_test.mjs https://probuild-group.webflow.io/pakalpojumi   # browser test (never submits)
```

`calc_test.mjs --html page.html` tests a local copy of the page served at that URL, before publishing.
After editing prices in Webflow, copy the embed's code back into `cenas.html` (and the other way round).

## Admin: cenu labošana (LV)

1. Webflow Designer → lapa **Pakalpojumi** → Navigator: sadaļa **Cenu kalkulators** → Code Embed
   **„Kalkulators · CENAS (labot šeit)”**. Atveriet to ar dubultklikšķi.
2. Bloka augšā ir instrukcija. Katra rinda ir viens darbs:
   `NO | CENA | LĪDZ | MĒRV. | DARBS`. Mainiet tikai skaitļus pirmajās trīs kolonnās: zemāko cenu, ieteicamo
   cenu (to kalkulators rāda kā galveno) un augstāko cenu. Decimāldaļu var rakstīt ar punktu vai komatu.
3. Spiediet **Save & Close**, tad **Publish**. Pārbaudiet lapu adresē
   `…webflow.io/pakalpojumi?pbc-check`: ja kādā rindā ir kļūda, virs kalkulatora parādās sarkans lodziņš ar
   rindas numuru un iemeslu, un šī rinda netiek rādīta.
4. Jaunu darbu pievieno, nokopējot rindu; jaunu darbu veidu – ar rindu `--- Nosaukums`. Pakalpojumu lapu
   pogas (Aprēķināt…) atver kalkulatoru pie darbu veida pēc nosaukuma (lapas kods, `services`), tāpēc, pārdēvējot darbu
   veidu, nomainiet nosaukumu arī tur.
5. Tekstus (virsrakstus, pogu tekstus, piezīmes) un mērvienības var labot lapas iestatījumos: Pakalpojumi →
   Page settings → Custom code → Before `</body>`, daļā `PBC_SETTINGS`. Zem tās esošo kodu labot nevajag.
