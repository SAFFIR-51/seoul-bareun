import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { load } from 'cheerio';

// Freeze the shared layout before demo1's independent photography/brand update.
// Regenerating demo2 must not import subsequent demo1 asset changes.
const base = 'reference-source/demo2-layout-base/';
const target = 'src/app/demo2/';
await mkdir('reference-source/demo2-independent-layout', { recursive: true });
for (const file of ['page.tsx', 'styles.css']) {
  // Preserve the rejected layout once; reruns must not replace the snapshot.
  try { await copyFile(target + file, 'reference-source/demo2-independent-layout/' + file + '.snapshot', 1); }
  catch (error) { if (error.code !== 'EEXIST') throw error; }
}
for (const file of ['reference-experience.tsx', 'reference-common.css', 'reference-main.css', 'reference-fonts.css', 'styles.css']) {
  let source = (await readFile(base + file, 'utf8')).replaceAll('SEOUL BAREUN MEDICAL CLINIC', 'SEOUL BARUN MEDICAL CLINIC');
  if (file.endsWith('.css')) {
    source = source.replaceAll('#0578b2', '#3472b9').replaceAll('#0077b2', '#3472b9').replaceAll('#1984ba', '#3472b9');
  }
  await writeFile(target + file, source);
}
const content = JSON.parse(await readFile(base + 'reference-content.json', 'utf8'));
const $ = load(content.markup, { decodeEntities: false }, false);
$('img[src="/images/seoul-bareun-logo.png"]').attr('src', '/images/seoul-bareun-logo-hd.png');
$('img[src="/reference-assets/brand-symbol.svg"]').attr('src', '/reference-assets/demo2-brand-symbol.svg');
$('.txt-top').text('SEOUL BARUN MEDICAL CLINIC');

// Keep the existing left/right header slots, using the supplied clinic focus instead of invented seals.
$('.logos .logo1').html('<div class="bareun-header-note"><b>내과 전문 진료</b><span>소화기 · 만성질환</span></div>');
$('.logos .logo2').html('<div class="bareun-header-note"><b>건강검진</b><span>국가 · 종합검진 안내</span></div>');
$('.logos .logo3').html('<div class="bareun-header-note bareun-header-note-right"><b>검사 전부터 결과 상담까지</b><span>서울바른의 내과 진료</span></div>');
const menuLabels = ['의료진 소개', '건강검진', '소화기내시경', '초음파', '만성질환', '영양·수액', '예방접종', '오시는 길'];
$('#gnb a').each((i, el) => $(el).text(menuLabels[i]));

const hero = [
  ['<span class="bareun-hero-lead">내과 전문 진료</span><b>서울바른내과</b>', '건강검진부터 만성질환 관리까지', '#section01', '진료과목 안내'],
  ['<span class="bareun-hero-lead">증상부터 생활습관까지</span><b>함께 살피는 내과 진료</b>', '현재의 불편함과 이전 검사 이력을 함께 확인합니다.', '#section02', '진료 소개 보기'],
  ['<span class="bareun-hero-lead">검사 준비부터 결과 상담까지</span><b>서울바른 건강검진</b>', '검진 종류와 방문 전 준비사항을 확인하세요.', '#section03', '건강검진 안내'],
];
$('#keyvisualMain .swiper-slide').each((i, el) => {
  $(el).find('.title').html(hero[i][0]);
  $(el).find('.subscript').html(hero[i][1]);
  $(el).find('a.btn').attr('href', hero[i][2]).text(hero[i][3]);
});

