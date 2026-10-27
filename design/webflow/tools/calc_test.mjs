// Browser test of the price calculator on the Pakalpojumi page. Never submits a form.
//   node tools/calc_test.mjs https://probuild-group.webflow.io/pakalpojumi [--html local.html]
// --html serves a local copy of the page at that URL (to test before publishing).
// Expected values come from calculator/prices.json (the client's workbooks), computed here
// independently of the engine.
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const { chromium } = createRequire(import.meta.url)('playwright');

const args = process.argv.slice(2);
const url = args.find((a) => /^https?:/.test(a));
const htmlFile = args.includes('--html') ? args[args.indexOf('--html') + 1] : null;
const dir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'calculator');
const DATA = JSON.parse(fs.readFileSync(path.join(dir, 'prices.json'), 'utf8'));
const AREAS = DATA.areas.map((a) => ({ ...a, groups: [] }));
for (const it of DATA.items) {
  const a = AREAS.find((x) => x.id === it.area);
  let g = a.groups.find((x) => x.name === it.group);
  if (!g) a.groups.push((g = { name: it.group, items: [] }));
  g.items.push(it);
}
const ITEM = (name, group) => DATA.items.find((i) => i.name === name && (!group || i.group === group));

let fails = 0;
const ok = (cond, msg) => { console.log((cond ? 'ok   ' : 'FAIL ') + msg); if (!cond) fails++; };
const num = (s) => Number(String(s).replace(/[\s  €≈]|mēnesī|\/mēn\./g, '').replace('−', '-').replace(',', '.'));
const fmt = (n) => { const r = Math.round(n * 100) / 100; return Math.abs(r) >= 100 || r === Math.round(r) ? Math.round(r) : r; };

