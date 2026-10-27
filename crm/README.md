# Webflow forms → GoHighLevel (ProBuild)

Built with the webflow-ghl-integration skill: every Webflow form → one Webflow "Form submission" webhook (no form
filter) → one GHL workflow with an Inbound Webhook trigger → contact, tags, opportunity, note, e-mail to the team.

## Status (2026-10-27)

| Part | State |
|---|---|
| Form inventory (`forms-inventory.md`) | done, 7 forms on 12 pages (CMS template pages included) |
| Config (`project-config.json`), level **full**, Latvian texts | done; values marked *to confirm* below are defaults |
| Generated artifacts (`generated/`) | done; `run_tests.sh`: 45 unit + 60 smoke checks pass |
| Webflow field renames (`generated/webflow/renames.md`) | done on staging; labels now point at their fields on every form |
| Site script (`generated/site-footer-crm.html`) | live on staging as the **first** block of the site footer, before `design/webflow/site/site.js`; copy of the whole live footer: `design/webflow/site/site-footer.live.html` |
| Check of every live form with `webCrm.context` (no submit) | done: keys, purpose, subject, E.164 phone, page, language, channel/UTM correct |
| GHL sub-account: custom fields, pipeline, workflow, probes, Webflow webhook, test sign-ups | **not started** — needs a session with a browser signed in to GHL (see `HANDOFF.md`) |

## Forms

| Form (Webflow name) | form_key | Page | Opportunity Source (purpose) | Opportunity name (subject) |
|---|---|---|---|---|
| Kalkulators | `kalkulators` | /pakalpojumi (offer dialog) | Cenas piedāvājums (kalkulators) | Cenas piedāvājums: {areas}, ≈ {sum} € |
| Pakalpojuma pieteikums | `pakalpojuma-pieteikums` | /pakalpojumi (request dialog) | the chosen service | Pieteikums: {service} |
| Kontaktforma | `kontaktforma` | /kontakti | the chosen interest | Kontaktforma: {interest} |
| Nomas pieprasījums | `nomas-pieprasijums` | /noma | Tehnikas noma | Tehnikas noma no {date} |
| Tehnikas nomas pieprasījums | `nomas-produkts` | /nomas-produkts/* | Tehnikas noma | Noma: {machine}, {date} |
| Līdzīgs projekts | `lidzigs-projekts` | /projekts/* | Līdzīgs projekts | Līdzīgs projekts: {project} |

All six create a contact, the tags `majaslapa` + `forma-<key>`, one opportunity per sign-up in
„Mājaslapas pieteikumi“ › „Jauns pieteikums“, a note and an e-mail to the team.

The calculator's fields `aprekins` (the whole calculation as text), `aprekins_joma`, `aprekins_darbi`,
`aprekins_summa`, `aprekins_no`, `aprekins_lidz`, `aprekins_menesi` are added to the form by the calculator code at
runtime (not in the static HTML, so `check_forms.py` lists them as "missing" — expected). Opportunity value stays empty
by default; `aprekins_summa` can be mapped to it if the team wants the estimate as the value.

## Defaults to confirm with the client

- Notification e-mail: `probuildlatvia@gmail.com` (the address on the site).
- One pipeline „Mājaslapas pieteikumi“ (stage „Jauns pieteikums“) for all forms; rental could get its own pipeline.
- All six forms create opportunities.
- `test_phone` for probes: +371 26 518 131 (the business number on the site).
- Consent: no marketing consent is collected; contacts get no marketing permission.
- The **Style Guide** page has a sample form „Stila paraugs“ without phone/e-mail: it would reach GHL as `other` and fail
  at Create contact. Make the Style Guide page a draft (or delete its sample form) before the Webflow webhook is
  connected.

## Known, harmless

- Contact form radios publish `name="radio-N"` with `data-name="interese"`; Webflow submits by `data-name`, and
  site.js also sets the name. `check_forms.py` reports it.
- Webflow Site settings still publish `lang="en"`; site.js sets `lv` at load, so `page_lang` is `lv`. Set the site
  language to Latvian in Site settings → General.

## Change something

Edit `project-config.json` → `python3 scripts/scaffold.py crm/project-config.json` → `scripts/run_tests.sh crm/generated`
(skill scripts) → paste the new `generated/site-footer-crm.html` as the first block of the site footer (keep site.js
after it), publish staging, `check_forms.py`. A new field or form also needs the GHL side (new mapping sample).
