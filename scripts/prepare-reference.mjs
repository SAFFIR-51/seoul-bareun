import { readFile, writeFile, mkdir, copyFile, access } from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';

const root = process.cwd();
const source = await readFile('reference-source/index.html', 'utf8');
const $ = load(source);
$('script,style,iframe,object,embed,link,#popup-wrap,.popup-dim,.popup-nopay').remove();
$('*').each((_,el) => { for (const attr of Object.keys(el.attribs ?? {})) if (/^on/i.test(attr)) $(el).removeAttr(attr); });
// Preserve the reference's DOM geometry while replacing its organization-specific copy.
const brand = '서울바른내과';
const sectionHeadings = {
 section01:`${brand} <b>진료과목</b>`,
 section02:`${brand}의<br /><b>의료진을 소개합니다.</b>`,
 section03:`나에게 맞는 건강관리의 시작<br /><b>${brand} 건강검진센터</b>`,
 section04:`검사 전부터 결과 안내까지<br /><b>${brand} 소화기내시경클리닉</b>`,
 section05:`몸속 건강을 세심하게 살피는<br /><b>${brand} 초음파클리닉</b>`,
 section06:`일상 가까이에서 함께하는<br /><b>${brand} 만성질환클리닉</b>`,
 section07:`${brand}의<br /><b>바른 진료철학</b>`,
 section08:`나에게 집중하는 회복의 시간<br /><b>${brand} 웰빙·수액클리닉</b>`,
 section09:`내일의 건강을 준비하는<br /><b>${brand} 예방접종클리닉</b>`,
 section10:`세심한 진료를 생각하는<br /><b>${brand} 검사 환경소개</b>`,
 section11:`편안한 머무름을 생각한 공간<br /><b>${brand} 둘러보기</b>`,
 section12:`<b>${brand} 오시는길</b>`,
};
const desc = {
 section02:'작은 불편함부터 일상 속 건강 고민까지 충분히 듣고,<br />진료와 검사의 과정을 이해하기 쉽게 설명하는 진료를 생각합니다.',
 section03:'생활습관과 검사 이력을 함께 확인하고, 개인에게 필요한 건강검진을 상담합니다.<br />검사 전 준비부터 결과 확인까지 차근차근 알아보세요.',
 section04:'검사를 앞둔 걱정에도 귀 기울이며, 개인의 건강 상태와 검사 이력을 바탕으로 필요한 과정을 안내합니다.',
 section05:'초음파 검사가 필요한 이유와 과정을 충분히 이해할 수 있도록 설명합니다.<br />구체적인 검사 항목과 가능 여부는 의료진 상담으로 확인해 주세요.',
 section06:'건강관리는 진료실을 나선 뒤에도 이어집니다.<br />몸의 변화와 생활습관을 함께 살피며 꾸준히 관리하는 과정을 안내합니다.',
 section07:'한 분 한 분의 이야기에 귀 기울이고,<br />이해하기 쉬운 설명과 세심한 안내로<br /><b>건강한 일상을 함께 생각하겠습니다.</b>',
 section08:'현재의 건강 상태와 생활습관을 상담하고 나에게 필요한 관리를 함께 생각합니다.<br />편안한 공간에서 회복의 시간을 준비해 보세요.',
 section09:'나이와 건강 상태, 이전 접종 이력에 따라 필요한 예방접종이 달라질 수 있습니다.<br />접종 대상과 일정은 의료진의 개별 안내를 확인해 주세요.',
 section10:'상담과 검사, 회복의 과정을 생각한 공간을 소개합니다.<br />아래 이미지는 데모를 위해 생성한 것으로 실제 장비 보유 현황과 다릅니다.',
 section11:'밝은 대기 공간부터 차분한 상담실과 회복실까지.<br />모든 인물·시설 이미지는 서울바른내과 데모를 위한 AI 생성 이미지입니다.',
};
for(const [id,title] of Object.entries(sectionHeadings)) $(`#${id} .cmn-tit`).first().find('.title').html(title);
for(const [id,text] of Object.entries(desc)) $(`#${id} .cmn-tit`).first().find('.desc').html(text);
$('.txt-top').text('seoul bareun internal medicine clinic');

