# Build the GoHighLevel workflow for the ProBuild website

The ProBuild Webflow site is already connected on the Webflow side, and the GHL sub-account already has its custom fields and pipelines. What's left is **one workflow in GHL's UI**: ProBuild's workflow API is off (403 `WORKFLOW_API_NOT_ENABLED_FOR_LOCATION`), so it has to be clicked together in a browser signed in as me. Do the clicks yourself in the browser. I'll sign in, copy one URL and send the real test sign-ups.

## 0. Before you start

- **Talk to me before every browser step.** Write one short line saying what you're about to do, then make the call. If a browser call doesn't come back, I'll see where it stopped.
- You need a browser you can control on this computer: the desktop app's built-in browser, or Claude in Chrome. Load the matching skill if you have one (`built-in-browser` / Claude in Chrome). If you have neither, stop and tell me.
- If the `webflow-ghl-integration` skill is available, load it and read `references/ghl-ui.md` (click paths and traps). The essentials are below.
- Optional background: repo `majaslapas/probuild`, branch `claude/blissful-johnson-qbbstj`, files `crm/HANDOFF.md`, `crm/README.md`, `crm/generated/ghl/*`. Everything you need is in this message.
- If a CRM / GoHighLevel connector is available, use it only to read: check test contacts and opportunities in location `LkU3HqQjzSJOBE4wFaGf`. Don't create or change anything with it.

## Hard rules

- **The Inbound Webhook URL is a secret.** Anyone who has it can create records. Never print it, type it, store it in files or commands, or show it in a legible screenshot. While the trigger panel is open, take screenshots at scale ≤ 0.35, or zoom into regions without the URL field. I copy it with the copy icon and paste it into Webflow myself.
- Never submit website forms from code or by clicking Send in the browser tool. I make every test sign-up myself in a **normal browser window**: Chrome, Edge, Firefox or Safari, opened by me, not the browser you control. Webflow's spam check (Cloudflare Turnstile) never passes in a browser driven by a tool. There the send button stays disabled and the form shows „Drošības pārbaude neizdevās…“. That's expected, not a bug.
- Don't touch the existing custom fields or pipelines. Recreating them changes keys.
- Ask me before deleting anything, before adding a second webhook in Webflow, and before e-mailing any inbox other than probuildlatvia@gmail.com (that one is approved). Never publish the Webflow site to its production domain.

## Already in GHL (sub-account „ProBuild“, location `LkU3HqQjzSJOBE4wFaGf`)

