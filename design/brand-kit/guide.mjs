// Brand guide (PDF), business card, e-mail signature and README for the ProBuild Group brand kit.
// All facts and copy come from the website (probuild-group.webflow.io / probuildgroup.lv) and design/logo.
import path from 'path';

export const COMPANY = {
  name: 'ProBuild Group', legal: 'SIA “Probuild”', reg: '54103137871', vat: 'LV54103137871',
  address: 'Limbažu nov., Vidrižu pag., “Garkalni”, LV-4013', phone: '+371 26 518 131', tel: '+37126518131',
  email: 'probuildlatvia@gmail.com', web: 'probuildgroup.lv', region: 'Salaspils un apkārtne',
};

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

function fontFaces(c) {
  return `@font-face{font-family:"Martian Mono";src:url("${c.url(path.join(c.fonts, 'MartianMono-Variable.ttf'))}") format("truetype");font-weight:100 800;font-stretch:75% 112.5%}
@font-face{font-family:"Noto Sans";src:url("${c.url(path.join(c.fonts, 'NotoSans-Variable.ttf'))}") format("truetype");font-weight:100 900;font-stretch:62.5% 100%}`;
}

// ------------------------------------------------------------------ brand guide
export function guideHtml(c) {
  const L = (n) => c.url(path.join(c.logo, 'svg', n + '.svg'));
  const P = (n) => c.url(path.join(c.pattern, n));
  const B = (f) => c.url(path.join(c.kit, c.D.banners, f + '.png'));
  const PH = (f) => c.url(path.join(c.kit, c.D.photos, f));
  const col = Object.fromEntries(c.COLOURS.map((x) => [x.key, x]));
  const cr = (a, b) => contrast(a, b).toFixed(1).replace('.', ',') + ':1';
  let n = 0;
  const pageNo = () => `<span class="pn">${String(++n).padStart(2, '0')}</span>`;
  const head = (title, kicker) => `<header class="ph"><p class="pk">${kicker}</p><h2>${title}</h2></header>`;
  const foot = (dark) => `<footer class="pf${dark ? ' is-dark' : ''}"><span>ProBuild Group · Brand guide 2026</span>${pageNo()}</footer>`;
  const tile = (logo, bg, label, h = 54) => `<figure class="tile" style="background:${bg}"><img src="${L(logo)}" style="height:${h}px"><figcaption style="color:${bg === '#FFFFFF' || bg === '#F2F2F2' || bg === '#F2600C' ? '#000' : '#B2B2B2'}">${label}<br><code>${logo}.svg</code></figcaption></figure>`;
  const dont = (inner, label, bg = '#000') => `<figure class="dont"><div class="dont-a" style="background:${bg}">${inner}</div><figcaption><b>✕</b> ${label}</figcaption></figure>`;
  const sw = (x, big) => `<div class="sw${big ? ' is-big' : ''}"><div class="sw-c" style="background:${x.hex}${x.hex === '#FFFFFF' || x.hex === '#F2F2F2' || x.hex === '#FDEFE6' ? ';box-shadow:inset 0 0 0 1px #ddd' : ''}"></div><p><b>${x.name}</b>${x.hex}<br>RGB ${x.rgb.join(' ')}<br>CMYK ≈ ${x.cmyk.join(' ')}</p>${big ? `<p class="sw-u">${x.use}</p>` : ''}</div>`;
  const barsBox = (w, h, cls, style = '') => `<div class="bars ${cls}" style="width:${w}px;height:${h}px;${style}"><i></i><i></i></div>`;
  const byName = Object.fromEntries(c.banners.map((b) => [path.basename(b.file), b]));
  const row = (names, { h, s: k, mt = 0 }) => `<div class="thumbs" style="margin-top:${mt}mm">${names.map((nm) => { const b = byName[nm]; const sc = h ? h / b.h : k; return `<figure><img src="${B(b.file)}" style="width:${Math.round(b.w * sc)}px;height:${Math.round(b.h * sc)}px"><span>${b.w}×${b.h}</span></figure>`; }).join('')}</div>`;

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>ProBuild Group · Brand guide</title><style>
${fontFaces(c)}
@page{size:297mm 210mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:"Noto Sans",sans-serif;color:#191919;background:#fff;font-size:13px;line-height:1.5;-webkit-font-smoothing:antialiased}
.pg{position:relative;width:297mm;height:210mm;overflow:hidden;padding:18mm 20mm 16mm;break-after:page;background:#fff;isolation:isolate}
.pg.is-dark{background:#000;color:#fff}.pg.is-orange{background:#F2600C;color:#000}
.mono,h1,h2,h3{font-family:"Martian Mono",monospace;font-weight:500;letter-spacing:-.03em;line-height:1.08}
.ph{margin-bottom:9mm}.pk{font-weight:600;color:#C14C09;font-size:13px;margin-bottom:6px}.is-dark .pk{color:#F2600C}
h2{font-size:38px}h3{font-size:17px;letter-spacing:-.02em;margin-bottom:6px}
p+p{margin-top:8px}code{font-family:"Martian Mono",monospace;font-size:10px;letter-spacing:0;color:inherit;opacity:.85}
.muted{color:#4C4C4C}.is-dark .muted{color:#B2B2B2}
.pf{position:absolute;left:20mm;right:20mm;bottom:9mm;display:flex;justify-content:space-between;font-size:10px;color:#7F7F7F}
.pf.is-dark{color:#7F7F7F}.pn{font-family:"Martian Mono",monospace}
.cols{display:grid;gap:10mm}.c2{grid-template-columns:1fr 1fr}.c3{grid-template-columns:repeat(3,1fr)}.c4{grid-template-columns:repeat(4,1fr)}
.bars{position:absolute;right:0;bottom:0;overflow:hidden;pointer-events:none;z-index:-1}
.bars i{position:absolute;bottom:0;width:46%;transform:skewY(-19deg);transform-origin:100% 100%;background:rgba(255,255,255,.28)}
.bars i:first-child{left:0;height:68%}.bars i:last-child{right:0;height:100%}
.bars.is-orange i{background:#F2600C}.bars.is-subtle i{background:rgba(255,255,255,.12)}.bars.is-black i{background:#000}.bars.is-glass i{background:rgba(255,255,255,.2)}
.tile{border-radius:10px;height:44mm;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:0 7mm;gap:12px}
.tile img{display:block;width:auto}.tile figcaption{font-size:10.5px;line-height:1.4}
.dont{font-size:11px}.dont-a{height:27mm;border-radius:8px;display:flex;align-items:center;justify-content:center;overflow:hidden;margin-bottom:6px}.dont b{color:#C14C09}
.sw .sw-c{height:14mm;border-radius:8px;margin-bottom:5px}.sw.is-big .sw-c{height:23mm}.sw p{font-size:10.5px;line-height:1.45}.sw b{display:block;font-size:12px}.sw-u{color:#4C4C4C}
.rule{border-top:1px solid #D8D8D8;padding-top:10px}.is-dark .rule{border-color:#333}
.chip{display:inline-flex;align-items:center;height:26px;padding:0 12px;border-radius:99px;font-size:11.5px;font-weight:600}
.cta{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 18px;border-radius:99px;background:#F2600C;color:#000;font-weight:600;font-size:14px}.cta svg{width:16px;height:16px}
.copy{border:1px solid #D8D8D8;border-radius:12px;padding:6mm}.copy dt{font-size:10px;font-weight:600;color:#7F7F7F;text-transform:uppercase;letter-spacing:.06em;margin-top:8px}.copy dd{font-size:13px}
.copy dd.h{font-family:"Martian Mono",monospace;font-weight:500;letter-spacing:-.02em;font-size:16px}
.do{color:#191919}.do b{color:#C14C09}
table{border-collapse:collapse;width:100%;font-size:11.5px}td,th{text-align:left;padding:6px 8px;border-top:1px solid #E5E5E5;vertical-align:top}th{font-size:10px;color:#7F7F7F;font-weight:600;text-transform:uppercase;letter-spacing:.05em}
.thumbs{display:flex;flex-wrap:nowrap;gap:4mm;align-items:flex-end}.thumbs figure{font-size:9.5px;color:#7F7F7F}.thumbs img{display:block;box-shadow:0 0 0 1px #ddd;border-radius:3px;margin-bottom:3px}
</style></head><body>

<!-- 1 cover -->
<section class="pg is-dark">
  <img src="${P('probuild-rising-bars-transparent.svg')}" style="position:absolute;left:0;bottom:0;width:100%;z-index:-1;opacity:.9">
  <img src="${L('probuild-logo-horizontal-on-dark')}" style="height:80px;margin-top:8mm">
  <h1 style="font-size:64px;margin-top:30mm">Brand guide</h1>
  <p class="mono" style="font-size:20px;color:#F2600C;margin-top:10px">Zīmola vadlīnijas · 2026</p>
  <p class="muted" style="margin-top:14px;max-width:120mm;font-size:14px">Logo, colours, type, the brand bars, photography, voice and ready-made banner layouts for ProBuild Group.</p>
  <footer class="pf is-dark"><span>ProBuild Group · ${COMPANY.web} · version 1.0, October 2026</span><span class="pn">${String(++n).padStart(2, '0')}</span></footer>
</section>

<!-- 2 the brand -->
<section class="pg">
  ${head('No pamatiem līdz atslēgai', 'The brand')}
  <div class="cols c2" style="grid-template-columns:1.1fr 1fr">
    <div>
      <p style="font-size:16px;line-height:1.55">ProBuild Group builds, renovates and rents out construction equipment in Salaspils and the surrounding area. One partner for the whole job, from the groundworks to the last finishing detail: the client doesn't have to coordinate several contractors.</p>
      <p class="muted" style="margin-top:12px">Site line (footer): <i>“Būvniecība, remonts un tehnikas noma Salaspils pusē. No pamatiem līdz atslēgai.”</i></p>
      <h3 style="margin-top:10mm">How it sounds</h3>
      <div class="cols c3" style="gap:6mm;margin-top:4px">
        <div class="rule"><b>Concrete</b><br><span class="muted">Says what is done and what it costs: “Pamati no 150 €/m²”.</span></div>
        <div class="rule"><b>Straight</b><br><span class="muted">Short sentences, no superlatives, no hype. Prices without VAT are marked.</span></div>
        <div class="rule"><b>Hands-on</b><br><span class="muted">Own team and own machinery; the price is agreed before the work starts.</span></div>
      </div>
    </div>
    <div class="cols" style="gap:5mm">
      <div class="rule"><p class="pk" style="margin:0">Būvniecība un remonts</p><p class="mono" style="font-size:26px">14 pakalpojumi</p><p class="muted">Foundations, roofs, facades, utilities, renovation, finishing, the grounds. In one contract.</p></div>
      <div class="rule"><p class="pk" style="margin:0">Cenu kalkulators</p><p class="mono" style="font-size:26px">380+ darbu cenas</p><p class="muted">Visitors price the whole project online, then get a precise offer after an inspection.</p></div>
      <div class="rule"><p class="pk" style="margin:0">Tehnikas noma</p><p class="mono" style="font-size:26px">55 €/h</p><p class="muted">Backhoe loader NEW HOLLAND B115 with an operator; tipper truck, ring lifter.</p></div>
    </div>
  </div>
  ${foot()}
</section>

<!-- 3 logo versions -->
<section class="pg">
  ${head('Logo', 'Logo versions')}
  <div class="cols c3" style="gap:6mm">
    ${tile('probuild-logo-horizontal-on-dark', '#000000', 'Main logo, on black or #191919')}
    ${tile('probuild-logo-horizontal-on-light', '#FFFFFF', 'On white and light backgrounds')}
    ${tile('probuild-logo-horizontal-mono-black', '#F2600C', 'On orange: one colour, black')}
    ${tile('probuild-logo-stacked-on-dark', '#191919', 'Stacked: square and tall formats', 84)}
    ${tile('probuild-mark-on-dark', '#000000', 'Mark: small sizes, avatars', 84)}
    <figure class="tile" style="background:#F2F2F2"><img src="${L('probuild-app-icon-orange')}" style="height:84px"><figcaption style="color:#000">App icon: favicon, social and Google profile<br><code>probuild-app-icon-orange.svg</code></figcaption></figure>
  </div>
  <p class="muted" style="margin-top:7mm;max-width:230mm">The mark is the 2025 logo redrawn: two orange bars rising to the P. The text is converted to outlines (Martian Mono), so the files need no fonts. Every version is in <code>02-logo/svg</code> (vector, for print and the web) and <code>02-logo/png</code> (transparent, at several widths); favicons are in <code>02-logo/favicon</code>. One-colour versions (<code>-mono-black</code>, <code>-mono-white</code>) are for orange backgrounds, engraving, stamps and single-colour print.</p>
  ${foot()}
</section>

<!-- 4 logo rules -->
<section class="pg">
  ${head('Using the logo', 'Logo rules')}
  <div class="cols c2" style="grid-template-columns:1fr 1.25fr">
    <div>
      <h3>Clear space</h3>
      <div style="position:relative;background:#000;border-radius:10px;height:52mm;display:flex;align-items:center;justify-content:center">
        <div style="position:relative;padding:28px;outline:1px dashed #F2600C"><img src="${L('probuild-logo-horizontal-on-dark')}" style="height:56px;display:block"></div>
      </div>
      <p class="muted" style="margin-top:8px">Keep free space around the logo equal to half its height on every side. Nothing else (text, edges, other logos) inside it.</p>
      <h3 style="margin-top:8mm">Minimum size</h3>
      <table><tr><th>Version</th><th>Screen</th><th>Print</th></tr>
      <tr><td>Horizontal logo</td><td>40 px tall</td><td>9 mm tall</td></tr>
      <tr><td>Stacked logo</td><td>80 px tall</td><td>18 mm tall</td></tr>
      <tr><td>Mark / app icon</td><td>16 px</td><td>5 mm</td></tr></table>
      <p class="muted" style="margin-top:6px">Below the horizontal minimum, use the mark alone.</p>
    </div>
    <div>
      <h3>Don't</h3>
      <div class="cols c3" style="gap:5mm">
        ${dont(`<img src="${L('probuild-logo-horizontal-on-dark')}" style="height:34px;transform:scaleX(1.45)">`, 'stretch or squash it')}
        ${dont(`<img src="${L('probuild-logo-horizontal-on-dark')}" style="height:34px;filter:hue-rotate(170deg)">`, 'change its colours')}
        ${dont(`<img src="${L('probuild-logo-horizontal-on-light')}" style="height:34px">`, 'use the colour logo on orange: the bars disappear', '#F2600C')}
        ${dont(`<img src="${L('probuild-logo-horizontal-on-dark')}" style="height:34px;filter:drop-shadow(4px 4px 3px #F2600C)">`, 'add shadows, glows or outlines')}
        ${dont(`<img src="${L('probuild-logo-horizontal-on-dark')}" style="height:34px;transform:rotate(-12deg)">`, 'rotate it or rebuild the layout')}
        ${dont(`<img src="${L('probuild-logo-horizontal-on-light')}" style="height:34px">`, 'place it on a busy photo without a dark shade', `url('${PH('rebar-aerial.jpg')}') center/cover`)}
      </div>
    </div>
  </div>
  ${foot()}
</section>

<!-- 5 colours -->
<section class="pg">
  ${head('Colours', 'Palette')}
  <div class="cols c4" style="gap:6mm">${['orange', 'black', 'dark', 'white'].map((x) => sw(col[x], true)).join('')}</div>
  <div class="cols" style="grid-template-columns:repeat(8,1fr);gap:4mm;margin-top:5mm">${['orange-light', 'orange-dark', 'orange-tint', 'graphite', 'grey', 'light', 'lighter', 'off-white'].map((x) => sw(col[x])).join('')}</div>
  <div class="cols c2" style="margin-top:6mm;grid-template-columns:1fr 1.1fr">
    <div><h3>Proportions</h3><div style="display:flex;height:12mm;border-radius:6px;overflow:hidden"><span style="flex:60;background:#000"></span><span style="flex:25;background:#191919"></span><span style="flex:10;background:#F2600C"></span><span style="flex:5;background:#fff;box-shadow:inset 0 0 0 1px #ddd"></span></div>
    <p class="muted" style="margin-top:6px">Black and #191919 carry most surfaces, white is for text, orange is the accent: one call to action, the prices, the bars. A whole orange field is for one strong message per page or campaign.</p></div>
    <div><h3>Contrast</h3><table>
      <tr><td>Black text on orange</td><td class="mono">${cr('#000000', '#F2600C')}</td><td>body text and buttons: yes</td></tr>
      <tr><td>Orange on black</td><td class="mono">${cr('#F2600C', '#000000')}</td><td>text, prices: yes</td></tr>
      <tr><td>White on orange</td><td class="mono">${cr('#FFFFFF', '#F2600C')}</td><td>large headings only, never body text</td></tr>
      <tr><td>Light Grey on black</td><td class="mono">${cr('#B2B2B2', '#000000')}</td><td>secondary text: yes</td></tr></table>
    <p class="muted" style="margin-top:6px">Files: <code>03-colours</code> (CSS, JSON, Adobe .ase swatches, TXT). CMYK values are a plain conversion: for print, ask the printer to match the HEX value on a proof.</p></div>
  </div>
  ${foot()}
</section>

<!-- 6 type -->
<section class="pg">
  ${head('Typography', 'Two typefaces')}
  <div class="cols c2" style="gap:12mm">
    <div>
      <p class="pk">Headings, prices and numbers</p>
      <p class="mono" style="font-size:44px">Martian Mono</p>
      <p class="mono" style="font-size:26px;margin-top:6mm">Aprēķiniet darbu izmaksas</p>
      <p class="mono" style="font-size:34px;color:#C14C09;margin-top:4mm;white-space:nowrap">55 €/h · ≈ 3 558 €</p>
      <p class="muted" style="margin-top:5mm">Medium (500) for headings, tracking −2 to −3.5 %, line height 1.05–1.2. Prices, amounts and totals are always set in Martian Mono so the numbers line up.</p>
    </div>
    <div>
      <p class="pk">Body text, labels, buttons</p>
      <p style="font-size:44px;font-weight:500;letter-spacing:-.02em;line-height:1.1">Noto Sans</p>
      <p style="font-size:16px;margin-top:6mm;line-height:1.55">Atzīmējiet vajadzīgos darbus un ierakstiet apjomu: aptuveno cenu redzēsiet uzreiz. Precīzu cenu sagatavosim pēc objekta apskates.</p>
      <p style="font-size:18px;margin-top:4mm;letter-spacing:.02em">Ā Č Ē Ģ Ī Ķ Ļ Ņ Š Ū Ž · ā č ē ģ ī ķ ļ ņ š ū ž</p>
      <p class="muted" style="margin-top:5mm">Regular (400) for text, SemiBold (600) for buttons, labels and short emphasis. Both families cover Latvian fully.</p>
    </div>
  </div>
  <table style="margin-top:7mm"><tr><th>Style</th><th>Font</th><th>Web size</th><th>Use</th></tr>
    <tr><td class="mono" style="font-size:16px">Heading 1</td><td>Martian Mono 500</td><td>56 px / 1.2</td><td>One per page or banner</td></tr>
    <tr><td class="mono" style="font-size:14px">Heading 2</td><td>Martian Mono 500</td><td>48 px / 1.2</td><td>Section titles</td></tr>
    <tr><td class="mono" style="font-size:12px">Heading 6</td><td>Martian Mono 500</td><td>20 px / 1.4</td><td>Card and list titles</td></tr>
    <tr><td style="font-weight:600;color:#C14C09">Kicker</td><td>Noto Sans 600, orange</td><td>17 px</td><td>Short line above a heading</td></tr>
    <tr><td>Body</td><td>Noto Sans 400</td><td>16–18 px / 1.5</td><td>Text</td></tr></table>
  <p class="muted" style="margin-top:5mm">Sentence case everywhere (no all-caps headings: capitals are reserved for the logo). The fonts are free (SIL Open Font License) and in <code>04-fonts</code>; install them before editing the banners or documents.</p>
  ${foot()}
</section>

<!-- 7 brand bars -->
<section class="pg is-dark">
  ${head('The brand bars', 'Pattern')}
  <div class="cols c2" style="grid-template-columns:1fr 1.15fr">
    <div>
      <p style="font-size:15px">The two rising bars come from the logo mark. On the site and in every layout they rise from the bottom edge of a surface and are cut off by it: they look like part of a building going up behind the content.</p>
      <h3 style="margin-top:8mm">How they are built</h3>
      <table style="color:#fff"><tr><td>Bar width</td><td>46 % of the bar box, two equal bars</td></tr><tr><td>Heights</td><td>left 68 %, right 100 %</td></tr><tr><td>Slant</td><td>tops rise to the right, skewY −19°</td></tr><tr><td>Box</td><td>anchored bottom right, about 60 % × 86 % of the surface</td></tr><tr><td>Colours</td><td>white 28 % or 12 % on black, orange on black, white 28 % on orange, black</td></tr></table>
      <p class="muted" style="margin-top:6mm">Files: <code>05-pattern</code>. One pair per surface, always behind the content and touching an edge. Don't rotate them, outline them or use them as icons. The full-screen pattern (thick bars rising across the width) is the site's intro; use it for covers, presentations and large prints.</p>
    </div>
    <div class="cols c3" style="gap:5mm;align-content:start">
      <div style="position:relative;height:60mm;background:#191919;border-radius:10px;overflow:hidden;isolation:isolate">${barsBox(110, 150, '')}</div>
      <div style="position:relative;height:60mm;background:#000;border-radius:10px;overflow:hidden;isolation:isolate;box-shadow:inset 0 0 0 1px #333">${barsBox(110, 150, 'is-orange')}</div>
      <div style="position:relative;height:60mm;background:#F2600C;border-radius:10px;overflow:hidden;isolation:isolate">${barsBox(110, 150, '')}</div>
      <div style="grid-column:1/-1;position:relative;height:66mm;border-radius:10px;overflow:hidden"><img src="${P('probuild-rising-bars-on-orange.svg')}" style="width:100%;height:100%;object-fit:cover;display:block"></div>
    </div>
  </div>
  ${foot(true)}
</section>

<!-- 8 photography + voice -->
<section class="pg">
  ${head('Photos and words', 'Photography · tone of voice')}
  <div class="cols c2" style="gap:12mm">
    <div>
      <div style="display:grid;grid-template-columns:2fr 1fr;grid-template-rows:30mm 30mm;gap:3mm">
        <div style="grid-row:1/span 2;border-radius:8px;background:url('${PH('hero.jpg')}') 60% 40%/cover"></div>
        <div style="border-radius:8px;background:url('${PH('house-timber.jpg')}') center/cover"></div>
        <div style="border-radius:8px;background:url('${PH('worker-cut.jpg')}') center/cover"></div>
      </div>
      <p style="margin-top:6mm"><b>Real work first.</b> The best photos are the client's own projects: before and after, the team at work in helmets and vests, Northern European houses, natural light, no other companies' logos.</p>
      <p class="muted">The photos on the site and in <code>07-photos</code> are temporary stock / AI images. Replace them with own project photos as they come in, and never present a stock photo as “our project”. For text over a photo, use a black gradient behind the text (see the banners).</p>
    </div>
    <div>
      <table>
        <tr><th>Write</th><th>Not</th></tr>
        <tr><td class="do">Pamati <b>no 150 €/m²</b>. Cenas bez PVN.</td><td class="muted">Labākās cenas Latvijā!</td></tr>
        <tr><td class="do">Precīzu cenu sagatavosim pēc objekta apskates.</td><td class="muted">Garantējam zemāko cenu.</td></tr>
        <tr><td class="do">Ekskavators-iekrāvējs ar operatoru, 55 €/h.</td><td class="muted">Super jaudīga tehnika par superzemu cenu</td></tr>
        <tr><td class="do">Sazināsimies tuvākajā darba dienā.</td><td class="muted">Atbildēsim uzreiz 24/7</td></tr>
      </table>
      <h3 style="margin-top:7mm">Writing rules</h3>
      <table>
        <tr><td>Prices</td><td class="mono">no 150 €/m² · 55 €/h · 25 €/diena</td></tr>
        <tr><td>Thousands, ranges</td><td class="mono">3 558 € · 2 392–5 502 €</td></tr>
        <tr><td>VAT</td><td>Service prices are without VAT: say “Cenas bez PVN”</td></tr>
        <tr><td>Phone, web</td><td class="mono">${COMPANY.phone} · ${COMPANY.web}</td></tr>
        <tr><td>Address the reader</td><td>“jūs”, lowercase; one clear action per message</td></tr>
      </table>
    </div>
  </div>
  ${foot()}
</section>

<!-- 9 offers -->
<section class="pg">
  ${head('Offers and approved copy', 'Messages')}
  <div class="cols c3" style="gap:6mm">
    <dl class="copy"><p class="pk" style="margin:0">1 · Cenu kalkulators</p><dt>Heading</dt><dd class="h">Cik maksās jūsu projekts?</dd><dt>Text</dt><dd>Atzīmējiet darbus un apjomu: aptuveno cenu redzēsiet uzreiz. 380+ darbu cenas.</dd><dt>Button</dt><dd>Aprēķināt izmaksas</dd><dt>Small print</dt><dd>Bez saistībām · ${COMPANY.web}</dd><dt>Link</dt><dd class="mono" style="font-size:11px">${COMPANY.web}/pakalpojumi#kalkulators</dd></dl>
    <dl class="copy"><p class="pk" style="margin:0">2 · Pakalpojumi un cenas</p><dt>Heading</dt><dd class="h">No pamatiem līdz atslēgai</dd><dt>Text</dt><dd>14 pakalpojumi vienā līgumā, ar vienu atbildīgo. Pamati no 150 €/m², jumti no 110 €/m², fasādes no 45 €/m².</dd><dt>Button</dt><dd>Skatīt cenas</dd><dt>Small print</dt><dd>Cenas bez PVN</dd><dt>Link</dt><dd class="mono" style="font-size:11px">${COMPANY.web}/cenas</dd></dl>
    <dl class="copy"><p class="pk" style="margin:0">3 · Tehnikas noma</p><dt>Heading</dt><dd class="h">Ekskavators-iekrāvējs ar operatoru</dd><dt>Price</dt><dd class="mono">55 €/h</dd><dt>Text</dt><dd>NEW HOLLAND B115 · 82 kW · 4×4. Pašizgāzējs 30 €/h, grodu satvērējs 25 €/diena.</dd><dt>Button</dt><dd>Pieprasīt nomu</dd><dt>Link</dt><dd class="mono" style="font-size:11px">${COMPANY.web}/noma</dd></dl>
  </div>
  <p class="muted" style="margin-top:6mm">Prices are from the website on 30 October 2026. When the price table changes, update the banners too. The rental prices on the site do not say whether VAT is included: confirm before running them as ads.</p>
  ${foot()}
</section>

<!-- 10 social banners -->
<section class="pg" style="background:#F2F2F2">
  ${head('Social banners', 'In 06-banners/social')}
  ${row(['kalkulators-dark-1080x1080', 'pakalpojumi-orange-1080x1080', 'noma-dark-1080x1080', 'kalkulators-foto-1080x1350', 'pakalpojumi-foto-1080x1350', 'kalkulators-dark-1080x1920', 'noma-orange-1080x1920'], { h: 150 })}
  ${row(['kalkulators-dark-1200x628', 'pakalpojumi-foto-1200x628', 'facebook-cover-1640x624'], { h: 140, mt: 7 })}
  <p class="muted" style="margin-top:7mm;max-width:240mm">Facebook, Instagram and LinkedIn: square and 4:5 posts, 9:16 stories (the top 250 px and bottom 340 px stay free of key content), 1.91:1 link ads and the Facebook cover (phones crop its sides: keep text in the middle). Each banner has an editable HTML file in <code>06-banners/html</code>.</p>
  ${foot()}
</section>

<!-- 11 display banners -->
<section class="pg" style="background:#F2F2F2">
  ${head('Display banners', 'In 06-banners/display · Google Ads')}
  ${row(['kalkulators-300x250', 'kalkulators-336x280', 'noma-300x250', 'kalkulators-160x600', 'kalkulators-300x600'], { s: 0.42 })}
  ${row(['kalkulators-970x250', 'kalkulators-728x90'], { s: 0.5, mt: 5 })}
  ${row(['noma-728x90', 'kalkulators-320x100', 'kalkulators-320x50'], { s: 0.5, mt: 4 })}
  <p class="muted" style="margin-top:5mm;max-width:240mm">All under the 150 KB Google Ads limit. The price card in the calculator banners is a worked example from the price table (four foundation jobs); keep it when prices change only if the numbers still add up.</p>
  ${foot()}
</section>

<!-- 11 details -->
<section class="pg is-dark">
  ${barsBox(420, 560, 'is-orange')}
  ${head('Company details', 'Contacts')}
  <table style="color:#fff;max-width:150mm;font-size:13px">
    <tr><td style="color:#B2B2B2">Brand</td><td>${COMPANY.name}</td></tr>
    <tr><td style="color:#B2B2B2">Company</td><td>${COMPANY.legal} · Reģ. nr. ${COMPANY.reg} · PVN nr. ${COMPANY.vat}</td></tr>
    <tr><td style="color:#B2B2B2">Address</td><td>${COMPANY.address}</td></tr>
    <tr><td style="color:#B2B2B2">Phone</td><td class="mono">${COMPANY.phone}</td></tr>
    <tr><td style="color:#B2B2B2">E-mail</td><td>${COMPANY.email}</td></tr>
    <tr><td style="color:#B2B2B2">Web</td><td>${COMPANY.web}</td></tr>
    <tr><td style="color:#B2B2B2">Region</td><td>${COMPANY.region}</td></tr>
  </table>
  <img src="${L('probuild-logo-horizontal-on-dark')}" style="height:54px;position:absolute;left:20mm;bottom:24mm">
  ${foot(true).replace('class="pn"', 'class="pn" style="color:#000"')}
</section>
</body></html>`;
}

// ------------------------------------------------------------------ business card (90 × 50 mm, 3 mm bleed)
export function cardHtml(c) {
  const L = (n) => c.url(path.join(c.logo, 'svg', n + '.svg'));
  const front = `<div class="face is-front"><img class="lg" src="${L('probuild-logo-horizontal-on-dark')}"><div class="bars is-orange"><i></i><i></i></div></div>`;
  const back = `<div class="face is-back"><div class="safe"><p class="nm">Jānis Ādamsons</p><p class="rl">Komandas vadītājs</p>
  <p class="ct"><span class="mono">${COMPANY.phone}</span><br>${COMPANY.email}<br>${COMPANY.web}</p><img class="mk" src="${L('probuild-mark-on-light')}"></div><div class="bars is-orange sm"><i></i><i></i></div></div>`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontFaces(c)}
@page{size:96mm 56mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:"Noto Sans",sans-serif;background:#ddd}
.mono{font-family:"Martian Mono",monospace}
.face{position:relative;width:96mm;height:56mm;overflow:hidden;isolation:isolate}
.is-front{background:#000}.is-back{background:#fff;color:#000}
.lg{position:absolute;left:10mm;top:21.5mm;height:13mm}
.bars{position:absolute;right:0;bottom:0;width:30mm;height:44mm;overflow:hidden;z-index:-1}
.bars.sm{width:16mm;height:24mm}
.bars i{position:absolute;bottom:0;width:46%;transform:skewY(-19deg);transform-origin:100% 100%;background:#F2600C}
.bars i:first-child{left:0;height:68%}.bars i:last-child{right:0;height:100%}
.safe{position:absolute;inset:7mm}
.nm{font-family:"Martian Mono",monospace;font-weight:500;font-size:13pt;letter-spacing:-.03em}
.rl{color:#C14C09;font-weight:600;font-size:8pt;margin-top:1mm}
.ct{position:absolute;left:0;bottom:0;font-size:7.5pt;line-height:1.5}
.ct .mono{font-weight:500;font-size:8pt}
.mk{position:absolute;right:0;top:0;height:8mm}
.pg{break-after:page}
#preview{display:flex;gap:40px;padding:40px;background:#ddd;width:max-content}
#preview .wrap{position:relative;transform:scale(1.9);transform-origin:0 0;width:96mm;height:56mm;margin:0 calc(96mm*.9) calc(56mm*.9) 0}
#preview .wrap::after{content:"";position:absolute;inset:3mm;outline:1px dashed rgba(242,96,12,.9);pointer-events:none}
@media print{#preview{display:none}body{background:none}}
@media screen{.print{display:none}}
</style></head><body>
<div class="print"><div class="pg">${front}</div><div class="pg">${back}</div></div>
<div id="preview"><div class="wrap">${front}</div><div class="wrap">${back}</div></div>
</body></html>`;
}

// ------------------------------------------------------------------ e-mail signature
export function signatureHtml() {
  return `<!doctype html><html lang="lv"><head><meta charset="utf-8"><title>ProBuild Group · e-pasta paraksts</title></head>
<body style="margin:24px;background:#fff">
<!-- Copy the table below into the e-mail program's signature editor (open this file in a browser, select, copy, paste).
     The logo must be on the web: upload ../02-logo/png/probuild-logo-horizontal-on-light-450px.png (e.g. to the Webflow
     site's Assets) and put its address in src. Change the name and role for each person. -->
<table cellpadding="0" cellspacing="0" border="0" style="font-family:'Noto Sans',Arial,Helvetica,sans-serif;color:#191919;font-size:13px;line-height:1.5">
  <tr><td style="padding:0 0 10px 0"><img src="../02-logo/png/probuild-logo-horizontal-on-light-450px.png" alt="ProBuild Group" width="180" height="40" style="display:block;border:0;width:180px;height:auto"></td></tr>
  <tr><td style="border-top:3px solid #F2600C;padding:10px 0 0 0">
    <strong style="font-size:15px;color:#000">Jānis Ādamsons</strong><br>
    <span style="color:#C14C09;font-weight:600">Komandas vadītājs</span><br>
    <span style="color:#4C4C4C">Būvniecība, remonts un tehnikas noma · ${COMPANY.region}</span>
  </td></tr>
  <tr><td style="padding:8px 0 0 0">
    <a href="tel:${COMPANY.tel}" style="color:#000;text-decoration:none;font-weight:600">${COMPANY.phone}</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="mailto:${COMPANY.email}" style="color:#000;text-decoration:none">${COMPANY.email}</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://${COMPANY.web}" style="color:#C14C09;text-decoration:none;font-weight:600">${COMPANY.web}</a>
  </td></tr>
  <tr><td style="padding:8px 0 0 0;font-size:11px;color:#7F7F7F">${COMPANY.legal} · Reģ. nr. ${COMPANY.reg}</td></tr>
</table>
</body></html>
`;
}

// ------------------------------------------------------------------ README
export function readme({ D, banners }) {
  const rows = (list) => list.map((b) => `| \`${b.file}.png\` | ${b.w}×${b.h} | ${b.title} |`).join('\n');
  return `# ProBuild Group · brand kit (2026)

Everything the brand needs outside the website: logo files, colours, fonts, the brand bars, photos and ready banner layouts.
Start with **\`${D.guide}/ProBuild-Group-brand-guide.pdf\`** (12 pages: logo, colours, type, pattern, photos, voice, offers, banners, company details).

| Folder | What is in it |
|---|---|
| \`${D.guide}\` | Brand guide (PDF) |
| \`${D.logo}\` | Logo: \`svg/\` (vector, for print and the web), \`png/\` (transparent, several widths), \`favicon/\` (32, 48, 180, 192, 512 px) |
| \`${D.colours}\` | Palette: \`.css\`, \`.json\`, Adobe swatches \`.ase\`, \`.txt\` and a palette image |
| \`${D.fonts}\` | Martian Mono and Noto Sans (variable TTF, SIL Open Font License, free for any use). Install both before editing |
| \`${D.pattern}\` | The brand bars as SVG/PNG (white, white-subtle, orange, black), the full-screen rising-bars pattern, the list marker |
| \`${D.banners}\` | Banners: \`social/\` and \`display/\` PNGs, \`html/\` editable sources, \`all-banners-overview.png\` |
| \`${D.photos}\` | The photos used on the site and in the banners (temporary stock / AI images) |
| \`${D.print}\` | Business card (90×50 mm, 3 mm bleed, print PDF + preview) and an e-mail signature |

## Which logo file

- On black or #191919: \`probuild-logo-horizontal-on-dark\` (main logo), \`probuild-logo-stacked-on-dark\` for square formats.
- On white: \`probuild-logo-horizontal-on-light\`.
- On orange or in one-colour print: \`probuild-logo-horizontal-mono-black\` / \`-mono-white\`.
- Small sizes, avatars, Facebook / Instagram / Google profile picture: \`probuild-app-icon-orange\` (1024 px PNG).

## Banners

Social (Facebook, Instagram, LinkedIn):

| File | Size | Layout |
|---|---|---|
${rows(banners.filter((b) => !b.display))}

Display (Google Ads; each PNG is under the 150 KB limit${banners.some((b) => b.jpg) ? ', a JPG is added where the PNG is larger' : ''}):

| File | Size | Layout |
|---|---|---|
${rows(banners.filter((b) => b.display))}

**Editing a banner:** install the fonts, open the banner's file in \`${D.banners}/html/\` in Chrome and change the text in the HTML (every text is plain HTML, the look is in \`banners.css\`). To export PNGs again: \`cd ${D.banners}/html && npm i playwright && npx playwright install chromium && node render.mjs\`. A designer can also rebuild a layout in Canva or Figma from the PNG, the fonts and the colours.

## Before using them

- **Web addresses:** the banners and the signature use **probuildgroup.lv**. Run the ads only after the site is published on that domain (today it is on probuild-group.webflow.io).
- **Photos** are temporary stock / AI images from the site. Swap in the client's own project photos when they exist, and don't present stock photos as the company's own work.
- **Prices** are from the website (30 October 2026): services from the Cenas page (without VAT), the calculator example from the calculator's price table, rental from the Noma page. The rental prices don't say whether VAT is included: confirm before running them as ads.
- **Business card and signature** use the team lead's name and title from the website as a template, with the company phone and e-mail. Change them per person.
- **E-mail signature:** the logo in \`email-signature.html\` points to the PNG in this folder, so it only shows on this computer. Upload \`02-logo/png/probuild-logo-horizontal-on-light-450px.png\` to the website (or any public address), put that address in the \`<img src>\`, then open the file in a browser, select all, copy and paste it into the mail program's signature settings.
- **Print colours:** the CMYK values are a plain conversion. Ask the printer to match #F2600C on a proof.
`;
}
