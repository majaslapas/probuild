# Hand-off: build the GHL side (needs a local session with a browser)

## Status (2026-10-28): done

- GHL workflow „Mājaslapa → Pieteikumi“ is built and published in the ProBuild sub-account (`LkU3HqQjzSJOBE4wFaGf`).
- All six test cases (`kalkulators`, `pakalpojuma-pieteikums`, `kontaktforma`, `nomas-pieprasijums`,
  `nomas-produkts`, `lidzigs-projekts`) passed end to end: site → Webflow → GHL.
- Afterwards both rental forms gained an optional `epasts` field (E-pasts) on staging: „Nomas pieprasījums“ (/noma,
  DOM id `nomas-pieprasijums-e-pasts`) and „Tehnikas nomas pieprasījums“ (/nomas-produkts/*, DOM id
  `tehnikas-noma-e-pasts`). Config, inventory and `generated/` are updated; the site script did not change. GHL
  needed no change because `epasts` was already mapped to the contact's e-mail.

The steps below are kept as the record of how it was built.

Ready-to-paste prompt for that session: `crm/LOCAL-SESSION-PROMPT.md`.

The Webflow side is finished on staging (`crm/README.md`). What is left happens in GoHighLevel's UI, signed in as
the person, so it needs **the Claude desktop app (Code tab, built-in browser) or `claude` in a terminal with Claude in
Chrome** — a cloud session cannot use the person's signed-in browser.

- Repo: `majaslapas/probuild`, branch `claude/blissful-johnson-qbbstj`.
- Skill: `webflow-ghl-integration` (steps 6–8 of its SKILL.md), **real sign-up route** (no synthetic probes: the
  client wants every test to go site → Webflow → GHL).
- Read first: `crm/README.md` (decisions), `crm/project-config.json`, `crm/generated/ghl/workflow-spec.md`,
  `crm/generated/ghl/custom-fields.csv`, and the skill's `references/ghl-ui.md` and `references/testing.md` §3.
  The spec still mentions `ghl-probe.sh`; skip those lines, the steps below replace them.
- Webflow site `6adf4142414584038f9dbb34`, staging https://probuild-group.webflow.io. Publish to staging only.
- GHL: the **ProBuild** sub-account (`LkU3HqQjzSJOBE4wFaGf`). The 25 opportunity custom fields and both pipelines
  were created on 2026-10-28 through the CRM connector (IDs and keys: `crm/README.md`). ProBuild's workflow API is off
  (403 `WORKFLOW_API_NOT_ENABLED_FOR_LOCATION`), which is why the workflow itself needs the browser.

## Before starting

- Decisions are confirmed (README). Style Guide page is already a draft.
- Count Webflow form submissions left on the site plan: the tests below use 7 (1 mapping reference + 6 cases).

## Build (Claude does the clicks; the person only signs in and copies the URL)

1. Person signs in to GHL in the browser and opens the ProBuild sub-account.
2. ~~Custom fields~~ — done via the API. Only check: Settings → Custom Fields → Opportunity shows the 25 fields of
   `custom-fields.csv` (in GHL's default opportunity folder; moving them to a folder „Mājaslapas pieteikums“ is
   optional). Do not create them again: a second „Mērķis“ would get a different key.
3. ~~Pipelines~~ — done via the API: „Mājaslapas pieteikumi“ › „Jauns pieteikums“ and „Tehnikas noma“ ›
   „Jauns pieprasījums“ (plus suggested later stages the team may rename).
4. Automation → Workflows → new workflow „Mājaslapa → Pieteikumi“ → trigger **Inbound Webhook**.
   **Keep this panel open** until the trigger is saved (closing it discards the trigger and its URL).
5. Person copies the webhook URL (copy icon) into a password manager and pastes it into Webflow: Site settings →
   Apps & integrations → Webhooks → Form submission → **no form filter**. The URL is a secret: never in chat, files,
   commands or screenshots.
6. **Mapping reference:** the person sends one real sign-up through the **calculator** on
   https://probuild-group.webflow.io/pakalpojumi (it carries the most keys): tick 2 works in 2 areas, enter amounts,
   „Saņemt precīzu cenas piedāvājumu“, fill name, phone, e-mail, address and a comment. In the trigger panel:
   Mapping reference → Fetch sample requests / Check for new requests → pick it → **Save trigger**. A draft workflow
   only records this request; it creates nothing.
7. Actions in the order of `workflow-spec.md` §2: If/else „Valid“ (siteId), Create contact, tags, note, internal
   notification (`ghl/email.html` in the </> source view, to probuildlatvia@gmail.com), and last the If/else „Route“
   with one Create opportunity per pipeline (duplicates enabled, field mapping as listed; Number fields via ⋮ →
   Dynamic). Keys the calculator sign-up did not carry (`pakalpojums`, `interese`, `no`, `lidz`, `datums`, `ilgums`,
   `produkts`, `projekts`) are typed as `{{inboundWebhookRequest.payload.data.<key>}}`. Settings per §3. Check the
   canvas for a stray trigger, then **Publish**.

## Test end to end (after publishing)

8. The person makes one real sign-up per form in a normal browser window they open themselves, not the browser Claude
   drives: Webflow's spam check (Turnstile) never passes there, and the form says „Drošības pārbaude neizdevās…“. Each with a
   **different e-mail** (`name+case@…`):

   | Case | Page | Expect |
   |---|---|---|
   | Kalkulators | /pakalpojumi → calculator → offer form | „Mājaslapas pieteikumi“; name „Cenas piedāvājums: … ≈ … €“; `aprekins` text and numbers filled |
   | Pakalpojuma pieteikums | /pakalpojumi → „Pieteikums bez aprēķina“, pick a service | „Mājaslapas pieteikumi“; Source = the service |
   | Kontaktforma | /kontakti, pick „Remonts un apdare“ (not the first chip) | „Mājaslapas pieteikumi“; Source = Remonts un apdare |
   | Nomas pieprasījums | /noma with both dates | „Tehnikas noma“; dates not shifted |
   | Tehnikas nomas pieprasījums | /nomas-produkts/ekskavators-iekravejs | „Tehnikas noma“; Tehnika = the machine |
   | Līdzīgs projekts | /projekts/fasades-atjaunosana | „Mājaslapas pieteikumi“; Projekts = Fasādes atjaunošana |

9. Check each run yourself: Execution logs (every action Executed) → the contact → fields, tags `majaslapa` +
   `forma-<key>`, note without leftover `{{…}}`, opportunity in the right pipeline, e-mail arrived. `payload.id`
   equals Webflow's submission ID. The person deletes the test records afterwards.

## Stop and ask before

Publishing to the production domain, sending notification e-mails to any other inbox, touching shared GHL fields,
deleting records. Then fill the skill's `assets/admin-handover.md`, `assets/client-guide.md` (LV) and
`assets/go-live-checklist.md`.
