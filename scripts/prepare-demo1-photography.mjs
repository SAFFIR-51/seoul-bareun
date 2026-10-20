import { readFile, writeFile, copyFile, mkdir } from 'node:fs/promises';
import { load } from 'cheerio';
import sharp from 'sharp';

const folder = 'public/images/demo1-realistic/';
const manifest = JSON.parse((await readFile(folder + 'asset-prompts-bright.json', 'utf8')).replace(/^\uFEFF/, ''));
await mkdir('reference-source/demo1-before-photo-upgrade', { recursive: true });
for (const file of ['reference-content.json', 'reference-main.css', 'styles.css']) {
  try { await copyFile('src/app/demo1/' + file, 'reference-source/demo1-before-photo-upgrade/' + file, 1); }
  catch (error) { if (error.code !== 'EEXIST') throw error; }
}

for (const asset of manifest.assets) {
  // Keep the full-resolution original in the project as well as the web copy.
  const original = folder + asset.name + '.png';
  await copyFile(asset.source, original);
  await sharp(original).resize({ width: asset.name.startsWith('physician') ? 1000 : 1920, withoutEnlargement: true }).webp({ quality: 88, effort: 6 }).toFile(folder + asset.file);
  const dimensions = await sharp(folder + asset.file).metadata();
  asset.width = dimensions.width;
  asset.height = dimensions.height;
  asset.original = asset.name + '.png';
}
await writeFile(folder + 'asset-prompts.json', JSON.stringify(manifest, null, 2) + '\n');

// Medical team portraits are independent transparent cutouts; keep room photos intact.
const cutoutFolder = folder + 'cutouts/';
const cutouts = JSON.parse(await readFile(cutoutFolder + 'existing-doctors-prompts.json', 'utf8'));
for (const portrait of cutouts.assets) {
  await copyFile(portrait.source, cutoutFolder + portrait.name + '.png');
  await sharp(cutoutFolder + portrait.name + '.png').resize({ width: 1000, withoutEnlargement: true })
    .webp({ quality: 94, alphaQuality: 100, effort: 6 }).toFile(cutoutFolder + portrait.name + '.webp');
  const metadata = await sharp(cutoutFolder + portrait.name + '.webp').metadata();
  portrait.width = metadata.width; portrait.height = metadata.height;
  portrait.file = portrait.name + '.webp'; portrait.original = portrait.name + '.png';
}
await writeFile(cutoutFolder + 'asset-prompts.json', JSON.stringify(cutouts, null, 2) + '\n');

const content = JSON.parse(await readFile('reference-source/demo1-before-photo-upgrade/reference-content.json', 'utf8'));
const $ = load(content.markup, { decodeEntities: false }, false);
$('#wrap').addClass('demo1');
$('#keyvisualMain .reference-carousel-controls').remove();
const descriptions = {
  lobby: '접수대와 대기 공간', consultation: '의료진과 환자의 진료 상담', endoscopy: '내시경 검사실',
  ultrasound: '초음파 장비와 검사 침대', infusion: '수액·회복 공간', vaccination: '예방접종 준비 장면',
  corridor: '진료실로 이어지는 복도', 'blood-draw': '채혈 공간', 'exam-prep': '검사 준비·회복 침대',
  'probe-detail': '초음파 탐촉자와 조작부', physician: '가상 의료진 소개 인물',
  'physician-02': '가상 의료진 소개 인물', 'physician-03': '가상 의료진 소개 인물',
};
const source = name => `/images/demo1-realistic/${name}.webp`;
function setPhoto(el, name, decorative = false) {
  const asset = manifest.assets.find(asset => asset.name === name);
  if (!asset) return; // Illustrated maps are not part of the photographic asset set.
  $(el).attr('src', source(name)).attr('alt', decorative ? '' : `${descriptions[name]} · AI 생성 데모 이미지`)
    .attr('width', asset.width).attr('height', asset.height).attr('decoding', 'async');
}
$('img.demo-photo').each((_, el) => {
  const name = $(el).attr('src').split('/').pop().replace('.webp', '');
  setPhoto(el, name, !!$(el).closest('#keyvisualMain').length);
});
$('#keyvisualMain .box-image img').first().attr('loading', 'eager').attr('fetchpriority', 'high');
$('#section02 article .img img').each((i, el) => {
  const portrait = cutouts.assets[i];
  $(el).attr('src', `/images/demo1-realistic/cutouts/${portrait.file}`)
    .attr('width', portrait.width).attr('height', portrait.height);
});

