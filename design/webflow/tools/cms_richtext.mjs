// Prints a rich text source file in the form Webflow's CMS editor keeps, ready for a CMS API write:
// one line, no whitespace around block tags, lists as <ul role="list"> / <ol role="list">.
// Why: lists written through the API with line breaks inside <ul>/<ol> show on the site, but Webflow's
// CMS editor drops them the next time the item is saved there (both articles lost theirs on 4 Nov 2026).
// Usage: node tools/cms_richtext.mjs pages/blog/raksts-jumta-nomaina.html
import { readFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('usage: node tools/cms_richtext.mjs <source.html>');
  process.exit(1);
}

const BLOCK = 'p|h[1-6]|ul|ol|li|blockquote|figure|figcaption';
const html = readFileSync(file, 'utf8')
  .trim()
  .replace(new RegExp(`\\s*(</?(?:${BLOCK})\\b[^>]*>)\\s*`, 'g'), '$1')
  .replace(/<(ul|ol)>/g, '<$1 role="list">');

if (/[\r\n]/.test(html)) {
  console.error(`${file}: a line break is left inside a text; join that line first`);
  process.exit(1);
}
process.stdout.write(html);
