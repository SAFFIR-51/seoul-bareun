import { copyFile, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const source = 'C:/Users/MinSeo/.codex/generated_images/01a156b9-020a-7da3-a93a-f7037aa7d8f7/exec-fb82cd6d-99d8-4da8-af7d-f50bea7aaa90.png';
const original = 'public/images/seoul-bareun-logo-hd-source.png';
const output = 'public/images/seoul-bareun-logo-hd.png';
await copyFile(source, original);
// Export the generated restoration with clean margins; preserve its original ink pixels.
await sharp(source).trim({ background: '#ffffff', threshold: 30 })
  .extend({ top: 24, bottom: 24, left: 24, right: 24, background: '#ffffff' })
  .png({ compressionLevel: 9, palette: true, colours: 256, dither: 0 }).toFile(output);
const metadata = await sharp(output).metadata();
const { data, info } = await sharp(source).removeAlpha().raw().toBuffer({ resolveWithObject: true });
let left = info.width, top = info.height, right = 0, bottom = 0;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < Math.floor(info.width * .3); x++) {
    const i = (y * info.width + x) * info.channels;
    if (data[i + 2] > data[i] + 40 && data[i + 1] > data[i] + 15 && data[i] < 140) {
      left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
    }
  }
}
const padding = 8;
const box = `${left - padding} ${top - padding} ${right - left + padding * 2 + 1} ${bottom - top + padding * 2 + 1}`;
const iconWidth = right - left + padding * 2 + 1;
const iconHeight = bottom - top + padding * 2 + 1;
const image = (await sharp(source).extract({ left: left - padding, top: top - padding, width: iconWidth, height: iconHeight })
  .png({ palette: true, colours: 256, dither: 0 }).toBuffer()).toString('base64');
await writeFile('public/reference-assets/demo2-brand-symbol.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${iconWidth} ${iconHeight}"><image width="${iconWidth}" height="${iconHeight}" href="data:image/png;base64,${image}"/></svg>`);
const path = 'src/app/demo2/reference-content.json';
const content = JSON.parse(await readFile(path, 'utf8'));
content.markup = content.markup.replaceAll('/images/seoul-bareun-logo.png', '/images/seoul-bareun-logo-hd.png').replaceAll('/reference-assets/brand-symbol.svg', '/reference-assets/demo2-brand-symbol.svg');
await writeFile(path, JSON.stringify(content, null, 2));
console.log(JSON.stringify({ logo: output, width: metadata.width, height: metadata.height, iconViewBox: box }));
