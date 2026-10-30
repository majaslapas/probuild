// Builds the ProBuild Group brand kit (folder + zip).
//   node design/brand-kit/build.mjs [out-dir]      (default: design/brand-kit/out)
// Needs Playwright (Chromium), curl and zip. Fonts (Google Fonts, OFL) and the site's photos (Webflow CDN)
// are downloaded once into design/brand-kit/.cache/.
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { execFileSync } from 'child_process';
import { CSS as BANNER_CSS, BANNERS, page as bannerPage, layoutCheck } from './banners.mjs';
import { guideHtml, cardHtml, signatureHtml, readme } from './guide.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const HERE = path.dirname(new URL(import.meta.url).pathname);
const REPO = path.resolve(HERE, '../..');
const LOGO = path.join(REPO, 'design/logo');
const OUT = path.resolve(process.argv[2] || path.join(HERE, 'out'));
const NAME = 'ProBuild-Group-brand-kit';
const KIT = path.join(OUT, NAME);
const CACHE = path.join(HERE, '.cache');
const D = {
  guide: '01-guide', logo: '02-logo', colours: '03-colours', fonts: '04-fonts', pattern: '05-pattern',
  banners: '06-banners', photos: '07-photos', print: '08-print-and-email',
};
const k = (...p) => path.join(KIT, ...p);
const write = (f, s) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); };
const url = (f) => 'file://' + f.split('/').map(encodeURIComponent).join('/');

// ------------------------------------------------------------------ downloads (cached)
const FONTS = {
  'MartianMono-Variable.ttf': 'https://raw.githubusercontent.com/google/fonts/main/ofl/martianmono/MartianMono%5Bwdth%2Cwght%5D.ttf',
  'OFL-MartianMono.txt': 'https://raw.githubusercontent.com/google/fonts/main/ofl/martianmono/OFL.txt',
  'NotoSans-Variable.ttf': 'https://raw.githubusercontent.com/google/fonts/main/ofl/notosans/NotoSans%5Bwdth%2Cwght%5D.ttf',
  'OFL-NotoSans.txt': 'https://raw.githubusercontent.com/google/fonts/main/ofl/notosans/OFL.txt',
};
// The site's current photos (stock / AI placeholders until the client's own project photos arrive).
// Left out: engineers.jpg (a US flag on a helmet), excavator.jpg (a tracked excavator, not the client's backhoe loader).
const CDN = 'https://cdn.prod.website-files.com/6adf4142414584038f9dbb34/';
const PHOTOS = ['hero.jpg', 'house-timber.jpg', 'timber-frame.jpg', 'renovation.jpg', 'worker-cut.jpg', 'rebar-workers.jpg', 'site-team.jpg', 'carpenter.jpg', 'rebar-aerial.jpg'];
function download() {
  fs.mkdirSync(CACHE, { recursive: true });
  for (const [f, u] of Object.entries(FONTS)) {
    const dst = path.join(CACHE, f);
    if (!fs.existsSync(dst)) execFileSync('curl', ['-sSfL', '-o', dst, u]);
  }
  const missing = PHOTOS.filter((f) => !fs.existsSync(path.join(CACHE, f)));
  if (missing.length) {
    // find the original (not resized) file names on the published site
    const found = {};
    for (const p of ['', 'par-mums', 'noma', 'pakalpojumi', 'projekti', 'kontakti']) {
      const html = execFileSync('curl', ['-sSfL', 'https://probuild-group.webflow.io/' + p]).toString();
      for (const m of html.matchAll(/https:\/\/cdn\.prod\.website-files\.com\/6adf4142414584038f9dbb34\/([0-9a-f]+_([a-z0-9-]+)\.jpe?g)/g)) {
        if (!found[m[2] + '.jpg']) found[m[2] + '.jpg'] = m[1];
      }
    }
    for (const f of missing) {
      const name = found[f];
      if (!name) throw new Error('photo not found on the site: ' + f);
      execFileSync('curl', ['-sSfL', '-o', path.join(CACHE, f), CDN + name]);
    }
  }
}

