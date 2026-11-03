// Phone check of the published site (never sends a form: every non-GET request is blocked).
//   node tools/mobilecheck.mjs            → audit every page at 320, 360 and 390 px, then the tap tests at 390 px
//   node tools/mobilecheck.mjs audit 375  → only the audit, at the given widths
//   node tools/mobilecheck.mjs taps       → only the tap tests
// Audit: sideways scrolling, heading words wider than their box, text under 12 px, inputs under 16 px (iOS zooms),
// tap targets under 44 px that have no larger hit area. Tap tests: menu, accordion, FAQ, reviews, thumbnails,
// lightbox, contact chips.
import { createRequire } from 'module';
const { chromium, devices } = createRequire(import.meta.url)('playwright');
const B = 'https://probuild-group.webflow.io';
const args = process.argv.slice(2);
const mode = /^(audit|taps)$/.test(args[0] || '') ? args.shift() : 'all';
const widths = args.length ? args.map(Number) : [320, 360, 390];
const PAGES = ['/', '/kalkulators', '/pakalpojumi', '/noma', '/projekti', '/par-mums', '/kontakti', '/privatuma-politika', '/sikdatnu-politika',
  '/pakalpojums/pamatu-buvnieciba', '/pakalpojums/koku-zagesana-un-apauguma-novaksana',
  '/nomas-produkts/ekskavators-iekravejs', '/nomas-produkts/pasizgazejs', '/nomas-produkts/grodu-satverejs', '/nomas-produkts/regipsa-pacelajs',
  '/projekts/jumts-tukuma', '/projekts/saimniecibas-eka-vidrizi', '/projekts/jaunbuve-doles-sala', '/projekts/jaunbuve-ikskile',
  '/projekts/fasade-vidrizi', '/projekts/garkalnu-pirts'];
let failed = 0;
const ok = (cond, msg) => { if (!cond) failed++; console.log((cond ? 'ok   ' : 'FAIL ') + msg); };

const b = await chromium.launch();
const phone = async (w) => {
  const ctx = await b.newContext({ ...devices['iPhone 13'], deviceScaleFactor: 1, viewport: { width: w, height: 844 } });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('pb-intro', '1'); } catch (e) {} });
  await ctx.route('**/*', (r) => (r.request().method() === 'GET' || /challenges\.cloudflare\.com/.test(r.request().url())) ? r.continue() : r.abort());
  return ctx;
};

if (mode !== 'taps') for (const w of widths) {
  const ctx = await phone(w), p = await ctx.newPage(), errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  for (const path of PAGES) {
    await p.goto(B + path, { waitUntil: 'load' }); await p.waitForTimeout(500);
    const r = await p.evaluate((W) => {
      document.documentElement.classList.remove('pb-motion');
      const out = { scroll: document.documentElement.scrollWidth - W, words: [], tiny: [], zoom: [], small: [] };
      const name = (e) => e.tagName.toLowerCase() + '.' + String(e.className).trim().split(/\s+/).slice(0, 2).join('.');
      // a tap a few px outside the box still lands on the element (a larger hit area via ::before/::after) or on the
      // next link right beside it (targets that touch lose no taps)
      const hits = (e, x, y) => { const t = document.elementFromPoint(x, y); return t && (t === e || e.contains(t) || (t.closest('a[href], button') && t.closest('a[href], button') !== e)); };
      document.querySelectorAll('body *').forEach((e) => {
        const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || !e.getClientRects().length) return;
        if (e.closest('.w-webflow-badge, script, style, svg, dialog:not([open]), .navbar_panel')) return;
        if (/^H[1-6]$/.test(e.tagName) && e.scrollWidth > e.clientWidth + 1) out.words.push(name(e) + ' "' + e.textContent.trim().slice(0, 30) + '"');
        if (!e.children.length && e.textContent.trim() && parseFloat(cs.fontSize) < 12) out.tiny.push(name(e) + ' ' + cs.fontSize);
        if (e.matches('input:not([type=hidden]):not([type=radio]):not([type=checkbox]), select, textarea') && parseFloat(cs.fontSize) < 16) out.zoom.push(name(e));
        if (e.matches('a[href], button, summary, [role=button]') && !e.closest('p, li')) {
          const q = e.getBoundingClientRect();
          if (q.height && q.height < 44 && q.bottom > 0 && q.top < innerHeight) {
            const cx = q.left + Math.min(q.width / 2, 12);
            if (!(hits(e, cx, q.top - 3) && hits(e, cx, q.bottom + 3))) out.small.push(name(e) + ' ' + Math.round(q.height) + 'px "' + e.textContent.trim().slice(0, 24) + '"');
          }
        }
      });
      return out;
    }, w);
    const bad = [];
    if (r.scroll > 0) bad.push('scrolls sideways by ' + r.scroll + ' px');
    if (r.words.length) bad.push('heading wider than its box: ' + r.words.join('; '));
    if (r.tiny.length) bad.push('text under 12 px: ' + r.tiny.slice(0, 3).join('; '));
    if (r.zoom.length) bad.push('inputs under 16 px: ' + r.zoom.join('; '));
    if (r.small.length) bad.push('small tap targets in the first screen: ' + r.small.slice(0, 4).join('; '));
    ok(!bad.length, `${w}px ${path}${bad.length ? ': ' + bad.join(' | ') : ''}`);
  }
  ok(!errs.length, `${w}px: no page errors ${errs.length ? JSON.stringify(errs.slice(0, 3)) : ''}`);
  await ctx.close();
}

