import { createRequire } from 'module';
const { chromium } = createRequire(import.meta.url)('playwright');
const [url, group] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage();
await p.goto(url, { waitUntil: 'networkidle' });
const tabs = await p.$$eval(`[data-filter-group="${group}"]`, (ts) => ts.map((t) => [t.dataset.filter, t.textContent.trim()]));
console.log('tabs', JSON.stringify(tabs));
for (const [f] of tabs) {
  await p.click(`[data-filter-group="${group}"][data-filter="${f}"]`);
  const vis = await p.$$eval('[data-filter-value]', (is) => is.filter((i) => i.offsetParent !== null).map((i) => i.dataset.filterValue));
  const active = await p.$eval(`[data-filter-group="${group}"].is-active`, (t) => t.dataset.filter);
  console.log(f, 'active=' + active, 'visible', JSON.stringify(vis));
}
const hrefs = await p.$$eval('[data-filter-value] a', (as) => as.map((a) => a.getAttribute('href')));
console.log('links', JSON.stringify(hrefs));
await b.close();
