import { readFile, writeFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { load } from 'cheerio';
import sharp from 'sharp';

const $ = load(JSON.parse(await readFile('src/app/demo1/reference-content.json', 'utf8')).markup);
assert.equal($('#keyvisualMain .reference-carousel-controls').length, 0);
const portraits = $('#section02 article .img img').map((_, el) => $(el).attr('src')).get();
assert.equal(portraits.length, 3);
for (const src of portraits) {
  assert(src.includes('/cutouts/'));
  const metadata = await sharp('public' + src).metadata();
  const stats = await sharp('public' + src).stats();
  assert(metadata.hasAlpha, `Portrait lacks transparency: ${src}`);
  assert.equal(stats.channels[3].min, 0);
  assert(stats.channels[3].max >= 250, `Portrait is too transparent: ${src}`);
}
const gallery = $('#gallery .swiper-slide img').map((_, el) => $(el).attr('src')).get();
assert.equal(gallery.length, 10);
assert.equal(new Set(gallery).size, 10);
assert.equal($('#section11 .img-btn li').length, gallery.length);
assert.equal($('#section10 .item').length, 9);
const equipment = $('#section10 img.demo-photo').map((_, el) => $(el).attr('src')).get();
assert.equal(new Set(equipment).size, 9);
const photos = $('img.demo-photo').filter((_, el) => !$(el).closest('.img-btn').length)
  .map((_, el) => $(el).attr('src')).get().filter(src => !src.endsWith('.svg'));
assert(photos.every(src => src.startsWith('/images/demo1-realistic/') || src.startsWith('/images/demo1-unique/')));
const uniqueManifest = await readFile('public/images/demo1-unique/asset-prompts.json', 'utf8').catch(() => null);
let uniquePhotoPositions = null;
if (uniqueManifest) {
  const { assets } = JSON.parse(uniqueManifest);
  assert.equal(assets.length, 47);
  const backgrounds = assets.filter(asset => asset.target.kind === 'background').map(asset => `/images/demo1-unique/${asset.file}`);
  const sources = [...photos.filter(src => !src.endsWith('.svg')), ...backgrounds];
  assert.equal(sources.length, 60);
  assert.equal(new Set(sources).size, sources.length, 'Repeated content photo source');
  const hashes = await Promise.all(sources.map(async src => createHash('sha256').update(await readFile('public' + src)).digest('hex')));
  assert.equal(new Set(hashes).size, sources.length, 'Repeated photo content under different filenames');
  uniquePhotoPositions = sources.length;
}
for (const src of new Set($('img').map((_, el) => $(el).attr('src')).get())) await access('public' + src);
const preserved = JSON.parse(await readFile('qa/demo2-before-photo-upgrade.json', 'utf8'));
for (const file of preserved) {
  const hash = createHash('sha256').update(await readFile(file.Path)).digest('hex').toUpperCase();
  assert.equal(hash, file.Hash, `Demo2 changed: ${file.Path}`);
}
const result = { galleryImages: gallery.length, distinctGalleryImages: new Set(gallery).size, distinctEnvironmentImages: new Set(equipment).size, photoSources: new Set(photos).size, uniquePhotoPositions, transparentPortraits: portraits.length, playbackControls: 0, missingFiles: 0, demo2FilesUnchanged: preserved.length };
await writeFile('qa/demo1-photography-checks.json', JSON.stringify(result, null, 2) + '\n');
console.log(result);
