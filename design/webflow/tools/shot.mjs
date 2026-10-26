// node shot.mjs <url-or-file> <out.png> [width] [--full]
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const { chromium } = createRequire(import.meta.url)('playwright');
const [target, out, w = '1440', ...flags] = process.argv.slice(2);
const blobmap = JSON.parse(fs.readFileSync(new URL('../blobmap.json', import.meta.url)));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: 900 }, reducedMotion: 'reduce' });
await page.route('**/_blob/*', (r) => {
  const id = r.request().url().split('/_blob/')[1].slice(0, 32);
  const f = blobmap[id];
  if (f && fs.existsSync(f)) return r.fulfill({ path: f });
  return r.abort();
});
const url = /^https?:/.test(target) ? target : 'file://' + path.resolve(target);
await page.goto(url, { waitUntil: 'networkidle' });
await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
await page.evaluate(async () => {
  for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
  window.scrollTo(0, 0);
  document.querySelectorAll('img[loading=lazy]').forEach((i) => { i.loading = 'eager'; });
});
await page.waitForTimeout(1500);
await page.waitForTimeout(800);
await page.screenshot({ path: out, fullPage: !flags.includes('--viewport') });
const h = await page.evaluate(() => document.documentElement.scrollHeight);
console.log(out, 'height', h);
await browser.close();
