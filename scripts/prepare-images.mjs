import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const records = JSON.parse(await readFile(new URL('../public/images/asset-prompts.json', import.meta.url), 'utf8'));
for (const asset of records) {
  await sharp(fileURLToPath(new URL(`../public/images/${asset.name}.png`, import.meta.url))).webp({ quality: 88 }).toFile(`public/images/${asset.name}.webp`);
  console.log(`${asset.name}: webp saved`);
}