const hero = [
 {title:'넓고 편안한 진료 공간에서<br /><b>당신의 건강을 바르게 살핍니다.</b>',text:'건강검진 상담부터 검사 과정과 결과에 대한 설명까지, 서울바른내과가 함께 생각합니다.'},
 {title:'충분히 듣고, 세심하게 살피는<br /><b>당신을 위한 바른 진료</b>',text:'작은 불편함과 건강에 대한 걱정도 편안하게 이야기할 수 있는 진료를 생각합니다.'},
 {title:'내시경과 초음파 검사,<br /><b>이해하기 쉬운 설명으로 함께</b>',text:'검사를 준비하는 순간부터 결과를 확인하는 시간까지, 모든 과정을 차근차근 안내합니다.'},
];
$('#keyvisualMain .swiper-slide').each((i,el)=>{ $(el).find('.title').html(hero[i].title); $(el).find('.subscript').text(hero[i].text); });

const promises=['충분한 상담으로<br /><b>한 분 한 분을 위한 진료</b>','건강한 일상을 위한<br /><b>건강검진 프로그램 안내</b>','세심하게 살피는<br /><b>내시경·초음파 검사 안내</b>','검사 준비부터 회복까지<br /><b>차근차근 안내하는 과정</b>','편안한 시간을 생각한<br /><b>회복 공간 소개</b>'];
$('#section01 .item-wrap figcaption').each((i,el)=>$(el).html(promises[i]));
const serviceCopy=['국가 건강검진, 종합검진,<br />암 검진, 채용검진 안내','위·대장내시경 등<br />소화기 검사 과정 안내','복부·갑상선·심장 등<br />초음파 검사 상담 안내','고혈압·당뇨 등<br />지속적인 건강관리 상담','몸의 상태에 맞춘 상담과<br />편안한 회복 공간 안내','접종 이력과 건강 상태에 따른<br />개별 예방접종 상담'];
$('#section01 .item-wrap2 .txt').each((i,el)=>$(el).html(serviceCopy[i]));

const doctorCopy=[
 ['의료진 소개','충분한 대화에서 시작하는 진료','건강 상태와 생활습관에 대한 상담','검사 과정에 대한 상세한 안내','결과를 이해하기 쉬운 설명','편안한 내원을 위한 진료 안내','개인별 건강관리 방향 상담','정기적인 상태 확인 안내','가상 의료진 이미지 · 데모 구성'],
 ['검진 상담','건강에 대한 고민을 나누는 시간','이전 검사와 건강 이력 확인','개인별 검진 항목 상담','검사 전 확인사항 안내','검진 결과를 살펴보는 상담','일상 속 건강관리 방향 안내','다음 방문과 검사 일정 상담','가상 의료진 이미지 · 데모 구성'],
 ['건강 관리','일상에서 이어지는 건강관리','생활습관과 불편함을 함께 확인','진료 후 궁금한 사항에 대한 상담','이해하기 쉬운 건강 정보 안내','개인별 진료 일정 상담','꾸준한 건강 점검을 위한 안내','편안한 진료 환경을 위한 노력','가상 의료진 이미지 · 데모 구성'],
];
$('#section02 article').each((i,article)=>{
 const el=$(article), lines=doctorCopy[i];
 el.find('.name').html(`<b>서울바른</b> ${lines[0]}`);
 el.find('.list-wrap .tit').eq(0).text('진료 안내');el.find('.list-wrap .tit').eq(1).text('진료 원칙');
 el.find('.list-wrap ul').each((j,ul)=>$(ul).html(lines.slice(j===0?1:5,j===0?5:9).map(t=>`<li>${t}</li>`).join('')));
});