const headings = {
  section01: '내과 전문 진료, <b>서울바른내과</b>',
  section02: '내과 전문 진료<br><b>서울바른의 진료를 소개합니다.</b>',
  section03: '검진 전 상담부터 결과 확인까지<br><b>서울바른 건강검진센터</b>',
  section04: '위·대장내시경 검사 안내<br><b>소화기내시경클리닉</b>',
  section05: '검사 목적과 과정을 확인하는<br><b>초음파클리닉</b>',
  section06: '진료실에서 일상으로 이어지는<br><b>만성질환 관리</b>',
  section07: '서울바른내과가 지향하는<br><b>바른 진료의 기준</b>',
  section08: '현재의 몸 상태를 먼저 살피는<br><b>영양·수액 상담</b>',
  section09: '이전 접종 이력부터 확인하는<br><b>예방접종 안내</b>',
  section10: '상담 · 검사 · 회복<br><b>진료 공간 안내</b>',
  section11: '서울바른내과<br><b>병원 둘러보기</b>',
  section12: '<b>오시는 길 · 진료시간</b>',
};
const descriptions = {
  section02: '소화기 진료와 건강검진, 만성질환 관리까지.<br>서울바른내과에서 살펴볼 수 있는 진료와 상담을 안내합니다.',
  section03: '건강 상태와 이전 검사 이력을 확인하고 검진을 상담합니다.<br>검진 종류와 방문 전 준비사항을 아래에서 확인하세요.',
  section04: '검사 종류와 준비 과정, 검사 후 안내를 확인하세요.',
  section05: '궁금한 검사 항목을 확인하고, 검사 목적과 준비 과정을 상담하세요.',
  section06: '현재의 증상, 복용 중인 약, 생활습관을 함께 확인합니다.<br>꾸준한 진료가 필요한 질환을 아래에서 살펴보세요.',
  section07: '불편한 점을 듣고, 필요한 검사를 상담하고,<br>결과와 관리 방향을 설명하는 것.<br><b>내과 진료의 기본을 바르게 지키겠습니다.</b>',
  section08: '건강 상태와 생활습관에 따른 상담을 안내합니다.<br>치료 여부와 방법은 의료진 상담 후 확인해 주세요.',
  section09: '나이와 건강 상태, 이전 접종 이력에 따라 상담합니다.<br>실제 접종 가능 여부와 일정은 방문 전 확인해 주세요.',
  section10: '각 공간에서 이루어지는 진료 과정을 안내합니다.<br>사진은 데모 이미지로 실제 시설·장비 보유 현황과 다릅니다.',
  section11: '대기 공간부터 진료실과 검사실까지 둘러보세요.<br>모든 사진은 홈페이지 구성을 위한 데모 이미지입니다.',
};
for (const [id, value] of Object.entries(headings)) $(`#${id} .cmn-tit`).first().find('.title').html(value);
for (const [id, value] of Object.entries(descriptions)) $(`#${id} .cmn-tit`).first().find('.desc').html(value);
const focus = ['내과 전문 진료<br><b>증상과 생활습관 확인</b>', '건강검진<br><b>국가·종합검진 상담</b>', '소화기내시경<br><b>위·대장내시경 안내</b>', '만성질환 관리<br><b>꾸준한 건강 상태 확인</b>', '검진 결과<br><b>관리 상담</b>'];
$('#section01 .item-wrap figcaption').each((i, el) => $(el).html(focus[i]));

const careCards = [
  ['건강검진', '국가·종합검진<br>준비와 결과 상담'],
  ['소화기내시경', '위·대장내시경<br>검사 전후 안내'],
  ['초음파 검사', '복부·갑상선 등<br>검사 준비 안내'],
  ['만성질환 관리', '고혈압·당뇨 등<br>생활습관 상담'],
  ['영양·수액', '몸 상태에 맞춘<br>영양·수액 상담'],
  ['예방접종', '이전 접종 이력<br>대상·일정 상담'],
];
$('#section01 .item-wrap2').attr('id', 'care-cards');
$('#section01 .item-wrap2 .item').each((i, el) => {
  const card = $(el), href = card.find('a.plus').attr('href');
  const [title, description] = careCards[i];
  const photo = ['lobby', 'endoscopy', 'ultrasound', 'consultation', 'infusion', 'vaccination'][i];
  // Preserve the grid and destinations, but give each card a distinct photo-and-paper treatment.
  el.tagName = 'a';
  card.addClass('bareun-care-link').attr('href', href).attr('aria-label', title).attr('aria-describedby', `care-card-copy-${i + 1}`);
  card.html(`<div class="bareun-care-photo"><img src="/images/${photo}.webp" alt="" width="920" height="560" loading="lazy"></div><div class="inner"><h3 class="tit f2">${title}</h3><p class="txt" id="care-card-copy-${i + 1}">${description}</p></div>`);
});

