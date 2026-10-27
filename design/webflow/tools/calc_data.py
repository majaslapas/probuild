"""Builds the price embeds of the cost calculator from the client's price workbooks.

    python3 -I tools/calc_data.py            (run from design/webflow)

Reads calculator/source/*.xlsx and writes:
  calculator/cenas.html    the Webflow Code Embed with every price as a plain-text table (the admin edits it)
  calculator/prices.json   the same rows with their source cell, for calc_verify.py and calc_test.mjs

Prices are copied unchanged. Names get spelling fixes (RENAME), units are mapped to the
calculator's unit keys (UNIT), and the column order of every row becomes from, recommended, to.
"""
import json
import os
import re
import sys

import openpyxl

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'calculator', 'source')
OUT = os.path.join(ROOT, 'calculator')

# Workbook layouts. cols = (group, name, unit, from, recommended, to, note); range = a "2.5–7"
# text column instead of from/to. Notes are copied only where they are written for customers.
AREAS = [
    dict(id='buvnieciba', order=1, name='Būvniecība', file='buvniecibas-tabula-2026.xlsx',
         sheet='Darbu cenas 2026', drive='būvniecības tabula 2026 pilna tabula.xlsx',
         cols=dict(group=1, name=2, unit=3, price=4, range=5),
         intro='Jaunbūve un būvdarbi: pamati, sienas, jumts, fasāde, grīdas, žogi, teritorija un komunikācijas.',
         short='Darba cenas bez materiāliem un PVN; cenu ietekmē objekts un apjoms.',
         note='Darba cenas bez materiāliem un PVN. Cenu var mainīt objekta atrašanās vieta, darbu apjoms, '
              'piekļuve, augstums, sagatavošana, tehnika un atkritumu izvešana.'),
    dict(id='remontdarbi', order=2, name='Remontdarbi', file='remontdarbi-2026.xlsx',
         sheet='Darbu cenas 2026', drive='remontdarbi_2026_parbaudita_tabula.xlsx',
         cols=dict(group=0, name=1, unit=2, price=3, frm=4, to=5),
         intro='Iekšdarbi dzīvoklī vai mājā: sienas, griesti, grīdas, elektrība, santehnika, logi un durvis.',
         note='Darba cenas bez materiāliem, PVN, transporta un būvgružu izvešanas.'),
    dict(id='metalapstrade', order=3, name='Metālapstrāde', file='metalapstrade-2026.xlsx',
         sheet='Metālapstrādes cenas', drive='metalapstrades_pakalpojumi_2026.xlsx',
         cols=dict(group=0, name=1, unit=2, frm=3, price=4, to=5, note=6),
         intro='Žogi, vārti, margas, metināšana, metāla konstrukcijas un to apdare.',
         short='Darba cenas; materiāls, apdare un transports atsevišķi. PVN precizēsim piedāvājumā.',
         note='Darba cenas. Materiāls, pamati, stiprinājumi, furnitūra, automātika, apdare, transports '
              'un demontāža var būt atsevišķas pozīcijas. PVN precizēsim piedāvājumā.'),
    dict(id='kokapstrade', order=4, name='Kokapstrāde', file='kokapstrade-2026.xlsx',
         sheet='Kokapstrādes cenas', drive='kokapstrades_pakalpojumi_2026.xlsx',
         cols=dict(group=0, name=1, unit=2, frm=3, price=4, to=5, note=6),
         intro='Zāģēšana, ēvelēšana, žāvēšana, CNC apstrāde, apdare un galdniecība.',
         short='Cenas bez kokmateriāla un furnitūras; PVN precizēsim piedāvājumā.',
         note='Pakalpojumu cenas bez kokmateriāla, MDF, saplākšņa, finiera un furnitūras. Minimālā '
              'pasūtījuma maksa, transports un steidzamība var būt atsevišķi. PVN precizēsim piedāvājumā.'),
    dict(id='apsaimniekosana', order=5, name='Apsaimniekošana', file='apsaimniekosana-2026.xlsx',
         sheet='Uzturēšanas darbu cenas', drive='majas_apsaimniekosana_un_teritorijas_uzturesana_2026.xlsx',
         cols=dict(group=0, name=1, unit=2, frm=3, price=4, to=5, note=6),
         intro='Ēku apsaimniekošana, uzkopšana, teritorijas uzturēšana, koku un sezonālie darbi.',
         short='Plānošanas aplēses; daļa cenu ar PVN, daļa bez – precizēsim piedāvājumā.',
         note='Plānošanas aplēses. Var piemērot minimālo izbraukuma maksu, transportu un piemaksu par '
              'darbu ārpus darba laika (koeficients līdz 2). Daļa cenu ir ar PVN, daļa bez – precizēsim piedāvājumā.'),
]