$('#section03 .cmn-cont-tit').each((_,el)=>$(el).text($(el).text().replaceAll('삼성베스트내과',brand)));
$('#section03 .cmn-cont-desc').each((_,el)=>$(el).html('현재의 건강 상태와 생활습관을 함께 살피고,<br /><b><u>개인에게 필요한 건강검진을 상담합니다.</u></b>'));
$('#section03 .cmn-cont-desc2').each((_,el)=>$(el).html('검진 항목은 연령과 건강 상태, 이전 검사 이력 등을 바탕으로 안내합니다.<br />제시된 프로그램은 페이지 구성을 위한 예시이며, 실제 검진 항목과 운영 여부는 병원에 확인해 주세요.'));
$('#section03 .se-tit b').text('구성 예시');
$('#section03 .cont-section figcaption').each((_,el)=>{
 const title=$(el).find('strong').text().trim();
 $(el).html(`<strong>${title}</strong>검사 내용과 준비사항을<br />상담을 통해 안내합니다.`);
});
$('#section03 .ico-wrap figcaption').each((i,el)=>{
 const titles=['개인별 건강상담','필요한 검진 안내','편안한 검사 준비','결과 확인 상담','지속적인 건강관리'];
 $(el).html(`<strong class="f2">${titles[i%5]}</strong>현재의 건강 상태와<br />개인별 상황을 살피고<br />필요한 과정을 안내합니다.`);
});
$('#section03 .list-txt').html('제출 기관의 요구 항목과 서류를 먼저 확인해 주세요.<br />검진 가능 여부와 소요 일정은 사전에 상담해 주세요.');
$('#section03 .caution-wrap .txt').html('방문 일정과 준비사항을 미리 확인해 주세요.<br />복용 중인 약과 기존 검사 자료가 있다면 상담 시 알려 주세요.<br />식사와 약 복용에 관한 사항은 의료진의 개별 안내를 따라 주세요.');
$('#section03 .emotion-wrap .box-left .title').html('당신의 건강을 함께 생각하는<br /><b>서울바른 건강검진 안내</b>');
$('#section03 .emotion-wrap .box-left .desc').html('검사 전 상담부터 결과를 확인하는 시간까지.<br />개인에게 필요한 안내를 차근차근 함께합니다.');
$('#section03 .emotion-wrap .item .txt').each((i,el)=>$(el).html(['<b>편안하게 머무는 공간</b><br />방문하는 순간부터 회복의 시간까지<br />당신의 편안함을 생각합니다.','<b>일상 가까이의 건강 파트너</b><br />몸의 작은 변화와 걱정에도<br />충분히 귀 기울입니다.','<b>개인별 검진 상담</b><br />연령과 건강 상태, 이전 검사 이력을<br />함께 확인하며 안내합니다.'][i]));
$('#section04 .ico-wrap figcaption').each((i,el)=>$(el).html(`<strong class="f2">${['충분한 사전 상담','검사 과정 안내','개인별 상태 확인','검사 후 결과 상담','회복 과정 안내'][i]}</strong>검사 전 걱정부터<br />검사 후 궁금한 사항까지<br />차근차근 안내합니다.`));
$('#section04 .info .desc').html('검사가 필요한 이유와 진행 과정을 이해할 수 있도록 안내합니다.');
$('#section04 .info .txt').html('검사 전 건강 상태와 복용 중인 약, 이전 검사 이력 등을 의료진에게 알려 주세요.<br /><br />검사에 필요한 준비와 회복 과정은 개인마다 다를 수 있으며, 의료진의 개별 안내를 확인해 주세요.');
$('#section04 .tip-txt').text('검사 방법과 진정 여부는 의료진 상담 후 결정합니다.');
$('#section05 .item-wrap .desc').each((_,el)=>{
 const title=$(el).closest('.inner').find('figcaption span').text();
 $(el).text(`${title}는 해당 부위의 상태를 살펴보는 검사입니다. 건강 상태와 이전 검사 결과를 함께 확인하고 검사 필요성을 상담합니다. 검사 준비와 과정에 대해 궁금한 점은 의료진에게 문의해 주세요. 구체적인 검사 항목과 결과에 대한 설명은 개별 상담으로 안내됩니다.`);
});
$('#section06 .item .info .desc').each((i,el)=>$(el).text(['매일의 건강 변화를 함께 살펴봅니다.','호흡기 불편함과 일상의 변화를 상담합니다.','몸의 변화에 귀 기울이는 건강관리.','불편함의 양상과 생활 환경을 함께 확인합니다.'][i]));
$('#section06 .item .info .txt').each((_,el)=>$(el).text('현재의 불편함과 생활습관, 복용 중인 약과 이전 검사 이력을 함께 확인합니다. 한 번의 진료를 넘어 일상에서 이어지는 관리를 생각하며, 개인에게 필요한 검사와 진료 방향을 상담합니다. 진료 후 궁금한 사항도 이해하기 쉽게 설명하는 과정을 지향합니다.'));
$('#section07 .circle-wrap .tit').each((i,el)=>$(el).text(['Listen','Explain','Care','Together'][i]));
$('#section07 .circle-wrap .desc').each((i,el)=>$(el).html(['작은 이야기에도<br />충분한 경청','이해하기 쉬운<br />자세한 설명','한 분 한 분을 위한<br />세심한 마음','건강한 일상을 위한<br />꾸준한 동행'][i]));
$('#section08 .item-wrap .tit').each((i,el)=>$(el).html(['현재의 몸 상태에 따른<br />개인별 상담','편안하게 머무는<br />회복 공간','생활 속 건강을 위한<br />영양 상담'][i]));
$('#section08 .item-wrap .txt').html('몸의 상태와 생활습관을<br />함께 확인하고 필요한<br />관리 방향을 상담합니다.');
$('#section08 .box-wrap .txt').html('건강 상태와 생활습관을 먼저 확인하고, 개인에게 필요한 관리 방향을 상담합니다. 치료 여부와 구체적인 방법은 의료진의 안내를 확인해 주세요.');
$('#section08 .box-wrap .txt2').html('개인별 건강 상태를 살피는 상담과<br />치료 과정에 대한 충분한 안내를 생각합니다.');
$('#section09 .item-wrap .info .tit').each((i,el)=>$(el).html(`개인별 접종 상담<br /><b>${['독감(인플루엔자)','폐렴구균','대상포진','HPV','A형 간염','B형 간염'][i]}</b>`));
$('#section09 .item-wrap .info ul').html('<li>· 접종 대상과 일정<br />건강 상태와 접종 이력에 따라 상담합니다.</li><li>· 방문 전 확인사항<br />실제 접종 가능 여부를 미리 확인해 주세요.</li>');
$('#section10 .item .tit').each((i,el)=>$(el).html(`${['위·대장내시경 검사 환경','검사 준비 공간','검사 과정 안내','검사실 관리 환경','초음파 검사 환경','건강검진 안내 공간','개인별 상태 상담','정기적인 건강 점검','진료 결과 상담'][i]}<br /><b>서울바른 데모 이미지</b>`));
$('#section10 .item .desc').text('개인에게 필요한 상담과 검사 과정을 생각한 데모 구성입니다. 이미지는 연출 예시이며 실제 장비의 종류, 모델이나 보유 현황을 나타내지 않습니다.');
$('#section12 .guide-txt').html('서울바른내과 위치 안내 <b class="pc">[실제 주소 연결 예정]</b>');
$('#section12 .time-table .table-txt').each((i,el)=>$(el).html(['오전 <b>09 : 00</b> - 오후 <b>06 : 00</b>','오후 <b>01 : 00</b> - 오후 <b>02 : 00</b>','오전 <b>09 : 00</b> - 오후 <b>01 : 00</b>'][i]));
$('#section12 .stxt').text('* 운영시간 예시 · 실제 진료시간 연결 예정');
$('#section12 .txt1').html('진료 및 예약 문의를 위한 안내입니다.<br />실제 상담 채널은 확인 후 연결됩니다.');
$('#section12 .tel a').text('연결 예정').attr('href','#contact');
$('#section12 .txt2').text('주차 안내 확인 후 연결 예정');
$('#footer address').html('서울바른내과 홈페이지 데모 ｜ 실제 예약·전화·주소는 연결되지 않습니다.<br />인물과 공간은 AI 생성 이미지이며 실제 의료진·시설과 다릅니다.<span>Copyright © 2026 SEOUL BAREUN MEDICAL CLINIC.</span>');
$('#footer ul a').eq(0).attr('href','#contact');$('#footer ul a').eq(1).attr('href','#section12');
$('.quick-wrap .btn-tel').attr('href','#contact').attr('aria-label','대표전화 안내');
$('.quick-wrap .btn-tel .f3').html('상담<br />연결<br />예정');
$('.quick-wrap a[target]').attr('href','#contact').removeAttr('target');
$('.quick-wrap a').each((_,el)=>{if(!$(el).attr('aria-label'))$(el).attr('aria-label',$(el).find('figcaption').text().trim()||'상담 안내');});
$('#section12 .map a').attr('aria-label','서울바른내과 위치 안내');
$('a[href^="tel:"],a[href^="https:"]').attr('href','#contact').removeAttr('target');
$('a.plus').each((_,el)=>$(el).attr('aria-label',`${$(el).siblings('.tit').text()} 바로가기`));
$('.btn-gnb').replaceWith('<button class="btn-gnb" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="gnb"><span></span><span></span><span></span></button>');
$('.arrow').each((_,el)=>$(el).attr('role','button').attr('tabindex','0').attr('aria-label',$(el).hasClass('arrow-prev')?'이전 슬라이드':'다음 슬라이드'));
$('.logos .logo1').html('<div class="reference-badge badge-gold"><span>✦</span><p>세심한 진료의 시작<br /><b>충분한 상담과 설명</b></p></div>');
$('.logos .logo2').html('<div class="reference-badge badge-red"><span>♥</span><p>건강한 일상을 위한<br /><b>건강검진 안내</b></p></div>');
$('.logos .logo3').html('<div class="reference-badge badge-gold"><span>✦</span><p>서울바른내과<br /><b>건강관리 파트너</b></p></div>');

