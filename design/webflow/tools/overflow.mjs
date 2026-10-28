import { createRequire } from 'module';
const { chromium } = createRequire(import.meta.url)('playwright');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
for (const u of ['', 'pakalpojumi', 'cenas', 'noma', 'projekti', 'par-mums', 'kontakti', 'nomas-produkts/ekskavators-iekravejs', 'projekts/koka-karkasa-privatmaja', 'pakalpojums/pamatu-buvnieciba']) {
  await p.goto('https://probuild-group.webflow.io/' + u, { waitUntil: 'load' }); await p.waitForTimeout(600);
  const r = await p.evaluate(() => {
    const W = document.documentElement.clientWidth;
    const wide = [...document.querySelectorAll('body *')].filter(e => { const b = e.getBoundingClientRect(); return b.right > W + 1 && getComputedStyle(e).position !== 'fixed' && e.offsetParent; })
      .slice(0, 4).map(e => e.className.toString().slice(0, 40) + ':' + Math.round(e.getBoundingClientRect().right));
    return { sw: document.documentElement.scrollWidth, W, wide };
  });
  console.log((u || 'home').padEnd(40), r.sw > r.W ? 'OVERFLOW ' + r.sw : 'ok', JSON.stringify(r.wide));
}
await b.close();
