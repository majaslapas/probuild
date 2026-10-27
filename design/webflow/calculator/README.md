# Price calculator (Pakalpojumi, 2026-10-27)

The calculator in the Pakalpojumi hero panel (`#kalkulators`). Visitors pick a service area, tick works, enter
amounts and see an approximate total with its range. To get a precise price offer they open the request form,
which sends their contact details together with the calculation.

Prices come from the client's five 2026 price workbooks (Google Drive, copies in `source/`). 384 works.

## In Webflow

All of it sits in the `.calc_panel` block on the Pakalpojumi page:

| Element | What it is |
|---|---|
| `calc_toggle` | "Aprēķināt cenu" / "Tikai pieteikums" switch (site footer script) |
| `calc_prices` (hidden div) | 5 Code Embeds, one per workbook: `cenas-*.html` |
| Code Embed after it | the calculator: `kalkulators.html` (settings, code, styles) |
| Form "Kalkulators" (`data-pbc-form`) | the request form, hidden until the visitor asks for the offer |
| Form "Pakalpojuma pieteikums" | plain request form, unchanged |

Each embed in Webflow is exactly the file here. After editing prices in Webflow, copy the code back here (or the
other way round) and run the checks below.

## Request form fields

Webflow field names (the keys a CRM maps):

| Name | Content |
|---|---|
| `vards`, `telefons`, `epasts` | name (required), phone (required), e-mail |
| `vieta`, `zina` | object address or town, comment (optional) |
| `aprekins` | the whole calculation as text: every work, amount, unit price, sum and range, totals |
| `aprekins_joma` | service areas used, e.g. `Remontdarbi, Metālapstrāde` |
| `aprekins_darbi` | number of works |
| `aprekins_summa`, `aprekins_no`, `aprekins_lidz` | one-off total: recommended, from, to (whole euros, no spaces) |
| `aprekins_menesi` | monthly fees total (maintenance areas), if any |

The calculator script creates the `aprekins*` fields inside the form and fills them on every change and on submit.

## How it calculates

- Each row: `['name', unit, from, recommended, to, 'optional note']`, euros per unit.
- Line = amount × price (× visits for `m2 reizē`). Totals add the lines with an amount above 0.
- Monthly units (`m2 mēnesī`, `mēnesī`) are summed separately as a monthly fee.
- The headline is the recommended total; the range is the sum of the from and to prices.

## Changes made to the client's data

- **Remontdarbi:** the workbook has two price sheets that differ on 7 rows (tiling, ceiling painting, plasterboard
  ceilings, board painting, concrete floors, click parquet). The calculator uses the first sheet, "Darbu cenas 2026";
  the summary sheet's averages match the other one. Confirm with the client.
- Names: 63 spelling and punctuation fixes (`RENAME` in `tools/calc_data.py`; `calc_verify.py -v` lists them).
  Prices and units are unchanged.
- Four maintenance notes quoted other companies' price lists (Rīgas Meži, Valmieras Namsaimnieks); reworded
  without the names (`NOTE` in `calc_data.py`).
- Left out: "Ziemas ārkārtas darbi / brīvdienu piemaksa" (a coefficient 1–2, not a price); the maintenance note
  mentions it.
- Notes shown to visitors come only from the metalwork, woodwork and maintenance sheets ("Kas iekļauts /
  piezīmes"); the construction and repair sheets' notes are internal checks and stay out.

## Tools

```bash
python3 -I tools/calc_data.py      # rebuild cenas-*.html from source/*.xlsx (overwrites manual price edits)
python3 -I tools/calc_verify.py    # every embedded price against the workbooks, cell by cell
node tools/calc_test.mjs https://probuild-group.webflow.io/pakalpojumi   # browser test (never submits)
```

`calc_test.mjs --html page.html` tests a local copy of the page served at that URL, before publishing.

## Admin: cenu labošana (LV)

1. Webflow Designer → lapa **Pakalpojumi** → Navigator: `calc_panel` → `calc_prices`. Tajā ir 5 Code Embed bloki,
   pa vienam katrai jomai (Būvniecība, Remontdarbi, Metālapstrāde, Kokapstrāde, Apsaimniekošana).
2. Atveriet vajadzīgo bloku (dubultklikšķis). Katra rinda ir viens darbs:
   `['Darba nosaukums', 'mērvienība', cena no, ieteicamā cena, cena līdz],`
3. Mainiet skaitļus (decimāldaļu atdala ar punktu, piem. `12.5`), saglabājiet un publicējiet vietni.
4. Jaunu darbu pievieno, nokopējot rindu; jaunu grupu, nokopējot bloku `{ group: '…', items: [ … ] },`.
   Mērvienību saraksts un teksti (virsraksts, pogas teksts, piezīmes) ir kalkulatora blokā zem `calc_prices`,
   sadaļā `PBC_SETTINGS`.
5. Pārbaude: atveriet lapu pārlūkā, izvēlieties labotās jomas darbu un salīdziniet cenu. Ja rindā ir kļūda (trūkst
   komata vai pēdiņas), pazūd tikai šīs jomas darbi; pārlūka konsolē parādās brīdinājums „[Kalkulators] …”.
