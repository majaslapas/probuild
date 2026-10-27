// Browser test of the price calculator on the Pakalpojumi page.
//   node tools/calc_test.mjs https://probuild-group.webflow.io/pakalpojumi [--html local.html]
// --html serves a local copy of the page at that URL (to test before publishing).
// Checks every rendered price against the embeds, totals of random picks against an
// independent sum, units with visits and monthly fees, search, service links, the mode
// toggle, the request form and its hidden fields, and the 390 px layout. Never submits.
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const { chromium } = createRequire(import.meta.url)('playwright');

const args = process.argv.slice(2);
const url = args.find((a) => /^https?:/.test(a));
const htmlFile = args.includes('--html') ? args[args.indexOf('--html') + 1] : null;
const dir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'calculator');

// The same data the page uses, read from the embed files.
const window = {};
for (const f of fs.readdirSync(dir).filter((f) => /^cenas-.*\.html$/.test(f))) {
  new Function('window', fs.readFileSync(path.join(dir, f), 'utf8').split('<script>')[1].split('</script>')[0])(window);
}
const eng = fs.readFileSync(path.join(dir, 'kalkulators.html'), 'utf8');
new Function('window', eng.slice(eng.indexOf('window.PBC_SETTINGS'), eng.indexOf('/* ====== Kalkulatora kods')))(window);
const AREAS = window.PBC_DATA.sort((a, b) => a.order - b.order);
const UNITS = window.PBC_SETTINGS.units;
const ITEMS = AREAS.flatMap((a) => a.groups.flatMap((g) => g.items.map((r) => ({ area: a.name, group: g.group, name: r[0], unit: r[1], from: r[2], price: r[3], to: r[4] }))));

let fails = 0;
const ok = (cond, msg) => { console.log((cond ? 'ok   ' : 'FAIL ') + msg); if (!cond) fails++; };
const num = (s) => Number(String(s).replace(/[\s  €]/g, '').replace('−', '-').replace(',', '.'));

