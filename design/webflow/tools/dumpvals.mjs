import fs from 'fs';
const [file, key] = process.argv.slice(2);
const src = fs.readFileSync(file, 'utf8');
const m = /<script type="text\/x-dc" data-dc-script[^>]*>([\s\S]*?)<\/script>/.exec(src);
class DCLogic { constructor(p) { this.props = p || {}; this.state = {}; } setState(s) { Object.assign(this.state, s); } }
const Comp = new Function('DCLogic', m[1] + '\n;return Component;')(DCLogic);
const c = new Comp({});
const v = c.renderVals();
console.log(JSON.stringify(v[key], (k, x) => typeof x === 'function' ? undefined : x));
