import json, re, sys
from html.parser import HTMLParser
from collections import defaultdict
reg = set(json.load(open('registry.json')))
glob_base = {k.split('.')[0] for k in reg if '_' not in k.split('.')[0]}
class P(HTMLParser):
    def __init__(s): super().__init__(); s.rows=[]
    def handle_starttag(s, tag, attrs):
        a=dict(attrs)
        if 'style' in a: s.rows.append((tag, a.get('class',''), a['style']))
stats=defaultdict(int); own=defaultdict(set); noclass=[]; globonly=defaultdict(set)
for f in sys.argv[1:]:
    p=P(); p.feed(open(f).read())
    for tag,cls,st in p.rows:
        c=cls.split()
        owned=[x for x in c if '_' in x or x.startswith('section_')]
        if not c: stats['noclass']+=1; noclass.append((f.split('/')[-1],tag,st[:80]))
        elif owned: stats['owned']+=1; own[owned[0]].add(st)
        else: stats['globonly']+=1; globonly[cls].add(st)
print(dict(stats))
conf={k:v for k,v in own.items() if len(v)>1}
print('owned classes with differing styles:',len(conf))
for k,v in list(conf.items())[:15]: print(' ',k,len(v),[x[:60] for x in v][:3])
print('global-only combos:')
for k,v in globonly.items(): print(' ',repr(k),len(v),[x[:70] for x in v][:2])
print('no class:',len(noclass))
for r in noclass[:30]: print(' ',r)
