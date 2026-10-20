import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { load } from 'cheerio';
import sharp from 'sharp';

const folder = 'public/images/demo1-unique/';
const manifest = JSON.parse(await readFile(folder + 'asset-prompts.json', 'utf8'));
assert.equal(manifest.assets.length, 47, 'All replacement photographs must be ready before applying.');
await mkdir(folder, { recursive: true });
for (let start = 0; start < manifest.assets.length; start += 6) {
  await Promise.all(manifest.assets.slice(start, start + 6).map(async asset => {
    await copyFile(asset.source, folder + asset.name + '.png');
    await sharp(folder + asset.name + '.png').resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 87, effort: 4 }).toFile(folder + asset.name + '.webp');
    const metadata = await sharp(folder + asset.name + '.webp').metadata();
    asset.width = metadata.width; asset.height = metadata.height;
    asset.file = asset.name + '.webp'; asset.original = asset.name + '.png';
    if (asset.name.startsWith('gallery-')) {
      await sharp(folder + asset.file).resize({ width: 320 }).webp({ quality: 80 }).toFile(folder + asset.name + '-thumb.webp');
    }
  }));
}

const $ = load(JSON.parse(await readFile('src/app/demo1/reference-content.json', 'utf8')).markup, { decodeEntities: false }, false);
const imageSlots = [
  ['hero-consultation', '#keyvisualMain .box-image img', 1, ''],
  ['hero-endoscopy', '#keyvisualMain .box-image img', 2, ''],
  ['checkup-basic', '#section03 .mid-img img.demo-photo', 0, '키·체중과 혈압을 확인하는 기초검사 공간'],
  ['checkup-public', '#section03 .mid-img img.demo-photo', 1, '검진 준비사항을 설명하는 간호사와 내원객'],
  ['checkup-comprehensive', '#section03 .mid-img img.demo-photo', 2, '건강검진을 위한 채혈 준비 공간'],
  ['checkup-custom', '#section03 .mid-img img.demo-photo', 3, '검진 결과에 대해 상담하는 의료진과 내원객'],
  ['endo-gastric', '#section04 .cont img.demo-photo', 0, '내시경 장비와 검사 침대가 놓인 검사실'],
  ['endo-colon', '#section04 .cont img.demo-photo', 1, '내시경 검사 준비를 확인하는 간호사'],
  ['endo-sedation', '#section04 .cont img.demo-photo', 2, '검사 이후 안정을 취하는 회복 침대'],
  ['endo-polyp', '#section04 .cont img.demo-photo', 3, '내시경 장비의 조작부와 포장된 준비 물품'],
  ['endo-sameday', '#section04 .cont img.demo-photo', 4, '내시경실 앞에서 검사 준비를 설명하는 의료진'],
  ['us-heart', '#section05 img.demo-photo', 0, '심장 초음파 안내용 장비 사진'],
  ['us-thyroid', '#section05 img.demo-photo', 1, '목 부위 초음파 검사를 설명하는 진료 장면'],
  ['us-abdomen', '#section05 img.demo-photo', 2, '복부 초음파 검사 준비 장면'],
  ['us-carotid', '#section05 img.demo-photo', 3, '목 옆 부위 초음파 검사 장면'],
  ['us-breast', '#section05 img.demo-photo', 4, '선형 초음파 탐촉자와 조작부 준비 장면'],
  ['us-prostate', '#section05 img.demo-photo', 5, '하복부 초음파 안내를 위한 검사 공간'],
  ['vaccine-influenza', '#section09 img.demo-photo', 0, '예방접종 준비 물품을 확인하는 간호사'],
  ['vaccine-pneumococcal', '#section09 img.demo-photo', 1, '어르신의 이전 예방접종 이력을 상담하는 의료진'],
  ['vaccine-shingles', '#section09 img.demo-photo', 2, '내원객 옆에서 접종 준비를 확인하는 간호사'],
  ['vaccine-hpv', '#section09 img.demo-photo', 3, '성인 내원객과 예방접종을 상담하는 의료진'],
  ['vaccine-hepatitis-a', '#section09 img.demo-photo', 4, '여행 전 예방접종 관련 준비사항 상담'],
  ['vaccine-hepatitis-b', '#section09 img.demo-photo', 5, '포장된 접종 물품과 바이알을 준비하는 장면'],
];
const gallery = [
  ['gallery-reception', '접수대와 대기 의자'], ['gallery-corridor', '진료실로 이어지는 복도'],
  ['gallery-consultation', '책상과 진찰 침대가 놓인 진료실'], ['gallery-blood-draw', '채혈 의자와 준비 물품'],
  ['gallery-endoscopy', '내시경 장비와 검사 침대'], ['gallery-recovery', '개별 커튼이 있는 검사 회복 공간'],
  ['gallery-ultrasound', '초음파 검사실'], ['gallery-probes', '초음파 탐촉자와 케이블'],
  ['gallery-infusion', '수액 의자와 개별 커튼'], ['gallery-treatment', '예방접종·처치 준비 공간'],
];
gallery.forEach(([name, alt], i) => imageSlots.push([name, '#gallery .swiper-slide img', i, alt]));

