// Banner layouts for the ProBuild Group brand kit. Each banner is one standalone HTML file in
// 06-banners/html/ (shared banners.css), rendered by build.mjs to 06-banners/<social|display>/ at its exact pixel size.
// Copy is Latvian and taken from the site (prices from the Cenas page and the calculator's price table).
// Text sits in flowing stacks (.stack / .row); build.mjs checks that the key blocks (.k) don't overlap or run off the edge.
// Sizing: Martian Mono at the heading tracking is 0.665 em per character.

export const CSS = `/* ProBuild Group banners. Edit the text in the HTML files; colours, type and the brand bars live here. */
@font-face{font-family:"Martian Mono";src:url("../../04-fonts/MartianMono-Variable.ttf") format("truetype");font-weight:100 800;font-stretch:75% 112.5%}
@font-face{font-family:"Noto Sans";src:url("../../04-fonts/NotoSans-Variable.ttf") format("truetype");font-weight:100 900;font-stretch:62.5% 100%}
:root{--orange:#F2600C;--orange-light:#F58F54;--orange-dark:#C14C09;--black:#000;--dark:#191919;--grey:#4C4C4C;--mid:#7F7F7F;--light:#B2B2B2;--lighter:#D8D8D8;--white:#FFF}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#2B2B2B}
.bn{position:relative;overflow:hidden;isolation:isolate;background:var(--black);color:var(--white);font-family:"Noto Sans",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.bn.is-darker{background:var(--dark)}
.bn.is-orange{background:var(--orange);color:var(--black)}
.abs{position:absolute}
.stack{position:absolute;display:flex;flex-direction:column;align-items:flex-start}
.row{position:absolute;display:flex;align-items:center}
.logo{display:block;height:auto;flex:none}
.mono{font-family:"Martian Mono",monospace}
.h{font-family:"Martian Mono",monospace;font-weight:500;letter-spacing:-.035em;line-height:1.04;text-wrap:balance}
.kicker{font-weight:600;color:var(--orange);line-height:1.3}
.is-orange .kicker{color:var(--black)}
.sub{color:var(--lighter);line-height:1.4}
.is-orange .sub{color:var(--black)}
.foot{color:var(--light);line-height:1.3;white-space:nowrap}
.is-orange .foot{color:rgba(0,0,0,.8)}
.cta{display:inline-flex;align-items:center;justify-content:center;gap:.5em;flex:none;border-radius:999px;background:var(--orange);color:var(--black);font-weight:600;line-height:1;white-space:nowrap}
.cta svg{flex:none;width:1.05em;height:1.05em}
.is-orange .cta,.cta.is-dark{background:var(--black);color:var(--white)}
.price{font-family:"Martian Mono",monospace;font-weight:500;letter-spacing:-.04em;line-height:1;white-space:nowrap;font-variant-numeric:tabular-nums}
/* Brand bars: two equal bars with slanted tops (skewY -19deg), the left one at 68% of the right one's height. */
.bars{position:absolute;right:0;bottom:0;overflow:hidden;pointer-events:none;z-index:-1}
.bars i{position:absolute;bottom:0;width:46%;transform:skewY(-19deg);transform-origin:100% 100%;background:rgba(255,255,255,.28)}
.bars i:first-child{left:0;height:68%}
.bars i:last-child{right:0;height:100%}
.bars.is-orange i{background:var(--orange)}
.bars.is-subtle i{background:rgba(255,255,255,.12)}
.bars.is-glass i{background:rgba(255,255,255,.2)}
/* Calculator estimate card */
.card{background:var(--dark);border:1px solid rgba(255,255,255,.12);border-radius:20px;color:var(--white)}
.card-h{display:flex;justify-content:space-between;align-items:baseline;gap:1em}
.card-t{font-family:"Martian Mono",monospace;font-weight:500;letter-spacing:-.02em}
.card-m{color:var(--light)}
.line{display:grid;grid-template-columns:1fr auto;column-gap:1em;border-top:1px solid rgba(255,255,255,.1)}
.line b{font-weight:400}
.line small{grid-column:1;color:var(--mid)}
.line span{grid-row:1/span 2;grid-column:2;align-self:center;font-family:"Martian Mono",monospace;font-weight:500;font-variant-numeric:tabular-nums;white-space:nowrap}
.tot{background:var(--black);border-radius:14px}
.tot-l{color:var(--light)}
.tot-v{font-family:"Martian Mono",monospace;font-weight:500;color:var(--orange-light);letter-spacing:-.03em;line-height:1.1;white-space:nowrap;font-variant-numeric:tabular-nums}
.tot-r{color:var(--light);font-variant-numeric:tabular-nums}
.tot-r b{color:var(--white);font-weight:600}
/* Price list and chips */
.plist{list-style:none}
.plist li{display:flex;justify-content:space-between;align-items:baseline;gap:1em;border-top:1px solid currentColor}
.plist li:last-child{border-bottom:1px solid currentColor}
.plist .p{font-family:"Martian Mono",monospace;font-weight:500;white-space:nowrap;letter-spacing:-.02em}
.chips{display:flex;flex-wrap:wrap}
.chip{display:inline-flex;align-items:center;border-radius:999px;border:1px solid rgba(255,255,255,.4);white-space:nowrap}
.chip b{font-family:"Martian Mono",monospace;font-weight:500;margin-left:.4em}
.is-orange .chip{border-color:rgba(0,0,0,.45)}
.photo{position:absolute;inset:0;background-size:cover;background-position:center;z-index:-3}
.shade{position:absolute;inset:0;z-index:-2}
`;