// Keep clinical subjects accurate; use preparation and recovery views in the relevant tabs.
$('#section04 .cont img.demo-photo').each((i, el) => setPhoto(el, ['endoscopy', 'endoscopy', 'exam-prep', 'endoscopy', 'consultation'][i]));
$('#section05 img.demo-photo').each((i, el) => setPhoto(el, i % 2 ? 'probe-detail' : 'ultrasound'));
$('#section03 .mid-img img.demo-photo').each((i, el) => setPhoto(el, ['blood-draw', 'consultation', 'corridor', 'exam-prep'][i % 4]));

const environments = [
  ['endoscopy', '내시경 검사실', '검사 장비와 침대가 놓인 내시경 검사 공간'],
  ['consultation', '내과 진료 상담', '현재의 불편함과 이전 진료 이력을 함께 확인하는 시간'],
  ['ultrasound', '초음파 검사실', '검사 장비와 침대, 프라이버시 커튼이 있는 공간'],
  ['blood-draw', '채혈 공간', '검진을 위한 채혈 의자와 준비 공간'],
  ['probe-detail', '초음파 장비', '탐촉자와 조작부를 가까이 살펴보는 장면'],
  ['exam-prep', '검사 준비·회복 공간', '검사 전후 잠시 안정을 취하는 침대와 커튼'],
  ['infusion', '수액·회복 공간', '등받이를 조절할 수 있는 의자와 개별 커튼'],
  ['vaccination', '예방접종 준비', '진료실에서 접종을 준비하는 장면'],
  ['corridor', '진료실 복도', '대기 공간과 진료실을 연결하는 동선'],
];
$('#section10 .item').each((i, el) => {
  const [photo, title, description] = environments[i];
  setPhoto($(el).find('img.demo-photo'), photo);
  $(el).find('.tit').html(`${title}<br><b>서울바른내과</b>`);
  $(el).find('.desc').text(description);
});
$('#section10 .cmn-tit .desc').html('상담부터 검사와 회복까지 이어지는 공간을 소개합니다.<br>사진은 AI 생성 데모 이미지로 실제 시설·장비와 다릅니다.');

// Ten distinct photographs, rather than cycling the same six across twenty frames.
const gallery = ['lobby', 'corridor', 'consultation', 'blood-draw', 'endoscopy', 'exam-prep', 'ultrasound', 'probe-detail', 'infusion', 'vaccination'];
$('#gallery .swiper-wrapper').html(gallery.map(name => `<div class="swiper-slide"><img class="demo-photo" src="${source(name)}" loading="lazy" alt=""></div>`).join(''));
$('#section11 .img-btn ul').html(gallery.map(name => `<li role="button" tabindex="0" aria-label="${descriptions[name]} 보기"><img class="demo-photo" src="${source(name)}" loading="lazy" alt=""></li>`).join(''));
$('#section11 img.demo-photo').each((_, el) => setPhoto(el, $(el).attr('src').split('/').pop().replace('.webp', ''), !!$(el).closest('.img-btn').length));

$('img[src="/images/seoul-bareun-logo.png"]').attr('src', '/images/demo1-brand/seoul-bareun-logo.svg').attr('width', '360').attr('height', '80');
$('img[src="/reference-assets/brand-symbol.svg"]').attr('src', '/images/demo1-brand/symbol.svg');
$('.txt-top').text('SEOUL BARUN MEDICAL CLINIC');
await writeFile('src/app/demo1/reference-content.json', JSON.stringify({ markup: $.html() }, null, 2) + '\n');
for (const file of ['reference-main.css', 'styles.css']) {
  let css = await readFile('reference-source/demo1-before-photo-upgrade/' + file, 'utf8');
  css = css.replace(/\/images\/(lobby|consultation|endoscopy|ultrasound|infusion|vaccination)\.webp/g, '/images/demo1-realistic/$1.webp');
  if (file === 'styles.css') css += '\n' + await readFile('src/app/demo1/photography.css', 'utf8');
  await writeFile('src/app/demo1/' + file, css);
}
console.log(`Demo1: ${manifest.assets.length} new photo assets, ${gallery.length} distinct gallery photographs, new vector logo.`);
// Apply the completed unique-image set when regenerating demo1.
try { await readFile('public/images/demo1-unique/asset-prompts.json'); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
if (await readFile('public/images/demo1-unique/asset-prompts.json', 'utf8').catch(() => null)) {
  await import('./prepare-demo1-unique.mjs');
}
