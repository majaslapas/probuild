# Kā pievienot video un rakstus mājaslapā

*Instrukcija mājaslapas administratoram, 2026. gada 4. novembris.*

Video lapā „Par mums“ un blogu rakstus varat mainīt paši Webflow CMS, kodu labot nevajag. Video pievieno ar YouTube saiti, failu Webflow augšupielādēt nevajag.

## Kur to izdarīt

Webflow atveriet vietni **Probuild Group** un kreisajā joslā izvēlieties **CMS** (datubāzes ikona). Var strādāt arī Webflow **Editor** režīmā, sadaļā **Collections**.

Pēc izmaiņām vienmēr spiediet **Publish**, citādi lapā tās neparādās.

## Video lapā „Par mums“

Video parādās lapā „Par mums“ zem kartītēm „Mērķis“ un „Vīzija“. Kamēr kolekcijā nav neviena video, šī vieta lapā nav redzama.

### Jauns video

1. Augšupielādējiet video savā YouTube kanālā. Tas var būt publisks vai „nerindots“ (*Unlisted*), bet ne privāts.
2. YouTube zem video spiediet **Kopīgot** (*Share*) un nokopējiet saiti, piem. `https://youtu.be/…`.
3. Webflow: **CMS → Video par uzņēmumu → New Video**.
4. Aizpildiet laukus:
   - **Virsraksts**: piem. „Saruna ar Jāni Ādamsonu“.
   - **YouTube saite**: ielīmējiet nokopēto saiti. Der arī `youtube.com/watch?v=…`, Shorts un `youtube.com/live/…` saites.
   - **Apraksts**: neobligāti, 1–2 teikumi.
   - **Secība**: neobligāti; mazāks skaitlis ir pirmais (1, 2, 3).
5. Spiediet **Create**, tad **Publish**.

### Nomainīt, pievienot vēl vai noņemt

- **Nomainīt:** atveriet esošo ierakstu, ielīmējiet jauno YouTube saiti un nomainiet virsrakstu, tad **Save** un **Publish**.
- **Vairāki video:** pievienojiet vēl ierakstus. Viens video lapā ir plata kartīte (video un teksts blakus), divi un vairāk ir kartītes divās kolonnās.
- **Noņemt:** atveriet ierakstu un spiediet **Archive** vai **Delete**, tad **Publish**. Ja neviena video vairs nav, lapa izskatās tāpat kā iepriekš.

Video vāka attēlu lapa paņem no YouTube automātiski. Pats YouTube atskaņotājs ielādējas tikai pēc klikšķa uz atskaņošanas pogas.

## Raksti (Blogs)

Raksti ir lapā **Blogs** (`/blogs`), katram ir sava lapa (`/raksts/…`). Trīs jaunākie ir arī sākumlapas apakšā sadaļā „Noderīgi raksti“, un saite „Blogs“ ir lapas kājenē.

**Jauns raksts:** **CMS → Blogs → New Raksts**, aizpildiet laukus un spiediet **Create**, tad **Publish**. Visi lauki ir obligāti, tāpēc Webflow neļaus saglabāt rakstu, kurā kāds trūkst.

| Lauks | Ko ierakstīt |
|---|---|
| **Virsraksts** | Raksta virsraksts, piem. „Kā sagatavoties jumta nomaiņai“. |
| **Slug** | Adrese, aizpildās pati no virsraksta. Pēc publicēšanas to vairs nemainiet: vecā saite pārstās darboties. |
| **Datums** | Publicēšanas datums. Raksti sakārtojas pēc tā, jaunākais pirmais. |
| **Galvenā bilde** | Horizontāla bilde, vismaz 1600 px plata; vēlams sava objekta foto. Pie bildes ierakstiet arī īsu aprakstu (*Alt text*), piem. „Jaunais jumts Tukumā“. |
| **Īss apraksts** | 1–2 teikumi kartītei un raksta sākumam, līdz ~160 zīmēm. |
| **Saturs** | Raksta teksts. Apakšvirsrakstiem izvēlieties **H2** (un **H3**); var pievienot sarakstus, saites un bildes, kā dokumentā. |
| **SEO virsraksts** | Virsraksts Google rezultātos, līdz ~60 zīmēm, piem. „Jumta nomaiņa: no kā sākt \| ProBuild Group“. |
| **SEO apraksts** | Apraksts Google rezultātos, līdz ~155 zīmēm. |

**Labot vai noņemt:** atveriet ierakstu, labojiet un **Publish**; noņem ar **Archive** vai **Delete** un **Publish**.

**Padomi:** rakstiet par to, ko paši darāt un zināt: cenām no kalkulatora, saviem projektiem, darbu gaitu. Saites uz kalkulatoru (`/kalkulators`) vai pakalpojumu lapām palīdz lasītājam uzreiz rīkoties.

## Ierobežojums

Kamēr vietnei nav Webflow vietnes plāna, CMS var būt līdz 50 ierakstiem kopā visās kolekcijās (pakalpojumi, projekti, noma, raksti, video). Šobrīd to ir 38.

Vietnes plāns būs vajadzīgs arī savam domēnam (probuildgroup.lv), un tad ierakstu limits ir daudz lielāks.
