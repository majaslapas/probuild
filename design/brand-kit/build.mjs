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
const NAME = 'ProBuild-Group-zimola-komplekts';
const KIT = path.join(OUT, NAME);
const CACHE = path.join(HERE, '.cache');
// Kit folders and file names are Latvian, without diacritics (they survive any zip tool and OS).
const D = {
  guide: '01-vadlinijas', logo: '02-logo', colours: '03-krasas', fonts: '04-fonti', pattern: '05-zimola-joslas',
  banners: '06-baneri', photos: '07-foto', print: '08-druka-un-e-pasts',
};
export const GUIDE_PDF = 'ProBuild-Group-zimola-vadlinijas.pdf';
const k = (...p) => path.join(KIT, ...p);
const write = (f, s) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); };
const url = (f) => 'file://' + f.split('/').map(encodeURIComponent).join('/');

// ------------------------------------------------------------------ downloads (cached)
const FONTS = {
  'MartianMono-Variable.ttf': 'https://raw.githubusercontent.com/google/fonts/main/ofl/martianmono/MartianMono%5Bwdth%2Cwght%5D.ttf',
  'licence-MartianMono-OFL.txt': 'https://raw.githubusercontent.com/google/fonts/main/ofl/martianmono/OFL.txt',
  'NotoSans-Variable.ttf': 'https://raw.githubusercontent.com/google/fonts/main/ofl/notosans/NotoSans%5Bwdth%2Cwght%5D.ttf',
  'licence-NotoSans-OFL.txt': 'https://raw.githubusercontent.com/google/fonts/main/ofl/notosans/OFL.txt',
};
// The site's current photos (stock / AI placeholders until the client's own project photos arrive).
// Left out: engineers.jpg (a US flag on a helmet), excavator.jpg (a tracked excavator, not the client's backhoe loader).
const CDN = 'https://cdn.prod.website-files.com/6adf4142414584038f9dbb34/';
// site file name (cache) -> name in the kit
const PHOTO_NAMES = {
  'hero.jpg': 'fasades-montaza.jpg', 'house-timber.jpg': 'maja-ar-koka-fasadi.jpg', 'timber-frame.jpg': 'koka-karkass.jpg',
  'renovation.jpg': 'renovacija.jpg', 'worker-cut.jpg': 'griesana.jpg', 'rebar-workers.jpg': 'armaturas-siesana.jpg',
  'site-team.jpg': 'komanda-objekta.jpg', 'carpenter.jpg': 'galdnieks.jpg', 'rebar-aerial.jpg': 'armatura-no-augsas.jpg',
};
const PHOTOS = Object.keys(PHOTO_NAMES);
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
  { group: 'Zīmola', name: 'ProBuild oranžā', key: 'orange', hex: '#F2600C', use: 'Akcents: pogas, cenas, logo joslas, oranži laukumi' },
  { group: 'Zīmola', name: 'Gaiši oranžā', key: 'orange-light', hex: '#F58F54', use: 'Izcēlumi uz melna, hover' },
  { group: 'Zīmola', name: 'Tumši oranžā', key: 'orange-dark', hex: '#C14C09', use: 'Nospiestas pogas, oranžs teksts uz balta' },
  { group: 'Zīmola', name: 'Oranžais tonis', key: 'orange-tint', hex: '#FDEFE6', use: 'Gaiši foni drukā un dokumentos' },
  { group: 'Neitrālās', name: 'Melnā', key: 'black', hex: '#000000', use: 'Galvenais fons, teksts uz oranža un balta' },
  { group: 'Neitrālās', name: 'Tumšā', key: 'dark', hex: '#191919', use: 'Otrais fons, kartītes, paneļi' },
  { group: 'Neitrālās', name: 'Grafīta', key: 'graphite', hex: '#4C4C4C', use: 'Atdalītāji un neaktīvi elementi uz melna' },
  { group: 'Neitrālās', name: 'Pelēkā', key: 'grey', hex: '#7F7F7F', use: 'Sīkais teksts uz melna' },
  { group: 'Neitrālās', name: 'Gaiši pelēkā', key: 'light', hex: '#B2B2B2', use: 'Papildu teksts uz melna' },
  { group: 'Neitrālās', name: 'Ļoti gaiši pelēkā', key: 'lighter', hex: '#D8D8D8', use: 'Pamatteksts uz melna' },
  { group: 'Neitrālās', name: 'Gandrīz baltā', key: 'off-white', hex: '#F2F2F2', use: 'Gaiši foni' },
  { group: 'Neitrālās', name: 'Baltā', key: 'white', hex: '#FFFFFF', use: 'Virsraksti un logo uz melna' },
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
  // horizontals = horizontal lockup, vertikals = stacked, zime = the mark, ikona = app icon; uz tumsa / uz gaisa = on dark / on light
  const src = {
    'probuild-logo-horizontals-uz-tumsa': 'lockups/probuild-lockup-11-white.svg',
    'probuild-logo-horizontals-uz-gaisa': 'lockups/probuild-lockup-11-black.svg',
    'probuild-logo-vertikals-uz-tumsa': 'probuild-logo-stacked-f-white.svg',
    'probuild-logo-vertikals-uz-gaisa': 'probuild-logo-stacked-f-black.svg',
    'probuild-zime-uz-tumsa': 'probuild-icon-f-white.svg',
    'probuild-zime-uz-gaisa': 'probuild-icon-f-black.svg',
    'probuild-ikona-oranza': 'probuild-app-icon-f-orange.svg',
    'probuild-ikona-melna': 'probuild-app-icon-f-black.svg',
  };
  for (const [n, f] of Object.entries(src)) svg[n] = fs.readFileSync(path.join(LOGO, f), 'utf8');
  for (const base of ['horizontals', 'vertikals']) { // one-colour versions
    svg[`probuild-logo-${base}-melns`] = svg[`probuild-logo-${base}-uz-gaisa`].replace(/#F2600C/gi, '#000000');
    svg[`probuild-logo-${base}-balts`] = svg[`probuild-logo-${base}-uz-tumsa`].replace(/#F2600C/gi, '#FFFFFF');
  }
  svg['probuild-zime-melna'] = svg['probuild-zime-uz-gaisa'].replace(/#F2600C/gi, '#000000');
  svg['probuild-zime-balta'] = svg['probuild-zime-uz-tumsa'].replace(/#F2600C/gi, '#FFFFFF');
  for (const [n, s] of Object.entries(svg)) write(k(D.logo, 'svg', n + '.svg'), s);

  // colours ------------------------------------------------------------
  write(k(D.colours, 'probuild-krasas.css'), '/* ProBuild Group krāsas */\n:root{\n' + COLOURS.map((c) => `  --pb-${c.key}: ${c.hex}; /* ${c.name} */`).join('\n') + '\n}\n');
  write(k(D.colours, 'probuild-krasas.json'), JSON.stringify(COLOURS.map(({ group, name, key, hex, rgb, cmyk, use }) => ({ group, name, key, hex, rgb, cmyk_approx: cmyk, use })), null, 2) + '\n');
  write(k(D.colours, 'probuild-krasas.ase'), ase(COLOURS));
  write(k(D.colours, 'probuild-krasas.txt'), 'ProBuild Group krāsas\nCMYK vērtības ir vienkāršs pārrēķins bez ICC profila: drukā lūdziet tipogrāfijai pielāgot HEX krāsu pēc provizoriskās izdrukas.\n\n' +
    COLOURS.map((c) => `${c.name.padEnd(18)} ${c.hex}   RGB ${c.rgb.join(' ').padEnd(11)}   CMYK ≈ ${c.cmyk.join(' ')}   ${c.use}`).join('\n') + '\n');

  // fonts ------------------------------------------------------------
  for (const f of Object.keys(FONTS)) fs.copyFileSync(path.join(CACHE, f), k(D.fonts, f));

  // pattern ------------------------------------------------------------
  const fills = { baltas: { c: '#FFFFFF', o: 0.28 }, 'baltas-maigas': { c: '#FFFFFF', o: 0.12 }, oranzas: { c: '#F2600C' }, melnas: { c: '#000000' } };
  for (const [n, f] of Object.entries(fills)) write(k(D.pattern, `probuild-joslas-${n}.svg`), barsPair(600, 860, f));
  write(k(D.pattern, 'probuild-saraksta-zime.svg'), fs.readFileSync(path.join(REPO, 'design/webflow/pattern/brand-bars-marker.svg'), 'utf8').replace('<svg ', '<svg fill="#F2600C" '));
  const rising = {
    'probuild-joslu-fons-uz-melna': risingBars(1920, 1080, '#191919', '#FFFFFF', 0.15),
    'probuild-joslu-fons-uz-oranza': risingBars(1920, 1080, '#F2600C', '#FFFFFF', 0.28),
    'probuild-joslu-fons-caurspidigs': risingBars(1920, 1080, '', '#FFFFFF', 0.15),
  };
  for (const [n, s] of Object.entries(rising)) write(k(D.pattern, n + '.svg'), s);

  // photos ------------------------------------------------------------
  for (const f of PHOTOS) fs.copyFileSync(path.join(CACHE, f), k(D.photos, PHOTO_NAMES[f]));

  // banners (sources) ------------------------------------------------------------
  write(k(D.banners, 'html', 'baneri.css'), BANNER_CSS);
  for (const b of BANNERS) write(k(D.banners, 'html', path.basename(b.file) + '.html'), bannerPage(b));
  write(k(D.banners, 'html', 'baneri.json'), JSON.stringify(Object.fromEntries(BANNERS.map((b) => [path.basename(b.file) + '.html', path.dirname(b.file)])), null, 2) + '\n');
  write(k(D.banners, 'html', 'eksportet.mjs'), RENDER_SCRIPT);

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
  const logoSizes = { horizontals: [1800, 900, 450], vertikals: [1200, 600], zime: [1024, 512], ikona: [1024, 512] };
  for (const n of Object.keys(svg)) {
    const kind = Object.keys(logoSizes).find((s) => n.includes(s));
    for (const w of logoSizes[kind]) await svgPng(k(D.logo, 'svg', n + '.svg'), k(D.logo, 'png', `${n}-${w}px.png`), w);
  }
  for (const [n, w] of [['favikons-32', 32], ['favikons-48', 48], ['apple-ikona-180', 180], ['android-ikona-192', 192], ['android-ikona-512', 512]]) {
    await svgPng(k(D.logo, 'svg', 'probuild-ikona-oranza.svg'), k(D.logo, 'favikoni', `probuild-${n}.png`), w);
  }
  for (const n of Object.keys(rising)) await svgPng(k(D.pattern, n + '.svg'), k(D.pattern, n + '.png'), 1920);
  for (const n of Object.keys(fills)) await svgPng(k(D.pattern, `probuild-joslas-${n}.svg`), k(D.pattern, `probuild-joslas-${n}.png`), 600);

  // palette sheet
  await pg.setViewportSize({ width: 1600, height: 900 });
  await show(paletteHtml());
  await (await pg.$('#sheet')).screenshot({ path: k(D.colours, 'probuild-palete.png') });

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
  write(k(D.banners, 'html', 'visi-baneri.html'), overviewHtml(rendered));
  await pg.setViewportSize({ width: 1400, height: 900 });
  await pg.goto(url(k(D.banners, 'html', 'visi-baneri.html')), { waitUntil: 'load' });
  await pg.screenshot({ path: k(D.banners, 'visi-baneri.png'), fullPage: true });
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
  await pg.pdf({ path: k(D.print, 'vizitkarte-90x50mm-3mm-pielaide.pdf'), width: '96mm', height: '56mm', printBackground: true, pageRanges: '1-2' });
  await pg.setViewportSize({ width: 1300, height: 900 });
  await (await pg.$('#preview')).screenshot({ path: k(D.print, 'vizitkarte-prieksskatijums.png') });
  write(k(D.print, 'e-pasta-paraksts.html'), signatureHtml());

  // guide ------------------------------------------------------------
  await pg.setViewportSize({ width: 1123, height: 794 });
  write(path.join(OUT, '.guide.html'), guideHtml({ ...ctxFonts, kit: KIT, D, COLOURS }));
  await pg.goto(url(path.join(OUT, '.guide.html')), { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  await pg.pdf({ path: k(D.guide, GUIDE_PDF), width: '297mm', height: '210mm', printBackground: true });
  if (await pg.$$eval('img', (a) => a.some((i) => !i.naturalWidth))) throw new Error('guide image did not load');
  await browser.close();
  fs.rmSync(TMP, { force: true });

  write(k('LASIMANI.md'), readme({ D, banners: rendered, guidePdf: GUIDE_PDF }));
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
  return `<!doctype html><html lang="lv"><head><meta charset="utf-8"><title>ProBuild Group baneri</title>
<style>body{margin:0;padding:32px;background:#2b2b2b;color:#fff;font:14px/1.4 system-ui,sans-serif}h1{font-size:20px;margin:0 0 4px}p{color:#b2b2b2;margin:0 0 24px}
.grid{display:flex;flex-wrap:wrap;gap:24px;align-items:flex-start}figure{margin:0}figure img{display:block;max-width:100%;height:auto;box-shadow:0 0 0 1px rgba(255,255,255,.15)}figcaption{margin-top:6px;color:#b2b2b2;font-size:12px}a{color:#f58f54}</style></head>
<body><h1>ProBuild Group · baneri</h1><p>Lai mainītu tekstu, atveriet banera HTML failu un pēc tam eksportējiet to vēlreiz (skat. LASIMANI.md). Lielie baneri parādīti uz pusi mazāki.</p><div class="grid">
${list.map((b) => `<figure><a href="${path.basename(b.file)}.html"><img src="../${b.file}.png" width="${Math.round(b.w / (b.w > 700 ? 2 : 1))}"></a><figcaption>${path.basename(b.file)} · ${b.w}×${b.h}</figcaption></figure>`).join('\n')}
</div></body></html>`;
}

const RENDER_SCRIPT = `// Baneru eksports pēc teksta labošanas HTML failos:  node eksportet.mjs [fails.html ...]
// Vajag Node 18+ un Playwright:  npm i playwright && npx playwright install chromium
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
const here = path.dirname(new URL(import.meta.url).pathname);
const where = JSON.parse(fs.readFileSync(path.join(here, 'baneri.json'), 'utf8')); // fails -> mape
const files = process.argv.slice(2).length ? process.argv.slice(2).map((f) => path.basename(f)) : Object.keys(where);
const browser = await chromium.launch();
const page = await browser.newPage();
for (const f of files) {
  const m = f.match(/(\\d+)x(\\d+)\\.html$/);
  await page.setViewportSize({ width: +m[1], height: +m[2] });
  await page.goto('file://' + path.join(here, f));
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(here, '..', where[f] || 'socialie-tikli', f.replace(/\\.html$/, '.png'));
  await (await page.$('#banner')).screenshot({ path: out });
  console.log(out);
}
await browser.close();
`;

main().catch((e) => { console.error(e); process.exit(1); });
