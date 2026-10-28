# Webflow forms → GoHighLevel (ProBuild)

Built with the webflow-ghl-integration skill: every Webflow form → one Webflow "Form submission" webhook (no form
filter) → one GHL workflow with an Inbound Webhook trigger → contact, tags, opportunity, note, e-mail to the team.

## Status (2026-10-28)

| Part | State |
|---|---|
| Form inventory (`forms-inventory.md`) | done, 7 forms on 12 pages (CMS template pages included) |
| Config (`project-config.json`), level **full**, Latvian texts | done; decisions confirmed by the client (below) |
| Generated artifacts (`generated/`) | done; `run_tests.sh`: 45 unit + 60 smoke checks pass |
| Webflow field renames (`generated/webflow/renames.md`) | done on staging; labels now point at their fields on every form |
| Site script (`generated/site-footer-crm.html`) | live on staging as the **first** block of the site footer, before `design/webflow/site/site.js`; copy of the whole live footer: `design/webflow/site/site-footer.live.html` |
| Check of every live form with `webCrm.context` (no submit) | done: keys, purpose, subject, E.164 phone, page, language, channel/UTM correct |
| Style Guide page (sample form without phone/e-mail) | made a draft (2026-10-28), not published |
| GHL custom fields (25, opportunity) and the two pipelines | done 2026-10-28 through the CRM connector (IDs below) |
| GHL workflow, Webflow webhook, test sign-ups | **open** — ProBuild's workflow API is off (403 `WORKFLOW_API_NOT_ENABLED_FOR_LOCATION`), so the workflow is built in GHL's UI in a browser signed in as the person (see `HANDOFF.md`) |

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

## GHL sub-account „ProBuild“ (`LkU3HqQjzSJOBE4wFaGf`)

Created 2026-10-28 through the CRM connector. The fields were created with plain-letter names first and then renamed,
so every key is ASCII (GHL drops letters like ē from keys: „Mērķis“ would have become `opportunity.mris`). The API
cannot make folders for opportunity fields, so they sit in GHL's default opportunity folder; moving them into a folder
„Mājaslapas pieteikums“ in the UI is optional and changes no key.

| Field | Type | Key | ID |
|---|---|---|---|
| Forma | Single line | `opportunity.forma` | `hyt7USjWjwlUzTMBoKr1` |
| Mērķis | Single line | `opportunity.merkis` | `UkXtLDpWkp8vrsSGj32B` |
| Lapa | Single line | `opportunity.lapa` | `ePKwDGWfjjYtp8LFA82M` |
| Objekta adrese vai pilsēta | Single line | `opportunity.objekta_adrese_vai_pilseta` | `CMPwoRX7XKxqwyWuFVqR` |
| Ziņa | Multi line | `opportunity.zina` | `vm7mUPj4JBFVdujE8QIa` |
| Kalkulatora aprēķins | Multi line | `opportunity.kalkulatora_aprekins` | `uHfhkBwW5yuS0Xa5csTX` |
| Aprēķina jomas | Single line | `opportunity.aprekina_jomas` | `M8TFx4sjD192TY61c0qj` |
| Aprēķina darbu skaits | Number | `opportunity.aprekina_darbu_skaits` | `nMbewaywnkc61mcrM0T9` |
| Aprēķina summa (€) | Number | `opportunity.aprekina_summa_eur` | `0goG9zG3RXVjJnBgVK57` |
| Aprēķins no (€) | Number | `opportunity.aprekins_no_eur` | `GbaCUhdZl2qmMGFEP1VT` |
| Aprēķins līdz (€) | Number | `opportunity.aprekins_lidz_eur` | `7LjDcMaAyiHGGBU4CAaH` |
| Ikmēneša maksa (€) | Number | `opportunity.ikmenesa_maksa_eur` | `94jh8uSpTGrSkhF1Sd9K` |
| Pakalpojums | Single line | `opportunity.pakalpojums` | `nXwXvQx2jfvWErlNjXfg` |
| Interese | Single line | `opportunity.interese` | `3IfB9rhQatgFgKFsWARo` |
| Nomas sākums | Date | `opportunity.nomas_sakums` | `ivgiIf7aa1NxYUnxN6XB` |
| Nomas beigas | Date | `opportunity.nomas_beigas` | `mxHNM5qXdu3jCf4d74Mk` |
| Vēlamais datums | Date | `opportunity.velamais_datums` | `o5cufKbl34JM1h4jnVoS` |
| Nomas ilgums | Single line | `opportunity.nomas_ilgums` | `yXf4seWefbGqnl7HXSyE` |
| Tehnika | Single line | `opportunity.tehnika` | `NtcpTReXidzCmrDgcqho` |
| Projekts | Single line | `opportunity.projekts` | `MrtNs6sxiVzqJJdnD6Fs` |
| Avots | Single line | `opportunity.avots` | `Pm8Z9CMQyBoUriQb78NU` |
| UTM source | Single line | `opportunity.utm_source` | `Xzfr03hnqofdTCAbiuUy` |
| UTM medium | Single line | `opportunity.utm_medium` | `cJfg2XPcTDW2Xfx8XpSv` |
| UTM campaign | Single line | `opportunity.utm_campaign` | `QzfdVa3USTS11Gri12HO` |
| Webflow iesnieguma ID | Single line | `opportunity.webflow_iesnieguma_id` | `vdYWPyZuIhG9RoQSDPve` |

| Pipeline | ID | Stages (first one is where the workflow puts new sign-ups) |
|---|---|---|
| Mājaslapas pieteikumi | `ksmrHKuTsnSPJ0EFzxLX` | **Jauns pieteikums** › Sazinājāmies › Objekta apskate › Piedāvājums nosūtīts › Līgums noslēgts |
| Tehnikas noma | `IrBmf5Xe9O9BaXgWH8Uv` | **Jauns pieprasījums** › Sazinājāmies › Rezervēts › Iznomāts › Atgriezts |

Only the first stages were agreed with the client; the later ones are suggestions and can be renamed, reordered or
removed in Opportunities → Pipelines without touching the workflow (it only uses the first stage). Won and lost are
GHL statuses, not stages.

## Known, harmless

- Contact form radios publish `name="radio-N"` with `data-name="interese"`; Webflow submits by `data-name`, and
  site.js also sets the name. `check_forms.py` reports it.
- Webflow Site settings still publish `lang="en"`; site.js sets `lv` at load, so `page_lang` is `lv`. Set the site
  language to Latvian in Site settings → General.

## Change something

Edit `project-config.json` → `python3 scripts/scaffold.py crm/project-config.json` → `scripts/run_tests.sh crm/generated`
(skill scripts) → paste the new `generated/site-footer-crm.html` as the first block of the site footer (keep site.js
after it), publish staging, `check_forms.py`. A new field or form also needs the GHL side (new mapping sample).