const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const LOGO = {
  dark: '../../02-logo/svg/probuild-logo-horizontal-on-dark.svg',
  mono: '../../02-logo/svg/probuild-logo-horizontal-mono-black.svg',
  markDark: '../../02-logo/svg/probuild-mark-on-dark.svg',
  markMono: '../../02-logo/svg/probuild-mark-mono-black.svg',
};
const AR = 429.45 / 95.79; // horizontal logo aspect ratio
const PH = (f) => `../../07-photos/${f}`;
const px = (o) => Object.entries(o).filter(([, v]) => v != null).map(([k, v]) => `${k}:${typeof v === 'number' ? v + 'px' : v}`).join(';');

const logo = (h, x, y, kind = 'dark') => `<img class="logo abs k" src="${LOGO[kind]}" alt="ProBuild Group" style="${px({ left: x, top: y, height: h, width: +(h * AR).toFixed(1) })}">`;
const mark = (h, x, y, kind = 'markDark') => `<img class="logo abs k" src="${LOGO[kind]}" alt="ProBuild Group" style="${px({ left: x, top: y, height: h, width: h })}">`;
const bars = (w, h, cls = '', pos = {}) => `<div class="bars ${cls}" style="${px({ width: w, height: h, ...pos })}" aria-hidden="true"><i></i><i></i></div>`;
const cta = (text, size, h, pad, cls = '') => `<span class="cta ${cls}" style="${px({ 'font-size': size, height: h, padding: `0 ${pad}px` })}">${text}${ARROW}</span>`;
const stack = (pos, inner, cls = '') => `<div class="stack k ${cls}" style="${px(pos)}">${inner}</div>`;
const row = (pos, inner) => `<div class="row k" style="${px(pos)}">${inner}</div>`;
const T = (tag, cls, size, text, extra = {}) => `<${tag} class="${cls}" style="${px({ 'font-size': size, ...extra })}">${text}</${tag}>`;
const urlTR = (text, size, right, top) => `<p class="foot abs k" style="${px({ right, top, 'font-size': size })}">${text}</p>`;

