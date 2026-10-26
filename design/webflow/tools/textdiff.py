"""Compare visible text of a published page's <main> with the canvas render.
  textdiff.py <rendered.html> <url>
"""
import difflib, re, sys, urllib.request
from bs4 import BeautifulSoup

def words(html):
    s = BeautifulSoup(html, "lxml")
    m = s.find("main") or s.body
    for t in m.find_all(["script", "style", "svg"]):
        t.decompose()
    for t in m.select("[data-import], .w-dyn-list, .w-form-done, .w-form-fail"):
        t.decompose()
    return re.findall(r"\S+", m.get_text(" "))

a = words(open(sys.argv[1]).read())
b = words(urllib.request.urlopen(sys.argv[2]).read().decode())
sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
for op, i1, i2, j1, j2 in sm.get_opcodes():
    if op != "equal":
        print(op, "canvas:", " ".join(a[i1:i2])[:200], "| webflow:", " ".join(b[j1:j2])[:200])
print(f"ratio {sm.ratio():.3f}  canvas {len(a)} words, webflow {len(b)}")