const careProfiles = [
  { name: '내과 진료', left: ['현재의 불편함과 증상 확인', '기존 질환과 복용 중인 약 확인', '소화기·호흡기 등 내과 진료 상담', '필요한 검사와 진료 과정 안내'], right: ['이전 진료·검사 결과', '복용 중인 약 목록', '증상이 시작된 시점과 변화', '의료진 성함과 약력은 확인 후 안내'] },
  { name: '건강검진', left: ['국가·종합 건강검진 안내', '건강 상태와 이전 검진 이력 확인', '검진 목적과 항목 상담', '결과 확인과 이후 관리 상담'], right: ['이전에 받은 검진 결과', '제출 기관의 요구 항목과 서식', '현재 복용 중인 약', '검진 일정과 준비사항은 개별 확인'] },
  { name: '만성질환 관리', left: ['고혈압·당뇨·고지혈증 등 상담', '기존 진료와 약 복용 이력 확인', '생활습관과 몸의 변화 확인', '진료 이후 관리 방향 상담'], right: ['이전 진료와 검사 자료', '현재 복용 중인 약 목록', '일상에서 기록한 건강 변화', '방문 간격과 검사 일정은 개별 상담'] },
];
$('#section02 article').each((i, el) => {
  const profile = careProfiles[i];
  $(el).find('.name').html(`<b>서울바른</b> ${profile.name}`);
  $(el).find('.list-wrap .tit').eq(0).text('주요 진료 안내');
  $(el).find('.list-wrap .tit').eq(1).text('상담 전 확인사항');
  $(el).find('.list-wrap ul').eq(0).html(profile.left.map(text => `<li>${text}</li>`).join(''));
  $(el).find('.list-wrap ul').eq(1).html(profile.right.map(text => `<li>${text}</li>`).join(''));
  $(el).find('.info').append('<p class="bareun-portrait-note">의료진 소개용 데모 이미지입니다. 실제 의료진 정보는 확인 후 반영됩니다.</p>');
});
$('#section07 .circle-wrap .tit').each((i, el) => $(el).text(['문진', '검사 상담', '결과 설명', '경과 확인'][i]));
$('#section07 .circle-wrap .desc').each((i, el) => $(el).html(['증상과 생활습관을<br>함께 확인', '필요한 검사와<br>준비 과정 안내', '검사 결과와<br>관리 방향 상담', '변화에 맞춘<br>꾸준한 진료'][i]));
const ultrasoundCopy = [
  '이전 심장 관련 검사 결과와 현재의 불편함을 함께 확인합니다. 검사 목적과 진행 과정에 대한 궁금한 점을 상담하세요.',
  '갑상선 관련 진료와 검사 이력을 확인합니다. 기존 결과 자료와 상담하고 싶은 내용을 함께 알려 주세요.',
  '복부 초음파 검사의 목적과 진행 과정을 상담합니다. 준비사항과 실제 검사 가능 여부는 방문 전 확인해 주세요.',
  '검사에 대한 궁금한 점과 이전 검사 이력을 확인합니다. 필요한 검사와 이후 안내는 개별 상담으로 확인하세요.',
  '검사 이력과 궁금한 점을 먼저 상담합니다. 실제 검사 가능 여부와 준비사항은 방문 전 확인해 주세요.',
  '검사 목적과 과정을 확인하고, 기존 검사 결과와 현재 불편한 점을 상담합니다.',
];
$('#section05 .item-wrap .desc').each((i, el) => $(el).text(ultrasoundCopy[i]));
$('#section06 .item .info .txt').each((i, el) => $(el).text([
  '고혈압·당뇨·고지혈증 등 기존 질환과 복용 약, 최근의 건강 변화를 함께 확인합니다. 이전 진료 자료를 바탕으로 관리 방향과 다음 진료를 상담합니다.',
  '현재 불편한 증상과 시작 시점, 이전 진료·검사 이력을 확인합니다. 궁금한 점과 복용 중인 약을 상담할 때 함께 알려 주세요.',
  '갑상선 관련 진료와 검사 이력을 확인하고 현재의 변화를 상담합니다. 이전 검사 결과와 복용 중인 약 목록을 함께 살펴봅니다.',
  '일상에서 불편함이 나타나는 상황과 생활 환경을 함께 확인합니다. 이전 진료 이력과 현재 사용 중인 약을 바탕으로 진료 방향을 상담합니다.',
][i]));
const checkupSteps = [
  '이전 진료와 검진 결과를<br>먼저 확인합니다.',
  '검진 목적과 건강 상태에 따라<br>항목을 상담합니다.',
  '검사 전 준비사항과<br>방문 일정을 확인합니다.',
  '검진 결과를 확인하고<br>궁금한 점을 상담합니다.',
  '이후 관리 방향과<br>다음 진료를 상담합니다.',
];
$('#section03 .ico-wrap figcaption').each((i, el) => { const title = $(el).find('strong').text(); $(el).html(`<strong class="f2">${title}</strong>${checkupSteps[i % 5]}`); });
const examSteps = ['이전 검사와 복용 약 등<br>건강 이력을 확인합니다.', '검사 목적과 순서를<br>먼저 안내합니다.', '현재 상태에 필요한<br>확인사항을 상담합니다.', '검사 결과를 확인하고<br>궁금한 점을 나눕니다.', '검사 이후 필요한<br>회복 과정을 안내합니다.'];
$('#section04 .ico-wrap figcaption').each((i, el) => { const title = $(el).find('strong').text(); $(el).html(`<strong class="f2">${title}</strong>${examSteps[i]}`); });
$('#section08 .item-wrap .txt').each((i, el) => $(el).html(['기존 질환과 복용 중인 약,<br>현재 불편한 점을<br>상담합니다.', '상담과 검사 후 필요한<br>회복 과정과 이용 방법을<br>확인합니다.', '식사·생활습관을 확인하고<br>관리 방향에 대해<br>상담합니다.'][i]));