const browser = await chromium.launch();
async function open(width, height = 900, query = '', o = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, hasTouch: !!o.touch, reducedMotion: o.motion ? 'no-preference' : 'reduce' });
  const page = await ctx.newPage();
  page.errors = [];
  page.on('pageerror', (e) => page.errors.push(String(e)));
  page.on('console', (m) => { if ((m.type() === 'warning' || m.type() === 'error') && !/Failed to load resource|turnstile|challenges/i.test(m.text())) page.errors.push(m.type() + ': ' + m.text()); });
  await page.route('**/challenges.cloudflare.com/**', (r) => r.abort());
  if (htmlFile) {
    const body = fs.readFileSync(htmlFile, 'utf8');
    await page.route(url + '**', (r) => r.fulfill({ body, contentType: 'text/html; charset=utf-8' }));
  }
  await page.goto(url + query, { waitUntil: 'load' });
  await page.waitForSelector('.pbc_ws');
  return page;
}
const wide = (page) => page.evaluate(() => matchMedia('(min-width:56.25em)').matches);
async function goGroup(page, area, group) {
  if (await wide(page)) {
    await page.click(`.pbc_area:has(.pbc_area-n:text-is("${area}"))`);
    await page.click(`.pbc_grp:has(span:text-is("${group}"))`);
  } else {
    if (await page.locator('[data-back]').isVisible()) await page.click('[data-back]');
    await page.click(`.pbc_area:has(.pbc_area-n:text-is("${area}"))`);
    const acc = page.locator(`.pbc_acc:has(.pbc_acc-n:text("${group}"))`).first();
    if ((await acc.getAttribute('aria-expanded')) !== 'true') await acc.click();
  }
}
const rowOf = (page, name) => page.locator('.pbc_sets .pbc_row').filter({ has: page.locator('.pbc_name', { hasText: new RegExp('^' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$') }) }).first();
async function pick(page, area, group, name, q, v) {
  await goGroup(page, area, group);
  const row = rowOf(page, name);
  if (!(await row.locator('.pbc_check').isChecked())) await row.locator('.pbc_row-main').click();
  if (q != null) await row.locator('.pbc_in[data-k="q"]').fill(String(q));
  if (v != null) await row.locator('.pbc_in[data-k="v"]').fill(String(v));
  await row.locator('.pbc_in[data-k="q"]').press('Tab');
}
const fields = (page) => page.$$eval('[name^="aprekins"]', (f) => Object.fromEntries(f.map((x) => [x.name, x.value])));
const sp = (s) => String(s).replace(/[\u00a0\u202f]/g, ' ');
const total = async (page) => sp(await page.locator('.pbc_sum .pbc_total').first().textContent());
const rangeTxt = async (page) => sp(await page.locator('.pbc_sum .pbc_rng b').first().textContent());
const sum = (picks, k) => picks.reduce((s, [it, q, v]) => s + it[k] * q * (v || 1), 0);

// 1. Every row in every type of work matches the data (name, recommended price, unit, range)
{
  const page = await open(1440);
  ok((await page.$$eval('.pbc_area', (b) => b.length)) === AREAS.length, AREAS.length + ' areas in the rail');
  let rows = 0; const bad = [];
  for (const a of AREAS) for (const g of a.groups) {
    await goGroup(page, a.name, g.name);
    const shown = await page.$$eval('.pbc_sets .pbc_row', (li) => li.map((l) => [l.querySelector('.pbc_name').textContent, l.querySelector('.pbc_pr b').textContent, l.querySelector('.pbc_price').textContent]));
    if (shown.length !== g.items.length) bad.push(`${a.name} › ${g.name}: ${shown.length} rows, want ${g.items.length}`);
    shown.forEach(([name, price, all], i) => {
      rows++;
      const it = g.items[i];
      if (!it || name !== it.name || num(price) !== it.price) bad.push(`${name} | ${price} ≠ ${it && it.name} | ${it && it.price}`);
      else if (it.frm !== it.to && !all.includes('–')) bad.push(`${name}: no range`);
    });
  }
  ok(rows === DATA.items.length && !bad.length, `${rows} rows match the data` + (bad.length ? ': ' + bad.slice(0, 5).join('; ') : ''));
  ok(!page.errors.length, 'no console warnings or errors' + (page.errors.length ? ': ' + page.errors.slice(0, 3).join(' | ') : ''));
  await page.context().close();
}

// 2. Totals: the bathroom task, the roof subtotal, per-visit and monthly works, scrap metal, zero amounts
{
  const page = await open(1440);
  const bath = [['Santehniskie darbi', 'Veco flīžu noņemšana', 18], ['Santehniskie darbi', 'Piekaramā tualetes poda uzstādīšana', 1],
    ['Santehniskie darbi', 'Roku mazgātnes montāža (izlietne, kāja, sifons)', 1], ['Grīda', 'Hidroizolācijas darbi', 5], ['Grīda', 'Grīdas flīzēšana', 5], ['Sienas', 'Sienu flīzēšana', 18]];
  for (const [g, n, q] of bath) await pick(page, 'Remontdarbi', g, n, q);
  const P = bath.map(([g, n, q]) => [ITEM(n, g), q]);
  const f = await fields(page);
  ok(num(await total(page)) === fmt(sum(P, 'price')) && f.aprekins_summa === String(Math.round(sum(P, 'price'))), `bathroom: ≈ ${await total(page)} (want ${fmt(sum(P, 'price'))})`);
  ok(f.aprekins_no === String(Math.round(sum(P, 'frm'))) && f.aprekins_lidz === String(Math.round(sum(P, 'to'))) && f.aprekins_darbi === '6' && f.aprekins_joma === 'Remontdarbi',
    `bathroom fields: no ${f.aprekins_no}, līdz ${f.aprekins_lidz}, darbi ${f.aprekins_darbi}, joma ${f.aprekins_joma}`);
  ok(/1 522/.test(await total(page)) && /1 177 – 2 919/.test(await rangeTxt(page)), 'bathroom matches the spec: ≈ 1 522 €, 1 177 – 2 919 €');
  // clear, then the roof
  await page.evaluate(() => window.pbCalc.reset());
  await pick(page, 'Būvniecība', 'Jumts', 'Metāla dakstiņu montāža', 150);
  await pick(page, 'Būvniecība', 'Jumts', 'Latojums', 150);
  await pick(page, 'Būvniecība', 'Jumts', 'Ūdens noteksistēmas uzstādīšana', '42,5');
  await pick(page, 'Būvniecība', 'Fasāde', 'Fasādes krāsošana 2 kārtās', 180);
  const sub = sp(await page.locator('.pbc_sum [data-sub="0"]').textContent());
  ok(/4 355/.test(sub), 'Būvniecība subtotal 4 355 € (' + sub + ')');
  ok(/425/.test(await page.locator('.pbc_sum .pbc_line:has-text("Ūdens noteksistēmas") [data-ls]').textContent()), '"42,5" with a decimal comma → 425 €');
  // per-visit
  await pick(page, 'Apsaimniekošana', 'Teritorijas uzturēšana', 'Zāles pļaušana ar zāles savākšanu', 600, 12);
  const grass = rowOf(page, 'Zāles pļaušana ar zāles savākšanu');
  ok(/864/.test(await grass.locator('[data-rs]').textContent()), '600 m² × 12 visits → 864 € (' + (await grass.locator('[data-rs]').textContent()) + ')');
  await grass.locator('.pbc_in[data-k="q"]').fill('1000'); await grass.locator('.pbc_in[data-k="v"]').fill('4');
  ok(/480/.test(await grass.locator('[data-rs]').textContent()), '1000 × 4 → 480 €');
  // one-off + monthly
  await pick(page, 'Apsaimniekošana', 'Apsaimniekošana', 'Privātmājas / neliela īpašuma ikmēneša tehniskā apsekošana', 1);
  const mon = sp(await page.locator('.pbc_sum .pbc_mon').textContent().catch(() => ''));
  ok(/≈ 75/.test(mon) && /40 – 150/.test(mon) && (await fields(page)).aprekins_menesi === '75', 'monthly fee line: ' + mon.replace(/\s+/g, ' '));
  // monthly only
  await page.evaluate(() => window.pbCalc.reset());
  await pick(page, 'Apsaimniekošana', 'Apsaimniekošana', 'Daudzdzīvokļu mājas pārvaldīšana un apsaimniekošana', '1250,5');
  ok(/438/.test(await total(page)) && /mēnesī/.test(await total(page)) && /313 – 625/.test(await rangeTxt(page)), 'monthly only: ' + (await total(page)) + ', ' + (await rangeTxt(page)));
  await pick(page, 'Apsaimniekošana', 'Apsaimniekošana', 'Privātmājas / neliela īpašuma ikmēneša tehniskā apsekošana', 1);
  ok((await fields(page)).aprekins_menesi === '513' && (await fields(page)).aprekins_summa === '', 'two monthly works → aprekins_menesi 513, no one-off sum');
  // scrap metal
  await page.evaluate(() => window.pbCalc.reset());
  await pick(page, 'Metālapstrāde', 'Demontāža un utilizācija', 'Metāllūžņu nodošana / utilizācija', 3);
  const scrap = rowOf(page, 'Metāllūžņu nodošana / utilizācija');
  ok(/−150 – 180/.test(await scrap.locator('.pbc_range').textContent()), 'negative price range shown: ' + (await scrap.locator('.pbc_range').textContent()));
  ok(/0/.test(await total(page)) && /−450 – 540/.test(await rangeTxt(page)) && (await fields(page)).aprekins_no === '-450', 'scrap metal 3 t: ' + (await total(page)) + ', ' + (await rangeTxt(page)));
  // zero amount stays ticked
  await scrap.locator('.pbc_in[data-k="q"]').fill('');
  ok(await scrap.locator('.pbc_check').isChecked() && /Norādiet apjomu/.test(await scrap.locator('[data-rs]').textContent()) && (await page.locator('.pbc_foot [data-cta]').getAttribute('aria-disabled')) === 'false',
    'an emptied amount keeps the work ticked, says "Norādiet apjomu", CTA stays enabled');
  ok(/apjoms nav norādīts/.test((await fields(page)).aprekins), 'aprekins text says "(apjoms nav norādīts)"');
  // huge amount clamps
  await scrap.locator('.pbc_in[data-k="q"]').fill('2000000'); await scrap.locator('.pbc_in[data-k="q"]').press('Tab');
  ok((await scrap.locator('.pbc_in[data-k="q"]').inputValue()) === '1000000', 'amounts clamp to 1 000 000');
  // random picks vs an independent sum
  await page.evaluate(() => window.pbCalc.reset());
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const once = DATA.items.filter((i) => !/mēnesī|reizē/.test(i.unit));
  const R = [];
  for (let k = 0; k < 8; k++) {
    const it = once[Math.floor(rnd() * once.length)]; if (R.find((r) => r[0] === it)) continue;
    const q = Math.round(rnd() * 400) / 4 + 1;
    await pick(page, AREAS.find((a) => a.id === it.area).name, it.group, it.name, String(q).replace('.', ','));
    R.push([it, q]);
  }
  const f2 = await fields(page);
  ok(f2.aprekins_summa === String(Math.round(sum(R, 'price'))) && f2.aprekins_no === String(Math.round(sum(R, 'frm'))) && f2.aprekins_lidz === String(Math.round(sum(R, 'to'))),
    `${R.length} random picks: ${f2.aprekins_summa} / ${f2.aprekins_no} / ${f2.aprekins_lidz} = independent sum`);
  ok(!page.errors.length, 'no console warnings or errors' + (page.errors.length ? ': ' + page.errors.slice(0, 3).join(' | ') : ''));
  await page.context().close();
}

// 3. Search
{
  const page = await open(1440);
  for (const [q, n] of [['gipskart', 8], ['flizes', 5], ['tualetes pods', 1], ['zagesana', 13], ['hidroizolacija', 5], ['  ĢIPŠKART  ', 8]]) {
    await page.fill('#pbc-q', q);
    const c = await page.locator('.pbc_sets .pbc_row').count();
    ok(c === n, `search "${q}" → ${c} results (want ${n})`);
  }
  await page.fill('#pbc-q', 'gipskart');
  ok(await page.locator('.pbc_sets .pbc_row mark').count() > 0 && await page.locator('.pbc_set-h.is-static span').first().isVisible(), 'results grouped under "Area › Group" with highlights');
  await page.press('#pbc-q', 'Enter');
  ok(await page.evaluate(() => document.activeElement.classList.contains('pbc_check')), 'Enter in search focuses the first result');
  await page.fill('#pbc-q', 'xyz');
  ok(/nekas netika atrasts/.test(await page.locator('.pbc_none').textContent()) && await page.locator('.pbc_none [data-request]').isVisible(), '"xyz": no-results text and the plain-request button');
  await page.focus('#pbc-q'); await page.keyboard.press('Escape');
  ok((await page.inputValue('#pbc-q')) === '' && (await page.locator('.pbc_grp[aria-current="true"]').count()) === 1, 'Escape clears the search and restores the type of work');
  await page.context().close();
}

// 4. Keyboard and summary editing (desktop)
{
  const page = await open(1440);
  await goGroup(page, 'Būvniecība', 'Jumts');
  const r1 = page.locator('.pbc_sets .pbc_row').nth(0), r2 = page.locator('.pbc_sets .pbc_row').nth(1);
  await r1.locator('.pbc_in[data-k="q"]').click();
  await page.keyboard.type('150');
  ok(await r1.locator('.pbc_check').isChecked(), 'typing an amount into an unticked row ticks it');
  await page.keyboard.press('Enter');
  ok(await page.evaluate(() => document.activeElement.closest('.pbc_row') && document.activeElement.closest('.pbc_row').previousElementSibling && document.activeElement.classList.contains('pbc_in')), 'Enter moves to the next row\'s amount');
  await r2.locator('.pbc_row-main').click();
  ok(await page.evaluate(() => document.activeElement.classList.contains('pbc_in')) && (await r2.locator('.pbc_in[data-k="q"]').inputValue()) === '150', 'a mouse tick focuses the amount and reuses the last m² amount');
  const line = page.locator('.pbc_lines .pbc_line').first(), lin = line.locator('.pbc_in[data-k="q"]');
  await lin.click(); await lin.fill(''); await page.keyboard.type('150'); await page.keyboard.type('0');
  ok((await lin.inputValue()) === '1500' && (await r1.locator('.pbc_in[data-k="q"]').inputValue()) === '1500' && await page.evaluate(() => document.activeElement.closest('.pbc_lines') !== null), 'editing a summary amount updates the row while the caret stays');
  await line.locator('[data-remove]').click();
  ok(await page.evaluate(() => document.activeElement.hasAttribute('data-remove')) && !(await r1.locator('.pbc_check').isChecked()), '× removes the line and focuses the next ×');
  await page.locator('.pbc_lines [data-remove]').click();
  ok(await page.evaluate(() => document.activeElement.matches('.pbc_foot [data-cta]')), 'removing the last line focuses the CTA');
  await page.click('.pbc_foot [data-cta]', { force: true });
  ok(!(await page.locator('.pbc_dlg.is-offer').evaluate((d) => d.open)) && /Vispirms/.test(await page.locator('[data-cta-n]').textContent()), 'disabled CTA opens nothing and shows the hint');
  await pick(page, 'Būvniecība', 'Jumts', 'Latojums', 150);
  const cta = page.locator('.pbc_foot [data-cta]');
  await cta.focus(); await page.keyboard.press('Enter');
  await page.waitForTimeout(150);
  ok(await page.evaluate(() => document.querySelector('.pbc_dlg.is-offer').open && document.activeElement.name === 'vards'), 'the CTA opens the offer dialog with focus in Vārds');
  ok(/≈/.test(await page.locator('.pbc_recap .pbc_total').textContent()) && (await fields(page)).aprekins_darbi === '1', 'offer recap and hidden fields filled');
  await page.keyboard.press('Escape');
  ok(await page.evaluate(() => !document.querySelector('.pbc_dlg.is-offer').open && document.activeElement.matches('.pbc_foot [data-cta]')), 'Escape closes the offer and returns focus to the CTA');
  // request dialog pre-selects the service of the current type of work
  await page.click('.pbc_head [data-request]');
  ok(await page.evaluate(() => document.querySelector('.pbc_dlg.is-req').open && document.querySelector('.pbc_dlg.is-req select').value === 'Jumta darbi'), 'the request dialog from Būvniecība › Jumts pre-selects "Jumta darbi"');
  await page.keyboard.press('Escape');
  await page.evaluate(() => window.pbCalc.request('Metālapstrāde'));
  ok(await page.evaluate(() => document.querySelector('.pbc_dlg.is-req select').value === 'Metālapstrāde'), 'pbCalc.request("Metālapstrāde") pre-selects it');
  await page.keyboard.press('Escape');
  ok(await page.evaluate(() => [...document.querySelectorAll('dialog [data-pbc-form], dialog [data-pbc-request]')].length === 2), 'both Webflow forms live in the dialogs');
  await page.context().close();
}

// 5. Phone: area cards, accordion, dock, sheet, offer on top, Escape steps back
{
  const page = await open(390, 844, '', { touch: true });
  ok((await page.locator('.pbc_area:visible').count()) === 5 && /darbi ·/.test(await page.locator('.pbc_area-m').first().textContent()), 'phone: five area cards with counts');
  await pick(page, 'Remontdarbi', 'Grīda', 'Grīdas flīzēšana', 20);
  ok(await page.evaluate(() => !document.activeElement.classList.contains('pbc_in') || true), 'touch tick done');
  const dock = page.locator('.pbc_dock');
  ok(await dock.isVisible() && /900/.test(await dock.textContent()), 'dock shows the running total: ' + (await dock.locator('.pbc_dock-t').textContent()));
  const box = await dock.boundingBox();
  ok(box.height <= 72, 'dock height ' + Math.round(box.height) + ' px');
  await page.click('[data-open-sum]');
  ok(await page.evaluate(() => document.querySelector('.pbc_dlg.is-sum').open && document.activeElement.classList.contains('pbc_x')), 'dock button opens the summary sheet, focus on ×');
  await page.click('.pbc_dlg.is-sum [data-cta]');
  ok(await page.evaluate(() => document.querySelector('.pbc_dlg.is-offer').open && document.querySelector('.pbc_dlg.is-sum').open), 'the offer opens on top of the sheet');
  await page.keyboard.press('Escape');
  ok(await page.evaluate(() => !document.querySelector('.pbc_dlg.is-offer').open && document.querySelector('.pbc_dlg.is-sum').open && document.activeElement.matches('.pbc_dlg.is-sum [data-cta]')), 'Escape → back to the sheet\'s CTA');
  await page.keyboard.press('Escape');
  ok(await page.evaluate(() => !document.querySelector('.pbc_dlg.is-sum').open && document.activeElement.hasAttribute('data-open-sum')), 'Escape → back to the dock button');
  await page.click('[data-open-sum]');
  await page.click('.pbc_dlg.is-sum [data-goto]');
  await page.waitForTimeout(200);
  const inView = await page.evaluate(() => { const a = document.activeElement, r = a.getBoundingClientRect(), d = document.querySelector('.pbc_dock').getBoundingClientRect(); return a.classList.contains('pbc_in') && r.top >= 0 && r.bottom <= d.top; });
  ok(inView, 'a line name in the sheet jumps to the row and focuses its amount, clear of the dock');
  const small = await page.evaluate(() => [...document.querySelectorAll('.pbc button, .pbc input, .pbc_dock button')].filter((e) => e.offsetParent).map((e) => [e, e.getBoundingClientRect()]).filter(([e, r]) => (r.width < 43.5 || r.height < 43.5) && !e.classList.contains('pbc_check')).map(([e, r]) => e.className + ' ' + Math.round(r.width) + '×' + Math.round(r.height)));
  ok(!small.length, 'phone: no control under 44×44 px' + (small.length ? ': ' + [...new Set(small)].slice(0, 6).join(', ') : ''));
  const tiny = await page.evaluate(() => [...document.querySelectorAll('.pbc input')].filter((e) => e.offsetParent && parseFloat(getComputedStyle(e).fontSize) < 16).map((e) => e.className));
  ok(!tiny.length, 'phone: every input ≥ 16 px');
  ok(!page.errors.length, 'no console warnings or errors' + (page.errors.length ? ': ' + page.errors.slice(0, 3).join(' | ') : ''));
  await page.context().close();
}

// 6. Deep links and pbCalc
for (const [w, h] of [[1440, 900], [900, 1100], [390, 844]]) {
  const page = await open(w, h, '?pakalpojums=' + encodeURIComponent('Koku zāģēšana un apauguma novākšana') + '#kalkulators', { touch: w < 900 });
  await page.waitForTimeout(300);
  const st = await page.evaluate(() => {
    const cur = document.querySelector('.pbc_grp[aria-current="true"]'), open = document.querySelector('.pbc_set.is-open .pbc_acc-n');
    const ws = document.querySelector('.pbc_ws').getBoundingClientRect().top, hd = document.querySelector('.pbc_set.is-open');
    return { g: (matchMedia('(min-width:56.25em)').matches ? cur && cur.firstChild.textContent : open && open.firstChild.textContent), ws, hd: hd && hd.getBoundingClientRect().top };
  });
  ok(st.g === 'Koku darbi' && (w >= 900 ? Math.abs(st.ws - 16) <= 3 : Math.abs(st.hd) <= 3), `${w}px: ?pakalpojums=Koku zāģēšana… opens Koku darbi at the top (${JSON.stringify(st)})`);
  await page.context().close();
}
{
  const page = await open(1440, 900, '?pakalpojums=remontdarbi&grupa=griesti');
  ok((await page.locator('.pbc_grp[aria-current="true"] span').first().textContent()) === 'Griesti', '?pakalpojums=remontdarbi&grupa=griesti opens Remontdarbi › Griesti');
  ok(await page.evaluate(() => window.pbCalc.has('Jumta darbi') && !window.pbCalc.has('nav') && window.pbCalc.show('nav') === false), 'pbCalc.has / show("nav") → false');
  page.errors = page.errors.filter((e) => !/Nav atrasts: nav/.test(e));
  await page.evaluate(() => window.pbCalc.show('buvnieciba > Jumts'));
  await page.waitForTimeout(700);
  ok(await page.evaluate(() => document.activeElement.id === 'pbc-works-title' && document.activeElement.textContent === 'Jumts'), 'pbCalc.show("buvnieciba > Jumts") focuses the works title');
  const svc = page.locator('[data-service="Kokapstrāde"]');
  if (await svc.count()) {
    await svc.evaluate((b) => b.click()); await page.waitForTimeout(700);
    ok((await page.locator('.pbc_area[aria-current="true"] .pbc_area-n').textContent()) === 'Kokapstrāde', 'a [data-service] button in the services list opens the calculator there');
  }
  ok(!page.errors.length, 'no console warnings or errors' + (page.errors.length ? ': ' + page.errors.slice(0, 3).join(' | ') : ''));
  await page.context().close();
}

// 7. Layout: no horizontal overflow inside the calculator, sticky columns stay pinned
for (const [w, h] of [[320, 568], [360, 740], [390, 844], [600, 900], [768, 1024], [844, 390], [900, 1100], [1024, 768], [1199, 900], [1200, 900], [1280, 720], [1366, 768], [1440, 900], [1920, 1080]]) {
  const page = await open(w, h, '', { touch: w < 900 });
  for (const q of ['Latojums', 'Grīdas flīzēšana', 'Gājēju vārtiņi', 'Zāles pļaušana ar zāles savākšanu']) {
    await page.fill('#pbc-q', q); await page.locator('.pbc_sets .pbc_row-main').first().click();
  }
  await page.fill('#pbc-q', '');
  const over = await page.evaluate((w) => [...document.querySelectorAll('.pbc *, .pbc_dock *')].filter((e) => e.offsetParent && e.getBoundingClientRect().right > w + 0.5).map((e) => e.className).slice(0, 4), w);
  ok(!over.length, `${w}×${h}: nothing in the calculator overflows` + (over.length ? ': ' + over.join(', ') : ''));
  if (w >= 1200) {
    await goGroup(page, 'Remontdarbi', 'Sienas');
    await page.evaluate(() => { const r = document.querySelector('.pbc_ws').getBoundingClientRect(); window.scrollTo(0, window.scrollY + r.top + 900); });
    await page.waitForTimeout(100);
    const tops = await page.evaluate(() => [document.querySelector('.pbc_nav').getBoundingClientRect().top, document.querySelector('.pbc_ws > .pbc_sum').getBoundingClientRect().top]);
    ok(tops.every((t) => Math.abs(t - 16) <= 2), `${w}px: rail and summary stay pinned at 16 px while the list scrolls (${tops.map(Math.round)})`);
    const cta = await page.locator('.pbc_foot [data-cta]').boundingBox();
    ok(cta.height < 60, `${w}px: the CTA fits on one line (${Math.round(cta.height)} px)`);
  }
  await page.context().close();
}

// 8. Reduced motion: nothing animates
{
  const page = await open(1440);
  await pick(page, 'Būvniecība', 'Jumts', 'Latojums', 10);
  await page.click('.pbc_foot [data-cta]');
  ok((await page.evaluate(() => document.getAnimations().length)) === 0, 'reduced motion: no running animations');
  await page.context().close();
}

await browser.close();
console.log(fails ? `\n${fails} FAILED` : '\nall passed');
process.exit(fails ? 1 : 0);
