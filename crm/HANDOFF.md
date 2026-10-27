# Hand-off: build the GHL side (needs a local session with a browser)

The Webflow side is finished on staging (`crm/README.md`). What is left happens in GoHighLevel's UI, signed in as
the person, so it needs **the Claude desktop app (Code tab, built-in browser) or `claude` in a terminal with Claude in
Chrome** — a cloud session cannot use the person's signed-in browser.

- Repo: `majaslapas/probuild`, branch `claude/blissful-johnson-qbbstj`.
- Skill: `webflow-ghl-integration` (steps 6–8 of its SKILL.md).
- Read first: `crm/README.md`, `crm/project-config.json`, `crm/generated/ghl/workflow-spec.md`,
  `crm/generated/ghl/custom-fields.csv`, and the skill's `references/ghl-ui.md` and `references/testing.md`.
- Webflow site `6adf4142414584038f9dbb34`, staging https://probuild-group.webflow.io. Publish to staging only.
- GHL: the **ProBuild** sub-account. (The CRM connector in the cloud session did not list it; it is not needed for the
  UI build, but reconnect the connector if API checks are wanted.)

## Before starting

1. Confirm the defaults in `crm/README.md` (notification e-mail, pipeline, test phone, Style Guide form). Change the
   config and re-scaffold if any differ — never edit `generated/` by hand.
2. Make the Style Guide page a draft (or remove its sample form) and publish staging.
3. Count Webflow form submissions left on the site plan: the tests below use about 8.

## Build (Claude does the clicks; the person only signs in and copies the URL)

1. Person signs in to GHL in the browser and opens the ProBuild sub-account.
2. Settings → Custom Fields: create every row of `custom-fields.csv` in folder „Mājaslapas pieteikums“; open each after
   saving and check its key is ASCII.
3. Opportunities → Pipelines: „Mājaslapas pieteikumi“, first stage „Jauns pieteikums“.
4. Automation → Workflows → new workflow „Mājaslapa → Pieteikumi“ → trigger **Inbound Webhook**.
   **Keep this panel open** until the trigger is saved (closing it discards the trigger and its URL).
5. Person copies the webhook URL into a password manager and runs `scripts/save-hook-url.sh ~/.config/webcrm/probuild-group/ghl-hook`
   (stores it from the clipboard). The URL is a secret: never in chat, files, commands or screenshots.
6. With the person's OK (premium trigger runs are billed): `scripts/ghl-probe.sh crm/generated/samples/mapping-sample.json`,
   then Mapping reference → that request → Save trigger.
7. Actions in the order of `workflow-spec.md` §2 (If/else „Valid“ on siteId, Create contact, tags, Create opportunity
   with duplicates enabled and the listed field mapping — Number fields via ⋮ → Dynamic —, note from `ghl/note.txt`,
   internal notification with `ghl/email.html` in the </> source view). Settings per §3. Check the canvas for a stray
   trigger, then **Publish**.
8. With the person's OK: `ghl-probe.sh` each `samples/probe-*.json`, then the mapping sample again (must stop at
   „Valid“). Check Execution logs, the contact (`scripts/ghl-readout.js`), opportunity fields, tags, note, e-mail.
   The person deletes the probe records.

## Connect and test end to end

9. Person adds the Webflow webhook: Webflow → Site settings → Apps & integrations → Webhooks → Form submission →
   paste the URL (`pbcopy < ~/.config/webcrm/probuild-group/ghl-hook`), **no form filter**.
10. Person makes one real test sign-up per form in a normal browser (Turnstile blocks automated ones), each with a
    **different e-mail**: Kalkulators (pick 2 works in 2 areas first), Pakalpojuma pieteikums, Kontaktforma, Nomas
    pieprasījums (/noma), Tehnikas nomas pieprasījums (/nomas-produkts/ekskavators-iekravejs), Līdzīgs projekts
    (/projekts/fasades-atjaunosana).
11. Check each run yourself (Execution logs → contact → readout): `payload.id` equals Webflow's submission ID; the
    calculator opportunity has the whole `aprekins` text and the numbers.

## Stop and ask before

Publishing to the production domain, sending notification e-mails to real inboxes beyond the agreed address, touching
shared GHL fields, deleting records. Then fill the skill's `assets/admin-handover.md`, `assets/client-guide.md` (LV)
and `assets/go-live-checklist.md`.
