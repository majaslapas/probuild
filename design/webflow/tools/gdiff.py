import re, sys, glob
from collections import defaultdict
sys.path.insert(0,'.')
from convert import parse_blocks, strip_comments, split_top, decls, norm_decl, WF_MEDIA
def rules(text):
    out=defaultdict(dict)
    def walk(nodes, media):
        for n in nodes:
            if n[0]=='at':
                m=WF_MEDIA.get(re.sub(r'\s','',n[1][6:])) if n[1].startswith('@media') else None
                if m: walk(n[2], m)
            elif n[0]=='rule':
                for s in split_top(n[1]):
                    for k,v in decls(n[2]).items():
                        for a,b in norm_decl(k,v)[0]: out[(media,s)][a]=b
    walk(parse_blocks(strip_comments(text)), '')
    return out
G=rules(open('globals.css').read())
def expand(d):
    # crude shorthand expansion for comparison
    o={}
    for k,v in d.items():
        p=v.split()
        if k in('padding','margin') :
            t=p+[p[0]]*(4-len(p)) if len(p)<4 else p
            if len(p)==1:t=p*4
            if len(p)==2:t=[p[0],p[1],p[0],p[1]]
            if len(p)==3:t=[p[0],p[1],p[2],p[1]]
            for s,x in zip(['top','right','bottom','left'],t): o[f'{k}-{s}']=x
        elif k=='gap':
            o['row-gap']=p[0]; o['column-gap']=p[-1]
        elif k=='border-radius' and len(p)==1:
            for s in ['top-left','top-right','bottom-left','bottom-right']: o[f'border-{s}-radius']=v
        elif k=='border-radius' and len(p)==4:
            for s,x in zip(['top-left','top-right','bottom-right','bottom-left'],p): o[f'border-{s}-radius']=x
        elif k=='border-color':
            for s in ['top','right','bottom','left']: o[f'border-{s}-color']=v
        elif k=='border':
            for s in ['top','right','bottom','left']: o[f'border-{s}']=v
        else: o[k]=v
    return o
def nv(v): return re.sub(r'\s+','',v).replace('0.','.').replace('100px','var(--radius--pill)').replace('16px','var(--radius--medium)').replace('12px','var(--radius--small)')
seen=defaultdict(set)
for f in sorted(glob.glob('rendered/*.marks.html')):
    t=open(f).read(); css='\n'.join(re.findall(r'<style>(.*?)</style>',t,re.S))
    R=rules(css)
    for (m,s),d in R.items():
        base=re.match(r'^\.([\w-]+)',s)
        if not base: continue
        from convert import GLOBAL
        if base.group(1) not in GLOBAL: continue
        g=expand(G.get((m,s),{})); e=expand(d)
        diff={k:v for k,v in e.items() if nv(g.get(k,'-'))!=nv(v) and k not in('text-wrap','touch-action','transition','cursor','font-family') and not k.startswith('--')}
        if diff: seen[(m,s)].add((f.split('/')[-1].split('.')[0], str(sorted(diff.items()))))
for k,v in sorted(seen.items()):
    print(k)
    byd=defaultdict(list)
    for f,d in v: byd[d].append(f)
    for d,fs in byd.items(): print('   ',d[:230],'<-',','.join(x.replace('site-','') for x in fs))
