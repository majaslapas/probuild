# Webflow renames

Field Names (Designer: field → Settings → Name; API: `data_element_settings_tool.set_settings` key `name`,
component forms with `scope_component_id`). After renaming: publish staging, run check_forms.py.

A rename through the API also sets the field's DOM id to the new Name: page code that finds a field by its id
(the inventory lists it) must change in the same publish, and two forms on one page that share a key get the same id
— give one of them another ID (the Name is what GHL reads).

| Form | Published now | Rename to |
|---|---|---|
| Pakalpojuma pieteikums | `Pakalpojums` | `pakalpojums` |
| Nomas pieprasījums | `Vārds` | `vards` |
| Nomas pieprasījums | `Telefons` | `telefons` |
| Nomas pieprasījums | `No` | `no` |
| Nomas pieprasījums | `Līdz` | `lidz` |
| Nomas pieprasījums | (form name) | Tehnikas nomas pieprasījums |
| Tehnikas nomas pieprasījums | `Vārds` | `vards` |
| Tehnikas nomas pieprasījums | `Telefons` | `telefons` |
| Tehnikas nomas pieprasījums | `Produkts` | `produkts` |
| Līdzīgs projekts | `Vārds` | `vards` |
| Līdzīgs projekts | `Telefons` | `telefons` |
| Līdzīgs projekts | `E-pasts` | `epasts` |
| Līdzīgs projekts | `Projekts` | `projekts` |