# Raw unit text (after removing "EUR/") → calculator unit key (see units in kalkulators.html).
UNIT = {
    'm2': 'm2', 'м2': 'm2', 'm²': 'm2', 'm3': 'm3', 'm³': 'm3', 'm³ izejmateriāla': 'm3 izejm.',
    't/m': 'm', 't\\m': 'm', 'm': 'm', 'tekošais m': 'm',
    'kanals – t/m': 'm kanāls', 't/m / kanālam': 'm kanāls',
    'Stunda': 'h', 'St': 'h', 'stundā': 'h',
    'gab': 'gab', 'gab.': 'gab', 'kompl': 'kompl', 'komplekts': 'kompl',
    'T': 't', 't': 't', 'kg': 'kg', 'Diena': 'diena',
    'griezums': 'griezums', 'brauciens': 'brauciens', 'izbraukums': 'izbraukums', 'reize': 'reize',
    'pasūtījums': 'pasūtījums', 'koks': 'koks', 'celms': 'celms', 'objekts': 'objekts',
    'izsaukums': 'izsaukums', 'm²/reize': 'm2 reizē', 'm² mēnesī': 'm2 mēnesī', 'mēnesī': 'mēnesī',
}

# Rows that are not a price for an amount of work: shown as a note instead (area note above).
SKIP = {('apsaimniekosana', 'Ziemas ārkārtas darbi / brīvdienu piemaksa')}