const photos=['lobby','consultation','endoscopy','ultrasound','infusion','vaccination'];
function asset(file) {
 const basename=path.basename(file);
 if (/^(logo|logo_bt)\./.test(basename)) return '/images/seoul-bareun-logo.png';
 if (/cmn_symbol/.test(basename)) return '/reference-assets/brand-symbol.svg';
 if (/ico|keyvisual_prev|keyvisual_next|btn_detail|se11_btn/.test(basename)) return `/reference-assets/${basename}`;
 if (basename==='map_img.jpg') return '/reference-assets/demo-map.svg';
 if (/keyvisual_main/.test(basename)) return `/images/${['lobby','consultation','endoscopy'][Number(basename.match(/(\d+)\./)[1])-1]}.webp`;
 if (/se02_doctor/.test(basename)) return `/images/${basename==='se02_doctor1.png'?'physician':basename==='se02_doctor2.png'?'physician-02':'physician-03'}.webp`;
 if (/se01_bg/.test(basename)) return `/images/${['lobby','endoscopy','ultrasound','consultation','infusion','vaccination'][Number(basename.match(/(\d+)\./)[1])-1]}.webp`;
 if (/se03_bg|se07_bg/.test(basename)) return '/images/lobby.webp';
 if (/se03_.*img/.test(basename)) return '/images/consultation.webp';
 if (/se04_img/.test(basename)) return '/images/endoscopy.webp';
 if (/se05_img/.test(basename)) return '/images/ultrasound.webp';
 if (/se06_img/.test(basename)) return '/images/consultation.webp';
 if (/se08_img/.test(basename)) return `/images/${basename.includes('01')?'infusion':'consultation'}.webp`;
 if (/se09_img/.test(basename)) return '/images/vaccination.webp';
 if (/se10_img/.test(basename)) return `/images/${['endoscopy','ultrasound','consultation'][Number(basename.match(/(\d+)\./)[1])%3]}.webp`;
 if (/se11_img/.test(basename)) return `/images/${photos[(Number(basename.match(/(\d+)\./)[1])-1)%photos.length]}.webp`;
 return '/images/lobby.webp';
}
$('img').each((_,el)=>{
 const node=$(el),original=node.attr('src')??'';const name=path.basename(original);node.attr('src',asset(original));
 if(/keyvisual_main/.test(name)) node.attr('loading','eager');
 else if(!/logo|ico|cmn_symbol|btn_/.test(name)) node.attr('loading','lazy');
 if(/\.jpg$|doctor/.test(name)) node.addClass('demo-photo').attr('alt','서울바른내과 데모를 위한 AI 생성 이미지');
 if(/logo\./.test(name)) node.attr('alt','서울바른내과');
});
$('.img-btn li').each((i,el)=>$(el).attr('role','button').attr('tabindex','0').attr('aria-label',`공간 이미지 ${i+1} 보기`));
// Accessible names and headings retain the reference's classes and visual frames.
$('main section').each((_, section) => {
 const node=$(section), title=node.find('.cmn-tit .title').first();
 if(title.length) {
  const id=`${node.attr('id')}-heading`;
  title.replaceWith(`<h2 class="${title.attr('class')}" id="${id}">${title.html()}</h2>`);
  node.attr('aria-labelledby',id);
 }
});
$('#section03 .cmn-tit .title').not('#section03-heading').each((_,el)=>$(el).replaceWith(`<h3 class="${$(el).attr('class')}">${$(el).html()}</h3>`));
$('#content').attr('tabindex','-1');
$('#gnb').attr('aria-label','진료 안내');
$('#footer h2 img').attr('alt',brand);
$('.cmn-tit .symbol img').attr('alt','');
const photoAlt={lobby:'밝은 대기 공간',consultation:'편안한 상담 공간',endoscopy:'내시경 검사 공간',ultrasound:'초음파 검사 공간',infusion:'차분한 회복 공간',vaccination:'예방접종 상담 장면'};
$('img.demo-photo').each((_,el)=>{
 const node=$(el),name=path.basename(node.attr('src'),'.webp');
 node.attr('alt',`${photoAlt[name]??'의료진 소개 인물'} · AI 생성 데모 이미지`);
});
$('#keyvisualMain .box-image img').attr('alt','');
$('#section12 .map img').attr('alt','서울바른내과 위치 안내용 예시 지도 · 실제 위치 연결 예정');
$('.cmn-tit .desc').each((_,el)=>$(el).html($(el).html().replace(/<br\s*\/?>/gi,' <br> ')));
$('#keyvisualMain').attr('aria-label','서울바른내과 주요 안내').attr('aria-roledescription','캐러셀').attr('role','region');
$('#keyvisualMain .slide').append('<div class="reference-carousel-controls"><button type="button" class="reference-carousel-prev" aria-label="이전 주요 안내">←</button><span class="reference-carousel-count" aria-hidden="true">1 / 3</span><button type="button" class="reference-carousel-toggle" aria-label="자동 전환 일시정지" aria-pressed="false"><span class="reference-pause-icon" aria-hidden="true"></span><span class="reference-carousel-action">일시정지</span></button><button type="button" class="reference-carousel-next" aria-label="다음 주요 안내">→</button></div><span class="reference-sr-only reference-carousel-status" role="status" aria-live="polite" aria-atomic="true"></span>');
$('#gallery').attr('role','region').attr('aria-roledescription','캐러셀').attr('aria-label','병원 공간 둘러보기');
$('#gallery').append('<span class="reference-sr-only reference-gallery-status" role="status" aria-live="polite" aria-atomic="true"></span>');
$('.reference-carousel-prev').html('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg>');
$('.reference-carousel-next').html('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg>');
$('.quick-wrap .item-wrap').attr('id','reference-quick-links');
$('.quick-wrap').append('<button type="button" class="reference-quick-toggle" aria-label="빠른 메뉴 열기" aria-expanded="false" aria-controls="reference-quick-links"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 5h14v11H9l-4 3V5Z"/><path d="M8 9h8M8 12h5"/></svg><span class="reference-sr-only">빠른 메뉴</span></button>');
// Strip residual identity, scripts, inline animations and unsupported source advertising.
$('[style]').removeAttr('style');
$('[data-ani]').addClass('fixo-animate');
$('*').contents().each((_,node)=>{ if(node.type==='comment') $(node).remove(); });
let markup=$('#wrap').toString()+$('.quick-wrap').toString();
markup=markup.replaceAll('삼성베스트내과',brand).replaceAll('sansung best internal medicine clinic','seoul bareun internal medicine clinic');
if(/삼성의료원|삼성메디슨|6953|이태영|박종신|최기정/.test(markup)) throw new Error('Source identity remains');
if(/<script|on(?:click|load|error)=|https?:\/\//i.test(markup)) throw new Error('Unexpected executable or external content');
await mkdir('src/app/demo1',{recursive:true});
await writeFile('src/app/demo1/reference-content.json',JSON.stringify({markup},null,2));
for (const name of ['common','main']) {
 let css=await readFile(`reference-source/${name}.css`,'utf8');
 css=css.replace(/@charset[^;]+;/g,'').replace(/url\(['"]?\.\.\/_images\/([^)'"\s]+)['"]?\)/g,(_,file)=>`url('${asset(file)}')`);
 await writeFile(`src/app/demo1/reference-${name}.css`,css);
}
const fontFaces=[['GmarketWeb',300,'GmarketSansTTFLight'],['GmarketWeb',500,'GmarketSansTTFMedium'],['GmarketWeb',700,'GmarketSansTTFBold'],['NotoSansWeb',300,'NotoSansKR-Light'],['NotoSansWeb',400,'NotoSansKR-Regular'],['NotoSansWeb',500,'NotoSansKR-Medium'],['NotoSansWeb',700,'NotoSansKR-Bold']];
await writeFile('src/app/demo1/reference-fonts.css',fontFaces.map(([family,weight,file])=>`@font-face{font-family:'${family}';font-weight:${weight};font-style:normal;font-display:swap;src:url('/fonts/reference/${file}.woff') format('woff')}`).join('\n'));
const logoData=(await readFile('public/images/seoul-bareun-logo.png')).toString('base64');
await writeFile('public/reference-assets/brand-symbol.svg',`<svg xmlns="http://www.w3.org/2000/svg" viewBox="26 11 55 55"><image width="254" height="77" href="data:image/png;base64,${logoData}"/></svg>`);
await writeFile('public/reference-assets/demo-map.svg','<svg xmlns="http://www.w3.org/2000/svg" width="1380" height="580" viewBox="0 0 1380 580"><rect width="1380" height="580" fill="#edf0f3"/><g fill="#dbe2e7" stroke="#f7f8fa" stroke-width="15"><path d="M0 0H400V200H0Z M450 0H900V210H450Z M950 0H1380V200H950Z M0 260H400V580H0Z M450 270H900V580H450Z M950 260H1380V580H950Z"/></g><path d="M0 250H1380 M440 0V580 M930 0V580" stroke="white" stroke-width="45"/><rect x="1030" y="350" width="270" height="160" rx="60" fill="#d9e7da"/><circle cx="690" cy="250" r="40" fill="#0578b2"/><path d="M670 250h40M690 230v40" stroke="white" stroke-width="4"/><rect x="540" y="310" width="300" height="80" rx="8" fill="white"/><g font-family="sans-serif" text-anchor="middle"><text x="690" y="345" font-size="26" fill="#143b60">서울바른내과</text><text x="690" y="375" font-size="15" fill="#8295a7">실제 주소 연결 예정</text><text x="690" y="540" font-size="15" fill="#8295a7">DEMO MAP · 실제 지도가 아닌 화면 구성 예시</text></g></svg>');
console.log('Prepared reference DOM, styles, fonts and local asset mapping.');
