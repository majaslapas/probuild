import { createRequire } from 'module';
import fs from 'fs';
const { chromium } = createRequire(import.meta.url)('playwright');
const svg = fs.readFileSync(process.argv[2], 'utf8');
const b = await chromium.launch();
for (const s of [32, 180, 512]) {
  const p = await b.newPage({ viewport: { width: s, height: s } });
  await p.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('<svg', `<svg width="${s}" height="${s}"`)}</body></html>`);
  await p.screenshot({ path: `icon-${s}.png`, omitBackground: true, clip: { x: 0, y: 0, width: s, height: s } });
}
await b.close();