// ------------------------------------------------------------------ colours
export const COLOURS = [
  { group: 'Brand', name: 'ProBuild Orange', key: 'orange', hex: '#F2600C', use: 'Accent: calls to action, prices, the logo bars, orange fields' },
  { group: 'Brand', name: 'Orange Light', key: 'orange-light', hex: '#F58F54', use: 'Prices and highlights on black (calculator totals), hover' },
  { group: 'Brand', name: 'Orange Dark', key: 'orange-dark', hex: '#C14C09', use: 'Pressed states, orange text on white' },
  { group: 'Brand', name: 'Orange Tint', key: 'orange-tint', hex: '#FDEFE6', use: 'Light backgrounds in print and documents' },
  { group: 'Neutral', name: 'Black', key: 'black', hex: '#000000', use: 'Main background, text on orange and white' },
  { group: 'Neutral', name: 'Dark', key: 'dark', hex: '#191919', use: 'Second background, cards, panels' },
  { group: 'Neutral', name: 'Graphite', key: 'graphite', hex: '#4C4C4C', use: 'Dividers and inactive elements on black' },
  { group: 'Neutral', name: 'Grey', key: 'grey', hex: '#7F7F7F', use: 'Fine print on black' },
  { group: 'Neutral', name: 'Light Grey', key: 'light', hex: '#B2B2B2', use: 'Secondary text on black' },
  { group: 'Neutral', name: 'Lighter Grey', key: 'lighter', hex: '#D8D8D8', use: 'Body text on black' },
  { group: 'Neutral', name: 'Off-white', key: 'off-white', hex: '#F2F2F2', use: 'Light backgrounds' },
  { group: 'Neutral', name: 'White', key: 'white', hex: '#FFFFFF', use: 'Headings and the logo on black' },
];
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const cmyk = (hex) => { // simple conversion (no ICC profile): a starting point for the printer, not a proof
  const [r, g, b] = rgb(hex).map((v) => v / 255); const kk = 1 - Math.max(r, g, b);
  if (kk >= 1) return [0, 0, 0, 100];
  return [r, g, b].map((v) => Math.round(((1 - v - kk) / (1 - kk)) * 100)).concat(Math.round(kk * 100));
};
COLOURS.forEach((c) => { c.rgb = rgb(c.hex); c.cmyk = cmyk(c.hex); });

function ase(colours) { // Adobe Swatch Exchange, RGB, global swatches
  const blocks = colours.map((c) => {
    const name = c.name + '\0';
    const nb = Buffer.alloc(2 + name.length * 2);
    nb.writeUInt16BE(name.length, 0);
    for (let i = 0; i < name.length; i++) nb.writeUInt16BE(name.charCodeAt(i), 2 + i * 2);
    const body = Buffer.alloc(4 + 12 + 2);
    body.write('RGB ', 0, 'ascii');
    c.rgb.forEach((v, i) => body.writeFloatBE(v / 255, 4 + i * 4));
    body.writeUInt16BE(0, 16);
    const data = Buffer.concat([nb, body]);
    const head = Buffer.alloc(6); head.writeUInt16BE(1, 0); head.writeUInt32BE(data.length, 2);
    return Buffer.concat([head, data]);
  });
  const h = Buffer.alloc(12); h.write('ASEF', 0, 'ascii'); h.writeUInt16BE(1, 4); h.writeUInt16BE(0, 6); h.writeUInt32BE(blocks.length, 8);
  return Buffer.concat([h, ...blocks]);
}

