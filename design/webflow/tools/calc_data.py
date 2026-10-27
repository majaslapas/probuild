"""Builds the price embeds of the cost calculator from the client's price workbooks.

    python3 -I tools/calc_data.py            (run from design/webflow)

Reads calculator/source/*.xlsx and writes:
  calculator/cenas-<area>.html   one Webflow Code Embed per workbook (the admin edits these)
  calculator/prices.json         the same rows with their source cell, for calc_test.mjs

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
         note='Darba cenas. Materiāls, pamati, stiprinājumi, furnitūra, automātika, apdare, transports '
              'un demontāža var būt atsevišķas pozīcijas. PVN precizēsim piedāvājumā.'),
    dict(id='kokapstrade', order=4, name='Kokapstrāde', file='kokapstrade-2026.xlsx',
         sheet='Kokapstrādes cenas', drive='kokapstrades_pakalpojumi_2026.xlsx',
         cols=dict(group=0, name=1, unit=2, frm=3, price=4, to=5, note=6),
         intro='Zāģēšana, ēvelēšana, žāvēšana, CNC apstrāde, apdare un galdniecība.',
         note='Pakalpojumu cenas bez kokmateriāla, MDF, saplākšņa, finiera un furnitūras. Minimālā '
              'pasūtījuma maksa, transports un steidzamība var būt atsevišķi. PVN precizēsim piedāvājumā.'),
    dict(id='apsaimniekosana', order=5, name='Apsaimniekošana', file='apsaimniekosana-2026.xlsx',
         sheet='Uzturēšanas darbu cenas', drive='majas_apsaimniekosana_un_teritorijas_uzturesana_2026.xlsx',
         cols=dict(group=0, name=1, unit=2, frm=3, price=4, to=5, note=6),
         intro='Ēku apsaimniekošana, uzkopšana, teritorijas uzturēšana, koku un sezonālie darbi.',
         note='Plānošanas aplēses. Var piemērot minimālo izbraukuma maksu, transportu un piemaksu par '
              'darbu ārpus darba laika (koeficients līdz 2). Daļa cenu ir ar PVN, daļa bez – precizēsim piedāvājumā.'),
]

# Raw unit text (after removing "EUR/") → calculator unit key (see UNITS in kalkulators.html).
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
}

HEADER = '''<script>
/* ==========================================================================
   PROBUILD CENU KALKULATORS · CENAS: {upper}
   Avots: {drive} (2026. gada cenas)
   --------------------------------------------------------------------------
   KĀ LABOT CENAS
   Katra rinda ir viens darbs:
     ['Darba nosaukums', 'mērvienība', cena no, ieteicamā cena, cena līdz],
   · Cenas ir eiro par vienu mērvienību. Decimāldaļu atdala ar punktu: 12.5
   · Kalkulators rāda ieteicamo cenu un diapazonu no–līdz.
   · Mērvienības: m2, m3, m (tekošais metrs), h (stunda), gab, kompl, t, kg,
     diena, reize, … Pilns saraksts ir kalkulatora koda iestatījumos (UNITS).
   · Rindas beigās var pievienot piezīmi klientam:
     ['Darba nosaukums', 'm2', 10, 12, 15, 'Piezīme'],
   · Jaunu darbu pievieno, nokopējot rindu. Rindas beigās jābūt komatam.
   · Jaunu grupu pievieno, nokopējot bloku {{ group: '…', items: [ … ] }},
   · Teksts starp pēdiņām nedrīkst saturēt pēdiņu ' (ja vajag, raksta \\').
   ========================================================================== */
(window.PBC_DATA = window.PBC_DATA || []).push({{
  id: '{id}',
  order: {order},
  name: '{name}',
  intro: '{intro}',
  note: '{note}',
  groups: [
'''


def num(v):
    if isinstance(v, str):
        v = v.strip().replace(',', '.')
    return float(v)


def parse_range(s):
    a, b = re.split(r'\s*[–-]\s*', str(s).strip())
    return num(a), num(b)


def js(s):
    return "'" + str(s).replace('\\', '\\\\').replace("'", "\\'") + "'"


def jsnum(v):
    return str(int(v)) if float(v).is_integer() else repr(round(v, 4))


def clean(s):
    return re.sub(r'\s+', ' ', str(s or '')).strip()


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
        item = dict(area=area['id'], group=group, name=RENAME.get(raw_name, raw_name), unit=UNIT[unit_text],
                    frm=frm, price=price, to=to, note=NOTE.get(clean(row[c['note']]), clean(row[c['note']])) if 'note' in c else '',
                    source=dict(file=area['file'], sheet=area['sheet'], row=r, name=raw_name, unit=raw_unit))
        if not frm <= price <= to:
            print('WARN %s row %d: from %s, recommended %s, to %s' % (area['file'], r, frm, price, to))
        groups.setdefault(group, []).append(item)
        rows.append(item)
    return groups, rows


def embed(area, groups):
    out = [HEADER.format(upper=area['name'].upper(), drive=area['drive'], id=area['id'], order=area['order'],
                         name=area['name'].replace("'", "\\'"), intro=area['intro'].replace("'", "\\'"),
                         note=area['note'].replace("'", "\\'"))]
    for g, items in groups.items():
        out.append('    {{ group: {}, items: [\n'.format(js(g)))
        width = min(max(len(js(i['name'])) for i in items) + 1, 62)
        for i in items:
            name = (js(i['name']) + ',').ljust(width + 1)
            cells = [name if name.endswith(' ') else name + ' ', (js(i['unit']) + ',').ljust(14),
                     (jsnum(i['frm']) + ',').ljust(7), (jsnum(i['price']) + ',').ljust(7), jsnum(i['to'])]
            note = (', ' + js(i['note'])) if i['note'] else ''
            out.append('      [' + ''.join(cells) + note + '],\n')
        out.append('    ]},\n')
    out.append('  ]\n});\n</script>\n')
    return ''.join(out)


def main():
    allrows = []
    for area in AREAS:
        groups, rows = load(area)
        code = embed(area, groups)
        path = os.path.join(OUT, 'cenas-%s.html' % area['id'])
        with open(path, 'w', encoding='utf-8') as f:
            f.write(code)
        print('%-40s %3d items %2d groups %6d chars' % (os.path.relpath(path, ROOT), len(rows), len(groups), len(code)))
        allrows += rows
    meta = [{k: a[k] for k in ('id', 'order', 'name', 'file', 'sheet', 'drive')} for a in AREAS]
    with open(os.path.join(OUT, 'prices.json'), 'w', encoding='utf-8') as f:
        json.dump(dict(areas=meta, items=allrows), f, ensure_ascii=False, indent=1)
    print('total', len(allrows), 'items')


if __name__ == '__main__':
    main()
