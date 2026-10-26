"""Page-level custom CSS: conv/<page>.custom.css minus what the site head already has.

  pagecss.py <page> [extra.css]   -> build/<page>.head.html
"""
import re, sys
from pathlib import Path

SKIP = re.compile(r"^(\*|\*::before|\*::after|\.navbar_component|\.footer_component|button:focus-visible|a:focus-visible|"
                  r"input:focus-visible|textarea:focus-visible|select:focus-visible|summary:focus-visible|"
                  r"button\{touch|\.form_input::placeholder|ol\{margin)")


def main(page, *extra):
    lines = Path(f"conv/{page}.custom.css").read_text().splitlines()
    out, seen = [], set()
    for ln in lines:
        ln = ln.strip()
        if not ln or SKIP.match(ln) or ln in seen:
            continue
        seen.add(ln)
        out.append(ln)
    for e in extra:
        out += [l.strip() for l in Path(e).read_text().splitlines() if l.strip()]
    css = "\n".join(out)
    css = re.sub(r"'Martian Mono',\s*monospace", "var(--font--heading),monospace", css)
    css = re.sub(r"'Noto Sans',[^;}]*", "var(--font--body),sans-serif", css)
    css = re.sub(r":\s+", ":", css)
    css = re.sub(r";\s+", ";", css)
    css = re.sub(r"\s*\{\s*", "{", css)
    # merge consecutive rules sharing one at-rule wrapper
    merged = []
    for ln in css.splitlines():
        m = re.match(r"^(@media[^{]+|@supports[^{]+)\{(.*)\}$", ln)
        if m and merged and merged[-1][0] == m.group(1):
            merged[-1][1].append(m.group(2))
        elif m:
            merged.append([m.group(1), [m.group(2)]])
        else:
            merged.append([None, [ln]])
    text = "\n".join(f"{w}{{{''.join(b)}}}" if w else b[0] for w, b in merged)
    html = f"<style>\n{text}\n</style>"
    Path(f"build/{page}.head.html").write_text(html)
    print(f"{page}: {len(html)} chars")


if __name__ == "__main__":
    main(*sys.argv[1:])