// ------------------------------------------------------------------ pattern (brand bars)
const T19 = Math.tan((19 * Math.PI) / 180);
function barsPair(w, h, fill) { // the site's .pattern-bars: two bars 46% wide, heights 68% / 100%, tops slanted 19°
  const bw = w * 0.46;
  const bar = (x0, top) => `<path d="M${x0.toFixed(1)} ${h}V${(top + bw * T19).toFixed(1)}L${(x0 + bw).toFixed(1)} ${top.toFixed(1)}V${h}Z"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><g fill="${fill.c}"${fill.o ? ` fill-opacity="${fill.o}"` : ''}>${bar(0, h * 0.32)}${bar(w - bw, 0)}</g></svg>`;
}
function risingBars(W, H, bg, fill, opacity) { // a frozen frame of the site's intro: thick bars, half a bar apart, tops rising to the right
  const bw = Math.round(W * 0.12), gap = Math.round(bw / 2), n = Math.ceil(W / (bw + gap)) + 1;
  const start = Math.round((W - (n * bw + (n - 1) * gap)) / 2);
  let paths = '';
  for (let i = 0; i < n; i++) {
    const x0 = start + i * (bw + gap), top = H * (0.62 - (0.5 * i) / (n - 1));
    paths += `<path d="M${x0} ${H}V${(top + bw * T19).toFixed(1)}L${x0 + bw} ${top.toFixed(1)}V${H}Z"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${bg ? `<rect width="${W}" height="${H}" fill="${bg}"/>` : ''}<g fill="${fill}" fill-opacity="${opacity}">${paths}</g></svg>`;
}

// ------------------------------------------------------------------ build
async function main() {
  download();
  fs.rmSync(KIT, { recursive: true, force: true });
  Object.values(D).forEach((d) => fs.mkdirSync(k(d), { recursive: true }));

  // logos ------------------------------------------------------------
  const svg = {};
  const src = {
    'probuild-logo-horizontal-on-dark': 'lockups/probuild-lockup-11-white.svg',
    'probuild-logo-horizontal-on-light': 'lockups/probuild-lockup-11-black.svg',
    'probuild-logo-stacked-on-dark': 'probuild-logo-stacked-f-white.svg',
    'probuild-logo-stacked-on-light': 'probuild-logo-stacked-f-black.svg',
    'probuild-mark-on-dark': 'probuild-icon-f-white.svg',
    'probuild-mark-on-light': 'probuild-icon-f-black.svg',
    'probuild-app-icon-orange': 'probuild-app-icon-f-orange.svg',
    'probuild-app-icon-black': 'probuild-app-icon-f-black.svg',
  };
  for (const [n, f] of Object.entries(src)) svg[n] = fs.readFileSync(path.join(LOGO, f), 'utf8');
  for (const base of ['horizontal', 'stacked']) {
    svg[`probuild-logo-${base}-mono-black`] = svg[`probuild-logo-${base}-on-light`].replace(/#F2600C/gi, '#000000');
    svg[`probuild-logo-${base}-mono-white`] = svg[`probuild-logo-${base}-on-dark`].replace(/#F2600C/gi, '#FFFFFF');
  }
  svg['probuild-mark-mono-black'] = svg['probuild-mark-on-light'].replace(/#F2600C/gi, '#000000');
  svg['probuild-mark-mono-white'] = svg['probuild-mark-on-dark'].replace(/#F2600C/gi, '#FFFFFF');
  for (const [n, s] of Object.entries(svg)) write(k(D.logo, 'svg', n + '.svg'), s);

  // colours ------------------------------------------------------------
  write(k(D.colours, 'probuild-colours.css'), ':root{\n' + COLOURS.map((c) => `  --pb-${c.key}: ${c.hex}; /* ${c.name} */`).join('\n') + '\n}\n');
  write(k(D.colours, 'probuild-colours.json'), JSON.stringify(COLOURS.map(({ group, name, key, hex, rgb, cmyk, use }) => ({ group, name, key, hex, rgb, cmyk_approx: cmyk, use })), null, 2) + '\n');
  write(k(D.colours, 'probuild-colours.ase'), ase(COLOURS));
  write(k(D.colours, 'probuild-colours.txt'), 'ProBuild Group colours\nCMYK values are a plain conversion without an ICC profile: ask the printer to match the HEX value / a printed proof.\n\n' +
    COLOURS.map((c) => `${c.name.padEnd(15)} ${c.hex}   RGB ${c.rgb.join(' ').padEnd(11)}   CMYK ≈ ${c.cmyk.join(' ')}   ${c.use}`).join('\n') + '\n');

  // fonts ------------------------------------------------------------
  for (const f of Object.keys(FONTS)) fs.copyFileSync(path.join(CACHE, f), k(D.fonts, f));

  // pattern ------------------------------------------------------------
  const fills = { white: { c: '#FFFFFF', o: 0.28 }, 'white-subtle': { c: '#FFFFFF', o: 0.12 }, orange: { c: '#F2600C' }, black: { c: '#000000' } };
  for (const [n, f] of Object.entries(fills)) write(k(D.pattern, `probuild-bars-${n}.svg`), barsPair(600, 860, f));
  write(k(D.pattern, 'probuild-list-marker.svg'), fs.readFileSync(path.join(REPO, 'design/webflow/pattern/brand-bars-marker.svg'), 'utf8').replace('<svg ', '<svg fill="#F2600C" '));
  const rising = {
    'probuild-rising-bars-on-black': risingBars(1920, 1080, '#191919', '#FFFFFF', 0.15),
    'probuild-rising-bars-on-orange': risingBars(1920, 1080, '#F2600C', '#FFFFFF', 0.28),
    'probuild-rising-bars-transparent': risingBars(1920, 1080, '', '#FFFFFF', 0.15),
  };
  for (const [n, s] of Object.entries(rising)) write(k(D.pattern, n + '.svg'), s);

  // photos ------------------------------------------------------------
  for (const f of PHOTOS) fs.copyFileSync(path.join(CACHE, f), k(D.photos, f));

  // banners (sources) ------------------------------------------------------------
  write(k(D.banners, 'html', 'banners.css'), BANNER_CSS);
  for (const b of BANNERS) write(k(D.banners, 'html', path.basename(b.file) + '.html'), bannerPage(b));
  write(k(D.banners, 'html', 'banners.json'), JSON.stringify(Object.fromEntries(BANNERS.map((b) => [path.basename(b.file) + '.html', path.dirname(b.file)])), null, 2) + '\n');
  write(k(D.banners, 'html', 'render.mjs'), RENDER_SCRIPT);

  // render ------------------------------------------------------------
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ deviceScaleFactor: 1 });
  const pg = await ctx.newPage();

  // Pages are written to disk and opened from there: a page set with setContent (about:blank) can't load file:// fonts or images.
  const TMP = path.join(OUT, '.render.html');
  async function show(html) {
    fs.writeFileSync(TMP, html);
    await pg.goto(url(TMP), { waitUntil: 'load' });
    await pg.evaluate(() => document.fonts.ready);
  }
  async function svgPng(svgFile, outFile, width, bg) {
    await pg.setViewportSize({ width: Math.max(width + 40, 200), height: 1400 });
    await show(`<html><body style="margin:0;background:${bg || 'transparent'}"><img id="i" src="${url(svgFile)}" style="display:block;width:${width}px;height:auto"></body></html>`);
    if (!(await pg.$eval('#i', (i) => i.complete && i.naturalWidth > 0))) throw new Error('image did not load: ' + svgFile);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    await (await pg.$('#i')).screenshot({ path: outFile, omitBackground: !bg });
  }
  const logoSizes = { horizontal: [1800, 900, 450], stacked: [1200, 600], mark: [1024, 512], 'app-icon': [1024, 512] };
  for (const n of Object.keys(svg)) {
    const kind = Object.keys(logoSizes).find((s) => n.includes(s));
    for (const w of logoSizes[kind]) await svgPng(k(D.logo, 'svg', n + '.svg'), k(D.logo, 'png', `${n}-${w}px.png`), w);
  }
  for (const [n, w] of [['favicon-32', 32], ['favicon-48', 48], ['apple-touch-icon-180', 180], ['android-192', 192], ['android-512', 512]]) {
    await svgPng(k(D.logo, 'svg', 'probuild-app-icon-orange.svg'), k(D.logo, 'favicon', `probuild-${n}.png`), w);
  }
  for (const n of Object.keys(rising)) await svgPng(k(D.pattern, n + '.svg'), k(D.pattern, n + '.png'), 1920);
  for (const n of Object.keys(fills)) await svgPng(k(D.pattern, `probuild-bars-${n}.svg`), k(D.pattern, `probuild-bars-${n}.png`), 600);

  // palette sheet
  await pg.setViewportSize({ width: 1600, height: 900 });
  await show(paletteHtml());
  await (await pg.$('#sheet')).screenshot({ path: k(D.colours, 'probuild-palette.png') });

  // banners
  const rendered = [], layoutProblems = [];
  for (const b of BANNERS) {
    await pg.setViewportSize({ width: b.w, height: b.h });
    await pg.goto(url(k(D.banners, 'html', path.basename(b.file) + '.html')), { waitUntil: 'load' });
    await pg.evaluate(() => document.fonts.ready);
    await pg.waitForTimeout(50);
    const el = await pg.$('#banner');
    const box = await el.boundingBox();
    if (Math.round(box.width) !== b.w || Math.round(box.height) !== b.h) throw new Error('bad size ' + b.file);
    for (const p of await pg.evaluate(layoutCheck, { margin: b.margin, safe: b.safe })) layoutProblems.push(`${b.file}: ${p}`);
    const png = k(D.banners, b.file + '.png');
    fs.mkdirSync(path.dirname(png), { recursive: true });
    await el.screenshot({ path: png });
    const out = { ...b, png, kb: Math.round(fs.statSync(png).size / 1024) };
    if (b.display && out.kb > 140) { // Google Ads image limit is 150 KB
      const jpg = png.replace(/\.png$/, '.jpg');
      await el.screenshot({ path: jpg, type: 'jpeg', quality: 86 });
      out.jpg = jpg;
    }
    rendered.push(out);
  }
  write(k(D.banners, 'html', 'index.html'), overviewHtml(rendered));
  await pg.setViewportSize({ width: 1400, height: 900 });
  await pg.goto(url(k(D.banners, 'html', 'index.html')), { waitUntil: 'load' });
  await pg.screenshot({ path: k(D.banners, 'all-banners-overview.png'), fullPage: true });
  if (layoutProblems.length) {
    console.error('Banner layout problems:\n  ' + layoutProblems.join('\n  '));
    await browser.close();
    process.exit(1);
  }
  if (process.env.BANNERS_ONLY) { await browser.close(); console.log('banners ok'); return; }

  // print + email ------------------------------------------------------------
  const ctxFonts = { fonts: k(D.fonts), logo: k(D.logo), pattern: k(D.pattern), url };
  await show(cardHtml(ctxFonts));
  if (await pg.$$eval('img', (a) => a.some((i) => !i.naturalWidth))) throw new Error('business card image did not load');
  await pg.pdf({ path: k(D.print, 'business-card-90x50mm-3mm-bleed.pdf'), width: '96mm', height: '56mm', printBackground: true, pageRanges: '1-2' });
  await pg.setViewportSize({ width: 1300, height: 900 });
  await (await pg.$('#preview')).screenshot({ path: k(D.print, 'business-card-preview.png') });
  write(k(D.print, 'email-signature.html'), signatureHtml());

  // guide ------------------------------------------------------------
  await pg.setViewportSize({ width: 1123, height: 794 });
  write(path.join(OUT, '.guide.html'), guideHtml({ ...ctxFonts, kit: KIT, D, COLOURS, banners: rendered }));
  await pg.goto(url(path.join(OUT, '.guide.html')), { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  await pg.pdf({ path: k(D.guide, 'ProBuild-Group-brand-guide.pdf'), width: '297mm', height: '210mm', printBackground: true });
  if (await pg.$$eval('img', (a) => a.some((i) => !i.naturalWidth))) throw new Error('guide image did not load');
  await browser.close();
  fs.rmSync(TMP, { force: true });

  write(k('README.md'), readme({ D, banners: rendered }));
  fs.rmSync(path.join(OUT, NAME + '.zip'), { force: true });
  execFileSync('zip', ['-rqX', NAME + '.zip', NAME], { cwd: OUT });
  console.log('kit:', KIT);
  console.log('zip:', path.join(OUT, NAME + '.zip'), Math.round(fs.statSync(path.join(OUT, NAME + '.zip')).size / 1024) + ' KB');
  for (const r of rendered) console.log(`${r.file}.png ${r.w}x${r.h} ${r.kb} KB${r.jpg ? ' (+ jpg)' : ''}`);
}

function paletteHtml() {
  const f = (n) => url(k(D.fonts, n));
  return `<html><head><style>@font-face{font-family:MM;src:url("${f('MartianMono-Variable.ttf')}");font-weight:100 800}@font-face{font-family:NS;src:url("${f('NotoSans-Variable.ttf')}");font-weight:100 900}
body{margin:0;background:#fff}#sheet{width:1600px;padding:48px;display:grid;grid-template-columns:repeat(6,1fr);gap:16px;font-family:NS;background:#fff}
.s{border:1px solid #e5e5e5;border-radius:14px;overflow:hidden}.c{height:150px}.t{padding:12px 14px;font-size:14px;line-height:1.45;color:#191919}.t b{font-family:MM;font-weight:500;font-size:15px;display:block;margin-bottom:2px}.t span{color:#4c4c4c}</style></head>
<body><div id="sheet">${COLOURS.map((c) => `<div class="s"><div class="c" style="background:${c.hex}"></div><div class="t"><b>${c.name}</b>${c.hex}<br><span>RGB ${c.rgb.join(' ')}<br>CMYK ≈ ${c.cmyk.join(' ')}</span></div></div>`).join('')}</div></body></html>`;
}

function overviewHtml(list) {
  return `<!doctype html><html lang="lv"><head><meta charset="utf-8"><title>ProBuild Group banners</title>
<style>body{margin:0;padding:32px;background:#2b2b2b;color:#fff;font:14px/1.4 system-ui,sans-serif}h1{font-size:20px;margin:0 0 4px}p{color:#b2b2b2;margin:0 0 24px}
.grid{display:flex;flex-wrap:wrap;gap:24px;align-items:flex-start}figure{margin:0}figure img{display:block;max-width:100%;height:auto;box-shadow:0 0 0 1px rgba(255,255,255,.15)}figcaption{margin-top:6px;color:#b2b2b2;font-size:12px}a{color:#f58f54}</style></head>
<body><h1>ProBuild Group · banners</h1><p>Open a banner's HTML file to edit its text, then export it again (see README). Shown at half size.</p><div class="grid">
${list.map((b) => `<figure><a href="${path.basename(b.file)}.html"><img src="../${b.file}.png" width="${Math.round(b.w / (b.w > 700 ? 2 : 1))}"></a><figcaption>${path.basename(b.file)} · ${b.w}×${b.h}</figcaption></figure>`).join('\n')}
</div></body></html>`;
}

const RENDER_SCRIPT = `// Re-export the banners after editing their HTML:  node render.mjs [file.html ...]
// Needs Node 18+ and Playwright:  npm i playwright && npx playwright install chromium
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
const here = path.dirname(new URL(import.meta.url).pathname);
const where = JSON.parse(fs.readFileSync(path.join(here, 'banners.json'), 'utf8')); // file -> social | display
const files = process.argv.slice(2).length ? process.argv.slice(2).map((f) => path.basename(f)) : Object.keys(where);
const browser = await chromium.launch();
const page = await browser.newPage();
for (const f of files) {
  const m = f.match(/(\\d+)x(\\d+)\\.html$/);
  await page.setViewportSize({ width: +m[1], height: +m[2] });
  await page.goto('file://' + path.join(here, f));
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(here, '..', where[f] || 'social', f.replace(/\\.html$/, '.png'));
  await (await page.$('#banner')).screenshot({ path: out });
  console.log(out);
}
await browser.close();
`;

main().catch((e) => { console.error(e); process.exit(1); });
