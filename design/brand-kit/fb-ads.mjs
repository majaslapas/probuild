// Facebook / Instagram ad banners for ProBuild Group (3 November 2026). One concept per service, per calculator angle, per
// rental item, and for projects, experience, reviews and contact; each in 1:1 and 4:5 (feeds) and 9:16 (stories and reels).
// All copy, prices and numbers are the published site's (probuild-group.webflow.io, checked 3 November 2026); the photos are
// the client's own (projects and machines). Text in 9:16 stays inside Meta's reels safe zone (top 270 px, bottom 672 px,
// sides 65 px). The calculator ads show how the calculator works, never amounts. Each concept also has its ad texts
// (primary text, headline, description, button) and a landing link with UTM tags, which the site's CRM script records.
import { LOGO, AR, PH, px, logo, bars, cta, stack, row, T, chips, plist, ui, r, CHECK, WEB } from './banners.mjs';

export const SIZES = [
  { key: 'kv', w: 1080, h: 1080, label: '1:1', margin: 60 },
  { key: 've', w: 1080, h: 1350, label: '4:5', margin: 60 },
  { key: 'st', w: 1080, h: 1920, label: '9:16', margin: 65, safe: [270, 672, 65, 65] },
];
const SITE = 'https://' + WEB;
const utm = (path, campaign, content) => `${SITE}${path}${path.includes('?') ? '&' : '?'}utm_source=facebook&utm_medium=paid_social&utm_campaign=${campaign}&utm_content=${content}`;

// ------------------------------------------------------------------ type scale per size
// A 1080 px ad shows about 390 px wide on a phone (×0.36), so nothing that must be read is under 26 px.
const S = {
  kv: { m: 72, logo: [56, 72, 64], kick: 32, h: 76, hMin: 50, lines: 2, sub: 32, price: 68, big: 140, note: 26, chip: [27, 56, 22, 12], cta: [32, 84, 40], bars: [190, 290], gap: 22, photoH: 760 },
  ve: { m: 72, logo: [56, 72, 64], kick: 33, h: 80, hMin: 52, lines: 2, sub: 33, price: 72, big: 160, note: 27, chip: [28, 58, 22, 12], cta: [33, 86, 42], bars: [210, 330], gap: 24, photoH: 960 },
  st: { m: 80, logo: [62, 80, 296], kick: 36, h: 90, hMin: 56, lines: 2, sub: 36, price: 80, big: 180, note: 29, chip: [30, 62, 24, 12], cta: [36, 96, 46], bars: [300, 480], gap: 28, photoH: 1160 },
};
const bottomOf = (z) => (z.key === 'st' ? 700 : S[z.key].m); // distance of a bottom-anchored stack from the bottom edge
// Martian Mono at the price tracking is about 0.67 em per character: big prices shrink to fit the column
const priceSize = (text, max, width) => Math.min(max, Math.floor(width / (text.length * 0.68)));
const fit = (size, text, lines, min, extra = {}) => `<h1 class="h fit" data-lines="${lines}" data-min="${min}" style="${px({ 'font-size': size, ...extra })}">${text}</h1>`;
const inRow = (inner, extra = {}) => `<div class="in-row" style="${px(extra)}">${inner}</div>`;
const photo = (f, pos, extra = {}) => `<div class="photo" style="${px({ 'background-image': `url('${PH(f)}')`, 'background-position': pos, ...extra })}"></div>`;
const shade = (g) => `<div class="shade" style="background:${g}"></div>`;
const posOf = (ad, key) => (ad.pos && (ad.pos[key] || ad.pos.all)) || '50% 50%';
// zoom: background width in % of the ad (for photos whose subject sits low in the frame); photoBy: another photo for one size
const zoomOf = (ad, key) => (ad.zoom && (ad.zoom[key] || ad.zoom.all)) ? (ad.zoom[key] || ad.zoom.all) + '%' : 'cover';
const photoOf = (ad, key) => (ad.photoBy && ad.photoBy[key]) || ad.photo;
const SHADE = {
  kv: 'linear-gradient(180deg,rgba(0,0,0,.55) 0,rgba(0,0,0,0) 15%,rgba(0,0,0,0) 26%,rgba(0,0,0,.88) 44%,#000 62%)',
  ve: 'linear-gradient(180deg,rgba(0,0,0,.55) 0,rgba(0,0,0,0) 12%,rgba(0,0,0,0) 30%,rgba(0,0,0,.88) 46%,#000 64%)',
  st: 'linear-gradient(180deg,rgba(0,0,0,.6) 0,rgba(0,0,0,.1) 19%,rgba(0,0,0,0) 22%,rgba(0,0,0,.88) 35%,#000 52%)',
};
const kicker = (z, text, extra = {}) => T('p', 'kicker', S[z.key].kick, text, extra);
const button = (z, text, extra = {}) => `<div style="${px({ 'margin-top': S[z.key].gap + 10, ...extra })}">${cta(text, ...S[z.key].cta)}</div>`;

// ------------------------------------------------------------------ layouts
// Photo across the whole ad, darkened under the text; text bottom-left. Used by services, rental, projects and contact.
function photoAd(ad, z) {
  const s = S[z.key], tall = z.key !== 'kv';
  const sub = ad.sub && (ad.subAlways || (tall && !ad.list)) ? T('p', 'sub', s.sub, ad.sub, { 'margin-top': 16, 'max-width': 900 }) : '';
  const W = z.w - 2 * s.m - 60;
  const price = ad.price ? inRow(`${T('p', 'price', ad.bigPrice ? priceSize(ad.price, s.big, W) : s.price, ad.price, { color: 'var(--orange)', 'margin-left': ad.bigPrice ? -6 : 0 })}${ad.note ? T('p', 'note', s.note, ad.note) : ''}`, { gap: '6px 20px', 'margin-top': s.gap, 'align-items': ad.bigPrice ? 'flex-end' : 'baseline' }) : '';
  const spec = ad.spec ? T('p', 'sub', s.sub, ad.spec, { 'margin-top': ad.bigPrice ? 14 : 12 }) : '';
  const facts = ad.chips && (z.key === 've' || ad.chipsAlways) ? chips(ad.chips, ...s.chip, { 'margin-top': s.gap, 'max-width': 900 }) : '';
  const list = ad.list ? `<div style="margin-top:${s.gap}px">${plist(ad.list, z.key === 'st' ? 28 : s.sub, z.key === 'st' ? 13 : 12, z.key === 'st' ? 860 : 780)}</div>` : '';
  const phone = ad.phone ? inRow(`${T('p', 'price', s.price * 0.8, ad.phone, { color: 'var(--white)' })}${ad.phoneNote ? T('p', 'note', s.note, ad.phoneNote) : ''}`, { gap: '6px 20px', 'margin-top': s.gap, 'align-items': 'baseline' }) : '';
  return `
${photo(photoOf(ad, z.key), posOf(ad, z.key), { bottom: 'auto', height: s.photoH, 'background-size': zoomOf(ad, z.key) })}${shade(SHADE[z.key])}
${logo(...s.logo)}
${bars(...s.bars, 'is-orange')}
${stack({ left: s.m, bottom: bottomOf(z), width: W }, `${kicker(z, ad.kicker)}${fit(s.h, ad.h, ad.lines || s.lines, s.hMin, { 'margin-top': 12 })}${sub}${price}${spec}${list}${facts}${phone}${button(z, ad.cta)}`, 'on-photo')}`;
}