const source = name => `/images/demo1-unique/${name}.webp`;
for (const [name, selector, index, alt] of imageSlots) {
  const asset = manifest.assets.find(asset => asset.name === name);
  assert(asset, name);
  const image = $(selector).eq(index);
  assert.equal(image.length, 1, `${selector} ${index}`);
  image.attr('src', source(name)).attr('alt', alt ? `${alt} · AI 생성 데모 이미지` : '')
    .attr('width', asset.width).attr('height', asset.height).attr('decoding', 'async');
  asset.target = { kind: 'image', selector, index, alt };
}
gallery.forEach(([name, alt], i) => {
  $('#section11 .img-btn li').eq(i).attr('aria-label', `${alt} 보기`).find('img')
    .attr('src', `/images/demo1-unique/${name}-thumb.webp`).attr('alt', '').attr('width', 320).attr('height', 213);
});

const backgroundSlots = [
  ['care-checkup', '#section01 .item-wrap2 .item.bg1'],
  ['care-endoscopy', '#section01 .item-wrap2 .item.bg2'],
  ['care-ultrasound', '#section01 .item-wrap2 .item.bg3'],
  ['care-chronic', '#section01 .item-wrap2 .item.bg4'],
  ['care-infusion', '#section01 .item-wrap2 .item.bg5'],
  ['care-vaccine', '#section01 .item-wrap2 .item.bg6'],
  ['checkup-banner', '#section03 .emotion-wrap', '#0009'],
  ['chronic-general', '#section06 .item-wrap .item .bg01'],
  ['respiratory', '#section06 .item-wrap .item .bg02'],
  ['thyroid-consult', '#section06 .item-wrap .item .bg03'],
  ['allergy-consult', '#section06 .item-wrap .item .bg04'],
  ['philosophy-background', '#section07', 'rgba(5,31,72,.84)'],
  ['infusion-treatment', '#section08 .box-wrap .bg01'],
  ['wellness-consult', '#section08 .box-wrap .bg02'],
];
const marker = '/* Demo1 unique photographs: one source per content position. */';
let css = marker + '\n';
for (const [name, selector, tint] of backgroundSlots) {
  assert.equal($(selector).length, 1, selector);
  const asset = manifest.assets.find(asset => asset.name === name);
  assert(asset, name);
  asset.target = { kind: 'background', selector, tint };
  css += `.demo1 ${selector} { background-image: ${tint ? `linear-gradient(${tint}, ${tint}), ` : ''}url('${source(name)}'); }\n`;
}
assert(manifest.assets.every(asset => asset.target));
await writeFile('src/app/demo1/unique-photography.css', css);
const styles = (await readFile('src/app/demo1/styles.css', 'utf8')).split(marker)[0].trimEnd() + '\n\n' + css;
await writeFile('src/app/demo1/styles.css', styles);
await writeFile('src/app/demo1/reference-content.json', JSON.stringify({ markup: $.html() }, null, 2) + '\n');
await writeFile(folder + 'asset-prompts.json', JSON.stringify(manifest, null, 2) + '\n');

for (let start = 0; start < manifest.assets.length; start += 8) {
  const assets = manifest.assets.slice(start, start + 8);
  const tiles = await Promise.all(assets.map(async (asset, index) => ({
    input: await sharp(folder + asset.file).resize(400, 267, { fit: 'cover' }).png().toBuffer(),
    left: index % 4 * 400, top: Math.floor(index / 4) * 300,
  })));
  const labels = `<svg width="1600" height="600">${assets.map((asset, index) => `<text x="${index % 4 * 400 + 10}" y="${Math.floor(index / 4) * 300 + 289}" font-size="17" font-family="Arial" fill="#173b5c">${asset.name}</text>`).join('')}</svg>`;
  await sharp({ create: { width: 1600, height: 600, channels: 3, background: 'white' } })
    .composite([...tiles, { input: Buffer.from(labels), top: 0, left: 0 }]).jpeg({ quality: 90 })
    .toFile(`qa/demo1-unique-contact-${start / 8 + 1}.jpg`);
}
console.log('Applied 47 unique replacement photographs, including 10 separate gallery photos.');