# Spelling and punctuation fixes in names (prices untouched). Key: (area, raw name) or a group name.
RENAME = {
    # Būvniecība
    'Sagatavošanas darbi, zemes darbi, pamatu nospraušana.': 'Sagatavošanas darbi, zemes darbi, pamatu nospraušana',
    'Pamatnes-pēdas sagatvošana': 'Pamatnes (pēdas) sagatavošana',
    'Veidņu uzstadīšana un noņemšana no pamatu pēdas': 'Veidņu uzstādīšana un noņemšana no pamatu pēdas',
    'Pamatu vertikālā un horizontāla hidroizolācija': 'Pamatu vertikālā un horizontālā hidroizolācija',
    'Pamatu izveide no FIBO,KIWI blokiem 5Mpa': 'Pamatu izveide no FIBO, KIWI blokiem 5 MPa',
    'Pakāpienu betonēšana (līdz 2,5m garumā)': 'Pakāpienu betonēšana (līdz 2,5 m garumā)',
    'Objektu apsardze - videonovērošana': 'Objekta apsardze – videonovērošana',
    'Guļbaļķu sienas izbūve (Guļbūvju būvniecībā)': 'Guļbaļķu sienas izbūve (guļbūvju būvniecībā)',
    'Bitumeņa apakšklāja ieklāšana': 'Bitumena apakšklāja ieklāšana',
    'Bitumeņa dakstiņu montāža': 'Bitumena dakstiņu montāža',
    'Ventilācijas kanāla-dūmvada izgatavošana': 'Ventilācijas kanāla / dūmvada izgatavošana',
    'Gāzbetona bloku mūrēšana,AEROC,ROCLITE': 'Gāzbetona bloku mūrēšana (AEROC, ROCLITE)',
    'Keramzīta bloku mūrēšana, FIBO': 'Keramzīta bloku mūrēšana (FIBO)',
    'kokšķiedras plāksnes montāža': 'Kokšķiedras plāksnes montāža',
    'kokšķiedras plāksnes montāža (griesti)': 'Kokšķiedras plāksnes montāža (griesti)',
    'Sienas siltinašana ar mineralvati': 'Sienas siltināšana ar minerālvati',
    'SANDVICH paneļi ar metala karkasa izveide': 'Sendviča paneļi ar metāla karkasa izveidi',
    'Terases dēļus montāža (lienāli)': 'Terases dēļu montāža (lineāri)',
    'Terases dēļus montāža (eglīte)': 'Terases dēļu montāža (eglīte)',
    'Koka stabus montāža': 'Koka stabu montāža',
    'Guļbūves sienas apstrāde ar liņeļļu': 'Guļbūves sienas apstrāde ar linsēklu eļļu',
    'Siltās grīdas ierikošana (Ūdens apsildamā)': 'Siltās grīdas ierīkošana (ūdens apsilde)',
    'Siltas grīdas ierikošana(Elektriskā)': 'Siltās grīdas ierīkošana (elektriskā)',
    'Uzklāt kausējamo ruberoīdu (2-kārtas)': 'Kausējamā ruberoīda uzklāšana (2 kārtas)',
    'skaidu jumtu klāšana': 'Skaidu jumta klāšana',
    'Jumta logu montāža “VELUX, FAKRO”': 'Jumta logu montāža (VELUX, FAKRO)',
    'Dekoratīvos elementu montāža': 'Dekoratīvo elementu montāža',
    'Apdare ar plastikāta dēļiem SAIDINGS': 'Apdare ar plastikāta dēļiem (SAIDINGS)',
    'Vecās dekoratīvās apdares renovācija, daļēja': 'Vecās dekoratīvās apdares daļēja renovācija',
    'Vēja kārbas apdare ar spundētiem dēļiem +2 kārtas krāsošana':
        'Vēja kārbas apdare ar spundētiem dēļiem un krāsošana 2 kārtās',
    'Vecās bruģa klājuma demontāža': 'Vecā bruģa klājuma demontāža',
    'Zemes līdzināšana + traktortehnikas pakalpojumi (zemes līdzināšana)': 'Zemes līdzināšana ar traktortehniku',
    'Kokā žoga izgatavošana no dēļiem': 'Koka žoga izgatavošana no dēļiem',
    'Monolītā betona pamatu izveide ķieģelu žogam': 'Monolītā betona pamatu izveide ķieģeļu žogam',
    'Elektriskā kabeļa ieguldīšana ne vairāk kā 90cm dziļumā': 'Elektriskā kabeļa ieguldīšana ne vairāk kā 90 cm dziļumā',
    'Būvgružu iznēšana': 'Būvgružu iznešana',
    'Guļbūve - Nojumes - Terase': 'Guļbūve, nojumes, terases',
    'Žogs': 'Žogi',
    # Remontdarbi
    'Veco ķieģeļu mūrēšana - makslinieka mūrēšana': 'Veco ķieģeļu mūrēšana (mākslinieciskā mūrēšana)',
    'Vecās apdares noņemšana, tapetes, krāsa utt…': 'Vecās apdares noņemšana (tapetes, krāsa u. c.)',
    'Vecās apdares noņemšana - linolejs, krāsa, utt…': 'Vecās apdares noņemšana (linolejs, krāsa u. c.)',
    'Špaktelēšana priekš LED apgaismojumam': 'Špaktelēšana LED apgaismojumam',
    'Stiklašķiedras sieta uzlīmēšana': 'Stiklšķiedras sieta uzlīmēšana',
    'Dekoratīva krāsošana ar venecianka imitācijas krāsam': 'Dekoratīvā krāsošana ar Venēcijas apmetuma imitācijas krāsām',
    'Stūru uzstādīšana ( iekšējais un ārējais )': 'Stūru uzstādīšana (iekšējie un ārējie)',
    'PVC plēves līmēšana (tips': 'PVC plēves līmēšana',
    'Metāla karkasa izveide gipškartonam': 'Metāla karkasa izveide ģipškartonam',
    'Reģipša arkas izveide līdz 1600mm': 'Reģipša arkas izveide līdz 1600 mm',
    'Gipškartona starpsienu izveide': 'Ģipškartona starpsienu izveide',
    'Grīdlistes izgatavošana no flīzem': 'Grīdlistes izgatavošana no flīzēm',
    'Špaktelešanas darbi': 'Špaktelēšanas darbi',
    'Gipškartona daudzlīmeņu griestu ierīkošana ar metāla karkasa izveidošanu':
        'Ģipškartona daudzlīmeņu griestu ierīkošana ar metāla karkasa izveidošanu',
    'Gipškartona griestu ierīkošana ar metāla karkasa izveidošanu':
        'Ģipškartona griestu ierīkošana ar metāla karkasa izveidošanu',
    'Betona grīdas līdz 5cm, un armēšana(siltām grīdām)': 'Betona grīdas līdz 5 cm un armēšana (siltajām grīdām)',
    'Pašizlīdzinošo grīdu ierīkošana, sagatavošana, gruntēšana, ieliešana.':
        'Pašizlīdzinošās grīdas ierīkošana (sagatavošana, gruntēšana, ieliešana)',
    'Hidroizolācijas darbi ar stiklšķiedra-hidroizolu': 'Hidroizolācijas darbi ar stiklšķiedras hidroizolu',
    'Ūdensizturīgs finieris (montažas darbi)': 'Ūdensizturīga finiera montāža',
    'Vadu kanālu štrobēšana, kabeļu ieguldīšana un kanālu aizpildīšanu':
        'Vadu kanālu štrobēšana, kabeļu ieguldīšana un kanālu aizpildīšana',
    'Kabeļu ieguldīšana (bez štrobēšana)': 'Kabeļu ieguldīšana (bez štrobēšanas)',
    'LED lentas montāža darbi': 'LED lentes montāža',
    'Lustras/gaismekļa uzstāīšana un pieslēgšana esošai elektroinstalācijai':
        'Lustras / gaismekļa uzstādīšana un pieslēgšana esošai elektroinstalācijai',
    'Interneta, TV, telefona u.c. vadu instalācija': 'Interneta, TV, telefona u. c. vadu instalācija',
    'sienas gāzes katla uzstādīšana': 'Sienas gāzes katla uzstādīšana',
    'Apkures radiātoru nomaiņa montāža/demontāža': 'Apkures radiatoru nomaiņa (demontāža un montāža)',
    'Zimejumu izstrāde bīdāmajam skapim': 'Zīmējumu izstrāde bīdāmajam skapim',
    'Logi un Durvis': 'Logi un durvis',
    'Sadzīves tehnika uzstādīšana un pieslēgšana': 'Sadzīves tehnikas uzstādīšana un pieslēgšana',
    'Mēbeļu un virtuves izgatavošana + montāža': 'Mēbeļu un virtuves izgatavošana un montāža',
    'Sienu flīzešana': 'Sienu flīzēšana',
    'Grīdas flīzešana': 'Grīdas flīzēšana',
}