- 25 opportunity custom fields (in GHL's default opportunity folder): Forma, Mērķis, Lapa, Objekta adrese vai pilsēta, Ziņa (multi line), Kalkulatora aprēķins (multi line), Aprēķina jomas, Aprēķina darbu skaits (Number), Aprēķina summa (€) (Number), Aprēķins no (€) (Number), Aprēķins līdz (€) (Number), Ikmēneša maksa (€) (Number), Pakalpojums, Interese, Nomas sākums (Date), Nomas beigas (Date), Vēlamais datums (Date), Nomas ilgums, Tehnika, Projekts, Avots, UTM source, UTM medium, UTM campaign, Webflow iesnieguma ID.
- Pipelines: „Mājaslapas pieteikumi“ (first stage „Jauns pieteikums“) and „Tehnikas noma“ (first stage „Jauns pieprasījums“).
- Webflow side (site `6adf4142414584038f9dbb34`, staging https://probuild-group.webflow.io) is done. A site script adds hidden fields to every form: form_key, purpose, subject, phone_e164, page_path, site_host, prev_path, page_lang, channel, referrer_host, utm_*.

Notation: `D(key)` = `{{inboundWebhookRequest.payload.data.key}}`. Type the raw syntax, or pick it with the tag icon (Inbound Webhook Trigger › Payload › Data › Key).

## Build

1. Open https://app.gohighlevel.com/ and ask me to sign in and open the **ProBuild** sub-account. Never type passwords.
2. Automation → Workflows → Create workflow → Start from scratch → name it **„Mājaslapa → Pieteikumi“**.
3. Add new trigger → **Inbound Webhook**. **Keep this panel open until the trigger is saved.** Closing it discards the trigger and its URL.
4. Ask me to:
   - copy the URL with the copy icon into a password manager;
   - paste it in Webflow: Site settings → Apps & integrations → Webhooks → Add webhook → trigger type **Form submission** → paste the URL → **no form filter**;
   - send **one real sign-up through the calculator** on https://probuild-group.webflow.io/pakalpojumi: tick 2 works in 2 areas, enter amounts, click „Saņemt precīzu cenas piedāvājumu“, fill in name, phone, e-mail, address and a comment, then send.

   After that: Mapping reference → Fetch sample requests / Check for new requests → pick that request → **Save trigger**. A draft workflow only records this request; it creates nothing.
5. Actions, in this order. Click **Save action** after each one.
   1. **If / else „Valid“**, branch „Webflow site“: Inbound webhook trigger › payload › siteId **Is** `6adf4142414584038f9dbb34` (press Return after picking). Leave the None branch empty. All the following actions go in the „Webflow site“ branch.
   2. **Create contact**: First Name ← D(vards) · Email ← D(epasts) · Phone ← D(phone_e164) · Contact Source ← D(channel).
   3. **Add contact tag** `majaslapa`.
   4. **Add contact tag**, dynamic (⋮ → Dynamic if needed): `forma-{{inboundWebhookRequest.payload.data.form_key}}`.
   5. **Add to notes**: title `Mājaslapas pieteikums: {{inboundWebhookRequest.payload.data.subject}}`. Body: the NOTE text below. Type each label and each placeholder as a separate action with about 1 s waits, because the rich editor drops characters while a chip converts. Then check the character counter.
   6. **Send internal notification** → Email → To: **Custom email** `probuildlatvia@gmail.com`.
      - Subject: `Jauns pieteikums: {{inboundWebhookRequest.payload.data.subject}} — {{inboundWebhookRequest.payload.data.vards}} ({{inboundWebhookRequest.payload.data.site_host}})`.
      - Message: open the editor's **</>** source view, select all, delete, then type the EMAIL HTML below.
      - Leave From name and From email both empty.
   7. **If / else „Route“**, the last step (branches never merge):
      - **Branch „Mājaslapas pieteikumi“**: payload › data › form_key **Is any of** `kalkulators, pakalpojuma-pieteikums, kontaktforma, lidzigs-projekts` → **Create opportunity** (not create/update):
        - pipeline „Mājaslapas pieteikumi“, stage „Jauns pieteikums“, status Open, value empty;
        - Duplicate opportunities → **Enable duplicates for this action only** → tick → Enable duplicates here;
        - Opportunity Name ← `{{inboundWebhookRequest.payload.data.subject}} — {{inboundWebhookRequest.payload.data.vards}}`;
        - Opportunity Source ← D(purpose);
        - Forma ← D(form_key) · Mērķis ← D(purpose) · Lapa ← D(page_path) · Objekta adrese vai pilsēta ← D(vieta) · Ziņa ← D(zina) · Kalkulatora aprēķins ← D(aprekins) · Aprēķina jomas ← D(aprekins_joma);
        - the Number fields (row ⋮ → Dynamic first): Aprēķina darbu skaits ← D(aprekins_darbi) · Aprēķina summa (€) ← D(aprekins_summa) · Aprēķins no (€) ← D(aprekins_no) · Aprēķins līdz (€) ← D(aprekins_lidz) · Ikmēneša maksa (€) ← D(aprekins_menesi);
        - Pakalpojums ← D(pakalpojums) · Interese ← D(interese) · Projekts ← D(projekts) · Avots ← D(channel) · UTM source ← D(utm_source) · UTM medium ← D(utm_medium) · UTM campaign ← D(utm_campaign) · Webflow iesnieguma ID ← `{{inboundWebhookRequest.payload.id}}`.
      - **Branch „Tehnikas noma“**: form_key **Is any of** `nomas-pieprasijums, nomas-produkts` → **Create opportunity**:
        - pipeline „Tehnikas noma“, stage „Jauns pieprasījums“, status Open, value empty, duplicates enabled as above;
        - same Opportunity Name, Source, Forma, Mērķis and Lapa as the first branch;
        - Nomas sākums ← D(no) · Nomas beigas ← D(lidz) · Ziņa ← D(zina) · Vēlamais datums ← D(datums) · Nomas ilgums ← D(ilgums) · Tehnika ← D(produkts) · Avots, UTM source/medium/campaign and Webflow iesnieguma ID as the first branch.
      - Keys the calculator sample didn't carry (pakalpojums, interese, no, lidz, datums, ilgums, produkts, projekts) aren't in the picker. Type them raw.
6. Settings tab: Allow re-entry ✓, Allow multiple opportunities ✓, Stop on response ✗.
7. Check the canvas for a stray trigger (the builder's AI panel can add „Form Submitted“ with no filter). If you find one, ask me before deleting it. Then **Publish** (Draft → Publish).

NOTE (one line each, label then placeholder; write D(x) out in full as `{{inboundWebhookRequest.payload.data.x}}`):

```
Vārds: D(vards)
Telefons (kā ievadīts): D(telefons)
E-pasts: D(epasts)
Objekta adrese vai pilsēta: D(vieta)
Ziņa: D(zina)
Kalkulatora aprēķins: D(aprekins)
Aprēķina jomas: D(aprekins_joma)
Aprēķina darbu skaits: D(aprekins_darbi)
Aprēķina summa (€): D(aprekins_summa)
Aprēķins no (€): D(aprekins_no)
Aprēķins līdz (€): D(aprekins_lidz)
Ikmēneša maksa (€): D(aprekins_menesi)
Pakalpojums: D(pakalpojums)
Interese: D(interese)
Nomas sākums: D(no)
Nomas beigas: D(lidz)
Vēlamais datums: D(datums)
Nomas ilgums: D(ilgums)
Tehnika: D(produkts)
Projekts: D(projekts)

Mērķis: D(purpose)
Forma: D(form_key)
Lapa: D(site_host)D(page_path)
No lapas: D(prev_path)
Lapas valoda: D(page_lang)
Avots: D(channel)
Atsauces vietne: D(referrer_host)
UTM: D(utm_source) / D(utm_medium) / D(utm_campaign) / D(utm_term) / D(utm_content)
Iesniegts: {{inboundWebhookRequest.payload.submittedAt}}
Webflow iesnieguma ID: {{inboundWebhookRequest.payload.id}}
Webflow formas ID: {{inboundWebhookRequest.payload.formId}}
```

EMAIL HTML (type it exactly, with D(x) written out in full):

```
<p>Jauns pieteikums no mājaslapas.</p><p><b>Vārds:</b> D(vards)<br><b>Telefons:</b> D(telefons)<br><b>E-pasts:</b> D(epasts)</p><p><b>Mērķis:</b> D(purpose)<br><b>Objekta adrese vai pilsēta:</b> D(vieta)<br><b>Aprēķina jomas:</b> D(aprekins_joma)<br><b>Aprēķina darbu skaits:</b> D(aprekins_darbi)<br><b>Aprēķina summa (€):</b> D(aprekins_summa)<br><b>Aprēķins no (€):</b> D(aprekins_no)<br><b>Aprēķins līdz (€):</b> D(aprekins_lidz)<br><b>Ikmēneša maksa (€):</b> D(aprekins_menesi)<br><b>Pakalpojums:</b> D(pakalpojums)<br><b>Interese:</b> D(interese)<br><b>Nomas sākums:</b> D(no)<br><b>Nomas beigas:</b> D(lidz)<br><b>Vēlamais datums:</b> D(datums)<br><b>Nomas ilgums:</b> D(ilgums)<br><b>Tehnika:</b> D(produkts)<br><b>Projekts:</b> D(projekts)</p><p><b>Ziņa:</b><br>D(zina)</p><p><b>Kalkulatora aprēķins:</b><br>D(aprekins)</p><p><b>Lapa:</b> D(site_host)D(page_path)<br><b>Avots:</b> D(channel)<br><b>Forma:</b> D(form_key)</p><p>Pieteikums ir saglabāts CRM.</p>
```

## Test end to end (after publishing)

I make one real sign-up per form in a normal browser, each with a **different e-mail** (`name+case@…`). Six cases, so seven Webflow submissions in total with the mapping one. Give me the list one case at a time.

| Case | Page | Expect |
|---|---|---|
| Kalkulators | /pakalpojumi → calculator → offer form | pipeline „Mājaslapas pieteikumi“, name „Cenas piedāvājums: … ≈ … € — <name>“, aprēķins text and numbers filled |
| Pakalpojuma pieteikums | /pakalpojumi → „Pieteikums bez aprēķina“, pick a service | „Mājaslapas pieteikumi“, Source = the service |
| Kontaktforma | /kontakti, pick „Remonts un apdare“ | „Mājaslapas pieteikumi“, Source = Remonts un apdare |
| Nomas pieprasījums | /noma with both dates | „Tehnikas noma“, dates not shifted |
| Tehnikas nomas pieprasījums | /nomas-produkts/ekskavators-iekravejs | „Tehnikas noma“, Tehnika = the machine |
| Līdzīgs projekts | /projekts/fasades-atjaunosana | „Mājaslapas pieteikumi“, Projekts = Fasādes atjaunošana |

Check each run yourself:
- Execution logs: every action Executed.
- The contact: tags `majaslapa` and `forma-<key>`, the note with no leftover `{{…}}`.
- The opportunity: right pipeline, stage and fields.
- Ask me whether the e-mail reached probuildlatvia@gmail.com, and remind me never to click its Unsubscribe link.
- Fix what's wrong and re-test only that case. I delete the test records afterwards.

## When you finish

End with a short report:
- what was built;
- each test case with pass or fail, and what you fixed;
- anything left open.

Don't include the webhook URL or any test person's data in it.
