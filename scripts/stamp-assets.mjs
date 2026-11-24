import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = path => readFile(resolve(root, path), 'utf8');
const version = source => createHash('sha256').update(source).digest('hex').slice(0, 10);
const pattern = path => new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:\\?v=[a-zA-Z0-9-]+)?', 'g');
async function save(path, next) {
  if (await read(path) !== next) await writeFile(resolve(root, path), next);
}

let script = await read('assets/app.js');
for (const path of ['assets/ui/icons.json', 'assets/content/portfolio.json', 'assets/photos/library.json']) {
  script = script.replace(pattern(path), `${path}?v=${version(await read(path))}`);
}
await save('assets/app.js', script);
let html = await read('index.html');
for (const path of ['assets/app.css', 'assets/app.js']) {
  html = html.replace(pattern(path), `${path}?v=${version(await read(path))}`);
}
await save('index.html', html);
console.log('Updated content-based asset versions.');
