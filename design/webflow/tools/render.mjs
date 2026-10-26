// Render a Claude Design canvas page (.dc.html) to static HTML.
//   node render.mjs <in.dc.html> <out.html> [stateJSON] [--marks]
// --marks keeps every <sc-if> branch (tagged data-if / data-if-init) and tags each
// <sc-for> item's root elements with data-for / data-for-i, so the Webflow converter can
// turn loops into CMS lists and conditional blocks into script-toggled ones.
import { createRequire } from 'module';
const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'fs';
import path from 'path';

const [inPath, outPath, stateArg, ...flags] = process.argv.slice(2);
const marks = flags.includes('--marks') || stateArg === '--marks';
const state = stateArg && stateArg !== '--marks' ? JSON.parse(stateArg) : {};
const src = fs.readFileSync(inPath, 'utf8');
const dir = path.dirname(inPath);
const imports = {};
for (const m of src.matchAll(/<dc-import name="([^"]+)"/g)) {
  const f = path.join(dir, m[1] + '.dc.html');
  if (fs.existsSync(f)) imports[m[1]] = fs.readFileSync(f, 'utf8');
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent('<!doctype html><html><head></head><body></body></html>');
const out = await page.evaluate(({ src, imports, state, marks }) => {
  class DCLogic {
    constructor(props) { this.props = props || {}; this.state = {}; }
    setState(s) { Object.assign(this.state, typeof s === 'function' ? s(this.state) : s); }
  }
  const evalExpr = (expr, scope) => {
    try { return new Function('scope', `with (scope) { return (${expr}); }`)(scope); }
    catch (e) { return undefined; }
  };
  const one = (txt) => { const m = /^\s*\{\{([\s\S]+?)\}\}\s*$/.exec(txt); return m ? m[1] : null; };
  const interp = (txt, scope) => txt.replace(/\{\{([\s\S]+?)\}\}/g, (_, e) => {
    const v = evalExpr(e, scope); return v === undefined || v === null ? '' : String(v);
  });

  function load(source, props, extraState) {
    const doc = new DOMParser().parseFromString(source, 'text/html');
    const tpl = doc.querySelector('x-dc');
    const helmet = tpl.querySelector('helmet');
    const css = helmet ? [...helmet.querySelectorAll('style')].map((s) => s.textContent).join('\n') : '';
    const links = helmet ? [...helmet.querySelectorAll('link')].map((l) => l.outerHTML).join('\n') : '';
    if (helmet) helmet.remove();
    const sc = doc.querySelector('script[data-dc-script]');
    let vals = {};
    if (sc) {
      const defs = JSON.parse(sc.getAttribute('data-props') || '{}');
      const p = {};
      for (const [k, d] of Object.entries(defs)) if (!k.startsWith('$') && d && 'default' in d) p[k] = d.default;
      Object.assign(p, props);
      const Comp = new Function('DCLogic', sc.textContent + '\n;return Component;')(DCLogic);
      const c = new Comp(p);
      Object.assign(c.state, extraState || {});
      vals = c.renderVals();
      vals.props = p;
    }
    return { tpl, css, links, vals };
  }

  const allCss = [];
  const allLinks = new Set();
  function expand(node, scope, out) {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === 3) { out.appendChild(document.createTextNode(interp(child.textContent, scope))); continue; }
      if (child.nodeType !== 1) continue;
      const tag = child.tagName.toLowerCase();
      if (tag === 'sc-for') {
        const listExpr = one(child.getAttribute('list'));
        const list = evalExpr(listExpr, scope) || [];
        const as = child.getAttribute('as');
        list.forEach((item, i) => {
          const frag = document.createElement('div');
          expand(child, Object.assign(Object.create(scope), { [as]: item, [as + 'Index']: i }), frag);
          for (const el of frag.children) if (marks) { el.setAttribute('data-for', listExpr); el.setAttribute('data-for-i', i); }
          while (frag.firstChild) out.appendChild(frag.firstChild);
        });
        continue;
      }
      if (tag === 'sc-if') {
        const expr = one(child.getAttribute('value'));
        const v = !!evalExpr(expr, scope);
        if (!v && !marks) continue;
        const frag = document.createElement('div');
        expand(child, scope, frag);
        for (const el of frag.children) if (marks) { el.setAttribute('data-if', expr); el.setAttribute('data-if-init', String(v)); }
        while (frag.firstChild) out.appendChild(frag.firstChild);
        continue;
      }
      if (tag === 'dc-import') {
        const name = child.getAttribute('name');
        const props = {};
        for (const a of child.attributes) if (!['name'].includes(a.name) && !a.name.startsWith('hint-')) props[a.name] = a.value;
        const ph = document.createElement('div');
        ph.setAttribute('data-import', name);
        ph.setAttribute('data-import-props', JSON.stringify(props));
        if (imports[name]) {
          const sub = load(imports[name], props);
          allCss.push(sub.css); if (sub.links) allLinks.add(sub.links);
          expand(sub.tpl, Object.assign(Object.create(null), sub.vals), ph);
        }
        out.appendChild(ph);
        continue;
      }
      const el = document.createElement(tag === 'svg' || child.closest('svg') ? tag : tag);
      const target = child.namespaceURI === 'http://www.w3.org/2000/svg'
        ? document.createElementNS('http://www.w3.org/2000/svg', child.tagName) : el;
      for (const a of child.attributes) {
        if (/^on[A-Z]/.test(a.name) || /^on[a-z]+$/.test(a.name) && one(a.value)) continue;
        if (a.name.startsWith('hint-')) continue;
        const e = one(a.value);
        if (e !== null) {
          const v = evalExpr(e, scope);
          if (v === undefined || v === null || v === false || typeof v === 'function') continue;
          target.setAttribute(a.name, String(v));
        } else target.setAttribute(a.name, interp(a.value, scope));
      }
      expand(child, scope, target);
      out.appendChild(target);
    }
  }
  const main = load(src, {}, state);
  allCss.unshift(main.css);
  if (main.links) allLinks.add(main.links);
  const root = document.createElement('div');
  expand(main.tpl, Object.assign(Object.create(null), main.vals), root);
  return { html: root.innerHTML, css: allCss.join('\n'), links: [...allLinks].join('\n') };
}, { src, imports, state, marks });
await browser.close();
const title = (/<title>([^<]*)<\/title>/.exec(src) || [])[1] || '';
fs.writeFileSync(outPath, `<!doctype html>\n<html lang="lv">\n<head>\n<meta charset="utf-8">\n<title>${title}</title>\n${out.links}\n<style>\n${out.css}\n</style>\n</head>\n<body>\n${out.html}\n</body>\n</html>\n`);
console.log(`${outPath}: ${out.html.length} chars html, ${out.css.length} chars css`);