// Example estimate from the calculator's price table (Būvniecība › Pamati).
export const EST = {
  title: 'Jūsu aprēķins', meta: 'Piemērs · Pamati',
  rows: [
    ['Šķembu pabēršana zem pamatiem un grīdām', '120 m² × 8 €/m²', '960 €'],
    ['Pamatnes (pēdas) sagatavošana', '44 tek. m × 12 €/tek. m', '528 €'],
    ['Armatūras uzstādīšana, betona ieliešana', '18 m³ × 55 €/m³', '990 €'],
    ['Horizontālā pamatu hidroizolācija', '120 m² × 9 €/m²', '1 080 €'],
  ],
  total: '≈ 3 558 €', range: '2 392–5 502 €',
};
// s: base size (row text); the rest scales from it
const card = (s, w, extra = {}, cls = '') => `<div class="card ${cls}" style="${px({ width: w, padding: Math.round(s * 1.4), ...extra })}">
  <div class="card-h" style="margin-bottom:${Math.round(s * .55)}px"><span class="card-t" style="font-size:${Math.round(s * 1.35)}px">${EST.title}</span><span class="card-m" style="font-size:${Math.round(s * .85)}px">${EST.meta}</span></div>
  ${EST.rows.map(([a, q, v]) => `<div class="line" style="padding:${Math.round(s * .55)}px 0;font-size:${s}px;line-height:1.3"><b>${a}</b><small style="font-size:${Math.round(s * .78)}px">${q}</small><span>${v}</span></div>`).join('\n  ')}
  <div class="tot" style="margin-top:${Math.round(s * .55)}px;padding:${Math.round(s * .85)}px ${Math.round(s)}px"><p class="tot-l" style="font-size:${Math.round(s * .82)}px">Aptuvenās izmaksas</p><p class="tot-v" style="font-size:${Math.round(s * 2.3)}px;margin:${Math.round(s * .15)}px 0">${EST.total}</p><p class="tot-r" style="font-size:${Math.round(s * .82)}px">Iespējamais diapazons <b>${EST.range}</b></p></div>
</div>`;
const total = (s, w, extra = {}) => `<div class="tot" style="${px({ width: w, padding: `${Math.round(s * .8)}px ${Math.round(s * .9)}px`, border: '1px solid rgba(255,255,255,.14)', ...extra })}"><p class="tot-l" style="font-size:${s}px">${EST.meta}</p><p class="tot-v" style="font-size:${Math.round(s * 1.75)}px;margin-top:${Math.round(s * .3)}px">${EST.total}</p></div>`;

const COPY = {
  calc: { kicker: 'Cenu kalkulators · 380+ darbu cenas', h: 'Cik maksās jūsu projekts?', sub: 'Atzīmējiet darbus un apjomu: aptuveno cenu redzēsiet uzreiz.', cta: 'Aprēķināt izmaksas', note: 'Bez saistībām' },
  svc: { kicker: 'Būvniecība · remonts · teritorija', h: 'No pamatiem līdz atslēgai', sub: '14 pakalpojumi vienā līgumā, ar vienu atbildīgo.', cta: 'Skatīt cenas', note: 'Cenas bez PVN',
    prices: [['Pamati', 'no 150 €/m²'], ['Jumti', 'no 110 €/m²'], ['Fasādes', 'no 45 €/m²'], ['Remonts un apdare', 'no 280 €/m²']] },
  rent: { kicker: 'Tehnikas noma Salaspilī', h: 'Ekskavators-iekrāvējs ar operatoru', price: '55 €/h', spec: 'NEW HOLLAND B115 · 82 kW · 4×4', extra: ['Pašizgāzējs 30 €/h', 'Grodu satvērējs 25 €/diena'], cta: 'Pieprasīt nomu', phone: '+371 26 518 131' },
};
const WEB = 'probuildgroup.lv';
const plist = (rows, size, pad, w) => `<ul class="plist" style="${px({ width: w })}">${rows.map(([a, p]) => `<li style="${px({ 'font-size': size, padding: `${pad}px 0` })}"><span>${a}</span><span class="p">${p}</span></li>`).join('')}</ul>`;
const chips = (items, size, h, padX, gap, extra = {}) => `<div class="chips" style="${px({ gap, ...extra })}">${items.map((t) => `<span class="chip" style="${px({ 'font-size': size, height: h, padding: `0 ${padX}px` })}">${t}</span>`).join('')}</div>`;
const priceChips = (rows) => rows.map(([a, p]) => `${a}<b>${p}</b>`);

