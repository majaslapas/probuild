// Browser check of every site form's send button and its spam-check line (site.js). Never sends a form:
// a capture-phase listener cancels every submit before Webflow sees it, and every POST outside
// Cloudflare is aborted.
//   node tools/formcheck.mjs [pass|fail|real] [--site https://probuild-group.webflow.io]
// Webflow's spam check (Cloudflare Turnstile) never passes in an automated browser, so the page's
// site key is swapped for one of Cloudflare's test keys in this browser only:
//   pass  1x00000000000000000000AA — every button must turn on and its click must reach submit
//   fail  2x00000000000000000000AB — every form must show the failure line with retry and contacts
//   real  the site's own key — what a browser driven by a tool sees (same as fail)
import { createRequire } from 'module';
const { chromium } = createRequire(import.meta.url)('playwright');

const args = process.argv.slice(2);
const mode = args.find((a) => /^(pass|fail|real)$/.test(a)) || 'pass';
const site = (args.includes('--site') ? args[args.indexOf('--site') + 1] : 'https://probuild-group.webflow.io').replace(/\/$/, '');
const KEY = { pass: '1x00000000000000000000AA', fail: '2x00000000000000000000AB', real: null }[mode];
const CASES = [
  ['Kalkulators', '/pakalpojumi', 'offer'],
  ['Pakalpojuma pieteikums', '/pakalpojumi', 'request'],
  ['Kontaktforma', '/kontakti'],
  ['Nomas pieprasījums', '/noma'],
  ['Tehnikas nomas pieprasījums', '/nomas-produkts/ekskavators-iekravejs'],
  ['Līdzīgs projekts', '/projekts/fasades-atjaunosana'],
];

const browser = await chromium.launch();
let failed = 0;
const ok = (cond, msg) => { console.log((cond ? 'ok   ' : 'FAIL ') + msg); if (!cond) failed++; };

for (const [name, path, open] of CASES) {
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  let posts = 0;
  await page.route('**/*', async (r) => {
    const q = r.request();
    if (q.method() !== 'GET' && !/challenges\.cloudflare\.com/.test(q.url())) { posts++; return r.abort(); }
    if (KEY && q.resourceType() === 'document') {
      const res = await r.fetch();
      const body = (await res.text()).replace(/data-turnstile-sitekey="[^"]*"/g, 'data-turnstile-sitekey="' + KEY + '"');
      return r.fulfill({ response: res, body, headers: { ...res.headers(), 'content-type': 'text/html; charset=utf-8' } });
    }
    return r.continue();
  });
  await page.addInitScript(() => {
    window.__submits = [];
    window.addEventListener('submit', (e) => { window.__submits.push(e.target.getAttribute('data-name')); e.preventDefault(); e.stopImmediatePropagation(); }, true);
  });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(site + path, { waitUntil: 'networkidle' });
  const sel = `form[data-name="${name}"]`;
  if (open) {
    await page.waitForSelector('[data-pbc-ready]');
    if (open === 'offer') {
      await page.fill('#pbc-q', 'latoj'); await page.waitForTimeout(300);
      const row = page.locator('.pbc_sets [data-id]').first();
      await row.locator('.pbc_row-main').click(); await row.locator('.pbc_in[data-k="q"]').fill('50');
      await page.click('.pbc_foot [data-cta]');
    } else await page.click('.pbc_head [data-request]');
  } else await page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), sel);
  await page.waitForTimeout(6000);
  const st = await page.evaluate((s) => {
    const f = document.querySelector(s), btn = f.querySelector('[type=submit]'), n = f.querySelector('.form_check');
    return { disabled: btn.disabled, note: n && !n.hidden ? n.textContent : '', retry: !!(n && n.querySelector('.form_check-retry')), tel: !!(n && n.querySelector('a[href^="tel:"]')) };
  }, sel);
  if (mode === 'pass') {
    ok(!st.disabled && !st.note, `${name}: button on, no spam-check line`);
    await page.evaluate((s) => {
      for (const e of document.querySelector(s).elements) {
        if (e.type === 'hidden' || e.type === 'submit' || e.type === 'radio' || e.type === 'checkbox' || e.offsetParent === null) continue;
        if (e.tagName === 'SELECT') { e.selectedIndex = 1; continue; }
        e.value = /tel/.test(e.type) ? '20000000' : e.type === 'email' ? 'a@example.com' : e.type === 'date' ? '2026-11-02' : 'Tests';
      }
    }, sel);
    await page.click(sel + ' [type=submit]', { timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(500);
    ok((await page.evaluate(() => window.__submits)).includes(name), `${name}: the click reaches submit (cancelled here)`);
  } else {
    ok(st.disabled && /neizdevās/.test(st.note) && st.retry && st.tel, `${name}: failure line with retry and phone`);
  }
  ok(posts === 0 && !errors.length, `${name}: nothing sent, no page errors` + (errors.length ? ' — ' + errors.join('; ') : ''));
  await page.close();
}
await browser.close();
console.log(failed ? `\n${failed} failed` : '\nall passed');
process.exit(failed ? 1 : 0);
