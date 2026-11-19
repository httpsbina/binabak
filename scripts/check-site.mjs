import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
const read = (path) => readFile(resolve(root, path), "utf8");
const portfolio = JSON.parse(await read("assets/content/portfolio.json"));
const library = JSON.parse(await read("assets/photos/library.json"));
const ids = new Set(library.photos.map((photo) => photo.id));
assert.equal(ids.size, library.photos.length, "Photo IDs must be unique");
for (const photo of library.photos) {
  await access(resolve(root, photo.src));
  assert(
    photo.alt && photo.width > 0 && photo.height > 0,
    `Missing photo metadata: ${photo.id}`,
  );
}
for (const album of library.albums) {
  assert(ids.has(album.coverId), `Unknown album cover: ${album.id}`);
  for (const id of album.photoIds)
    assert(ids.has(id), `Missing album photo: ${id}`);
}
assert.equal(portfolio.emails.length, 9);
for (const email of portfolio.emails)
  assert(email.sender && email.subject && email.body && email.date);
assert.equal(Object.keys(portfolio.notes).length, 6);
assert.equal(Object.keys(portfolio.projects).length, 10);
const files = [
  "index.html",
  "assets/app.js",
  "assets/app.css",
  "assets/content/portfolio.json",
];
const assets = new Set();
for (const file of files) {
  const source = await read(file);
  for (const match of source.matchAll(
    /assets\/[\w./-]+\.(?:png|jpg|svg|json|pdf|html)/g,
  ))
    assets.add(match[0]);
}
for (const path of assets) await access(resolve(root, path));
const pdf = await readFile(
  resolve(root, "assets/resume/Binafsha_Bakhramova_Resume.pdf"),
);
assert.equal(
  pdf.subarray(0, 5).toString(),
  "%PDF-",
  "Résumé must be a real PDF",
);
console.log(
  `Verified ${assets.size} referenced assets, ${library.photos.length} photos, ${library.albums.length} albums, 9 emails, 6 résumé sections and 10 project notes.`,
);
