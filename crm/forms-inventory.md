# Forms inventory

6 pages read, 4 distinct forms with fields.

## Kalkulators

- element ID: `dd2304bf-c927-eda7-8438-babe29a04994`
- pages (1): `/pakalpojumi`

| name (published) | data-name | type | required | label | role guess | options |
|---|---|---|---|---|---|---|
| `vards` | `vards` | text | yes | vards | first_name |  |
| `telefons` | `telefons` | tel | yes | telefons | phone |  |
| `epasts` | `epasts` | email |  | epasts | email |  |
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
| `vards` | `vards` | text | yes | vards | first_name |  |
| `telefons` | `telefons` | tel | yes | telefons | phone |  |
| `epasts` | `epasts` | email |  | epasts | email |  |
| `zina` | `zina` | textarea |  | zina | message |  |

## Nomas pieprasījums

- element ID: `e86c52af-94a3-9432-bf15-ea2220226664`
- pages (1): `/noma`

| name (published) | data-name | type | required | label | role guess | options |
|---|---|---|---|---|---|---|
| `Vārds` | `Vārds` | text |  | Vārds | first_name |  |
| `Telefons` | `Telefons` | tel |  | Telefons | phone |  |
| `No` | `No` | date |  | No |  |  |
| `Līdz` | `Līdz` | date |  | Līdz |  |  |
| `zina` | `zina` | textarea |  | zina | message |  |

## Pakalpojuma pieteikums

- element ID: `dd2304bf-c927-eda7-8438-babe29a049e5`
- pages (1): `/pakalpojumi`

| name (published) | data-name | type | required | label | role guess | options |
|---|---|---|---|---|---|---|
| `Pakalpojums` | `Pakalpojums` | select |  | Pakalpojums | service | Pamatu būvniecība, Jumta darbi, Fasādes darbi, Inženiertīklu |
| `vards` | `vards` | text | yes | vards | first_name |  |
| `telefons` | `telefons` | tel | yes | telefons | phone |  |
| `epasts` | `epasts` | email |  | epasts | email |  |
| `zina` | `zina` | textarea |  | zina | message |  |
