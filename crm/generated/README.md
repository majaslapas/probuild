# Generated for probuild-group (full level)

Do not edit these files by hand: change project-config.json and re-run scaffold.py.

## Next steps

1. `webflow/renames.md` → rename fields/forms, publish staging, `check_forms.py project-config.json`.
2. `site-footer-crm.html` → first block of Site settings → Custom code → Footer code (keep the existing code after it), publish staging, `webCrm.context(form)` in the console.
3. GHL: `ghl/workflow-spec.md` top to bottom (fields from `ghl/custom-fields.csv`, texts from `ghl/*.txt|html`).
4. `ghl-probe.sh samples/probe-*.json` (user OK first: premium runs + real records), check, delete the records.
5. The user adds the Webflow webhook (Form submission → URL), then real test sign-ups from a normal browser.

## Files

- `site-footer-crm.html`
- `tests/context-cases.json`
- `samples/mapping-sample.json`
- `samples/probe-kalkulators.json`
- `samples/probe-pakalpojuma-pieteikums.json`
- `samples/probe-kontaktforma.json`
- `samples/probe-nomas-pieprasijums.json`
- `samples/probe-nomas-produkts.json`
- `samples/probe-lidzigs-projekts.json`
- `ghl/custom-fields.csv`
- `ghl/note.txt`
- `ghl/note-title.txt`
- `ghl/email-subject.txt`
- `ghl/email.html`
- `ghl/opportunity-name.txt`
- `ghl/workflow-spec.md`
- `webflow/renames.md`

## Warnings

- forms "Kalkulators" and "Pakalpojuma pieteikums" are both on /pakalpojumi and share epasts, telefons, vards, zina: an API rename sets each field's DOM id to its Name, so give one of them another ID (see webflow/renames.md)