const browser = await chromium.launch();
async function open(width, query = '') {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  page.errors = [];
  page.on('pageerror', (e) => page.errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'warning' && /Kalkulators/.test(m.text())) page.errors.push(m.text()); });
  await page.route('**/challenges.cloudflare.com/**', (r) => r.abort());
  if (htmlFile) {
    const body = fs.readFileSync(htmlFile, 'utf8');
    await page.route(url + '**', (r) => r.fulfill({ body, contentType: 'text/html; charset=utf-8' }));
  }
  await page.goto(url + query, { waitUntil: 'load' });
  await page.waitForSelector('.pbc_item');
  return page;
}
const pressed = (page, sel) => page.$$eval(sel + '[aria-pressed="true"]', (b) => b.map((x) => x.firstChild.textContent.trim()));
async function find(page, name) {
  await page.fill('[data-search]', name);
  const exact = new RegExp('^' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$');
  const row = page.locator('.pbc_item').filter({ has: page.locator('.pbc_item-name', { hasText: exact }) }).first();
  await row.waitFor();
  return row;
}
async function pick(page, name, q, v) {
  const row = await find(page, name);
  if (!(await row.locator('.pbc_check').isChecked())) await row.locator('.pbc_check').check();
  await row.locator('.pbc_qty-input[data-k="q"]').fill(String(q).replace('.', ','));
  if (v != null) await row.locator('.pbc_qty-input[data-k="v"]').fill(String(v));
  await page.keyboard.press('Tab');
}
const fields = (page) => page.$$eval('[data-pbc-form] [name^="aprekins"]', (f) => Object.fromEntries(f.map((x) => [x.name, x.value])));

// 1. Every rendered row matches the data (name, recommended price, unit text)
{
  const page = await open(1440);
  ok((await page.$$eval('[data-area]', (b) => b.length)) === AREAS.length, AREAS.length + ' areas shown');
  let rows = 0, bad = [];
  for (let ai = 0; ai < AREAS.length; ai++) {
    await page.click(`[data-area="${ai}"]`);
    for (let gi = 0; gi < AREAS[ai].groups.length; gi++) {
      await page.click(`[data-group="${gi}"]`);
      const shown = await page.$$eval('.pbc_item', (li) => li.map((l) => [l.querySelector('.pbc_item-name').textContent, l.querySelector('.pbc_item-price').textContent]));
      const want = AREAS[ai].groups[gi].items;
      if (shown.length !== want.length) bad.push(`${AREAS[ai].name} › ${AREAS[ai].groups[gi].group}: ${shown.length} rows, want ${want.length}`);
      shown.forEach(([name, price], i) => {
        rows++;
        const r = want[i], unit = UNITS[r[1]].price;
        const n = num(price.replace(unit, ''));
        if (name !== r[0] || n !== r[3] || !price.endsWith(' ' + unit)) bad.push(`${name} | ${price} ≠ ${r[0]} | ${r[3]} ${unit}`);
      });
    }
  }
  ok(!bad.length && rows === ITEMS.length, `${rows} rows rendered with the right names and prices` + (bad.length ? '\n  ' + bad.slice(0, 8).join('\n  ') : ''));
  ok(!page.errors.length, 'no script errors or data warnings' + (page.errors.length ? ': ' + page.errors.join(' | ') : ''));
  ok(await page.locator('[data-pbc-form]').isHidden(), 'request form hidden before the offer is asked for');
  await page.click('[data-cta]', { force: true }); // aria-disabled: still clickable, explains why
  ok(await page.locator('[data-pbc-form]').isHidden() && /is-alert/.test(await page.getAttribute('[data-cta-note]', 'class')),
    'offer button only nudges until a work is picked');
  await page.close();
}

// 2. Random picks: totals equal an independent sum (seeded, repeatable)
{
  const page = await open(1440);
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const once = ITEMS.filter((it) => !UNITS[it.unit].visits && !UNITS[it.unit].monthly);
  const chosen = [];
  while (chosen.length < 14) {
    const it = once[Math.floor(rnd() * once.length)];
    if (!chosen.some((c) => c.it.name === it.name && c.it.group === it.group)) chosen.push({ it, q: Math.round(rnd() * 2000) / 10 + 1 });
  }
  let lo = 0, mid = 0, hi = 0;
  for (const c of chosen) {
    const row = await find(page, c.it.name);
    // the same name can appear in two groups: take the row of this group
    const rows = page.locator('.pbc_item').filter({ has: page.locator('.pbc_item-meta', { hasText: c.it.area + ' › ' + c.it.group }) })
      .filter({ has: page.locator('.pbc_item-name', { hasText: c.it.name }) });
    const r = (await rows.count()) ? rows.first() : row;
    await r.locator('.pbc_check').check();
    await r.locator('.pbc_qty-input[data-k="q"]').fill(String(c.q).replace('.', ','));
    lo += c.q * c.it.from; mid += c.q * c.it.price; hi += c.q * c.it.to;
  }
  await page.keyboard.press('Tab');
  const f = await fields(page);
  ok(+f.aprekins_darbi === chosen.length, `${chosen.length} works picked across areas (${[...new Set(chosen.map((c) => c.it.area))].join(', ')})`);
  ok(+f.aprekins_summa === Math.round(mid) && +f.aprekins_no === Math.round(lo) && +f.aprekins_lidz === Math.round(hi),
    `totals ${f.aprekins_no} / ${f.aprekins_summa} / ${f.aprekins_lidz} = ${Math.round(lo)} / ${Math.round(mid)} / ${Math.round(hi)}`);
  const shown = num((await page.textContent('.pbc_total')).replace('≈', ''));
  ok(shown === Math.round(mid), `visible total ${shown} €`);
  ok(chosen.every((c) => f.aprekins.includes(c.it.name)), 'summary lists every picked work');
  // remove one line from the result list
  await page.click('.pbc_remove >> nth=0');
  ok(+(await fields(page)).aprekins_darbi === chosen.length - 1, '× in the result removes the work');
  await page.close();
}

// 3. Units with visits and monthly fees, zero quantity, decimal comma
{
  const page = await open(1440);
  await pick(page, 'Zāles pļaušana ar zāles savākšanu', 1000, 10);
  let f = await fields(page);
  ok(+f.aprekins_summa === 1200 && +f.aprekins_no === 800 && +f.aprekins_lidz === 1500, `mowing 1000 m² × 10 times = ${f.aprekins_summa} € (${f.aprekins_no}–${f.aprekins_lidz})`);
  await pick(page, 'Daudzdzīvokļu mājas pārvaldīšana un apsaimniekošana', 2000);
  f = await fields(page);
  ok(+f.aprekins_menesi === 700 && +f.aprekins_summa === 1200, `management fee 2000 m² = ${f.aprekins_menesi} € a month, kept apart from one-off works`);
  ok(/ikmēneša maksa/.test(await page.textContent('[data-result]')), 'monthly fee shown separately in the result');
  await pick(page, 'Lamināta ieklāšana', '12.5');
  f = await fields(page);
  ok(+f.aprekins_summa === 1325, `12,5 m² laminate adds 125 € (total ${f.aprekins_summa})`);
  await pick(page, 'Lamināta ieklāšana', 0);
  f = await fields(page);
  ok(+f.aprekins_summa === 1200 && /apjoms nav norādīts/.test(f.aprekins), 'quantity 0 leaves the work out of the total');
  await page.close();
}

// 4. Search without diacritics, service buttons, URL preset, mode toggle, request form
{
  const page = await open(1440);
  await page.fill('[data-search]', 'flizes');
  await page.fill('[data-search]', 'flīzē');
  const names = await page.$$eval('.pbc_item-name', (n) => n.map((x) => x.textContent));
  await page.fill('[data-search]', 'grida flizesana');
  const two = await page.$$eval('.pbc_item-name', (n) => n.map((x) => x.textContent));
  ok(names.includes('Sienu flīzešana') && names.includes('Grīdas flīzešana') && two.includes('Grīdas flīzešana') && !two.includes('Sienu flīzešana'),
    `search finds ${names.length} tiling works; two words narrow it to ${two.length}`);
  await page.fill('[data-search]', 'xyzq');
  ok(/Nekas netika atrasts/.test(await page.textContent('[data-found]')), 'empty search says so');
  await page.click('[data-clear]');
  const svc = page.locator('[data-service="Jumta darbi"]');
  ok(/Aprēķināt/.test(await svc.textContent()), 'service buttons read "Aprēķināt un pieteikties"');
  const openService = (name) => page.locator('.services-list_item').filter({ has: page.locator('.services-list_name', { hasText: name }) }).locator('[data-accordion-trigger]').click();
  await openService('Jumta darbi');
  await svc.click();
  ok((await pressed(page, '[data-area]'))[0] === 'Būvniecība' && (await pressed(page, '[data-group]'))[0] === 'Jumts', 'Jumta darbi button opens Būvniecība › Jumts');
  await page.click('[data-calc-toggle="form"]');
  const modes = [await page.locator('.pbc').isHidden(), await page.locator('#wf-form-Pakalpojuma-pieteikums').isVisible(), await page.locator('[data-pbc-form]').isHidden()];
  ok(modes.every(Boolean), 'Tikai pieteikums shows only the plain request form ' + JSON.stringify(modes));
  await openService('Kokapstrāde');
  await page.locator('[data-service="Kokapstrāde"]').click();
  ok(await page.locator('.pbc').isVisible() && (await pressed(page, '[data-area]'))[0] === 'Kokapstrāde', 'a service button switches back to the calculator');
  await pick(page, 'Lakošana', 8);
  await page.click('[data-cta]');
  await page.waitForTimeout(700);
  ok(await page.locator('[data-pbc-form]').isVisible(), 'offer button opens the request form');
  ok(await page.evaluate(() => document.activeElement && document.activeElement.name) === 'vards', 'focus moves to the first form field');
  const f = await fields(page);
  ok(+f.aprekins_summa === 160 && f.aprekins_joma === 'Kokapstrāde' && /Lakošana: 8 m² × 20 €\/m² = 160 €/.test(f.aprekins), 'hidden fields carry the calculation');
  const names2 = await page.$$eval('[data-pbc-form] form [name]', (els) => els.map((e) => e.name));
  ok(['vards', 'telefons', 'epasts'].every((n) => names2.includes(n)), 'form fields: ' + names2.join(', '));
  await page.close();
  const p2 = await open(1440, '?pakalpojums=' + encodeURIComponent('Koku zāģēšana un apauguma novākšana'));
  ok((await pressed(p2, '[data-group]'))[0] === 'Koku darbi', '?pakalpojums= opens the matching works');
  await p2.close();
}

// 5. Phone width: no sideways scroll, keyboard picking
{
  const page = await open(390);
  await page.click('[data-area="1"]');
  await pick(page, 'Sienu flīzešana', 24);
  await page.fill('[data-search]', '');
  const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  ok(over <= 0, `no sideways scroll at 390 px (${over})`);
  await page.focus('.pbc_item >> nth=1 >> .pbc_check');
  await page.keyboard.press('Space');
  ok(+(await fields(page)).aprekins_darbi === 2, 'Space on a focused work picks it');
  await page.close();
}

await browser.close();
console.log(fails ? `\n${fails} FAILED` : '\nall passed');
process.exit(fails ? 1 : 0);
