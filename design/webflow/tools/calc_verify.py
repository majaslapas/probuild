"""Checks the calculator's price embeds against the client's workbooks, cell by cell.

    python3 -I tools/calc_verify.py            (run from design/webflow; needs node)

Independent of calc_data.py: reads each workbook with its own column layout, evaluates the
embeds as the browser does, and compares every row in order (prices exactly, units through
the mapping below). Prints renamed rows for review and exits 1 on any price difference.
"""
import json
import os
import subprocess
import sys

import openpyxl

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CALC = os.path.join(ROOT, 'calculator')

# file, sheet, columns (group, name, unit, recommended, from, to) or range text column
BOOKS = {
    'buvnieciba': ('buvniecibas-tabula-2026.xlsx', 'Darbu cenas 2026', dict(g=1, n=2, u=3, rec=4, rng=5)),
    'remontdarbi': ('remontdarbi-2026.xlsx', 'Darbu cenas 2026', dict(g=0, n=1, u=2, rec=3, lo=4, hi=5)),
    'metalapstrade': ('metalapstrade-2026.xlsx', 'Metālapstrādes cenas', dict(g=0, n=1, u=2, lo=3, rec=4, hi=5)),
    'kokapstrade': ('kokapstrade-2026.xlsx', 'Kokapstrādes cenas', dict(g=0, n=1, u=2, lo=3, rec=4, hi=5)),
    'apsaimniekosana': ('apsaimniekosana-2026.xlsx', 'Uzturēšanas darbu cenas', dict(g=0, n=1, u=2, lo=3, rec=4, hi=5)),
}
GROUPS = {'Guļbūve - Nojumes - Terase': 'Guļbūve, nojumes, terases', 'Žogs': 'Žogi', 'Logi un Durvis': 'Logi un durvis',
          'Sadzīves tehnika uzstādīšana un pieslēgšana': 'Sadzīves tehnikas uzstādīšana un pieslēgšana',
          'Mēbeļu un virtuves izgatavošana + montāža': 'Mēbeļu un virtuves izgatavošana un montāža'}
UNITS = {'m2': 'm2', 'м2': 'm2', 'm²': 'm2', 'EUR/m²': 'm2', 'm3': 'm3', 'm³': 'm3', 'EUR/m³': 'm3',
         'm³ izejmateriāla': 'm3 izejm.', 't/m': 'm', 't\\m': 'm', 'm': 'm', 'EUR/m': 'm', 'EUR/tekošais m': 'm',
         'kanals – t/m': 'm kanāls', 't/m / kanālam': 'm kanāls', 'Stunda': 'h', 'St': 'h', 'stundā': 'h',
         'EUR/stundā': 'h', 'gab': 'gab', 'gab.': 'gab', 'kompl': 'kompl', 'komplekts': 'kompl', 'T': 't', 't': 't',
         'kg': 'kg', 'Diena': 'diena', 'griezums': 'griezums', 'brauciens': 'brauciens', 'izbraukums': 'izbraukums',
         'reize': 'reize', 'EUR/reize': 'reize', 'pasūtījums': 'pasūtījums', 'EUR/koks': 'koks', 'EUR/celms': 'celms',
         'EUR/objekts': 'objekts', 'EUR/izsaukums': 'izsaukums', 'EUR/m²/reize': 'm2 reizē',
         'EUR/m² mēnesī': 'm2 mēnesī', 'EUR/mēnesī': 'mēnesī'}
LEFT_OUT = {'Ziemas ārkārtas darbi / brīvdienu piemaksa'}  # a coefficient, explained in the area note


def embeds():
    js = r'''
const fs = require('fs'), path = require('path'), dir = process.argv[1], window = {};
for (const f of fs.readdirSync(dir).filter(f => /^cenas-.*\.html$/.test(f))) {
  new Function('window', fs.readFileSync(path.join(dir, f), 'utf8').split('<script>')[1].split('</script>')[0])(window);
}
const s = fs.readFileSync(path.join(dir, 'kalkulators.html'), 'utf8');
new Function('window', s.slice(s.indexOf('window.PBC_SETTINGS'), s.indexOf('/* ====== Kalkulatora kods')))(window);
console.log(JSON.stringify({ data: window.PBC_DATA, units: Object.keys(window.PBC_SETTINGS.units) }));
'''
    return json.loads(subprocess.check_output(['node', '-e', js, CALC]))


def main():
    out = embeds()
    data = {a['id']: a for a in out['data']}
    bad = renamed = total = 0
    for area, (fname, sheet, c) in BOOKS.items():
        ws = openpyxl.load_workbook(os.path.join(CALC, 'source', fname), data_only=True)[sheet]
        rows = [r for r in list(ws.iter_rows(values_only=True))[1:] if any(r) and str(r[c['n']]).strip() not in LEFT_OUT]
        by_group = {}
        for r in rows:
            g = str(r[c['g']]).strip()
            by_group.setdefault(GROUPS.get(g, g), []).append(r)
        groups = data[area]['groups']
        if [g['group'] for g in groups] != list(by_group):
            print('GROUPS DIFFER', area, [g['group'] for g in groups], list(by_group)); bad += 1
        for g in groups:
            src = by_group.get(g['group'], [])
            if len(src) != len(g['items']):
                print('COUNT DIFFERS', area, g['group'], len(src), len(g['items'])); bad += 1
            for r, it in zip(src, g['items']):
                total += 1
                if 'rng' in c:
                    lo, hi = (float(x) for x in str(r[c['rng']]).replace('–', '-').split('-'))
                else:
                    lo, hi = float(r[c['lo']]), float(r[c['hi']])
                want = (lo, float(r[c['rec']]), hi)
                got = tuple(float(x) for x in it[2:5])
                unit = UNITS.get(str(r[c['u']]).strip())
                if got != want or unit != it[1] or it[1] not in out['units']:
                    print('DIFF', area, g['group'], repr(r[c['n']]), 'sheet', want, r[c['u']], '| embed', got, it[1]); bad += 1
                if str(r[c['n']]).strip() != it[0]:
                    renamed += 1
                    if '-v' in sys.argv:
                        print('  renamed: %s  →  %s' % (str(r[c['n']]).strip(), it[0]))
    print('%d rows checked, %d price/unit differences, %d names tidied (-v lists them)' % (total, bad, renamed))
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