// Orange field with the brand bars, for services without a fitting photo of the client's own work.
function graphicAd(ad, z) {
  const s = S[z.key];
  return `
${logo(s.logo[0], s.logo[1], s.logo[2], 'mono')}
${bars(z.key === 'st' ? 620 : 520, z.key === 'kv' ? 760 : z.key === 've' ? 900 : 1200)}
${stack({ left: s.m, bottom: bottomOf(z), width: z.w - 2 * s.m - 80 }, `${kicker(z, ad.kicker)}${fit(z.key === 'st' ? s.h : s.h * 1.18, ad.h, z.key === 've' ? 3 : 2, s.hMin, { 'margin-top': 14 })}${T('p', 'sub', s.sub, ad.sub, { 'margin-top': 20, 'max-width': 760 })}${T('p', 'price', priceSize(ad.price, s.big * (z.key === 'st' ? 0.62 : 0.78), z.w - 2 * s.m - 80), ad.price, { 'margin-top': s.gap + 8, 'margin-left': -4 })}${T('p', 'note', s.note, ad.note, { 'margin-top': 10 })}${chips(ad.chips, ...s.chip, { 'margin-top': s.gap, 'max-width': 820 })}${button(z, ad.cta)}`)}`;
}

// Two photos side by side, "Pirms" and "Pēc", text underneath.
function splitAd(ad, z) {
  const s = S[z.key], ph = { kv: 500, ve: 760, st: 640 }[z.key], half = z.w / 2;
  const tag = (t, x) => `<span class="tag is-dark k" style="${px({ left: x + s.m, top: ph - 84, height: 56, padding: '0 24px', 'font-size': 28 })}">${t}</span>`;
  return `
<div class="tile is-flat" style="${px({ left: 0, top: 0, width: half - 3, height: ph, 'z-index': '-3', 'background-image': `url('${PH(ad.before)}')`, 'background-position': ad.posBefore || '50% 50%' })}"></div>
<div class="tile is-flat" style="${px({ left: half + 3, top: 0, width: half - 3, height: ph, 'z-index': '-3', 'background-image': `url('${PH(ad.after)}')`, 'background-position': ad.posAfter || '50% 50%' })}"></div>
${shade(`linear-gradient(180deg,rgba(0,0,0,.6) 0,rgba(0,0,0,0) ${z.key === 'st' ? 22 : 18}%,rgba(0,0,0,0) ${Math.round(ph / z.h * 100) - 14}%,#000 ${Math.round(ph / z.h * 100) + 2}%)`)}
${logo(...s.logo)}
${tag('Pirms', 0)}${tag('Pēc', half + 3)}
${bars(...s.bars, 'is-orange')}
${stack({ left: s.m, bottom: bottomOf(z), width: z.w - 2 * s.m - 60 }, `${kicker(z, ad.kicker)}${fit(s.h, ad.h, 2, s.hMin, { 'margin-top': 12 })}${ad.price ? inRow(`${T('p', 'price', s.price, ad.price, { color: 'var(--orange)' })}${T('p', 'note', s.note, ad.note)}`, { gap: '6px 20px', 'margin-top': s.gap, 'align-items': 'baseline' }) : ''}${T('p', 'sub', s.sub, ad.sub, { 'margin-top': 14 })}${button(z, ad.cta)}`)}`;
}

// Three photos of one project in order (foundations, roof, finished house), text underneath.
function sequenceAd(ad, z) {
  const s = S[z.key], top = z.key === 'st' ? 380 : 150, th = { kv: 400, ve: 560, st: 340 }[z.key];
  const gap = 18, tw = (z.w - 2 * s.m - 2 * gap) / 3;
  const tiles = ad.pics.map(([f, label, pos], i) => `<div class="tile k" style="${px({ left: s.m + i * (tw + gap), top, width: tw, height: th, 'background-image': `url('${PH(f)}')`, 'background-position': pos || '50% 50%' })}"><span class="tag is-dark" style="${px({ left: 14, bottom: 14, height: 50, padding: '0 20px', 'font-size': 26 })}">${label}</span></div>`).join('');
  return `
${logo(...s.logo)}
${tiles}
${bars(...s.bars, 'is-orange')}
${stack({ left: s.m, bottom: bottomOf(z), width: z.w - 2 * s.m - 60 }, `${kicker(z, ad.kicker)}${fit(s.h, ad.h, 2, s.hMin, { 'margin-top': 12 })}${z.key === 've' ? T('p', 'sub', s.sub, ad.sub, { 'margin-top': 16, 'max-width': 900 }) : ''}${chips(ad.chips, ...s.chip, { 'margin-top': s.gap })}${button(z, ad.cta)}`)}`;
}

// Experience in numbers over a photo of a finished house.
function statsAd(ad, z) {
  const s = S[z.key], cols = z.key === 'kv' ? 4 : 2;
  const grid = `<div class="stats" style="${px({ 'grid-template-columns': `repeat(${cols},minmax(0,1fr))`, gap: z.key === 'kv' ? '0 26px' : '28px 40px', 'margin-top': s.gap + 6, width: z.w - 2 * s.m - 40 })}">${ad.stats.map(([n, l]) => `<div><b style="font-size:${z.key === 'kv' ? 76 : z.key === 've' ? 100 : 112}px">${n}</b><span style="font-size:${z.key === 'kv' ? 26 : s.sub - 3}px">${l}</span></div>`).join('')}</div>`;
  return `
${photo(photoOf(ad, z.key), posOf(ad, z.key), { bottom: 'auto', height: s.photoH, 'background-size': zoomOf(ad, z.key) })}${shade(SHADE[z.key])}
${logo(...s.logo)}
${bars(...s.bars, 'is-orange')}
${stack({ left: s.m, bottom: bottomOf(z), width: z.w - 2 * s.m - 40 }, `${kicker(z, ad.kicker)}${fit(s.h, ad.h, 2, s.hMin, { 'margin-top': 12 })}${grid}${button(z, ad.cta)}`, 'on-photo')}`;
}

// The Google rating and a review quote as published on the site.
function reviewAd(ad, z) {
  const s = S[z.key], top = z.key === 'st' ? 420 : z.key === 've' ? 230 : 180;
  return `
${logo(...s.logo)}
${bars(z.key === 'st' ? 560 : 460, z.key === 'kv' ? 640 : z.key === 've' ? 800 : 1100, 'is-subtle')}
${stack({ left: s.m, top, bottom: bottomOf(z), width: z.w - 2 * s.m - 40, 'justify-content': 'center' }, `${inRow(`${T('p', 'big', z.key === 'kv' ? 150 : 180, ad.rating, { color: 'var(--orange)' })}<div>${T('p', 'stars', z.key === 'kv' ? 44 : 52, '★★★★★')}${T('p', 'sub', s.sub, ad.ratingNote, { 'margin-top': 10 })}</div>`, { gap: '10px 32px', 'align-items': 'center' })}${T('p', 'quote', z.key === 'kv' ? 52 : z.key === 've' ? 58 : 62, ad.quote, { 'margin-top': z.key === 'kv' ? 44 : 64, 'max-width': 900 })}${T('p', 'note', s.note + 2, ad.who, { 'margin-top': 18 })}${button(z, ad.cta, { 'margin-top': z.key === 'kv' ? 48 : 64 })}`)}`;
}

// The calculator, drawn as the visitor uses it; no amounts.
const projectCard = (sz, w, rows) => `<div class="card" style="${px({ width: w, padding: r(sz * 1.3) })}">
  <div class="card-h" style="margin-bottom:${r(sz * .7)}px"><span class="card-t" style="font-size:${r(sz * 1.3)}px">Jūsu aprēķins</span><span class="card-m" style="font-size:${r(sz * .85)}px">${rows.length} darbi</span></div>
  ${rows.map(([name, where, unit]) => `<div class="work" style="font-size:${sz}px;gap:${r(sz * .7)}px;padding:${r(sz * .55)}px ${r(sz * .7)}px;margin-top:${r(sz * .45)}px"><i class="box" style="width:${r(sz * 1.15)}px;height:${r(sz * 1.15)}px;background:var(--orange);border-color:var(--orange)">${CHECK}</i><b>${name}<em style="font-size:${r(sz * .78)}px">${where}</em></b><span class="qty" style="font-size:${r(sz * .8)}px;height:${r(sz * 1.75)}px;padding:0 ${r(sz * .6)}px"><i></i>${unit}</span></div>`).join('\n  ')}
  <div class="res" style="margin-top:${r(sz * .9)}px;padding:${r(sz * .85)}px ${r(sz)}px"><span class="res-l" style="font-size:${r(sz * .85)}px">Aptuvenā kopsumma</span><span class="res-v" style="font-size:${r(sz * 1.3)}px">redzama uzreiz</span></div>
</div>`;
const steps = (sz, items) => `<ul class="steps" style="gap:${r(sz * 1.05)}px">${items.map(([n, a, b]) => `<li style="gap:${r(sz * .9)}px"><span class="n" style="font-size:${r(sz * 1.6)}px">${n}</span><span><b style="font-size:${sz}px">${a}</b><small style="font-size:${r(sz * .8)}px;margin-top:4px">${b}</small></span></li>`).join('')}</ul>`;
function calcAd(ad, z) {
  const s = S[z.key], story = z.key === 'st', top = story ? 384 : z.key === 've' ? 196 : 164;
  const W = z.w - 2 * s.m;
  let visual = '';
  if (ad.visual === 'ui') visual = ui(z.key === 'kv' ? 19 : z.key === 've' ? 23 : 20, z.key === 'kv' ? 740 : 880, { extra: { 'margin-top': s.gap + 8 } });
  if (ad.visual === 'project') visual = `<div style="margin-top:${s.gap + 8}px">${projectCard(z.key === 'kv' ? 19 : z.key === 've' ? 23 : 21, z.key === 'kv' ? 740 : 880, ad.rows)}</div>`;
  if (ad.visual === 'count') visual = `${inRow(`${T('p', 'big', z.key === 'kv' ? 190 : z.key === 've' ? 230 : 210, '380+', { color: 'var(--orange)', 'margin-left': -8 })}${T('p', 'sub', s.sub + 4, 'darbu cenas<br>5 jomās', { 'line-height': '1.25' })}`, { gap: '10px 28px', 'margin-top': s.gap + 12, 'align-items': 'flex-end' })}${chips(ad.areas, ...s.chip, { 'margin-top': s.gap + 8, 'max-width': 900 })}`;
  if (ad.visual === 'steps') visual = `<div style="margin-top:${s.gap + 14}px">${steps(z.key === 'kv' ? 28 : z.key === 've' ? 32 : 31, ad.steps)}</div>`;
  const sub = ad.sub && (z.key === 've' || ad.subAlways) ? T('p', 'sub', s.sub, ad.sub, { 'margin-top': 16, 'max-width': 880 }) : '';
  return `
${logo(...s.logo)}
${bars(story ? 330 : 230, story ? 520 : z.key === 'kv' ? 360 : 420, 'is-orange')}
${stack({ left: s.m, top, width: W }, `${story ? '' : kicker(z, ad.kicker)}${fit(s.h, ad.h, 2, s.hMin, { 'margin-top': story ? 0 : 12 })}${sub}${visual}${story ? inRow(`${cta(ad.cta, ...s.cta)}${ad.note ? T('p', 'note', s.note, ad.note) : ''}`, { gap: '12px 24px', 'margin-top': s.gap + 12 }) : ''}`)}
${story ? '' : row({ left: s.m, bottom: bottomOf(z), gap: 22 }, `${cta(ad.cta, ...s.cta)}${ad.note ? T('p', 'note', s.note, ad.note) : ''}`)}`;
}

// A tool photographed on white (the plasterboard lift): white panel with the product, text on orange.
function productAd(ad, z) {
  const s = S[z.key];
  const side = z.key !== 've'; // 1:1 and 9:16: product panel right of the name
  const panel = z.key === 'kv' ? { left: 600, top: 150, width: 408, height: 470 } : z.key === 've' ? { left: 72, top: 150, width: 936, height: 500 } : { left: 580, top: 384, width: 420, height: 520 };
  const textTop = side ? null : panel.top + panel.height + 44;
  const head = `${kicker(z, ad.kicker)}${fit(s.h, ad.h, 2, s.hMin, { 'margin-top': 12 })}${T('p', 'sub', s.sub, ad.sub, { 'margin-top': 14 })}`;
  const priceBlock = `${T('p', 'price', priceSize(ad.price, s.big * 0.72, z.key === 'kv' ? 900 : z.w - 2 * s.m - 40), ad.price, { 'margin-left': -4 })}${T('p', 'note', s.note, ad.note, { 'margin-top': 10 })}`;
  return `
${logo(s.logo[0], s.logo[1], s.logo[2], 'mono')}
${bars(z.key === 'st' ? 520 : 420, z.key === 'kv' ? 620 : 820)}
<div class="panel k" style="${px({ ...panel, padding: 28 })}"><img src="${PH(ad.photo)}" alt="${ad.h}"></div>
${side
    ? `${stack({ left: s.m, top: z.key === 'kv' ? 170 : 404, width: panel.left - s.m - 40 }, head)}${stack({ left: s.m, bottom: bottomOf(z), width: 900 }, `${priceBlock}${button(z, ad.cta)}`)}`
    : stack({ left: s.m, top: textTop, width: z.w - 2 * s.m - 40 }, `${head}<div style="margin-top:${s.gap}px">${priceBlock}</div>${button(z, ad.cta)}`)}`;
}
const LAYOUT = { photo: photoAd, graphic: graphicAd, split: splitAd, sequence: sequenceAd, stats: statsAd, review: reviewAd, calc: calcAd, product: productAd };

// ------------------------------------------------------------------ concepts (copy and numbers from the site, 3 November 2026)
const svcCta = 'Skatīt cenas';
const SVC = (o) => ({ group: 'pakalpojumi', layout: o.photo ? 'photo' : 'graphic', cta: svcCta, url: `/pakalpojums/${o.slug}`, desc: 'Precīzu cenu saskaņojam pēc objekta apskates', button: 'Uzzināt vairāk (Learn more)', ...o });
export const CONCEPTS = [
  // ---------------------------------------------------------------- services (Pakalpojumi: name, "cena no", description, "Cenā iekļauts")
  SVC({ slug: 'pamatu-buvnieciba', kicker: 'Pamatu būvniecība', h: 'Stabils un drošs pamats gadiem ilgi', price: 'no 150 €/m²', note: 'Orientējošā cena bez PVN',
    chips: ['Zemes darbi', 'Veidņi, armatūra, betons', 'Hidroizolācija un siltināšana'], photo: 'objekti/jaunbuve-doles-sala-04.jpg', pos: { all: '50% 60%' },
    text: 'Izbūvējam pamatus privātmājām, komerciālām ēkām un citiem objektiem. Darbu sākam ar plānošanu un tehnisko risinājumu izvērtēšanu. Cena no 150 €/m², bez PVN.', headline: 'Pamatu būvniecība no 150 €/m²' }),
  SVC({ slug: 'jumta-darbi', kicker: 'Jumta darbi', h: 'Jauni jumti un esošo jumtu remonts', price: 'no 110 €/m²', note: 'Orientējošā cena bez PVN',
    chips: ['Nesošās konstrukcijas', 'Spāres un latojums', 'Jumta segums'], photo: 'objekti/jumts-tukuma-16.jpg', zoom: { kv: 170 }, pos: { kv: '60% 100%', ve: '50% 100%', st: '50% 100%' }, photoBy: { ve: 'objekti/jumts-tukuma-20.jpg', st: 'objekti/jumts-tukuma-20.jpg' },
    text: 'Izbūvējam jaunus jumtus un remontējam esošos: konstrukcijas, spāres un latojums, segums, siltināšana, hidroizolācija un noteksistēmas. Cena no 110 €/m², bez PVN.', headline: 'Jumta darbi no 110 €/m²' }),
  SVC({ slug: 'fasades-darbi', kicker: 'Fasādes darbi', h: 'Siltinām, apdarām un renovējam fasādes', price: 'no 45 €/m²', note: 'Bez PVN, materiāli nav iekļauti',
    chips: ['Siltumizolācija', 'Armējošais slānis', 'Dekoratīvais apmetums'], photo: 'objekti/fasade-vidrizi-19.jpg', pos: { all: '40% 40%', st: '36% 40%' },
    text: 'Siltinām, apdarām un renovējam fasādes privātmājām, daudzdzīvokļu ēkām un komerciāliem objektiem. Cena no 45 €/m², bez PVN, materiāli nav iekļauti.', headline: 'Fasādes darbi no 45 €/m²' }),
  SVC({ slug: 'inzeniertiklu-un-komunikaciju-izbuve', kicker: 'Inženiertīklu un komunikāciju izbūve', h: 'Ūdens, kanalizācija, apkure, elektrība, ventilācija', price: 'no 120 €/m²', note: 'Orientējošā cena bez PVN',
    chips: ['Ūdensapgāde un kanalizācija', 'Apkure', 'Elektroinstalācija'], photo: 'objekti/jaunbuve-doles-sala-18.jpg', pos: { all: '62% 50%' },
    text: 'Ierīkojam ūdensapgādi un kanalizāciju, apkures sistēmas, elektroinstalāciju, ventilāciju un ārējās komunikācijas. Strādājam pēc projekta. Cena no 120 €/m², bez PVN.', headline: 'Inženiertīkli no 120 €/m²' }),
  SVC({ slug: 'eku-renovacija-un-rekonstrukcija', layout: 'split', kicker: 'Ēku renovācija un rekonstrukcija', h: 'Atjaunojam un pārbūvējam ēkas', price: 'no 450 €/m²', note: 'Orientējošā cena bez PVN',
    sub: 'Saimniecības ēka Vidrižos: jauns jumts un piebūve', before: 'objekti/saimniecibas-eka-vidrizi-14.jpg', after: 'objekti/saimniecibas-eka-vidrizi-01.jpg', posBefore: '62% 50%', posAfter: '40% 50%',
    text: 'Atjaunojam, modernizējam un pārbūvējam ēkas: fasādes un jumti, siltināšana, iekštelpu pārbūve un konstrukciju remonts. Cena no 450 €/m², bez PVN.', headline: 'Renovācija no 450 €/m²' }),
  SVC({ slug: 'remonta-un-apdares-darbi', kicker: 'Remonta un apdares darbi', h: 'Remontējam dzīvokļus, mājas un komerctelpas', price: 'no 280 €/m²', note: 'Orientējošā cena bez PVN',
    chips: ['Špaktelēšana un krāsošana', 'Flīzēšana', 'Grīdas segumi'], photo: 'objekti/garkalnu-pirts-03.jpg', pos: { all: '45% 50%', st: '42% 50%' },
    text: 'Remontējam dzīvokļus, privātmājas un komerctelpas: špaktelēšana un krāsošana, flīzēšana, grīdas segumi, reģipša konstrukcijas, vannas istabas un virtuves. Cena no 280 €/m², bez PVN.', headline: 'Remonts un apdare no 280 €/m²' }),
  SVC({ slug: 'demontaza-un-konstrukciju-nojauksana', kicker: 'Demontāža un konstrukciju nojaukšana', h: 'Nojaucam pirms remonta vai renovācijas', price: 'no 10 €/m²', note: 'Orientējošā cena bez PVN',
    chips: ['Starpsienas', 'Grīdas, flīzes, griesti', 'Durvis un logi'], photo: 'objekti/jumts-tukuma-10.jpg', pos: { all: '42% 40%' },
    text: 'Nojaucam starpsienas, noņemam grīdas segumus, flīzes, griestus, durvis, logus un veco apdari pirms remonta vai renovācijas. Cena no 10 €/m², bez PVN.', headline: 'Demontāža no 10 €/m²' }),
  SVC({ slug: 'kokapstrade', kicker: 'Kokapstrāde', h: 'Koka detaļas un izstrādājumi pēc pasūtījuma', price: 'no 30 €/h', note: 'Bez PVN, materiāli atsevišķi',
    chips: ['Zāģēšana', 'Ēvelēšana', 'Frēzēšana'], photo: 'objekti/garkalnu-pirts-02.jpg', pos: { all: '50% 48%' },
    text: 'Izgatavojam koka detaļas un izstrādājumus pēc pasūtījuma: zāģēšana, ēvelēšana, frēzēšana un virsmas apstrāde. Cena no 30 €/h, bez PVN, materiāli atsevišķi.', headline: 'Kokapstrāde no 30 €/h' }),
  SVC({ slug: 'metalapstrade', kicker: 'Metālapstrāde', h: 'Žogi, vārti, kāpnes un margas', sub: 'Metāla detaļas un konstrukcijas pēc izmēriem, skicēm vai rasējumiem.', price: 'no 35 €/h', note: 'Bez PVN, materiāli atsevišķi',
    chips: ['Griešana', 'Metināšana', 'Montāža'],
    text: 'Izgatavojam metāla detaļas un konstrukcijas pēc izmēriem, skicēm vai rasējumiem, arī žogus, vārtus, kāpnes un margas. Cena no 35 €/h, bez PVN, materiāli atsevišķi.', headline: 'Metālapstrāde no 35 €/h' }),
  SVC({ slug: 'eku-apsaimniekosana-un-uzturesana', kicker: 'Ēku apsaimniekošana un uzturēšana', h: 'Problēmas pamanām laikus', price: 'no 100 €/mēn.', note: 'Orientējošā cena',
    chips: ['Tehniskās pārbaudes', 'Inženiersistēmu apkope', 'Nelieli remonti'], photo: 'objekti/jumts-tukuma-22.jpg', zoom: { kv: 130, ve: 140 }, pos: { kv: '55% 75%', ve: '55% 80%', st: '40% 50%' },
    text: 'Regulāras tehniskā stāvokļa pārbaudes, inženiersistēmu apkope, nelieli remonti un jumtu, fasāžu un konstrukciju uzturēšana. Mēneša maksa no 100 €.', headline: 'Ēku uzturēšana no 100 €/mēn.', desc: 'Maksa atkarīga no mājas platības un apjoma' }),
  SVC({ slug: 'drenazas-un-melioracijas-darbi', kicker: 'Drenāžas un meliorācijas darbi', h: 'Pasargājam pamatus no liekā mitruma', price: 'no 25 €/m', note: 'Bez PVN, materiāli nav iekļauti',
    chips: ['Pamatu drenāža', 'Lietus ūdens novadīšana', 'Drenāžas akas'], photo: 'objekti/fasade-vidrizi-10.jpg', pos: { all: '45% 55%' },
    text: 'Izbūvējam pamatu drenāžu, lietus ūdens novadīšanas sistēmas, drenāžas akas un meliorācijas sistēmas. Cena no 25 €/m, bez PVN, materiāli nav iekļauti.', headline: 'Drenāža no 25 €/m' }),
  SVC({ slug: 'apzalumosana-un-labiekartosana', kicker: 'Apzaļumošana un labiekārtošana', h: 'Sakopta un viegli kopjama vide', price: 'no 5 €/m²', note: 'Orientējošā cena bez PVN',
    chips: ['Zālieni', 'Stādījumi un dobes', 'Bruģis un celiņi'], photo: 'objekti/fasade-vidrizi-18.jpg', pos: { all: '52% 70%' },
    text: 'Planējam teritoriju, ierīkojam zālienus, stādām kokus un krūmus, veidojam dobes, bruģējam un izbūvējam dārza celiņus. Cena no 5 €/m², bez PVN.', headline: 'Labiekārtošana no 5 €/m²' }),
  SVC({ slug: 'buvgruzu-izvesana-un-utilizacija', kicker: 'Būvgružu izvešana un utilizācija', h: 'Savācam, iekraujam un izvedam būvgružus', price: 'no 50 €', note: 'Par izbraukumu, bez PVN',
    chips: ['Pēc remonta un demontāžas', 'Šķirošana', 'Arī mēbeles un tehnika'], photo: 'objekti/saimniecibas-eka-vidrizi-15.jpg', zoom: { kv: 140, ve: 150 }, pos: { kv: '30% 100%', ve: '30% 100%', st: '30% 60%' },
    text: 'Savācam, iekraujam un izvedam būvgružus pēc remonta, demontāžas vai būvdarbiem, arī mēbeles un sadzīves tehniku. No 50 € par izbraukumu, bez PVN.', headline: 'Būvgružu izvešana no 50 €' }),
  SVC({ slug: 'koku-zagesana-un-apauguma-novaksana', kicker: 'Koku zāģēšana un apauguma novākšana', h: 'Attīrām aizaugušas teritorijas', sub: 'Zāģējam nevajadzīgus un bojātus kokus, izcērtam krūmus.', price: 'no 5 €/m²', note: 'Apauguma novākšana, bez PVN',
    chips: ['Krūmu izciršana', 'Apauguma novākšana', 'Sagatavošana būvniecībai'],
    text: 'Zāģējam nevajadzīgus un bojātus kokus, izcērtam krūmus un attīrām aizaugušas teritorijas, arī pirms būvniecības. Apauguma novākšana no 5 €/m², bez PVN.', headline: 'Apauguma novākšana no 5 €/m²' }),

  // ---------------------------------------------------------------- calculator angles (Kalkulators and Pakalpojumi pages)
  { group: 'kalkulators', slug: 'cena-uzreiz', layout: 'calc', visual: 'ui', kicker: 'Cenu kalkulators · 380+ darbu cenas', h: 'Cik maksās jūsu projekts?', sub: 'Atzīmējiet darbus un ierakstiet apjomu: aptuveno cenu redzēsiet uzreiz.', cta: 'Aprēķināt izmaksas', note: 'Bez saistībām',
    url: '/kalkulators', text: 'Atzīmējiet vajadzīgos darbus un ierakstiet apjomu: aptuveno cenu redzēsiet uzreiz. 380+ darbu cenas, bez saistībām.', headline: 'Aprēķiniet darbu izmaksas', desc: 'Precīzu cenu sagatavosim pēc objekta apskates', button: 'Uzzināt vairāk (Learn more)' },
  { group: 'kalkulators', slug: 'viss-projekts', layout: 'calc', visual: 'project', kicker: 'Cenu kalkulators', h: 'Viss projekts vienā aprēķinā', sub: 'Atzīmējiet visus vajadzīgos darbus, un aptuveno kopsummu redzēsiet uzreiz.', cta: 'Aprēķināt visu projektu', note: 'Bez saistībām',
    rows: [['Zemes darbi', 'Būvniecība · Pamati', 'm³'], ['Valcprofila montāža', 'Būvniecība · Jumts', 'm²'], ['Dekoratīvais apmetums', 'Būvniecība · Fasāde', 'm²'], ['Sienu flīzēšana', 'Remontdarbi · Sienas', 'm²']],
    url: '/kalkulators', text: 'Pamati, jumts, fasāde un apdare vienā aprēķinā. Atzīmējiet darbus kalkulatorā, nosūtiet aprēķinu, un pēc objekta apskates sagatavosim precīzu tāmi.', headline: 'Viss projekts vienā aprēķinā', desc: 'Bez saistībām, apmaksa lapā nav jāveic', button: 'Uzzināt vairāk (Learn more)' },
  { group: 'kalkulators', slug: 'skaidras-cenas', layout: 'calc', visual: 'count', kicker: 'Cenu kalkulators', h: 'Skaidras cenas pirms darbiem', sub: 'Orientējošās cenas redzat jau kalkulatorā, galīgo saskaņojam pirms darbiem.', subAlways: true, cta: 'Atvērt kalkulatoru', note: 'Bez saistībām',
    areas: ['Būvniecība', 'Remontdarbi', 'Metālapstrāde', 'Kokapstrāde', 'Apsaimniekošana'],
    url: '/kalkulators', text: 'Orientējošās cenas redzat jau kalkulatorā, galīgo cenu saskaņojam pirms darbiem. 380+ darbu cenas: būvniecība, remontdarbi, metālapstrāde, kokapstrāde un apsaimniekošana.', headline: '380+ darbu cenas vienuviet', desc: 'Bez saistībām, apmaksa lapā nav jāveic', button: 'Uzzināt vairāk (Learn more)' },
  { group: 'kalkulators', slug: 'no-aprekina-lidz-piedavajumam', layout: 'calc', visual: 'steps', kicker: 'Kas notiek pēc aprēķina', h: 'No aprēķina līdz precīzam piedāvājumam', cta: 'Aprēķināt izmaksas', note: 'Bez saistībām',
    steps: [['01', 'Nosūtāt aprēķinu', 'Redzam darbus un apjomus, kas jums vajadzīgi'], ['02', 'Sazināmies tuvākajā darba dienā', 'Precizējam apjomus un laiku apskatei'], ['03', 'Apskatām objektu', 'Novērtējam piekļuvi un esošo stāvokli'], ['04', 'Precīzs cenas piedāvājums', 'Ar darbiem, materiāliem un PVN']],
    url: '/kalkulators', text: 'Nosūtiet aprēķinu no kalkulatora, un sazināsimies tuvākajā darba dienā. Pēc objekta apskates saņemsiet precīzu cenas piedāvājumu ar darbiem, materiāliem un PVN.', headline: 'Precīzs piedāvājums pēc apskates', desc: 'Darbus sākam, kad cena ir saskaņota', button: 'Uzzināt vairāk (Learn more)' },

  // ---------------------------------------------------------------- rental (Noma and the product pages)
  { group: 'noma', slug: 'ekskavators-iekravejs', layout: 'photo', kicker: 'Tehnikas noma Vidzemē', h: 'Ekskavators-iekrāvējs ar operatoru', price: '55 €/h', bigPrice: true, spec: 'NEW HOLLAND B115-4PS · 82 kW · 4×4', chips: ['Rakšana un tranšejas', 'Zemes pārvietošana', 'Iekraušana'],
    photo: 'tehnika/ekskavators-iekravejs-03.jpg', pos: { all: '62% 50%', st: '70% 50%' }, cta: 'Pieprasīt nomu',
    url: '/nomas-produkts/ekskavators-iekravejs', text: 'NEW HOLLAND B115-4PS ar operatoru rakšanai, tranšejām, zemes pārvietošanai un iekraušanai. 82 kW, 4×4, rakšanas dziļums līdz ~5,6 m. 55 €/h.', headline: 'Ekskavators ar operatoru 55 €/h', desc: 'Pieejamību apstiprināsim pēc sazināšanās', button: 'Pieteikties (Sign up)' },
  { group: 'noma', slug: 'pasizgazejs', layout: 'photo', kicker: 'Tehnikas noma Vidzemē', h: 'Pašizgāzējs ar B kategorijas tiesībām', price: '30 €/h', bigPrice: true, spec: '+0,65 €/km · līdz 11 m³ · min. 2 h', chips: ['Beramkravas', 'Būvmateriāli', 'Būvgruži'],
    photo: 'tehnika/pasizgazejs-01.jpg', pos: { all: '45% 60%', st: '42% 60%' }, cta: 'Pieprasīt nomu',
    url: '/nomas-produkts/pasizgazejs', text: 'Renault Mascott 90 pašizgāzējs beramkravu, būvmateriālu un būvgružu pārvadāšanai, vadāms ar B kategorijas tiesībām. 30 €/h + 0,65 €/km, minimāli 2 h.', headline: 'Pašizgāzējs 30 €/h', desc: 'Pieejamību apstiprināsim pēc sazināšanās', button: 'Pieteikties (Sign up)' },
  { group: 'noma', slug: 'grodu-satverejs', layout: 'photo', kicker: 'Instrumentu noma', h: 'Grodu satvērējs betona grodiem', price: '25 €/diena', bigPrice: true, note: 'bez PVN', spec: '3 t celtspēja · grodiem bez kaučuka pārklājuma', chips: ['Celšana', 'Montāža', 'CE marķējums'],
    photo: 'tehnika/grodu-satverejs-01.jpg', pos: { all: '50% 45%' }, cta: 'Pieprasīt nomu',
    url: '/nomas-produkts/grodu-satverejs', text: 'Trīszaru satvērējs betona grodu celšanai un montāžai: celtspēja 3 t, grodiem bez kaučuka pārklājuma. 25 €/diena, bez PVN.', headline: 'Grodu satvērējs 25 €/diena', desc: 'Pieejamību apstiprināsim pēc sazināšanās', button: 'Pieteikties (Sign up)' },
  { group: 'noma', slug: 'regipsa-pacelajs', layout: 'product', kicker: 'Instrumentu noma', h: 'Reģipša pacēlājs', sub: 'Ērtai reģipša un citu plākšņu pacelšanai 1,4–3,5 m augstumā.', price: '9,50 €/diena', note: 'No 2. dienas 9 € dienā · mēnesis 150 € · bez PVN',
    photo: 'tehnika/regipsa-pacelajs-01.jpg', cta: 'Pieprasīt nomu',
    url: '/nomas-produkts/regipsa-pacelajs', text: 'Pacēlājs ērtai reģipša un citu plākšņu pacelšanai līdz 3,5 m. 9,50 €/diena, no 2. dienas 9 €, nedēļa 45 €, mēnesis 150 €, bez PVN.', headline: 'Reģipša pacēlājs 9,50 €/diena', desc: 'Pieejamību apstiprināsim pēc sazināšanās', button: 'Pieteikties (Sign up)' },
  { group: 'noma', slug: 'tehnika-un-instrumenti', layout: 'photo', kicker: 'Tehnikas noma Vidzemē', h: 'Tehnika un instrumenti nomai',
    list: [['Ekskavators-iekrāvējs ar operatoru', '55 €/h'], ['Pašizgāzējs (B kategorija)', '30 €/h'], ['Grodu satvērējs', '25 €/diena'], ['Reģipša pacēlājs', '9,50 €/diena']],
    photo: 'tehnika/ekskavators-iekravejs-05.jpg', pos: { all: '52% 50%', st: '50% 50%' }, cta: 'Skatīt nomu',
    url: '/noma', text: 'Ekskavators-iekrāvējs ar operatoru, pašizgāzējs, grodu satvērējs un reģipša pacēlājs. Apmaksa lapā nav jāveic: cenu un periodu saskaņosim pēc sazināšanās.', headline: 'Tehnikas noma Vidzemē', desc: 'Instrumentu cenas bez PVN', button: 'Uzzināt vairāk (Learn more)' },

  // ---------------------------------------------------------------- projects (Projekti and the project pages)
  { group: 'projekti', slug: 'jaunbuve-doles-sala', layout: 'photo', kicker: 'Realizētie projekti · Jaunbūve Doles sala', h: 'Jaunbūve no pamatiem līdz atslēgai', sub: '127 m² · būvniecība ≈ 9 mēneši', subAlways: true, chips: ['Lentveida pamati', 'Gāzbetona sienas', 'Ventilējamā fasāde'],
    photo: 'objekti/jaunbuve-doles-sala-25.jpg', pos: { all: '30% 35%', st: '36% 30%' }, cta: 'Skatīt projektu',
    url: '/projekts/jaunbuve-doles-sala', text: 'Jaunbūve Doles salā no pamatiem līdz atslēgai: lentveida pamati, gāzbetona sienas, koka ventilējamā fasāde, siltināts mansards un metāla jumts. 127 m², ≈ 9 mēneši.', headline: 'Jaunbūve no pamatiem līdz atslēgai', desc: 'Realizētie projekti ar bildēm', button: 'Uzzināt vairāk (Learn more)' },
  { group: 'projekti', slug: 'garkalnu-pirts', layout: 'photo', kicker: 'Realizētie projekti · Garkalnu pirts', h: 'Pirts klientu uzņemšanai', sub: 'Koka karkasa jaunbūve · 59 m² + 70 m² terase', subAlways: true, chips: ['Individuāla dizaina materiāli', 'Karstumizturīgi materiāli', 'Konstrukcija lielai noslodzei'],
    photo: 'objekti/garkalnu-pirts-23.jpg', pos: { all: '50% 55%' }, cta: 'Skatīt projektu',
    url: '/projekts/garkalnu-pirts', text: 'Koka karkasa jaunbūve uz betona stabiņiem: pirts klientu uzņemšanai ar 70 m² terasi. Individuāls dizains un materiāli, kas iztur lielu noslodzi.', headline: 'Garkalnu pirts: koka karkasa jaunbūve', desc: 'Realizētie projekti ar bildēm', button: 'Uzzināt vairāk (Learn more)' },
  { group: 'projekti', slug: 'fasade-vidrizi', layout: 'split', kicker: 'Realizētie projekti · Fasāde Vidriži', h: 'Fasāde, atjaunota tuvu oriģinālam', sub: '251 m² fasāde, vējkaste un bruģis',
    before: 'objekti/fasade-vidrizi-01.jpg', after: 'objekti/fasade-vidrizi-02.jpg', posBefore: '44% 45%', posAfter: '56% 45%', cta: 'Skatīt projektu',
    url: '/projekts/fasade-vidrizi', text: 'Atjaunojām veco apmesto fasādi tuvu oriģinālajam dekoram, nomainījām vagondēļus, atjaunojām cokolu un lieveni un ieklājām bruģi. Fasāde 251 m².', headline: 'Fasāde Vidriži: pirms un pēc', desc: 'Realizētie projekti ar bildēm', button: 'Uzzināt vairāk (Learn more)' },
  { group: 'projekti', slug: 'jumts-tukuma', layout: 'photo', kicker: 'Realizētie projekti · Jumts Tukumā', h: '320 m² šīfera jumta nomaiņa', sub: 'Click sistēmas valcprofils · 2,5 mēneši', subAlways: true, chips: ['Skārda jumts', 'Koka konstrukcija', 'Skursteņa mūrēšana'],
    photo: 'objekti/jumts-tukuma-19.jpg', zoom: { st: 190 }, pos: { kv: '55% 40%', ve: '55% 45%', st: '58% 62%' }, cta: 'Skatīt projektu',
    url: '/projekts/jumts-tukuma', text: 'Nomainījām 320 m² veco šīfera jumtu pret click sistēmas valcprofila jumtu, pārbūvējām skursteni un izbūvējām vējkastes. Darbi ilga 2,5 mēnešus.', headline: 'Jumts Tukumā: 320 m², 2,5 mēneši', desc: 'Realizētie projekti ar bildēm', button: 'Uzzināt vairāk (Learn more)' },

  // ---------------------------------------------------------------- trust and contact (Sākums, Par mums, Kalkulators, Kontakti)
  { group: 'uzticiba', slug: 'pieredze', layout: 'stats', kicker: 'Par mums · kopš 2020', h: 'Uzticība, kas balstīta darbos',
    stats: [['17+', 'gadi būvniecībā'], ['100+', 'remontdarbi'], ['3', 'jaunas mājas'], ['4', 'rekonstrukcijas']],
    photo: 'objekti/jaunbuve-ikskile-16.jpg', pos: { all: '42% 30%', st: '40% 28%' }, cta: 'Par mums',
    url: '/par-mums', text: 'Uzņēmums dibināts 2020. gadā, bet mūsu ceļš būvniecībā sākās jau 11 gadus agrāk. 17+ gadu pieredze, 100+ remontdarbi, 3 jaunas mājas un 4 rekonstrukcijas.', headline: '17+ gadi būvniecībā', desc: 'Būvniecība, remonts un tehnikas noma', button: 'Uzzināt vairāk (Learn more)' },
  { group: 'uzticiba', slug: 'atsauksmes', layout: 'review', rating: '5,0', ratingNote: 'Verificētas atsauksmes Google', quote: '„Laba komunikācija, rūpīgs darbs, augsta atbildība.“', who: 'Iveta, Rīga · Google atsauksme', cta: 'Sazināties',
    url: '/', text: '„Laba komunikācija, rūpīgs darbs, augsta atbildība.“ 5,0 vērtējums verificētās Google atsauksmēs. Būvniecība, remonts un tehnikas noma Vidzemē.', headline: '5,0 ★ Google atsauksmēs', desc: 'Būvniecība, remonts un tehnikas noma', button: 'Sazināties ar mums (Contact us)' },
  { group: 'uzticiba', slug: 'viens-partneris', layout: 'sequence', kicker: 'Būvniecība · remonts · teritorija', h: 'Viens partneris visam procesam', sub: 'No zemes darbiem līdz pēdējai apdares detaļai. Jums nav jākoordinē vairāki darbuzņēmēji.',
    pics: [['objekti/jaunbuve-doles-sala-04.jpg', 'Pamati', '50% 60%'], ['objekti/jaunbuve-doles-sala-11.jpg', 'Jumts', '40% 50%'], ['objekti/jaunbuve-doles-sala-25.jpg', 'Atslēga', '30% 40%']],
    chips: ['14 pakalpojumi', 'Vienā līgumā', 'Sava tehnika'], cta: 'Skatīt pakalpojumus',
    url: '/pakalpojumi', text: 'No zemes darbiem līdz pēdējai apdares detaļai: 14 pakalpojumi vienā līgumā ar vienu atbildīgo. Jums nav jākoordinē vairāki darbuzņēmēji.', headline: 'Viens partneris visam procesam', desc: 'Pakalpojumi un orientējošās cenas', button: 'Uzzināt vairāk (Learn more)' },
  { group: 'uzticiba', slug: 'sakam-projektu', layout: 'photo', kicker: 'Būvniecība, remonts un tehnikas noma Vidzemē', h: 'Sāksim jūsu projektu', sub: 'Pastāstiet, ko vēlaties uzbūvēt, atjaunot vai nomāt. Atbildēsim ātri un skaidri.', subAlways: true,
    phone: '+371 26 518 131', phoneNote: 'Bez saistībām', photo: 'objekti/jaunbuve-doles-sala-10.jpg', pos: { all: '50% 40%', st: '45% 40%' }, cta: 'Sazināties',
    url: '/kontakti', text: 'Pastāstiet, ko vēlaties uzbūvēt, atjaunot vai nomāt. Atbildēsim darba dienas laikā. Zvaniet +371 26 518 131 vai aizpildiet pieteikumu.', headline: 'Sāksim jūsu projektu', desc: 'Bez saistībām, apmaksa nav jāveic', button: 'Sazināties ar mums (Contact us)' },
];

export const GROUPS = { pakalpojumi: 'Pakalpojumi', kalkulators: 'Kalkulators', noma: 'Tehnikas noma', projekti: 'Projekti', uzticiba: 'Uzticība un kontakti' };

// Every concept in every size, in the same shape as BANNERS (banners.mjs), under 06-baneri/facebook-reklama/<group>/.
// Ads with photos are exported as JPEG (quality 92; Facebook re-encodes every upload to JPEG anyway), flat ones as PNG.
const FLAT = ['calc', 'graphic', 'review', 'product'];
const extOf = (ad) => (FLAT.includes(ad.layout) ? 'png' : 'jpg');
export const ADS = CONCEPTS.flatMap((ad) => SIZES.map((z) => ({
  file: `facebook-reklama/${ad.group}/${ad.slug}-${z.w}x${z.h}`, ext: extOf(ad), html: `fb-${ad.slug}-${z.w}x${z.h}`, group: ad.group, slug: ad.slug,
  w: z.w, h: z.h, theme: ad.layout === 'graphic' || ad.layout === 'product' ? 'is-orange' : ad.layout === 'review' ? 'is-darker' : '',
  title: `${GROUPS[ad.group]} · ${ad.kicker || ad.h || ad.slug} · ${z.label}`, margin: z.margin, safe: z.safe, body: LAYOUT[ad.layout](ad, z),
})));

// ------------------------------------------------------------------ ad texts (Ads Manager fields)
const cell = (v) => `"${String(v).replace(/"/g, '""')}"`;
export function copyRows() {
  return CONCEPTS.map((ad) => ({
    group: GROUPS[ad.group], files: `${ad.group}/${ad.slug}-1080x1080.${extOf(ad)}, -1080x1350.${extOf(ad)}, -1080x1920.${extOf(ad)}`, slug: ad.slug,
    text: ad.text, headline: ad.headline, desc: ad.desc, button: ad.button, url: utm(ad.url, ad.group, ad.slug),
  }));
}
export function copyCsv() { // semicolon-separated with a BOM, so Excel in Latvian opens it in columns with the letters intact
  const head = ['Grupa', 'Faili', 'Galvenais teksts (Primary text)', 'Virsraksts (Headline)', 'Apraksts (Description)', 'Poga (Call to action)', 'Saite (Website URL)'];
  return '﻿' + [head.map(cell).join(';'), ...copyRows().map((x) => [x.group, x.files, x.text, x.headline, x.desc, x.button, x.url].map(cell).join(';'))].join('\r\n') + '\r\n';
}
export function copyMd() {
  const rows = copyRows();
  return `# ProBuild Group · Facebook reklāmu teksti

Katram reklāmas attēlam ir trīs izmēri: 1080×1080 (1:1, plūsma), 1080×1350 (4:5, plūsma) un 1080×1920 (9:16, stāsti un reels).
Ads Manager vienā reklāmā pievienojiet visus trīs, katru savam izvietojumam. Teksti, cenas un skaitļi ir no mājaslapas
(2026. gada 3. novembris); ja tie mājaslapā mainās, mainiet arī reklāmā.

Saitēs ir UTM birkas (utm_source=facebook, utm_medium=paid_social, utm_campaign = grupa, utm_content = reklāma). CRM pie pieteikuma
saglabā avotu, kanālu un kampaņu (iespējas laukos „UTM source“, „UTM medium“, „UTM campaign“) un pieteikuma piezīmē arī reklāmu
(utm_content), tāpēc redzēsiet, kura reklāma atnesa pieteikumu. Saites ved uz ${WEB}: reklāmas sāciet, kad mājaslapa ir šajā domēnā.

${Object.keys(GROUPS).map((g) => `## ${GROUPS[g]}

${rows.filter((x) => x.group === GROUPS[g]).map((x) => `### ${x.slug}

- **Faili:** \`${x.files}\`
- **Galvenais teksts:** ${x.text}
- **Virsraksts:** ${x.headline}
- **Apraksts:** ${x.desc}
- **Poga:** ${x.button}
- **Saite:** ${x.url}`).join('\n\n')}`).join('\n\n')}
`;
}