# Customer-facing notes that quote another company's price list: same meaning, no names.
NOTE = {
    'Rīgas Mežu cena darba laikā brīvi pieejamā vietā; sarežģīti apstākļi dārgāki.':
        'Darba laikā brīvi pieejamā vietā; sarežģītos apstākļos dārgāk.',
    'Rīgas Mežu bāzes cena brīvi pieejamā vietā; lielāks diapazons sarežģītākai piekļuvei.':
        'Brīvi pieejamā vietā; augstākā cena – sarežģītākai piekļuvei.',
    'Rīgas Mežu bāzes cena; sarežģītos apstākļos publiskā cena 148,86 EUR bez PVN.':
        'Brīvi pieejamā vietā; sarežģītos apstākļos dārgāk.',
    'Valmieras Namsaimnieka likme par tehnikas darba stundu; mazam celmam iespējama minimālā maksa.':
        'Tehnikas darba stunda; mazam celmam iespējama minimālā maksa.',
    'Cena atkarīga no apauguma blīvuma, stumbru diametra un vai jāizņem saknes.':
        'Cena atkarīga no apauguma blīvuma, stumbru diametra un no tā, vai jāizņem saknes.',
    'Vienkāršai detaļu apstrādei; sarežģītas jig/šablona prasības sadārdzina.':
        'Vienkāršai detaļu apstrādei; sarežģītas šablona prasības sadārdzina.',
}

