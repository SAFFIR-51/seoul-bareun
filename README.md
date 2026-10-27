# 서울바른내과 홈페이지

Next.js App Router, React, TypeScript, Tailwind CSS로 만든 홈페이지입니다.

## 실행

```bash
npm ci
npm run dev -- --port 3001
```

브라우저에서 http://localhost:3001 을 엽니다.

## 빌드 및 확인

```bash
npm run build
npm run typecheck
npm start -- --port 3001
```

타입 검사는 최초 빌드 후 실행하면 Next.js가 생성하는 라우트 타입도 포함합니다.

## 페이지

- `/`: 메인 홈페이지
- `/demo1`: 기존 주소로 접속하면 `/`로 영구 이동

## 프로젝트 구성

- `src/app/layout.tsx`: 공통 레이아웃과 검색·공유 메타데이터
- `src/app/globals.css`: 공통 스타일
- `src/app/`: 홈페이지 화면 코드와 스타일
- `src/app/reference-content.json`: 현재 페이지에서 사용하는 본문 HTML 데이터
- `src/app/reference-experience.tsx`: 메뉴·탭·갤러리·팝업 동작
- `public/images/`: 페이지와 공유 미리보기에서 사용하는 이미지
- `public/reference-assets/`: 페이지에서 사용하는 아이콘과 정적 이미지
- `public/fonts/`: 로컬 웹폰트와 라이선스

`reference-content.json`과 `reference-*.css`는 현재 실행 코드이므로 유지해야 합니다.

## 보유 장비와 인공신장실

원장 소개에는 한정석 원장만 표시합니다. 건강채널 본문과 관련 메뉴는 표시하지 않습니다.

- `src/app/clinic-refinement.css`: PC·태블릿·모바일 레이아웃, 의료 아이콘과 추가 콘텐츠 스타일
- `src/app/*-refinement.css`, `src/app/mobile-polish.css`: 내시경·초음파·인공신장실·보유 장비·예방접종의 섹션별 스타일과 모바일 보완
- `src/app/clinical-sources.json`: 실제 참고 사진·검사 영상의 원본 주소·저작자·라이선스
- `public/images/clinical/`: 실제 초음파·X선·혈액투석 참고 사진
- `public/images/clinical-care/`: 과도한 확대를 피한 실제 내시경 영상과 장비·진료·병실 참고 사진
- `public/images/equipment/`: 제공된 PPT에서 추출한 CV-290·LOGIQ Totus 이미지
- `public/images/equipment/olympus-cv290-cutout.webp`: CV-290 이미지의 배경을 제거한 투명 WebP
- `public/videos/equipment-intro.mp4`: 제공 이미지와 장비 설명으로 구성한 18초 소개 영상(무음, H.264)
- `public/videos/equipment-ko.vtt`: 영상 한국어 자막
- `public/icons/medical/`: Health Icons 기반 의료 전용 아이콘, Lucide 안내 아이콘과 라이선스
- `public/icons/clinic-overview/`: 진료·검진 안내에 사용하는 선형 아이콘과 라이선스

외부 임상 자료는 본원 환자의 검사 결과나 실제 시설 사진으로 표시하지 않습니다. 출처는 페이지 하단에서 펼쳐 볼 수 있습니다. 장비 영상은 이미지 기반 소개 영상이며 원내 촬영 영상이 아닙니다.

장비 기능 확인 자료:
- [OLYMPUS CV-290 제조사 안내](https://mdc.olympus.eu/asset/084438885177/ee81217fcf9efd365bb045376c78bc6f?content-disposition=inline)
- [GE LOGIQ Totus 제조사 안내](https://www.gehealthcare.com/en-us/products/ultrasound/logiq/totus)

내시경 30,000회·10,000회는 사용자 제공 수치로 반영했습니다. 대표전화, 점심시간, 주차, 비급여 및 검진 프로그램의 미확정 내용은 기존 안내를 유지했습니다. 실제 공개 전 병원 운영 정보와 최종 검진 항목을 반영해야 합니다.

## 저장소 관리

현재 실행 소스, 사용 중인 정적 파일, 패키지 잠금 파일과 설정을 보관합니다. 작업 캡처·원고·과거 시안·일회성 생성 스크립트·미사용 이미지 원본은 저장소 외부에 별도 보관합니다.

`node_modules/`, `.next/`, 환경변수 파일, 로그와 타입 검사 캐시는 Git에서 제외합니다. 외부 보관 자료가 없어도 `npm ci` 후 빌드할 수 있습니다.

## 이미지 안내

한정석 원장 및 보유 장비는 제공 자료를 사용합니다. 내시경 안내에는 실제 위내시경·작은 대장 용종 영상을 카드 너비에 맞춰 표시하고, 장비·진료·병실 사진을 함께 사용합니다. 망막 확대 사진은 실제 건강관리 사진으로 대체했습니다. 초음파·X선은 실제 외부 검사 영상이며, 병실·투석실 및 건강관리 장면은 외부 참고 사진입니다. 외부 사진을 본원 시설이나 환자의 사진으로 표시하지 않습니다. 일부 기존 인물·시설 이미지는 AI 생성 예시이므로 관련 안내를 유지합니다. 웹폰트 및 아이콘 라이선스를 함께 보관합니다.
