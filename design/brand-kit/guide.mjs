// Brand guide (PDF), business card, e-mail signature and README for the ProBuild Group brand kit. All text is Latvian.
// The guide holds only what people use when making materials: logo, logo rules, colours, fonts, the brand bars, company details.
// Facts come from the website (probuild-group.webflow.io / probuildgroup.lv) and design/logo.
import path from 'path';

export const COMPANY = {
  name: 'ProBuild Group', legal: 'SIA “Probuild”', reg: '54103137871', vat: 'LV54103137871',
  address: 'Limbažu nov., Vidrižu pag., “Garkalni”, LV-4013', phone: '+371 26 518 131', tel: '+37126518131',
  email: 'probuildlatvia@gmail.com', web: 'probuildgroup.lv', region: 'Vidzeme',
};

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

function fontFaces(c) {
  return `@font-face{font-family:"Martian Mono";src:url("${c.url(path.join(c.fonts, 'MartianMono-Variable.ttf'))}") format("truetype");font-weight:100 800;font-stretch:75% 112.5%}
@font-face{font-family:"Noto Sans";src:url("${c.url(path.join(c.fonts, 'NotoSans-Variable.ttf'))}") format("truetype");font-weight:100 900;font-stretch:62.5% 100%}`;
}

// ------------------------------------------------------------------ brand guide
export function guideHtml(c) {
  const L = (n) => c.url(path.join(c.logo, 'svg', n + '.svg'));
  const P = (n) => c.url(path.join(c.pattern, n));
  const PH = (f) => c.url(path.join(c.kit, c.D.photos, f));
  const col = Object.fromEntries(c.COLOURS.map((x) => [x.key, x]));
  const cr = (a, b) => contrast(a, b).toFixed(1).replace('.', ',') + ':1';
  let n = 0;
  const pageNo = () => `<span class="pn">${String(++n).padStart(2, '0')}</span>`;
  const head = (title) => `<header class="ph"><h2>${title}</h2></header>`;
  const foot = (dark, pnStyle = '') => `<footer class="pf${dark ? ' is-dark' : ''}"><span>ProBuild Group · Zīmola vadlīnijas 2026</span>${pageNo().replace('class="pn"', `class="pn" style="${pnStyle}"`)}</footer>`;
  const tile = (logo, bg, label, h = 54) => `<figure class="tile" style="background:${bg}"><img src="${L(logo)}" style="height:${h}px"><figcaption style="color:${['#FFFFFF', '#F2F2F2', '#F2600C'].includes(bg) ? '#000' : '#B2B2B2'}">${label}<br><code>${logo}.svg</code></figcaption></figure>`;
  const dont = (inner, label, bg = '#000') => `<figure class="dont"><div class="dont-a" style="background:${bg}">${inner}</div><figcaption><b>✕</b> ${label}</figcaption></figure>`;
  const sw = (x, big) => `<div class="sw${big ? ' is-big' : ''}"><div class="sw-c" style="background:${x.hex}${['#FFFFFF', '#F2F2F2', '#FDEFE6'].includes(x.hex) ? ';box-shadow:inset 0 0 0 1px #ddd' : ''}"></div><p><b>${x.name}</b>${x.hex}<br>RGB ${x.rgb.join(' ')}<br>CMYK ≈ ${x.cmyk.join(' ')}</p>${big ? `<p class="sw-u">${x.use}</p>` : ''}</div>`;
  const barsBox = (w, h, cls) => `<div class="bars ${cls}" style="width:${w}px;height:${h}px"><i></i><i></i></div>`;
  const logoH = 'probuild-logo-horizontals-uz-tumsa', logoHL = 'probuild-logo-horizontals-uz-gaisa';

  return `<!doctype html><html lang="lv"><head><meta charset="utf-8"><title>ProBuild Group · Zīmola vadlīnijas</title><style>
${fontFaces(c)}
@page{size:297mm 210mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:"Noto Sans",sans-serif;color:#191919;background:#fff;font-size:13px;line-height:1.5;-webkit-font-smoothing:antialiased}
.pg{position:relative;width:297mm;height:210mm;overflow:hidden;padding:18mm 20mm 16mm;break-after:page;background:#fff;isolation:isolate}
.pg.is-dark{background:#000;color:#fff}
.mono,h1,h2,h3{font-family:"Martian Mono",monospace;font-weight:500;letter-spacing:-.03em;line-height:1.08}
.ph{margin-bottom:9mm}.pk{font-weight:600;color:#C14C09;font-size:13px;margin-bottom:6px}.is-dark .pk{color:#F2600C}
h2{font-size:38px}h3{font-size:17px;letter-spacing:-.02em;margin-bottom:6px}
p+p{margin-top:8px}code{font-family:"Martian Mono",monospace;font-size:10px;letter-spacing:0;color:inherit;opacity:.85}
.muted{color:#4C4C4C}.is-dark .muted{color:#B2B2B2}
.pf{position:absolute;left:20mm;right:20mm;bottom:9mm;display:flex;justify-content:space-between;font-size:10px;color:#7F7F7F}
.pn{font-family:"Martian Mono",monospace}
.cols{display:grid;gap:10mm}.c2{grid-template-columns:1fr 1fr}.c3{grid-template-columns:repeat(3,1fr)}.c4{grid-template-columns:repeat(4,1fr)}
.bars{position:absolute;right:0;bottom:0;overflow:hidden;pointer-events:none;z-index:-1}
.bars i{position:absolute;bottom:0;width:46%;transform:skewY(-19deg);transform-origin:100% 100%;background:rgba(255,255,255,.28)}
.bars i:first-child{left:0;height:68%}.bars i:last-child{right:0;height:100%}
.bars.is-orange i{background:#F2600C}
.tile{border-radius:10px;height:44mm;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:0 7mm;gap:12px}
.tile img{display:block;width:auto}.tile figcaption{font-size:10.5px;line-height:1.4}
.dont{font-size:11px}.dont-a{height:27mm;border-radius:8px;display:flex;align-items:center;justify-content:center;overflow:hidden;margin-bottom:6px}.dont b{color:#C14C09}
.sw .sw-c{height:14mm;border-radius:8px;margin-bottom:5px}.sw.is-big .sw-c{height:23mm}.sw p{font-size:10.5px;line-height:1.45}.sw b{display:block;font-size:12px}.sw-u{color:#4C4C4C}
table{border-collapse:collapse;width:100%;font-size:11.5px}td,th{text-align:left;padding:6px 8px;border-top:1px solid #E5E5E5;vertical-align:top}th{font-size:10px;color:#7F7F7F;font-weight:600;text-transform:uppercase;letter-spacing:.05em}
.is-dark td{border-color:#333}
</style></head><body>

<!-- 1 vāks -->
<section class="pg is-dark">
  <img src="${P('probuild-joslu-fons-caurspidigs.svg')}" style="position:absolute;left:0;bottom:0;width:100%;z-index:-1;opacity:.9">
  <img src="${L(logoH)}" style="height:80px;margin-top:8mm">
  <h1 style="font-size:60px;margin-top:30mm">Zīmola vadlīnijas</h1>
  <p class="muted" style="margin-top:14px;font-size:16px">Logo, krāsas, fonti, zīmola joslas un foto</p>
  <footer class="pf is-dark"><span>ProBuild Group · ${COMPANY.web} · versija 1.2, 2026. gada novembris</span>${pageNo()}</footer>
</section>

<!-- 2 logo -->
<section class="pg">
  ${head('Logo')}
  <div class="cols c3" style="gap:6mm">
    ${tile(logoH, '#000000', 'Galvenais logo: uz melna vai #191919')}
    ${tile(logoHL, '#FFFFFF', 'Uz balta un gaišiem foniem')}
    ${tile('probuild-logo-horizontals-melns', '#F2600C', 'Uz oranža: vienkrāsains, melns')}
    ${tile('probuild-logo-vertikals-uz-tumsa', '#191919', 'Vertikālais: kvadrātiem un šauriem formātiem', 84)}
    ${tile('probuild-zime-uz-tumsa', '#000000', 'Zīme: mazi izmēri, avatāri', 84)}
    ${tile('probuild-ikona-oranza', '#F2F2F2', 'Ikona: favikons, sociālo tīklu un Google profils', 84)}
  </div>
  <p class="muted" style="margin-top:7mm;max-width:230mm">Visas versijas: <code>02-logo/svg</code> (vektors drukai un tīmeklim), <code>02-logo/png</code> (caurspīdīgs fons, vairāki izmēri), <code>02-logo/favikoni</code>. Vienkrāsainās versijas (<code>-melns</code>, <code>-balts</code>) – oranžiem foniem, gravēšanai, zīmogiem un vienas krāsas drukai.</p>
  ${foot()}
</section>

<!-- 3 logo lietošana -->
<section class="pg">
  ${head('Logo lietošana')}
  <div class="cols c2" style="grid-template-columns:1fr 1.25fr">
    <div>
      <h3>Brīvā zona</h3>
      <div style="position:relative;background:#000;border-radius:10px;height:52mm;display:flex;align-items:center;justify-content:center">
        <div style="position:relative;padding:28px;outline:1px dashed #F2600C"><img src="${L(logoH)}" style="height:56px;display:block"></div>
      </div>
      <p class="muted" style="margin-top:8px">Ap logo no visām pusēm atstājiet brīvu vietu, kas vienāda ar pusi no logo augstuma.</p>
      <h3 style="margin-top:8mm">Mazākais izmērs</h3>
      <table><tr><th>Versija</th><th>Ekrānā</th><th>Drukā</th></tr>
      <tr><td>Horizontālais logo</td><td>40 px augsts</td><td>9 mm augsts</td></tr>
      <tr><td>Vertikālais logo</td><td>80 px augsts</td><td>18 mm augsts</td></tr>
      <tr><td>Zīme, ikona</td><td>16 px</td><td>5 mm</td></tr></table>
      <p class="muted" style="margin-top:6px">Mazāk par horizontālā logo minimumu – lietojiet tikai zīmi.</p>
    </div>
    <div>
      <h3>Nedrīkst</h3>
      <div class="cols c3" style="gap:5mm">
        ${dont(`<img src="${L(logoH)}" style="height:34px;transform:scaleX(1.45)">`, 'stiept vai saspiest')}
        ${dont(`<img src="${L(logoH)}" style="height:34px;filter:hue-rotate(170deg)">`, 'mainīt krāsas')}
        ${dont(`<img src="${L(logoHL)}" style="height:34px">`, 'likt krāsaino logo uz oranža: joslas pazūd', '#F2600C')}
        ${dont(`<img src="${L(logoH)}" style="height:34px;filter:drop-shadow(4px 4px 3px #F2600C)">`, 'pievienot ēnas, spīdumu vai kontūras')}
        ${dont(`<img src="${L(logoH)}" style="height:34px;transform:rotate(-12deg)">`, 'pagriezt vai pārkārtot daļas')}
        ${dont(`<img src="${L(logoHL)}" style="height:34px">`, 'likt uz raiba foto bez tumša slāņa', `url('${PH('objekti/jaunbuve-doles-sala-04.jpg')}') center/cover`)}
      </div>
    </div>
  </div>
  ${foot()}
</section>

<!-- 4 krāsas -->
<section class="pg">
  ${head('Krāsas')}
  <div class="cols c4" style="gap:6mm">${['orange', 'black', 'dark', 'white'].map((x) => sw(col[x], true)).join('')}</div>
  <div class="cols" style="grid-template-columns:repeat(9,1fr);gap:4mm;margin-top:5mm">${['orange-light', 'orange-dark', 'orange-tint', 'charcoal', 'graphite', 'grey', 'light', 'lighter', 'off-white'].map((x) => sw(col[x])).join('')}</div>
  <div class="cols c2" style="margin-top:6mm;grid-template-columns:1fr 1.1fr">
    <div><h3>Proporcijas</h3><div style="display:flex;height:12mm;border-radius:6px;overflow:hidden"><span style="flex:60;background:#000"></span><span style="flex:25;background:#191919"></span><span style="flex:10;background:#F2600C"></span><span style="flex:5;background:#fff;box-shadow:inset 0 0 0 1px #ddd"></span></div>
    <p class="muted" style="margin-top:6px">Melnā un tumšā – lielākā daļa virsmu, baltā – teksts, oranžā – akcents: viena poga, cenas, joslas. Pilns oranžs laukums – vienam spēcīgam vēstījumam. Ogļu #262626 – sadaļai, kas jāatdala no melnās un #191919 (mājaslapā: atsauksmes ar melnām kartītēm).</p></div>
    <div><h3>Kontrasts</h3><table>
      <tr><td>Melns teksts uz oranža</td><td class="mono">${cr('#000000', '#F2600C')}</td><td>teksts un pogas: jā</td></tr>
      <tr><td>Oranžs uz melna</td><td class="mono">${cr('#F2600C', '#000000')}</td><td>teksts, cenas: jā</td></tr>
      <tr><td>Balts uz oranža</td><td class="mono">${cr('#FFFFFF', '#F2600C')}</td><td>tikai lieli virsraksti</td></tr>
      <tr><td>Gaiši pelēks uz melna</td><td class="mono">${cr('#B2B2B2', '#000000')}</td><td>papildu teksts: jā</td></tr></table>
    <p class="muted" style="margin-top:6px">Faili: <code>03-krasas</code> (CSS, JSON, Adobe .ase, TXT). CMYK ir aptuvens: drukā lūdziet salīdzināt ar HEX krāsu provizoriskajā izdrukā.</p></div>
  </div>
  ${foot()}
</section>

<!-- 5 fonti -->
<section class="pg">
  ${head('Fonti')}
  <div class="cols c2" style="gap:12mm">
    <div>
      <p class="pk">Virsraksti, cenas un skaitļi</p>
      <p class="mono" style="font-size:44px">Martian Mono</p>
      <p class="mono" style="font-size:26px;margin-top:6mm">Aprēķiniet darbu izmaksas</p>
      <p class="mono" style="font-size:34px;color:#C14C09;margin-top:4mm;white-space:nowrap">55 €/h · no 150 €/m²</p>
      <p class="muted" style="margin-top:5mm">Medium (500) virsrakstiem, burtu atstarpe −2…−3,5 %, rindstarpa 1,05–1,2. Cenas un skaitļi vienmēr ar Martian Mono.</p>
    </div>
    <div>
      <p class="pk">Pamatteksts, etiķetes, pogas</p>
      <p style="font-size:44px;font-weight:500;letter-spacing:-.02em;line-height:1.1">Noto Sans</p>
      <p style="font-size:16px;margin-top:6mm;line-height:1.55">Atzīmējiet vajadzīgos darbus un ierakstiet apjomu: aptuveno cenu redzēsiet uzreiz.</p>
      <p style="font-size:18px;margin-top:4mm;letter-spacing:.02em">Ā Č Ē Ģ Ī Ķ Ļ Ņ Š Ū Ž · ā č ē ģ ī ķ ļ ņ š ū ž</p>
      <p class="muted" style="margin-top:5mm">Regular (400) tekstam, SemiBold (600) pogām, etiķetēm un īsiem izcēlumiem.</p>
    </div>
  </div>
  <table style="margin-top:7mm"><tr><th>Stils</th><th>Fonts</th><th>Izmērs tīmeklī</th><th>Lietojums</th></tr>
    <tr><td class="mono" style="font-size:16px">Virsraksts 1</td><td>Martian Mono 500</td><td>56 px / 1,2</td><td>Viens lapā vai banerī</td></tr>
    <tr><td class="mono" style="font-size:14px">Virsraksts 2</td><td>Martian Mono 500</td><td>48 px / 1,2</td><td>Sadaļu virsraksti</td></tr>
    <tr><td class="mono" style="font-size:12px">Virsraksts 6</td><td>Martian Mono 500</td><td>20 px / 1,4</td><td>Kartīšu un sarakstu virsraksti</td></tr>
    <tr><td style="font-weight:600;color:#C14C09">Virsrinda</td><td>Noto Sans 600, oranžs</td><td>17 px</td><td>Īsa rinda virs virsraksta</td></tr>
    <tr><td>Pamatteksts</td><td>Noto Sans 400</td><td>16–18 px / 1,5</td><td>Teksts</td></tr></table>
  <p class="muted" style="margin-top:5mm">Virsrakstos ar lielo burtu tikai pirmais vārds (tikai ar lielajiem burtiem raksta logo). Fonti ir bezmaksas (SIL Open Font License), mapē <code>04-fonti</code>: uzinstalējiet tos pirms baneru vai dokumentu labošanas.</p>
  ${foot()}
</section>

<!-- 6 zīmola joslas -->
<section class="pg is-dark">
  ${head('Zīmola joslas')}
  <div class="cols c2" style="grid-template-columns:1fr 1.15fr">
    <div>
      <p style="font-size:15px">Divas augošas joslas no logo zīmes. Tās aug no virsmas apakšējās malas, un mala tās nogriež – kā ēka, kas ceļas aiz satura.</p>
      <h3 style="margin-top:8mm">Uzbūve</h3>
      <table style="color:#fff"><tr><td>Platums</td><td>katra josla 46 % no joslu laukuma</td></tr><tr><td>Augstums</td><td>kreisā 68 %, labā 100 %</td></tr><tr><td>Slīpums</td><td>augša ceļas pa labi, skewY −19°</td></tr><tr><td>Novietojums</td><td>apakšā pa labi, ap 60 % × 86 % no virsmas</td></tr><tr><td>Krāsas</td><td>balts 28 % vai 12 % uz melna, oranžs uz melna, balts 28 % uz oranža, melns</td></tr></table>
      <p class="muted" style="margin-top:6mm">Faili: <code>05-zimola-joslas</code>. Viens pāris uz virsmas, vienmēr aiz satura un pie malas. Nepagriezt, nekontūrēt, nelietot kā ikonu. Pilnekrāna joslu fons – vākiem, prezentācijām un lielām izdrukām.</p>
    </div>
    <div class="cols c3" style="gap:5mm;align-content:start">
      <div style="position:relative;height:60mm;background:#191919;border-radius:10px;overflow:hidden;isolation:isolate">${barsBox(110, 150, '')}</div>
      <div style="position:relative;height:60mm;background:#000;border-radius:10px;overflow:hidden;isolation:isolate;box-shadow:inset 0 0 0 1px #333">${barsBox(110, 150, 'is-orange')}</div>
      <div style="position:relative;height:60mm;background:#F2600C;border-radius:10px;overflow:hidden;isolation:isolate">${barsBox(110, 150, '')}</div>
      <div style="grid-column:1/-1;position:relative;height:66mm;border-radius:10px;overflow:hidden"><img src="${P('probuild-joslu-fons-uz-oranza.svg')}" style="width:100%;height:100%;object-fit:cover;display:block"></div>
    </div>
  </div>
  ${foot(true)}
</section>

<!-- 7 foto -->
<section class="pg">
  ${head('Foto')}
  <div class="cols c3" style="gap:6mm">
    ${[['objekti/jaunbuve-doles-sala-25.jpg', '30% 35%', 'Gatavs objekts: jaunbūve Doles salā'], ['objekti/jaunbuve-doles-sala-04.jpg', '50% 60%', 'Darbs procesā: pamati ar armatūru'], ['tehnika/ekskavators-iekravejs-03.jpg', '60% 50%', 'Sava tehnika: NEW HOLLAND B115-4PS']].map(([f, pos, t]) => `<figure><div style="height:62mm;border-radius:10px;background:url('${PH(f)}') ${pos}/cover"></div><figcaption class="muted" style="margin-top:6px;font-size:11px">${t}</figcaption></figure>`).join('')}
  </div>
  <div class="cols c2" style="margin-top:8mm;gap:12mm">
    <div><h3>Kādus foto lietot</h3><p>Tikai savu objektu un savas tehnikas foto: <code>07-foto/objekti</code> un <code>07-foto/tehnika</code> (no mājaslapas projektu un nomas lapām). Tie rāda īstu darbu; svešu objektu foto neuzdodiet par savu darbu.</p><p>Labākie kadri: gatavs objekts saulainā dienā, pirms un pēc no viena skatpunkta, darbs procesā ar tīru fonu, tehnika darbā ar operatoru.</p></div>
    <div><h3>Teksts uz foto</h3><p>Zem teksta foto aptumšojiet ar melnu pāreju (līdz 90–100 % apakšā), lai balts teksts un oranžā cena būtu skaidri salasāmi. Logo – uz tumšākās vietas, oranžās joslas – apakšējā labajā stūrī aiz teksta.</p><p>Uz foto nelieciet vairāk par virsrakstu, cenu un vienu pogu; sīkāka informācija – reklāmas tekstā vai mājaslapā.</p></div>
  </div>
  ${foot()}
</section>

<!-- 8 rekvizīti -->
<section class="pg is-dark">
  ${barsBox(420, 560, 'is-orange')}
  ${head('Rekvizīti')}
  <table style="color:#fff;max-width:150mm;font-size:13px">
    <tr><td style="color:#B2B2B2">Zīmols</td><td>${COMPANY.name}</td></tr>
    <tr><td style="color:#B2B2B2">Uzņēmums</td><td>${COMPANY.legal} · Reģ. nr. ${COMPANY.reg} · PVN nr. ${COMPANY.vat}</td></tr>
    <tr><td style="color:#B2B2B2">Adrese</td><td>${COMPANY.address}</td></tr>
    <tr><td style="color:#B2B2B2">Tālrunis</td><td class="mono">${COMPANY.phone}</td></tr>
    <tr><td style="color:#B2B2B2">E-pasts</td><td>${COMPANY.email}</td></tr>
    <tr><td style="color:#B2B2B2">Mājaslapa</td><td>${COMPANY.web}</td></tr>
    <tr><td style="color:#B2B2B2">Darbības reģions</td><td>${COMPANY.region}</td></tr>
  </table>
  <img src="${L(logoH)}" style="height:54px;position:absolute;left:20mm;bottom:24mm">
  ${foot(true, 'color:#000')}
</section>
</body></html>`;
}

