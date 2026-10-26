# Webflow + Client-First iestatījumi

Dizains top Claude Design, pēc tam to pārnes uz Webflow. Lai pārnešana būtu tieša, jau Claude Design katra sadaļa un elements nosaukts pēc [Finsweet Client-First](https://finsweet.com/client-first/docs) konvencijas. Tad Webflow klases un Claude Design markup ir vienādi.

Dizaina avots: [reference/](../reference/) (Relume eksports, 2026-10-22). Tokenu avots ir `reference/DESIGN.md`.

> **Uzmanību:** `reference/react/globals.css` shēmas numurē citādi nekā `DESIGN.md` un `sitemap.md` (CSS: scheme-1 = #191919, scheme-2 = oranžs, scheme-3 = #000). Ekrānšāviņi atbilst `DESIGN.md`, tāpēc numerācija ņemta no tā.

## Lapas struktūra (katrai sadaļai)

```
section_[sadaļa] + color-scheme-[1|2|3]
  padding-global
    container-large
      padding-section-large
        [sadaļa]_component
          [sadaļa]_[elements]
```

- `[sadaļa]` = lapa + bloks ar defisi, piem. `home-hero`, `services-calculator`, `rental-list`.
- Elementi: `home-hero_component`, `home-hero_content`, `home-hero_image-wrapper`, `home-hero_image`, `home-hero_button-group`.
- Globālās komponentes: `navbar_component`, `footer_component`.
- CMS: `rental-list_list-wrapper` / `rental-list_list` / `rental-list_item` (Webflow Collection List struktūra).

## Utility klases

| Mērķis | Klase |
|---|---|
| Virsraksti | `heading-style-h1` … `heading-style-h6` |
| Teksta izmērs | `text-size-large`, `text-size-medium`, `text-size-regular`, `text-size-small`, `text-size-tiny` |
| Teksta stils | `text-weight-semibold`, `text-align-center`, `text-style-tagline` |
| Platums | `max-width-small` … `max-width-xxlarge` |
| Atstarpes | `margin-bottom margin-small`, `margin-top margin-large`, `padding-section-small/medium/large` |
| Pogas | `button`, `button is-secondary`, `button is-link is-icon`, `button-group` |
| Konteineri | `container-small` (48rem), `container-medium` (64rem), `container-large` (80rem) |
| Shēmas | `color-scheme-1`, `color-scheme-2`, `color-scheme-3` (combo klase uz `section_`) |

## Dizaina tokeni → Webflow Variables

Webflow Variables kolekcijās (Client-First v2.1 pieeja):

**Colors / Base**
| Variable | Vērtība |
|---|---|
| `neutral-white` | #FFFFFF |
| `neutral-lightest` | #F2F2F2 |
| `neutral-lighter` | #D8D8D8 |
| `neutral-light` | #B2B2B2 |
| `neutral` | #7F7F7F |
| `neutral-dark` | #4C4C4C |
| `neutral-darker` | #191919 |
| `neutral-darkest` | #000000 |
| `christine-lightest` … `christine-darkest` | #FDEFE6, #FCDFCE, #F58F54, **#F2600C**, #C14C09, #602604, #481C03 |
| `cello-lightest` … `cello-darkest` | #E8EBEF, #D2D7DF, #62758F, **#1F3A5F**, #182E4C, #0C1726, #09111C |

**Color schemes** (katrai shēmai: background / foreground / text / accent / border)
| Shēma | Background | Foreground | Text | Border |
|---|---|---|---|---|
| `color-scheme-1` | #000000 | #191919 | #FFFFFF | #FFFFFF33 |
| `color-scheme-2` | #191919 | #000000 | #FFFFFF | #FFFFFF33 |
| `color-scheme-3` | #F2600C | #C14C09 | #FFFFFF | #FFFFFF33 |

**Typography**
- Virsraksti: Martian Mono 500, letter-spacing −1%, line-height 1.2 (h1–h3), 1.3 (h4), 1.4 (h5–h6)
- Teksts: Noto Sans 400, line-height 1.5
- Fonti augšupielādējami Webflow no `reference/fonts/` (woff2), nevis no Google Fonts CDN

| Stils | Desktop | Mobile (≤767px) |
|---|---|---|
| h1 | 56px | 40px |
| h2 | 48px | 36px |
| h3 | 40px | 32px |
| h4 | 32px | 24px |
| h5 | 24px | 20px |
| h6 | 20px | 18px |
| text-large | 20px | 18px |
| text-medium | 18px | 16px |
| text-regular | 16px | 14px |
| text-small | 14px | 12px |
| text-tiny | 12px | 10px |

**Radius / UI**
| Variable | Vērtība |
|---|---|
| `radius-button` | 100px |
| `radius-badge` (tag) | 100px |
| `radius-form` (input) | 12px |
| `radius-card`, `radius-image` | 16px |
| Card border | 0px (flat), divider 1px |

## Lapas un sadaļu klases

| Lapa | Webflow slug | Sadaļas (`section_…`, shēma) |
|---|---|---|
| Sākumlapa | `/` | `navbar` (2), `home-hero` (2), `home-services` (2), `home-about` (3), `home-rental` (2, jauns pēc 01.10), `home-reviews` (2), `home-cta` (1), `footer` (1) |
| Pakalpojumi | `/pakalpojumi` | `services-hero` + kalkulators (1), `services-list` (1), `services-benefits` (1), `services-reviews` (1), `services-contact` (1) |
| Noma | `/noma` | `rental-hero` (1), `rental-list` CMS ar kategorijām (1), `rental-contact` (1) |
| Nomas produkts | `/nomas-produkts/[slug]` CMS template | `rental-product` (1) ar `rental-product_form` |
| Projekti | `/projekti` | `portfolio-list` CMS ar filtriem (1) |
| Projekts | `/projekts/[slug]` CMS template | `project-header` (1), `project-content` (1), `project-gallery` (1), `project-contact` (1) |
| Pakalpojums | `/pakalpojums/[slug]` CMS template | `service-detail` (1) |
| Par mums | `/par-mums` | `about-hero`, `about-marquee`, `about-story`, `about-stats`, `about-values`, `about-team` (CMS), `about-partners`, `about-cta` (visas 1) |
| Kontakti | `/kontakti` | `contact` (1): kontakti + anketa blakus, bez kartes |

## CMS kolekcijas

| Kolekcija | Lauki |
|---|---|
| Nomas produkti | Nosaukums, slug, kategorija (ref → Nomas kategorijas), apraksts, cena (teksts), bilžu galerija (rich text ar bildēm), papildu sadaļa 1–3 (virsraksts + rich text; tukša neparādās) |
| Nomas kategorijas | Nosaukums (Tehnika, Instrumenti) |
| Projekti | Nosaukums, slug, darba veids (ref, filtram), īss apraksts, izceltie punkti (termiņš, m², cena, darbu veids), detalizēts apraksts (rich text), papildu punkti (līdz 3), titulbilde, bilžu galerija (rich text, līdz 25 bildēm), YouTube saite |
| Darba veidi | Nosaukums (filtriem, piem. pamati, koka karkass, elektroinstalācija) |
| Komanda | Vārds uzvārds, amats, apraksts, bilde |
| Pakalpojumi | Nosaukums, grupa (cilne), apraksts, cena no, cenas (rich text), iekļauts, piezīme, kalkulatora veids, titulbilde, bilžu galerija (rich text) |

Galerijas ir rich text lauks "Bilžu galerija", nevis multi-image: Webflow API nevar piesaistīt Collection List multi-image laukam. Bildes pievieno rich text laukā, katru savā rindā; vietnes skripts tās pārvērš sīktēlos un galerijā.

## Pārnešana uz Webflow

1. Webflow projektā uzstāda Client-First starter (klonējams no Finsweet).
2. Variables ievada pēc tabulām augstāk; shēmas kā `color-scheme-*` combo klases.
3. Fontus augšupielādē no `reference/fonts/`.
4. Katru Claude Design sadaļu būvē ar tieši tām pašām klasēm (tās redzamas Claude Design markup un sadaļu etiķetēs).
5. Formas savieno ar CRM; Google atsauksmes caur embed (rāda tikai 4+).
6. Vietne ir uzbūvēta (2026-10-26): https://probuild-group.webflow.io. Lapas, CMS, skripti, pārbaudes un atlikušie soļi Designer: [design/webflow/README.md](../design/webflow/README.md).
7. Logo: `design/logo/lockups/probuild-lockup-11-white.svg` (dark backgrounds, used in the navbar and footer) and `-black.svg` (light backgrounds). Navbar `navbar_logo` 197×44 px (162×36 at ≤479px), footer `footer_logo` 233×52 px. Favicon: `design/logo/probuild-app-icon-f-black.svg` or `-orange.svg`.
