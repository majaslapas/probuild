# Webflow forms → GoHighLevel (ProBuild)

Built with the webflow-ghl-integration skill: every Webflow form → one Webflow "Form submission" webhook (no form
filter) → one GHL workflow with an Inbound Webhook trigger → contact, tags, opportunity, note, e-mail to the team.

## Status (2026-10-27)

| Part | State |
|---|---|
| Form inventory (`forms-inventory.md`) | done, 7 forms on 12 pages (CMS template pages included) |
| Config (`project-config.json`), level **full**, Latvian texts | done; decisions confirmed by the client (below) |
| Generated artifacts (`generated/`) | done; `run_tests.sh`: 45 unit + 60 smoke checks pass |
| Webflow field renames (`generated/webflow/renames.md`) | done on staging; labels now point at their fields on every form |
| Site script (`generated/site-footer-crm.html`) | live on staging as the **first** block of the site footer, before `design/webflow/site/site.js`; copy of the whole live footer: `design/webflow/site/site-footer.live.html` |
| Check of every live form with `webCrm.context` (no submit) | done: keys, purpose, subject, E.164 phone, page, language, channel/UTM correct |
| Style Guide page (sample form without phone/e-mail) | made a draft (2026-10-28), not published |
| GHL sub-account: custom fields, pipelines, workflow, Webflow webhook, test sign-ups | **not started** — the ProBuild sub-account is not in the CRM connection yet, and the workflow needs a browser signed in to GHL (see `HANDOFF.md`) |

## Forms

| Form (Webflow name) | form_key | Page | Opportunity Source (purpose) | Opportunity name (subject) |
|---|---|---|---|---|
| Kalkulators | `kalkulators` | /pakalpojumi (offer dialog) | Cenas piedāvājums (kalkulators) | Cenas piedāvājums: {areas}, ≈ {sum} € |
| Pakalpojuma pieteikums | `pakalpojuma-pieteikums` | /pakalpojumi (request dialog) | the chosen service | Pieteikums: {service} |
| Kontaktforma | `kontaktforma` | /kontakti | the chosen interest | Kontaktforma: {interest} |
| Nomas pieprasījums | `nomas-pieprasijums` | /noma | Tehnikas noma | Tehnikas noma no {date} |
| Tehnikas nomas pieprasījums | `nomas-produkts` | /nomas-produkts/* | Tehnikas noma | Noma: {machine}, {date} |
| Līdzīgs projekts | `lidzigs-projekts` | /projekts/* | Līdzīgs projekts | Līdzīgs projekts: {project} |

All six create a contact, the tags `majaslapa` + `forma-<key>`, one opportunity per sign-up, a note and an e-mail to
the team. The two rental forms go to the pipeline „Tehnikas noma“ › „Jauns pieprasījums“; the other four to
„Mājaslapas pieteikumi“ › „Jauns pieteikums“ (the workflow's last If/else „Route“ picks the pipeline by `form_key`).

The calculator's fields `aprekins` (the whole calculation as text), `aprekins_joma`, `aprekins_darbi`,
`aprekins_summa`, `aprekins_no`, `aprekins_lidz`, `aprekins_menesi` are added to the form by the calculator code at
runtime (not in the static HTML, so `check_forms.py` lists them as "missing" — expected). Opportunity value stays empty
by default; `aprekins_summa` can be mapped to it if the team wants the estimate as the value.

## Decisions (confirmed 2026-10-28)

- Notification e-mail: `probuildlatvia@gmail.com`.
- Two pipelines: „Mājaslapas pieteikumi“ (calculator, service request, contact form, similar project) and
  „Tehnikas noma“ (both rental forms).
- All six forms create opportunities. No marketing consent is collected; contacts get no marketing permission.
- Tests are real sign-ups only, sent from the staging site through Webflow to GHL: no synthetic probes, so no test
  phone is stored (`test_phone` left out on purpose; `ghl-probe.sh` refuses the samples).
- The Style Guide page is a draft, so its sample form cannot reach GHL.

## Known, harmless

- Contact form radios publish `name="radio-N"` with `data-name="interese"`; Webflow submits by `data-name`, and
  site.js also sets the name. `check_forms.py` reports it.
- Webflow Site settings still publish `lang="en"`; site.js sets `lv` at load, so `page_lang` is `lv`. Set the site
  language to Latvian in Site settings → General.

## Change something

Edit `project-config.json` → `python3 scripts/scaffold.py crm/project-config.json` → `scripts/run_tests.sh crm/generated`
(skill scripts) → paste the new `generated/site-footer-crm.html` as the first block of the site footer (keep site.js
after it), publish staging, `check_forms.py`. A new field or form also needs the GHL side (new mapping sample).