if (mode !== 'audit') {
  const ctx = await phone(390), p = await ctx.newPage(), errs = [];
  p.on('pageerror', (e) => errs.push(p.url() + ' ' + e.message));
  const go = async (path) => { await p.goto(B + path, { waitUntil: 'load' }); await p.waitForTimeout(600); await p.evaluate(() => { const wb = document.querySelector('.w-webflow-badge'); if (wb) wb.remove(); }); };
  for (const path of ['/', '/kalkulators', '/projekts/garkalnu-pirts', '/nomas-produkts/pasizgazejs']) {
    await go(path);
    await p.tap('.navbar_toggle'); await p.waitForTimeout(300);
    ok(await p.evaluate(() => document.querySelector('.navbar_toggle').getAttribute('aria-expanded') === 'true' && getComputedStyle(document.querySelector('.navbar_panel')).visibility === 'visible'), `${path}: the menu opens`);
    await Promise.all([p.waitForNavigation({ waitUntil: 'load' }), p.tap('.navbar_panel .navbar_link[href="/projekti"]')]);
    ok(await p.evaluate(() => location.pathname === '/projekti' && document.querySelector('.navbar_toggle').getAttribute('aria-expanded') === 'false' && getComputedStyle(document.documentElement).overflow === 'visible'), `${path}: a menu link opens its page with the menu closed`);
  }
  await go('/pakalpojumi');
  const trig = await p.$$('[data-accordion-trigger]'); await trig[1].scrollIntoViewIfNeeded(); await trig[1].tap(); await p.waitForTimeout(300);
  ok(JSON.stringify(await p.$$eval('.services-list_item', (is) => is.slice(0, 2).map((i) => i.classList.contains('is-open')))) === '[false,true]', 'pakalpojumi: tapping a service opens it and closes the open one');
  const sum = await p.$('.prices-faq_item summary'); await sum.scrollIntoViewIfNeeded(); await sum.tap(); await p.waitForTimeout(300);
  ok(await p.$eval('.prices-faq_item', (d) => d.open), 'pakalpojumi: a question opens on tap');
  await go('/');
  const n0 = await p.$$eval('.pb-reviews_card', (c) => c.length);
  if (n0) {
    const more = await p.$('.pb-reviews_more'); await more.scrollIntoViewIfNeeded(); await more.tap(); await p.waitForTimeout(400);
    ok((await p.$$eval('.pb-reviews_card', (c) => c.length)) > n0, 'home: „Ielādēt vairāk“ adds reviews');
  } else console.log('skip home reviews: the review grid did not load');
  await go('/nomas-produkts/ekskavators-iekravejs');
  const src0 = await p.$eval('.rental-product_main-image', (i) => i.src);
  const th = await p.$$('.rental-product_thumbs figure'); await th[2].scrollIntoViewIfNeeded(); await th[2].tap(); await p.waitForTimeout(300);
  ok((await p.$eval('.rental-product_main-image', (i) => i.src)) !== src0, 'rental: a thumbnail tap swaps the main photo');
  await go('/projekts/garkalnu-pirts');
  const figs = await p.$$('.project-gallery_list figure'); await figs[0].scrollIntoViewIfNeeded(); await figs[0].tap(); await p.waitForTimeout(400);
  ok(await p.evaluate(() => { const l = document.querySelector('[data-lightbox="photo"]'), i = l.querySelector('.lightbox_image').getBoundingClientRect(); return l.classList.contains('is-open') && i.left >= -1 && i.right <= innerWidth + 1; }), 'project: a photo tap opens the lightbox and the photo fits the screen');
  await p.tap('[data-lightbox="photo"] [data-lightbox-next]'); await p.waitForTimeout(200);
  ok((await p.$eval('[data-lightbox-count]', (e) => e.textContent)).startsWith('2 /'), 'project: next photo on tap');
  await p.tap('[data-lightbox="photo"] [data-lightbox-close]'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => !document.querySelector('[data-lightbox="photo"]').classList.contains('is-open') && document.body.style.overflow === ''), 'project: the close button closes it');
  await go('/kontakti');
  const chips = await p.$$('.contact_chip-label'); await chips[2].scrollIntoViewIfNeeded(); await chips[2].tap(); await p.waitForTimeout(150);
  ok(JSON.stringify(await p.$$eval('input[name="interese"]', (rs) => rs.map((r) => r.checked))) === JSON.stringify([false, false, true, false, false, false]), 'kontakti: a topic chip tap selects only it');
  ok(!errs.length, 'taps: no page errors ' + (errs.length ? JSON.stringify(errs.slice(0, 3)) : ''));
  await ctx.close();
}
await b.close();
console.log(failed ? `\n${failed} failed` : '\nall passed');
process.exit(failed ? 1 : 0);
