import { createRequire } from 'module';
const { chromium } = createRequire(import.meta.url)('playwright');
const b = await chromium.launch(); const p = await b.newPage();
const errs=[]; p.on('pageerror', e => errs.push(e.message));
await p.goto(process.argv[2], { waitUntil: 'load' }); await p.waitForTimeout(1500);
const st = async () => p.evaluate(() => ({
  total: document.querySelector('[data-calc-total]')?.textContent,
  area: document.querySelector('[data-calc-area]')?.textContent,
  note: document.querySelector('[data-calc-note]')?.textContent,
  active: [...document.querySelectorAll('[data-calc-option].is-active')].map(e=>e.textContent),
  forms: [...document.querySelectorAll('.calc_panel > .w-form')].map(f=>getComputedStyle(f).display),
  open: [...document.querySelectorAll('.services-list_item.is-open .services-list_name')].map(e=>e.textContent),
  items: document.querySelectorAll('.services-list_item').length,
  hidden: [...document.querySelectorAll('[data-calc-field]')].map(e=>e.name+'='+e.value),
  sel: document.querySelector('.calc_panel select')?.value,
  apply: [...document.querySelectorAll('[data-service]')].slice(0,14).map(b=>b.getAttribute('data-calc-apply')+':'+b.textContent).join(' | '),
  groups: [...document.querySelectorAll('[data-filter-value]')].map(e=>e.dataset.filterValue).join(','),
  counts: [...document.querySelectorAll('[data-filter-count]')].map(e=>e.textContent).join(','),
}));
console.log('init', JSON.stringify(await st()));
await p.click('[data-calc-option="2"]'); await p.click('[data-calc-step="10"]'); await p.click('[data-calc-step="10"]');
console.log('fasade+20', JSON.stringify(await st()));
await p.click('[data-calc-toggle="form"]'); console.log('form', JSON.stringify((await st()).forms));
const items = await p.$$('[data-accordion-trigger]'); await items[3].click(); console.log('open4', JSON.stringify((await st()).open));
const svc = await p.$$('[data-service]');
await items[6].click(); await svc[6].click(); const s6=await st(); console.log('apply6', s6.forms, s6.sel);
await items[1].click(); await svc[1].click(); const s1=await st(); console.log('apply1', s1.forms, s1.active, s1.total);
await p.click('[data-filter="Remonts un apdare"]'); console.log('visible', await p.evaluate(()=>[...document.querySelectorAll('.services-list_cms-item')].filter(e=>e.offsetParent).length));
console.log('errors', errs);
await b.close();