export const BANNERS = [
  // ---------------------------------------------------------------- social: square posts
  { file: 'social/kalkulators-dark-1080x1080', w: 1080, h: 1080, theme: '', title: 'Kalkulators · ieraksts 1:1', margin: 60, body: `
${logo(60, 80, 80)}${urlTR(WEB, 22, 80, 97)}
${bars(380, 600, 'is-orange')}
${stack({ left: 80, top: 186, width: 920 }, `${T('p', 'kicker', 28, COPY.calc.kicker)}${T('h1', 'h', 78, COPY.calc.h, { 'margin-top': 12 })}${card(17, 640, { 'margin-top': 36 })}`)}
${row({ left: 80, bottom: 80, gap: 26 }, `${cta(COPY.calc.cta, 26, 72, 34)}${T('p', 'foot', 22, COPY.calc.note)}`)}` },
  { file: 'social/pakalpojumi-orange-1080x1080', w: 1080, h: 1080, theme: 'is-orange', title: 'Pakalpojumi · ieraksts 1:1', margin: 60, body: `
${logo(60, 80, 80, 'mono')}${urlTR(WEB + '/cenas', 22, 80, 97)}
${bars(480, 720)}
${stack({ left: 80, top: 186, width: 920 }, `${T('p', 'kicker', 28, COPY.svc.kicker)}${T('h1', 'h', 100, COPY.svc.h, { 'margin-top': 12 })}${T('p', 'sub', 30, COPY.svc.sub, { 'margin-top': 28, width: 600 })}<div style="margin-top:30px">${plist(COPY.svc.prices, 25, 12, 600)}</div>`)}
${row({ left: 80, bottom: 80, gap: 26 }, `${cta(COPY.svc.cta, 26, 72, 34)}${T('p', 'foot', 22, COPY.svc.note)}`)}` },
  { file: 'social/noma-dark-1080x1080', w: 1080, h: 1080, theme: 'is-darker', title: 'Noma · ieraksts 1:1', margin: 60, body: `
${logo(60, 80, 80)}${urlTR(WEB + '/noma', 22, 80, 97)}
${bars(520, 800, 'is-glass')}
${stack({ left: 80, top: 186, width: 920 }, `${T('p', 'kicker', 28, COPY.rent.kicker)}${T('h1', 'h', 72, COPY.rent.h, { 'margin-top': 12 })}${T('p', 'price', 200, COPY.rent.price, { 'margin-top': 30, color: 'var(--orange)', 'margin-left': -6 })}${T('p', 'sub', 28, COPY.rent.spec, { 'margin-top': 26 })}${chips(COPY.rent.extra, 22, 48, 20, 12, { 'margin-top': 20 })}`)}
${row({ left: 80, bottom: 80, gap: 26 }, `${cta(COPY.rent.cta, 26, 72, 34)}${T('p', 'foot mono', 22, COPY.rent.phone, { color: 'var(--white)' })}`)}` },
  // ---------------------------------------------------------------- social: 4:5 feed
  { file: 'social/kalkulators-foto-1080x1350', w: 1080, h: 1350, theme: '', title: 'Kalkulators · ieraksts 4:5 ar foto', margin: 60, body: `
<div class="photo" style="background-image:url('${PH('renovation.jpg')}');bottom:auto;height:1000px"></div>
<div class="shade" style="background:linear-gradient(180deg,rgba(0,0,0,.82) 0,rgba(0,0,0,.35) 15%,rgba(0,0,0,.2) 40%,rgba(0,0,0,.75) 58%,#000 72%)"></div>
${logo(60, 80, 80)}${urlTR(WEB, 22, 80, 97)}
${bars(250, 380, 'is-orange')}
${card(16.5, 580, { position: 'absolute', right: 80, top: 250 }, 'k')}
${stack({ left: 80, bottom: 80, width: 920 }, `${T('p', 'kicker', 28, COPY.calc.kicker)}${T('h1', 'h', 78, COPY.calc.h, { 'margin-top': 12 })}<div class="row" style="position:static;margin-top:40px;gap:26px">${cta(COPY.calc.cta, 26, 72, 34)}${T('p', 'foot', 22, COPY.calc.note)}</div>`)}` },
  { file: 'social/pakalpojumi-foto-1080x1350', w: 1080, h: 1350, theme: '', title: 'Pakalpojumi · ieraksts 4:5 ar foto', margin: 60, body: `
<div class="photo" style="background-image:url('${PH('house-timber.jpg')}');background-position:40% 50%"></div>
<div class="shade" style="background:linear-gradient(180deg,rgba(0,0,0,.8) 0,rgba(0,0,0,.25) 14%,rgba(0,0,0,0) 32%,rgba(0,0,0,.92) 58%,#000 100%)"></div>
${logo(60, 80, 80)}${urlTR(WEB + '/cenas', 22, 80, 97)}
${bars(190, 290, 'is-orange')}
${stack({ left: 80, bottom: 80, width: 920 }, `${T('p', 'kicker', 28, COPY.svc.kicker)}${T('h1', 'h', 96, COPY.svc.h, { 'margin-top': 12 })}${chips(priceChips(COPY.svc.prices), 22, 50, 20, 12, { 'margin-top': 28, width: 760 })}<div class="row" style="position:static;margin-top:40px;gap:26px">${cta(COPY.svc.cta, 26, 72, 34)}${T('p', 'foot', 22, COPY.svc.note)}</div>`)}` },
  // ---------------------------------------------------------------- social: stories 9:16 (top 250 px and bottom 340 px stay free of key content)
  { file: 'social/kalkulators-dark-1080x1920', w: 1080, h: 1920, theme: '', title: 'Kalkulators · stāsts 9:16', margin: 60, safe: [250, 340], body: `
${logo(64, 80, 250)}${urlTR(WEB, 24, 80, 268)}
${bars(520, 1000, 'is-orange')}
${stack({ left: 80, top: 380, width: 920 }, `${T('p', 'kicker', 30, COPY.calc.kicker)}${T('h1', 'h', 94, COPY.calc.h, { 'margin-top': 14 })}${T('p', 'sub', 34, COPY.calc.sub, { 'margin-top': 28, width: 860 })}${card(20, 780, { 'margin-top': 48 })}<div style="margin-top:56px">${cta(COPY.calc.cta, 32, 88, 44)}${T('p', 'foot', 26, COPY.calc.note, { 'margin-top': 18 })}</div>`)}` },
  { file: 'social/noma-orange-1080x1920', w: 1080, h: 1920, theme: 'is-orange', title: 'Noma · stāsts 9:16', margin: 60, safe: [250, 340], body: `
${logo(64, 80, 250, 'mono')}${urlTR(WEB + '/noma', 24, 80, 268)}
${bars(600, 1100)}
${stack({ left: 80, top: 380, width: 920 }, `${T('p', 'kicker', 30, COPY.rent.kicker)}${T('h1', 'h', 86, COPY.rent.h, { 'margin-top': 14 })}${T('p', 'price', 220, COPY.rent.price, { 'margin-top': 44, 'margin-left': -8 })}${T('p', 'sub', 34, COPY.rent.spec, { 'margin-top': 34 })}${chips(COPY.rent.extra, 28, 60, 26, 14, { 'margin-top': 28 })}<div style="margin-top:64px">${cta(COPY.rent.cta, 32, 88, 44)}${T('p', 'foot mono', 26, COPY.rent.phone, { 'margin-top': 18 })}</div>`)}` },
  // ---------------------------------------------------------------- social: link ads 1.91:1
  { file: 'social/kalkulators-dark-1200x628', w: 1200, h: 628, theme: '', title: 'Kalkulators · saites reklāma 1,91:1', margin: 40, body: `
${logo(44, 64, 56)}
${bars(400, 520, 'is-orange')}
${card(14.5, 470, { position: 'absolute', right: 64, top: 56 }, 'k')}
${stack({ left: 64, top: 146, width: 540 }, `${T('p', 'kicker', 21, COPY.calc.kicker)}${T('h1', 'h', 56, COPY.calc.h, { 'margin-top': 10 })}${T('p', 'sub', 20, COPY.calc.sub, { 'margin-top': 18, width: 500 })}`)}
${row({ left: 64, bottom: 56, gap: 22 }, `${cta(COPY.calc.cta, 21, 58, 28)}${T('p', 'foot', 17, COPY.calc.note + ' · ' + WEB)}`)}` },
  { file: 'social/pakalpojumi-foto-1200x628', w: 1200, h: 628, theme: '', title: 'Pakalpojumi · saites reklāma 1,91:1', margin: 40, body: `
<div class="photo" style="background-image:url('${PH('hero.jpg')}');left:400px;background-position:60% 40%"></div>
<div class="shade" style="background:linear-gradient(90deg,#000 0,#000 38%,rgba(0,0,0,.75) 50%,rgba(0,0,0,0) 74%)"></div>
${logo(44, 64, 56)}
${bars(210, 270, 'is-orange')}
${stack({ left: 64, top: 146, width: 600 }, `${T('p', 'kicker', 21, COPY.svc.kicker)}${T('h1', 'h', 62, COPY.svc.h, { 'margin-top': 10 })}${T('p', 'sub', 20, COPY.svc.sub, { 'margin-top': 16 })}${chips(priceChips(COPY.svc.prices.slice(0, 2)), 17, 40, 16, 10, { 'margin-top': 18 })}`)}
${row({ left: 64, bottom: 56, gap: 22 }, `${cta(COPY.svc.cta, 21, 58, 28)}${T('p', 'foot', 17, COPY.svc.note + ' · ' + WEB + '/cenas')}`)}` },
  // ---------------------------------------------------------------- Facebook page cover (phones show only the middle ~1110 × 624)
  { file: 'social/facebook-cover-1640x624', w: 1640, h: 624, theme: '', title: 'Facebook vāka attēls', margin: 60, safe: [0, 0, 300, 300], body: `
${bars(520, 624, 'is-orange')}
${stack({ left: 300, top: 140, width: 780 }, `<img class="logo" src="${LOGO.dark}" alt="ProBuild Group" style="height:64px;width:${(64 * AR).toFixed(1)}px">${T('h1', 'h', 58, 'No pamatiem līdz atslēgai', { 'margin-top': 40 })}${T('p', 'sub', 24, 'Būvniecība, remonts un tehnikas noma Salaspilī un apkārtnē', { 'margin-top': 18 })}${T('p', 'foot', 22, `<span class="mono" style="color:var(--white)">${COPY.rent.phone}</span>&nbsp;&nbsp;·&nbsp;&nbsp;${WEB}`, { 'margin-top': 18 })}`)}` },
  // ---------------------------------------------------------------- Google Display (calculator)
  { file: 'display/kalkulators-300x250', w: 300, h: 250, theme: '', title: 'Displejs 300×250', display: true, margin: 8, body: `
${logo(22, 16, 16)}
${bars(108, 160, 'is-orange')}
${stack({ left: 16, top: 54, width: 234 }, `${T('h1', 'h', 24, COPY.calc.h)}${T('p', 'sub', 12.5, '380+ darbu cenas. Aptuveno cenu redzēsiet uzreiz.', { 'margin-top': 10, width: 170 })}`)}
${row({ left: 16, bottom: 16 }, cta('Aprēķināt', 14, 38, 16))}` },
  { file: 'display/kalkulators-336x280', w: 336, h: 280, theme: '', title: 'Displejs 336×280', display: true, margin: 8, body: `
${logo(24, 18, 18)}
${bars(120, 176, 'is-orange')}
${stack({ left: 18, top: 60, width: 264 }, `${T('h1', 'h', 27, COPY.calc.h)}${T('p', 'sub', 13.5, '380+ darbu cenas. Aptuveno cenu redzēsiet uzreiz.', { 'margin-top': 12, width: 190 })}`)}
${row({ left: 18, bottom: 18 }, cta('Aprēķināt', 15, 40, 18))}` },
  { file: 'display/kalkulators-728x90', w: 728, h: 90, theme: '', title: 'Displejs 728×90', display: true, margin: 6, body: `
${mark(46, 18, 22)}
${bars(110, 90, 'is-orange')}
${stack({ left: 80, top: 17, width: 372 }, `${T('h1', 'h', 22, COPY.calc.h, { 'white-space': 'nowrap' })}${T('p', 'sub', 12.5, 'Cenu kalkulators · 380+ darbu cenas · bez saistībām', { 'margin-top': 6, 'white-space': 'nowrap' })}`)}
${row({ right: 136, top: 25 }, cta('Aprēķināt', 15, 40, 18))}` },
  { file: 'display/kalkulators-970x250', w: 970, h: 250, theme: '', title: 'Displejs 970×250', display: true, margin: 10, body: `
${logo(30, 32, 30)}
${bars(300, 250, 'is-orange')}
${stack({ left: 32, top: 86, width: 610 }, `${T('h1', 'h', 36, COPY.calc.h, { 'white-space': 'nowrap' })}${T('p', 'sub', 15, COPY.calc.sub, { 'margin-top': 12 })}`)}
${row({ left: 32, bottom: 28, gap: 18 }, `${cta(COPY.calc.cta, 16, 44, 22)}${T('p', 'foot', 13, COPY.calc.note + ' · ' + WEB)}`)}
<div class="card abs k" style="right:32px;top:30px;width:290px;padding:16px"><p class="card-m" style="font-size:12px">${EST.meta} · 4 darbi</p><div class="tot" style="margin-top:8px;padding:14px"><p class="tot-l" style="font-size:12px">Aptuvenās izmaksas</p><p class="tot-v" style="font-size:34px;margin:4px 0">${EST.total}</p><p class="tot-r" style="font-size:12px">Diapazons <b>${EST.range}</b></p></div></div>` },
  { file: 'display/kalkulators-160x600', w: 160, h: 600, theme: '', title: 'Displejs 160×600', display: true, margin: 6, body: `
${mark(48, 16, 20)}
${bars(150, 340, 'is-glass')}
${stack({ left: 16, top: 92, width: 128 }, `${T('p', 'kicker', 12, 'Cenu kalkulators')}${T('h1', 'h', 21, COPY.calc.h, { 'margin-top': 6 })}${T('p', 'sub', 12, '380+ darbu cenas. Aptuveno cenu redzēsiet uzreiz.', { 'margin-top': 12 })}${total(10.5, 128, { 'margin-top': 20 })}`)}
${row({ left: 16, bottom: 20 }, cta('Aprēķināt', 14, 38, 14))}` },
  { file: 'display/kalkulators-300x600', w: 300, h: 600, theme: '', title: 'Displejs 300×600', display: true, margin: 8, body: `
${logo(24, 22, 24)}
${bars(200, 340, 'is-glass')}
${stack({ left: 22, top: 74, width: 256 }, `${T('h1', 'h', 26, COPY.calc.h)}${card(10.5, 256, { 'margin-top': 16 })}`)}
${row({ left: 22, bottom: 22 }, cta(COPY.calc.cta, 15, 42, 18))}` },
  { file: 'display/kalkulators-320x100', w: 320, h: 100, theme: '', title: 'Displejs 320×100', display: true, margin: 6, body: `
${mark(30, 12, 35)}
${stack({ left: 52, top: 24, width: 148 }, `${T('h1', 'h', 15, COPY.calc.h)}${T('p', 'sub', 11, '380+ darbu cenas', { 'margin-top': 5 })}`)}
${row({ right: 10, top: 34 }, cta('Aprēķināt', 12, 32, 12))}` },
  { file: 'display/kalkulators-320x50', w: 320, h: 50, theme: '', title: 'Displejs 320×50', display: true, margin: 4, body: `
${mark(28, 10, 11)}
${stack({ left: 46, top: 10, width: 160 }, T('h1', 'h', 13, COPY.calc.h, { 'line-height': '1.1' }))}
${row({ right: 8, top: 10 }, cta('Aprēķināt', 12, 30, 12))}` },
  // ---------------------------------------------------------------- Google Display (rental)
  { file: 'display/noma-300x250', w: 300, h: 250, theme: 'is-orange', title: 'Displejs 300×250, noma', display: true, margin: 8, body: `
${logo(22, 16, 16, 'mono')}
${bars(96, 150)}
${stack({ left: 16, top: 52, width: 268 }, `${T('h1', 'h', 18.5, COPY.rent.h)}${T('p', 'price', 54, COPY.rent.price, { 'margin-top': 10, 'margin-left': -2 })}${T('p', 'sub', 11.5, 'NEW HOLLAND B115 · 4×4', { 'margin-top': 8 })}`)}
${row({ left: 16, bottom: 16 }, cta(COPY.rent.cta, 13.5, 36, 15))}` },
  { file: 'display/noma-728x90', w: 728, h: 90, theme: 'is-orange', title: 'Displejs 728×90, noma', display: true, margin: 6, body: `
${mark(46, 18, 22, 'markMono')}
${bars(72, 90)}
${stack({ left: 80, top: 20, width: 256 }, `${T('h1', 'h', 18, 'Ekskavators-iekrāvējs', { 'white-space': 'nowrap' })}${T('p', 'sub', 12.5, 'ar operatoru · NEW HOLLAND B115', { 'margin-top': 6, 'white-space': 'nowrap' })}`)}
${T('p', 'price abs k', 34, COPY.rent.price, { left: 352, top: 28 })}
${row({ right: 84, top: 25 }, cta('Pieprasīt', 15, 40, 18))}` },
];

