# Forms inventory

12 pages read, 7 distinct forms with fields.

## Līdzīgs projekts

- element ID: `b8fd0538-e508-3c03-e0ae-0791d216d596`
- pages (2): `/projekts/fasades-atjaunosana`, `/projekts/koka-karkasa-privatmaja`

| name (published) | data-name | type | required | label | role guess | options |
|---|---|---|---|---|---|---|
| `vards` | `vards` | text |  | Vārds | first_name |  |
| `telefons` | `telefons` | tel |  | Telefons | phone |  |
| `epasts` | `epasts` | email |  | E-pasts | email |  |
| `zina` | `zina` | textarea |  | Jūsu iecere | message |  |

Hidden inputs already in the form: `projekts`

## Tehnikas nomas pieprasījums

- element ID: `f722b463-050e-f37c-ca3b-cbe6ed38bd20`
- pages (2): `/nomas-produkts/ekskavators-iekravejs`, `/nomas-produkts/pasizgazejs`
- note: page code refers to field `datums` by `datums` (/nomas-produkts/ekskavators-iekravejs, /nomas-produkts/pasizgazejs) — update that code together with the rename

| name (published) | data-name | type | required | label | role guess | options |
|---|---|---|---|---|---|---|
| `vards` | `vards` | text |  | Vārds | first_name |  |
| `telefons` | `telefons` | tel |  | Telefons | phone |  |
| `datums` | `datums` | date |  | Datums |  |  |
| `ilgums` | `ilgums` | text |  | Aptuvenais ilgums |  |  |

Hidden inputs already in the form: `produkts`

## Kalkulators

- element ID: `dd2304bf-c927-eda7-8438-babe29a04994`
- pages (1): `/pakalpojumi`

| name (published) | data-name | type | required | label | role guess | options |
|---|---|---|---|---|---|---|
| `vards` | `vards` | text | yes | Vārds | first_name |  |
| `telefons` | `telefons` | tel | yes | Telefons | phone |  |
| `epasts` | `epasts` | email |  | E-pasts (nav obligāts) | email |  |
| `vieta` | `vieta` | text |  | Objekta adrese vai pilsēta (nav obligāta |  |  |
| `zina` | `zina` | textarea |  | Komentārs (nav obligāts) | message |  |

## Kontaktforma

- element ID: `4d10121b-a9de-c7da-8368-dcad032a656a`
- pages (1): `/kontakti`
- note: page code refers to field `interese` by `radio` (/kontakti) — update that code together with the rename

| name (published) | data-name | type | required | label | role guess | options |
|---|---|---|---|---|---|---|
| `radio` | `interese` | radio |  | interese |  | Būvniecība |
| `radio-2` | `interese` | radio |  | interese |  | Remonts un apdare |
| `radio-3` | `interese` | radio |  | interese |  | Teritorija |
| `radio-4` | `interese` | radio |  | interese |  | Apsaimniekošana |
| `radio-5` | `interese` | radio |  | interese |  | Tehnikas noma |
| `radio-6` | `interese` | radio |  | interese |  | Cits |
| `vards` | `vards` | text | yes | Vārds | first_name |  |
| `telefons` | `telefons` | tel | yes | Telefons | phone |  |
| `epasts` | `epasts` | email |  | E-pasts | email |  |
| `zina` | `zina` | textarea |  | Ziņa | message |  |

## Nomas pieprasījums

- element ID: `e86c52af-94a3-9432-bf15-ea2220226664`
- pages (1): `/noma`
- note: page code refers to field `no` by `no` (/noma) — update that code together with the rename

| name (published) | data-name | type | required | label | role guess | options |
|---|---|---|---|---|---|---|
| `vards` | `vards` | text |  | Vārds | first_name |  |
| `telefons` | `telefons` | tel |  | Telefons | phone |  |
| `no` | `no` | date |  | No |  |  |
| `lidz` | `lidz` | date |  | Līdz |  |  |
| `zina` | `zina` | textarea |  | Ko vēlaties nomāt? | message |  |

## Pakalpojuma pieteikums

- element ID: `dd2304bf-c927-eda7-8438-babe29a049e5`
- pages (1): `/pakalpojumi`
- note: page code refers to field `pakalpojums` by `pakalpojums` (/pakalpojumi) — update that code together with the rename

| name (published) | data-name | type | required | label | role guess | options |
|---|---|---|---|---|---|---|
| `pakalpojums` | `pakalpojums` | select |  | Pakalpojums | service | Pamatu būvniecība, Jumta darbi, Fasādes darbi, Inženiertīklu |
| `vards` | `vards` | text | yes | Vārds | first_name |  |
| `telefons` | `telefons` | tel | yes | Telefons | phone |  |
| `epasts` | `epasts` | email |  | E-pasts (nav obligāts) | email |  |
| `zina` | `zina` | textarea |  | Jūsu iecere | message |  |

## Stila paraugs

- element ID: `d6034131-2140-1c34-0373-e5700dfad24b`
- pages (1): `/style-guide`

| name (published) | data-name | type | required | label | role guess | options |
|---|---|---|---|---|---|---|
| `Vards` | `Vards` | text |  | Vards | first_name |  |
| `Pakalpojums` | `Pakalpojums` | select |  | Pakalpojums | service | Būvniecība, Remonts, Noma |
| `Zina` | `Zina` | textarea |  | Zina | message |  |
| `Piekrītu privātuma politikai` | `Piekrītu privātuma politikai` | checkbox |  | Piekrītu privātuma politikai | consent |  |
