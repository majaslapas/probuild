import { createRequire } from 'module';
const { chromium } = createRequire(import.meta.url)('playwright');
const base = 'https://probuild-group.webflow.io';
const pages = ['/', '/pakalpojumi', '/cenas', '/noma', '/projekti', '/par-mums', '/kontakti',
  '/nomas-produkts/ekskavators-iekravejs', '/nomas-produkts/pasizgazejs', '/nomas-produkts/grodu-satverejs', '/nomas-produkts/regipsa-pacelajs',
  '/projekts/koka-karkasa-privatmaja', '/projekts/moderna-gimenes-maja', '/pakalpojums/pamatu-buvnieciba', '/pakalpojums/koku-zagesana-un-apauguma-novaksana'];
const b = await chromium.launch();
const p = await b.newPage();
const links = new Set();
for (const u of pages) {
  const errs = [];
  p.removeAllListeners('pageerror'); p.on('pageerror', e => errs.push(e.message));
  const r = await p.goto(base + u, { waitUntil: 'load' }); await p.waitForTimeout(500);
  const info = await p.evaluate(() => ({
    title: document.title, h1: (document.querySelector('h1') || {}).textContent,
    icon: !!document.querySelector('link[rel=icon][type="image/svg+xml"]'),
    og: (document.querySelector('meta[property="og:image"]') || {}).content ? 'og' : '-',
    links: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => h.startsWith('/'))
  }));
  info.links.forEach(l => links.add(l.split('#')[0] || '/'));
  console.log(r.status(), u.padEnd(48), info.og, info.icon ? 'icon' : 'NOICON', errs.length ? 'ERR ' + errs : '', '|', info.title.slice(0, 60));
}
console.log('internal links:', [...links].sort().join(' '));
for (const l of links) { const r = await p.request.get(base + l); if (r.status() !== 200) console.log('BROKEN', l, r.status()); }
await b.close();