export function page(b) {
  return `<!doctype html>
<html lang="lv"><head><meta charset="utf-8"><title>${b.title} · ${b.w}×${b.h}</title>
<link rel="stylesheet" href="banners.css">
</head><body>
<div class="bn ${b.theme}" id="banner" style="width:${b.w}px;height:${b.h}px">${b.body}
</div>
</body></html>
`;
}

// Run in the page: key blocks (.k) must stay inside the banner (margin, story safe zones) and not overlap;
// headings must not overflow their box. Returns a list of problems.
export function layoutCheck({ margin = 8, safe = [0, 0, 0, 0] }) {
  const root = document.getElementById('banner').getBoundingClientRect();
  const [st, sb, sl, sr] = [0, 1, 2, 3].map((i) => Math.max(margin, safe[i] || 0));
  const ks = [...document.querySelectorAll('#banner .k')].map((e) => ({ e, r: e.getBoundingClientRect() }));
  const name = (e) => e.className.split(' ')[0] + (e.textContent.trim() ? ' "' + e.textContent.trim().slice(0, 24) + '"' : '');
  const out = [];
  for (const { e, r } of ks) {
    if (r.left < root.left + sl || r.top < root.top + st || r.right > root.right - sr || r.bottom > root.bottom - sb) {
      out.push(`${name(e)} outside the safe area (${Math.round(r.left)},${Math.round(r.top)} – ${Math.round(r.right)},${Math.round(r.bottom)})`);
    }
  }
  for (let i = 0; i < ks.length; i++) for (let j = i + 1; j < ks.length; j++) {
    const a = ks[i].r, b = ks[j].r;
    if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) out.push(`${name(ks[i].e)} overlaps ${name(ks[j].e)}`);
  }
  document.querySelectorAll('#banner .h, #banner .price, #banner .stack > *').forEach((e) => {
    if (e.scrollWidth > e.clientWidth + 1) out.push(`${name(e)} is wider than its box`);
    const p = e.closest('.stack');
    if (p && e.getBoundingClientRect().right > p.getBoundingClientRect().right + 1) out.push(`${name(e)} runs past its stack`);
  });
  return out;
}
