// Builds the two Pakalpojumi page code blocks of the price calculator.
//   node tools/calc_build.mjs            (run from design/webflow; uses npx terser@5.31.6)
//
// calculator/kalkulators.html is the readable source. Webflow's custom code blocks hold at most
// 50 000 characters each, so the engine part (below "Kalkulatora kods") is minified here, while
// the settings the client may edit (texts, units, service links) stay as written.
//   calculator/dist/page-head.html    → Page settings → Custom code → Inside <head> tag
//                                       (page-code/services.head.html + kalkulators-stils.html)
//   calculator/dist/page-footer.html  → Page settings → Custom code → Before </body> tag
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const LIMIT = 50000;
const MARK = '/* ====== Kalkulatora kods (labot nevajag) ================================= */';

const src = read('calculator/kalkulators.html');
const body = src.slice(src.indexOf('<script>') + 8, src.lastIndexOf('</script>'));
const cut = body.indexOf(MARK);
if (cut < 0) throw new Error('marker not found: ' + MARK);
const settings = body.slice(0, cut).trim();
const engine = body.slice(cut + MARK.length);

const t = spawnSync('npx', ['-y', 'terser@5.31.6', '--ecma', '2018', '--compress', 'passes=2', '--mangle', '--comments', 'false'],
  { input: engine, encoding: 'utf8', maxBuffer: 1 << 24 });
if (t.status !== 0) throw new Error('terser failed: ' + t.stderr);
const min = t.stdout.trim();
if (/\\u/.test(min)) throw new Error('minified code contains a \\u escape (the Webflow MCP decodes them)');

const footer = '<script>\n' + settings + '\n\n' + MARK + '\n' + min + '\n</script>\n';
const head = read('page-code/services.head.html').trim() + '\n' + read('calculator/kalkulators-stils.html').trim() + '\n';

fs.mkdirSync(path.join(root, 'calculator', 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'calculator', 'dist', 'page-footer.html'), footer);
fs.writeFileSync(path.join(root, 'calculator', 'dist', 'page-head.html'), head);
new Function(footer.slice(8, -10)); // syntax check
let bad = 0;
for (const [name, s] of [['page-head.html', head], ['page-footer.html', footer], ['../cenas.html', read('calculator/cenas.html')]]) {
  const over = s.length > LIMIT;
  bad += over;
  console.log(`${over ? 'OVER ' : 'ok   '}calculator/dist/${name.replace('../', '../')}  ${s.length} chars (limit ${LIMIT}, free ${LIMIT - s.length})`);
}
process.exit(bad ? 1 : 0);