// ------------------------------------------------------------------ business card (90 × 50 mm, 3 mm bleed)
export function cardHtml(c) {
  const L = (n) => c.url(path.join(c.logo, 'svg', n + '.svg'));
  const front = `<div class="face is-front"><img class="lg" src="${L('probuild-logo-horizontals-uz-tumsa')}"><div class="bars is-orange"><i></i><i></i></div></div>`;
  const back = `<div class="face is-back"><div class="safe"><p class="nm">Jānis Ādamsons</p><p class="rl">Komandas vadītājs</p>
  <p class="ct"><span class="mono">${COMPANY.phone}</span><br>${COMPANY.email}<br>${COMPANY.web}</p><img class="mk" src="${L('probuild-zime-uz-gaisa')}"></div><div class="bars is-orange sm"><i></i><i></i></div></div>`;
  return `<!doctype html><html lang="lv"><head><meta charset="utf-8"><title>ProBuild Group · vizītkarte</title><style>
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
<!-- Atveriet šo failu pārlūkā, iezīmējiet tabulu, nokopējiet un ielīmējiet e-pasta programmas paraksta iestatījumos.
     Logo jābūt internetā: augšupielādējiet ../02-logo/png/probuild-logo-horizontals-uz-gaisa-450px.png (piemēram, Webflow
     mājaslapas Assets) un ierakstiet tā adresi src laukā. Vārdu un amatu nomainiet katram darbiniekam. -->
<table cellpadding="0" cellspacing="0" border="0" style="font-family:'Noto Sans',Arial,Helvetica,sans-serif;color:#191919;font-size:13px;line-height:1.5">
  <tr><td style="padding:0 0 10px 0"><img src="../02-logo/png/probuild-logo-horizontals-uz-gaisa-450px.png" alt="ProBuild Group" width="180" height="40" style="display:block;border:0;width:180px;height:auto"></td></tr>
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

// ------------------------------------------------------------------ README (LASIMANI.md)
export function readme({ D, banners, ads = [], groups = {}, guidePdf }) {
  const rows = (list) => list.map((b) => `| \`${b.file}.png\` | ${b.w}×${b.h} | ${b.title} |`).join('\n');
  const social = banners.filter((b) => !b.display), display = banners.filter((b) => b.display);
  const adGroups = Object.keys(groups).map((g) => `| \`${D.banners}/facebook-reklama/${g}/\` | ${groups[g]} | ${new Set(ads.filter((a) => a.group === g).map((a) => a.slug)).size} |`).join('\n');
  return `# ProBuild Group · zīmola komplekts (2026)

Viss, kas zīmolam vajadzīgs ārpus mājaslapas: logo faili, krāsas, fonti, zīmola joslas, savu objektu foto, gatavi baneri un
Facebook reklāmas. Sāciet ar **\`${D.guide}/${guidePdf}\`** (8 lpp.: logo, logo lietošana, krāsas, fonti, zīmola joslas, foto, rekvizīti).

| Mape | Saturs |
|---|---|
| \`${D.guide}\` | Zīmola vadlīnijas (PDF) |
| \`${D.logo}\` | Logo: \`svg/\` (vektors drukai un tīmeklim), \`png/\` (caurspīdīgs fons, vairāki izmēri), \`favikoni/\` (32, 48, 180, 192, 512 px) |
| \`${D.colours}\` | Krāsas: \`.css\`, \`.json\`, Adobe krāsu paraugi \`.ase\`, \`.txt\` un krāsu attēls |
| \`${D.fonts}\` | Martian Mono un Noto Sans (TTF, SIL Open Font License, bezmaksas). Licences teksts ir oriģinālvalodā (angliski) |
| \`${D.pattern}\` | Zīmola joslas SVG/PNG (baltas, baltas maigas, oranžas, melnas), pilnekrāna joslu fons, saraksta zīme |
| \`${D.banners}\` | Baneri: \`socialie-tikli/\` un \`displeja-reklama/\` (PNG), \`facebook-reklama/\` (reklāmas un to teksti), \`html/\` (labojami avoti), \`visi-baneri.png\` |
| \`${D.photos}\` | Savu objektu (\`objekti/\`) un savas tehnikas (\`tehnika/\`) foto no mājaslapas, 2000 px |
| \`${D.print}\` | Vizītkarte (90×50 mm, 3 mm pielaide, PDF drukai + priekšskatījums) un e-pasta paraksts |

## Kuru logo failu lietot

- Uz melna vai #191919: \`probuild-logo-horizontals-uz-tumsa\` (galvenais logo), kvadrātiem \`probuild-logo-vertikals-uz-tumsa\`.
- Uz balta: \`probuild-logo-horizontals-uz-gaisa\`.
- Uz oranža un vienas krāsas drukā: \`probuild-logo-horizontals-melns\` / \`-balts\`.
- Mazi izmēri, Facebook / Instagram / Google profila attēls: \`probuild-ikona-oranza\` (1024 px PNG).

## Facebook un Instagram reklāmas

${ads.length} attēli: ${new Set(ads.map((a) => a.slug)).size} reklāmas, katra 1080×1080 (1:1, plūsma), 1080×1350 (4:5, plūsma) un 1080×1920 (9:16, stāsti un
reels). Ads Manager vienā reklāmā pievienojiet visus trīs izmērus, katru savam izvietojumam.

| Mape | Kas | Reklāmas |
|---|---|---|
${adGroups}

- **Teksti:** \`${D.banners}/facebook-reklama/reklamu-teksti.md\` (un \`.csv\` Excel): katrai reklāmai galvenais teksts, virsraksts, apraksts,
  poga un saite ar UTM birkām. CRM pie pieteikuma saglabā kampaņu (iespējas laukos) un reklāmu (pieteikuma piezīmē), tāpēc
  redzēsiet, kura reklāma atnesa pieteikumu.
- **Pārskats:** \`parskats-<grupa>.jpg\`: katras grupas reklāmas trijos izmēros vienā attēlā.
- **Formāts:** reklāmas ar foto ir JPG (kvalitāte 92), pārējās PNG; Facebook katru augšupielādi tik un tā pārveido JPG.
- **9:16 drošā zona:** teksts un logo ir starp 270 px no augšas un 672 px no apakšas (Meta reels drošā zona), tāpēc stāstos un reels tos
  neaizsedz poga un paraksts.
- **Fakti:** cenas, skaitļi un teksti ir no mājaslapas (2026. gada 3. novembris). Pakalpojumu cenas ir orientējošas un bez PVN (ēku
  apsaimniekošanai PVN statuss nav norādīts, tāpēc tur ir tikai „Orientējošā cena“), nomas instrumentiem – bez PVN, ekskavatoram un
  pašizgāzējam mājaslapā PVN nav norādīts. Mainot cenas mājaslapā, mainiet tās arī reklāmās.
- **Kalkulatora reklāmas** rāda, kā kalkulators darbojas (jomas, atzīmēti darbi, apjoms, cena uzreiz), un neviena summa tajās nav redzama.
- **Atsauksme** („Laba komunikācija, rūpīgs darbs, augsta atbildība.“, Iveta, Rīga) ir tā pati, ko rāda mājaslapa; tā ir publiska Google atsauksme.

## Citi baneri

Sociālie tīkli (Facebook, Instagram, LinkedIn):

| Fails | Izmērs | Kas |
|---|---|---|
${rows(social)}

Displeja reklāma (Google Ads, katrs PNG mazāks par 150 KB):

| Fails | Izmērs | Kas |
|---|---|---|
${rows(display)}

**Teksta labošana:** uzinstalējiet fontus, atveriet banera failu mapē \`${D.banners}/html/\` pārlūkā Chrome un mainiet tekstu HTML failā
(izskats ir \`baneri.css\`; garāks virsraksts pats samazinās, lai ietilptu). PNG no jauna: \`cd ${D.banners}/html && npm i playwright && npx playwright install chromium && node eksportet.mjs\`.
Dizainers maketu var pārveidot arī Canva vai Figma no PNG, fontiem un krāsām.

## Pirms lietošanas

- **Domēns:** baneros, reklāmu saitēs un parakstā ir **probuildgroup.lv**. Reklāmas sāciet, kad mājaslapa ir publicēta šajā domēnā (pagaidām tā ir probuild-group.webflow.io).
- **Foto** ir klienta paša objektu un tehnikas foto no mājaslapas projektu un nomas lapām. Reģipša pacēlāja attēls ir neliels (447 px), tāpēc reklāmā tas ir baltā laukumā, nevis pa visu attēlu.
- **Cenas** ņemtas no mājaslapas 2026. gada 3. novembrī: pakalpojumi no lapas Pakalpojumi (bez PVN), noma no lapas Noma.
- **Vizītkarte un paraksts** kā paraugu izmanto kontaktpersonas vārdu un amatu no mājaslapas (Jānis Ādamsons, komandas vadītājs) ar uzņēmuma tālruni un e-pastu. Nomainiet katram darbiniekam.
- **E-pasta paraksts:** logo failā \`e-pasta-paraksts.html\` norāda uz PNG šajā mapē, tāpēc redzams tikai šajā datorā. Augšupielādējiet \`02-logo/png/probuild-logo-horizontals-uz-gaisa-450px.png\` mājaslapā (vai citur internetā), ierakstiet adresi \`<img src>\`, tad atveriet failu pārlūkā, iezīmējiet visu, nokopējiet un ielīmējiet e-pasta programmas paraksta iestatījumos.
- **Drukas krāsas:** CMYK ir vienkāršs pārrēķins. Lūdziet tipogrāfijai salīdzināt #F2600C provizoriskajā izdrukā.
`;
}
