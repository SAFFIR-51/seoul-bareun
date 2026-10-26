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

## 건강채널

메인 대표 영상과 건강 상태 확인 영상은 유튜브로 연결됩니다. 나머지 두 항목은 클릭 시 저작권 관련 추후 연결 안내 팝업을 표시합니다. 연결 정보와 썸네일 경로는 `src/app/reference-content.json`에 있습니다.

## 저장소 관리

현재 실행 소스, 사용 중인 정적 파일, 패키지 잠금 파일과 설정을 보관합니다. 작업 캡처·원고·과거 시안·일회성 생성 스크립트·미사용 이미지 원본은 저장소 외부에 별도 보관합니다.

`node_modules/`, `.next/`, 환경변수 파일, 로그와 타입 검사 캐시는 Git에서 제외합니다. 외부 보관 자료가 없어도 `npm ci` 후 빌드할 수 있습니다.

## 이미지 안내

제공된 의료진 사진 외 일부 인물·시설·장비·설명 이미지는 AI 생성 시안입니다. 홈페이지의 관련 안내와 웹폰트 라이선스를 유지합니다.