# The admin's view of the prices: one Code Embed with a plain-text table (the engine parses it).
TABLE_HEAD = '''<script type="text/plain" data-pbc-cenas>
#=============================================================================
#  PROBUILD CENU KALKULATORS · DARBU CENAS 2026
#  Šajā blokā ir visas kalkulatora cenas. Kalkulatora kods ir lapas
#  iestatījumos (Page settings → Custom code), to mainīt nevajag.
#  Rindas, kas sākas ar #, ir paskaidrojumi: kalkulators tās nerāda.
#=============================================================================
#  KĀ MAINĪT CENU
#  Katra rinda ir viens darbs. Mainiet skaitļus pirmajās trīs kolonnās:
#
#      NO |   CENA |   LĪDZ | MĒRV.      | DARBS
#     2.5 |      4 |      7 | m2         | Sagatavošanas darbi, zemes darbi
#
#    NO    = zemākā cena
#    CENA  = ieteicamā cena, kalkulators to rāda kā galveno
#    LĪDZ  = augstākā cena
#    MĒRV. = mērvienība, par kuru ir cena
#
#  · Cena ir eiro par vienu mērvienību, bez € zīmes. Decimāldaļa: 12.5 vai 12,5
#  · Kolonnas atdala vertikālā svītra |. Atstarpju skaits nav svarīgs.
#  · Ja cena ir viena, ierakstiet to visās trīs kolonnās: 40 | 40 | 40
#  · Piezīmi klientam raksta rindas beigās aiz vēl vienas svītras |:
#      40 |     55 |     75 | h          | Darba nosaukums | Piezīme klientam
#
#  PĒC IZMAIŅĀM
#  · Spiediet Save & Close, tad Publish.
#  · Pārbaudiet lapu adresē …webflow.io/pakalpojumi?pbc-check – ja kādā rindā
#    ir kļūda, virs kalkulatora būs sarkans lodziņš ar rindas numuru un
#    iemeslu. Kļūdainu rindu kalkulators nerāda, pārējās darbojas.
#
#  DARBI, DARBU VEIDI UN JOMAS
#  · Jauns darbs: nokopējiet rindu tajā pašā darbu veidā un nomainiet tekstu.
#    Dzēst: izdzēsiet rindu. Paslēpt uz laiku: rindas sākumā ierakstiet #.
#  · Darbu veids (grupa) sākas ar rindu „--- Nosaukums”, joma – ar rindu
#    „=== Nosaukums”. # šādas rindas sākumā paslēpj visu darbu veidu vai jomu.
#  · Jomas teksti: „Apraksts:” – zem jomas nosaukuma; „Piezīme:” – pie
#    kopsummas; „Īsā piezīme:” (nav obligāta) – pie kopsummas, ja izvēlēti
#    darbi vairākās jomās.
#  · Visas rindas jāraksta virs rindas „=== BEIGAS”.
#  · Pakalpojumu saraksta pogas atver darbu veidu pēc tā nosaukuma. Ja
#    pārdēvējat darbu veidu vai jomu, nomainiet nosaukumu arī lapas kodā
#    (PBC_SETTINGS, daļā services), citādi poga atvērs pieteikumu bez aprēķina.
#
#  MĒRVIENĪBAS (rakstiet tieši tā)
#    m2, m3, m3 izejm., m (tekošais metrs), m kanāls, h (stunda), gab,
#    kompl, t, kg, diena, reize, brauciens, izbraukums, griezums,
#    pasūtījums, koks, celms, objekts, izsaukums,
#    m2 reizē – cenu reizina arī ar reižu skaitu (piem. pļaušana sezonā),
#    m2 mēnesī un mēnesī – ikmēneša maksa, to skaita atsevišķi.
#    Jaunu mērvienību pievieno lapas kodā (PBC_SETTINGS, daļā units).
#
#  NEMAINIET
#  · Pirmo rindu (<script …>) un rindas zem „=== BEIGAS”.
#  · Code Embed saglabā līdz 50 000 zīmēm. Ja vietas pietrūkst, ievietojiet
#    tajā pašā sadaļā vēl vienu Code Embed ar daļu jomu: tas sākas ar rindu
#    <script type="text/plain" data-pbc-cenas>, tad „=== Jomas nosaukums”,
#    darbi, „=== BEIGAS” un tāda pati pēdējā rinda kā šim blokam.
#=============================================================================
'''
COLS = '#   NO |   CENA |   LĪDZ | MĒRV.      | DARBS'
TABLE_FOOT = '''
=== BEIGAS ===================================================================
# Zem šīs rindas neko nemainiet.
</script>
<div class="pbc" data-pbc>
  <noscript><p>Kalkulatoram vajadzīgs JavaScript. Precīzu cenas piedāvājumu var pieprasīt pa tālruni +371 26 518 131.</p></noscript>
</div>
'''


