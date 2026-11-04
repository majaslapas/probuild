// What the published site stores in the browser and which other hosts it loads, page by page: the facts behind
// Sīkdatņu politika and the recipients in Privātuma politika. Run it after adding a script, embed or integration and
// update both policies if anything new shows up.
//   node tools/storagecheck.mjs [path ...]
// Only GET requests go out (plus Cloudflare Turnstile's own check), so no form is ever sent.
import { createRequire } from 'module';
const { chromium } = createRequire(import.meta.url)('playwright');

const base = 'https://probuild-group.webflow.io';
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/kalkulators', '/pakalpojumi', '/pakalpojums/jumta-darbi',
  '/noma', '/nomas-produkts/ekskavators-iekravejs', '/projekti', '/projekts/garkalnu-pirts', '/par-mums', '/kontakti',
  '/privatuma-politika', '/sikdatnu-politika', '/blogs', '/raksts/ka-veidojas-buvdarbu-cena'];

const browser = await chromium.launch();
const all = { hosts: new Set(), cookies: new Map(), storage: new Map() };
for (const path of paths) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'lv-LV' });
  const hosts = new Set();
  await ctx.route('**/*', (r) => {
    const u = new URL(r.request().url());
    return r.request().method() === 'GET' || u.hostname.endsWith('challenges.cloudflare.com') ? r.continue() : r.abort();
  });
  ctx.on('request', (rq) => { try { hosts.add(new URL(rq.url()).hostname); } catch (e) {} });
  const page = await ctx.newPage();
  await page.goto(base + path, { waitUntil: 'load' });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } });
  await page.waitForTimeout(5000);
  const frames = [];
  for (const f of page.frames()) {
    try {
      const keys = await f.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage) }));
      frames.push({ origin: new URL(f.url()).hostname, ...keys });
    } catch (e) {}
  }
  const cookies = await ctx.cookies();
  console.log('\n' + path);
  console.log('  other hosts:', [...hosts].filter((h) => h !== new URL(base).hostname).sort().join(', ') || 'none');
  console.log('  cookies:', cookies.map((c) => `${c.domain} ${c.name} (${c.expires > 0 ? Math.round((c.expires - Date.now() / 1000) / 60) + ' min' : 'session'})`).join(', ') || 'none');
  for (const f of frames) if (f.local.length || f.session.length) console.log(`  storage ${f.origin}: local [${f.local.join(', ')}] session [${f.session.join(', ')}]`);
  hosts.forEach((h) => all.hosts.add(h));
  cookies.forEach((c) => all.cookies.set(`${c.domain} ${c.name}`, true));
  frames.forEach((f) => [...f.local.map((k) => 'local ' + k), ...f.session.map((k) => 'session ' + k)].forEach((k) => all.storage.set(`${f.origin} ${k}`, true)));
  await ctx.close();
}
await browser.close();
console.log('\nALL HOSTS:', [...all.hosts].sort().join(', '));
console.log('ALL COOKIES:', [...all.cookies.keys()].join(', ') || 'none');
console.log('ALL STORAGE:', [...all.storage.keys()].join(', ') || 'none');