// Match each facility caption to its actual demo photo; preserve all nine reference frames.
const environments = [
  ['endoscopy', '위·대장내시경 검사 공간', '검사 전 준비와 진행 과정에 대한 안내'],
  ['consultation', '내과 진료실', '현재의 증상과 이전 진료 이력을 확인하는 상담'],
  ['ultrasound', '초음파 검사 공간', '검사 목적과 진행 과정을 확인하는 공간'],
  ['lobby', '대기 공간', '진료와 검사 전 안내를 확인하는 공간'],
  ['infusion', '회복 공간', '검사와 상담 이후의 회복 과정 안내'],
  ['consultation', '건강검진 상담', '개인의 검진 목적과 이전 검사 이력 확인'],
  ['endoscopy', '내시경 검사 안내', '검사 준비와 결과 확인 과정 안내'],
  ['ultrasound', '검사 결과 상담', '검사 결과와 이후 진료 방향 확인'],
  ['lobby', '방문 안내', '진료시간과 상담 채널을 확인하는 안내'],
];
$('#section10 .item').each((i, el) => {
  const [photo, title, text] = environments[i];
  $(el).find('img').attr('src', `/images/${photo}.webp`).attr('alt', `${title} · AI 생성 데모 이미지`);
  $(el).find('.tit').html(`${title}<br><b>서울바른내과</b>`);
  $(el).find('.desc').text(text);
});
await writeFile(target + 'reference-content.json', JSON.stringify({ markup: $.html().replaceAll('SEOUL BAREUN MEDICAL CLINIC', 'SEOUL BARUN MEDICAL CLINIC') }, null, 2) + '\n');
await writeFile(target + 'page.tsx', 'import ReferenceExperience from "./reference-experience";\nimport content from "./reference-content.json";\n\nexport default function DemoTwoPage() {\n  return <ReferenceExperience markup={content.markup} />;\n}\n');
await writeFile(target + 'styles.css', (await readFile(target + 'styles.css', 'utf8')) + `
/* Demo2: keep demo1 geometry; use Seoul Barun's logo blue and plain clinic information. */
.bareun-header-note { text-align:left; color:#52606c; font-size:13px; line-height:1.65; }
.bareun-header-note b { display:block; color:#3472b9; font-size:17px; font-weight:700; }
.bareun-header-note span { display:block; white-space:nowrap; }
.bareun-header-note-right { text-align:right; }
.bareun-mobile-break { display:none; }
.bareun-portrait-note { margin-top:24px; color:#596572; font-size:13px; line-height:1.7; }
.quick-wrap .btn-tel { background:#1e528c; }
#footer h2 img { mix-blend-mode:multiply; }
@media(max-width:768px) { .bareun-mobile-break { display:inline; } .bareun-desktop-separator { display:none; } .bareun-portrait-note { font-size:13px; margin-top:18px; } }
`);
await writeFile(target + 'styles.css', (await readFile(target + 'styles.css', 'utf8')) + '\n' + await readFile(target + 'entry-polish.css', 'utf8'));
await writeFile(target + 'styles.css', (await readFile(target + 'styles.css', 'utf8')) + '\n' + await readFile(target + 'care-cards.css', 'utf8'));
console.log('Demo2 restored from demo1 layout with clinic-specific copy and logo blue. Demo1 was not written.');