def num(v):
    if isinstance(v, str):
        v = v.strip().replace(',', '.')
    return float(v)


def parse_range(s):
    a, b = re.split(r'\s*[–-]\s*', str(s).strip())
    return num(a), num(b)


def clean(s):
    return re.sub(r'\s+', ' ', str(s or '')).strip()


def dash(s):
    return re.sub(r' [-—] ', ' – ', s)


def load(area):
    wb = openpyxl.load_workbook(os.path.join(SRC, area['file']), data_only=True)
    ws = wb[area['sheet']]
    c = area['cols']
    groups, rows = {}, []
    for r, row in enumerate(ws.iter_rows(values_only=True), start=1):
        if r == 1 or not any(row):
            continue
        raw_name = clean(row[c['name']])
        if (area['id'], raw_name) in SKIP:
            continue
        raw_unit = clean(row[c['unit']])
        unit_text = raw_unit[4:] if raw_unit.startswith('EUR/') else raw_unit
        if unit_text not in UNIT:
            sys.exit('Unknown unit %r in %s row %d' % (raw_unit, area['file'], r))
        price = num(row[c['price']])
        if 'range' in c:
            frm, to = parse_range(row[c['range']])
        else:
            frm, to = num(row[c['frm']]), num(row[c['to']])
        group = RENAME.get(clean(row[c['group']]), clean(row[c['group']]))
        item = dict(area=area['id'], group=group, name=dash(RENAME.get(raw_name, raw_name)), unit=UNIT[unit_text],
                    frm=frm, price=price, to=to, note=dash(NOTE.get(clean(row[c['note']]), clean(row[c['note']]))) if 'note' in c else '',
                    source=dict(file=area['file'], sheet=area['sheet'], row=r, name=raw_name, unit=raw_unit))
        if not frm <= price <= to:
            print('WARN %s row %d: from %s, recommended %s, to %s' % (area['file'], r, frm, price, to))
        groups.setdefault(group, []).append(item)
        rows.append(item)
    return groups, rows


def tnum(v):
    return str(int(v)) if float(v).is_integer() else repr(round(v, 4))


def table(loaded):
    out = [TABLE_HEAD]
    for area, groups in loaded:
        out.append('\n\n=== %s %s\n' % (area['name'], '=' * max(3, 73 - len(area['name']))))
        out.append('Apraksts: %s\nPiezīme: %s\n%s\n%s\n' % (area['intro'], area['note'],
                   'Īsā piezīme: %s\n' % area['short'] if area.get('short') else '', COLS + ' | PIEZĪME KLIENTAM' if any(
            i['note'] for items in groups.values() for i in items) else COLS))
        for g, items in groups.items():
            out.append('\n--- %s\n' % g)
            for i in items:
                row = '%6s | %6s | %6s | %-10s | %s' % (tnum(i['frm']), tnum(i['price']), tnum(i['to']), i['unit'], i['name'])
                out.append((row + ' | ' + i['note'] if i['note'] else row) + '\n')
    out.append(TABLE_FOOT)
    return ''.join(out)


def main():
    allrows, loaded = [], []
    for area in AREAS:
        groups, rows = load(area)
        loaded.append((area, groups))
        print('%-16s %3d items %2d groups' % (area['id'], len(rows), len(groups)))
        allrows += rows
    code = table(loaded)
    with open(os.path.join(OUT, 'cenas.html'), 'w', encoding='utf-8') as f:
        f.write(code)
    print('calculator/cenas.html %d chars (Webflow Code Embed limit 50 000)' % len(code))
    meta = [{k: a[k] for k in ('id', 'order', 'name', 'file', 'sheet', 'drive')} for a in AREAS]
    with open(os.path.join(OUT, 'prices.json'), 'w', encoding='utf-8') as f:
        json.dump(dict(areas=meta, items=allrows), f, ensure_ascii=False, indent=1)
    print('total', len(allrows), 'items')


if __name__ == '__main__':
    main()
