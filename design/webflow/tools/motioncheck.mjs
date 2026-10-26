// With motion on: scroll each page like a visitor, then report anything still hidden or mid-reveal, and JS errors.
import { createRequire } from 'module';
const { chromium } = createRequire(import.meta.url)('playwright');
const base = 'https://probuild-group.webflow.io';
const paths = ['/', '/pakalpojumi', '/noma', '/projekti', '/par-mums', '/kontakti', '/nomas-produkts/ekskavators-iekravejs', '/projekts/koka-karkasa-privatmaja', '/pakalpojums/pamatu-buvnieciba'];
const b = await chromium.launch();
for (const w of [1440, 390]) for (const path of paths) {
  const p = await b.newPage({ viewport: { width: w, height: w > 500 ? 900 : 844 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(base + path, { waitUntil: 'load' }); await p.waitForTimeout(800);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 400) { await p.mouse.wheel(0, 400); await p.waitForTimeout(120); }
  await p.waitForTimeout(1800);
  const r = await p.evaluate(() => {
    const hidden = [...document.querySelectorAll('[data-pb-reveal]')].filter((e) => e.offsetParent && parseFloat(getComputedStyle(e).opacity) < 0.99)
      .map((e) => e.className.split(' ')[0]);
    const bars = [...document.querySelectorAll('.brand-bars')].map((e) => e.className.replace('brand-bars ', '') + ':' + e.children.length + (e.offsetParent ? '' : '(hidden)'));
    const counts = [...document.querySelectorAll('.pb-count')].map((e) => e.textContent);
    return { motion: document.documentElement.classList.contains('pb-motion'), hidden, bars, counts };
  });
  console.log(`${w} ${path.padEnd(40)} motion=${r.motion} hidden=${JSON.stringify(r.hidden)} bars=${r.bars.join(' ')} counts=${r.counts.join(',')} errors=${JSON.stringify(errs)}`);
  await p.close();
}
await b.close();
