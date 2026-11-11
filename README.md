# 논스톱(NonStop) 프론트엔드

arXiv 논문을 AI가 카드로 재구성해 매일 한 편씩 읽게 하는 웹 서비스의 프론트엔드 저장소다. 2026 ITM전공 IT 서비스 공모전 출품용 데모이며, 로그인 없이 사용자 데이터를 브라우저 localStorage에만 저장한다.

| 문서                                             | 내용                                               |
| ------------------------------------------------ | -------------------------------------------------- |
| [CLAUDE.md](CLAUDE.md)                           | 작업 규칙, 절대 규칙, 기기 저장 키, API 요약       |
| [docs/spec.md](docs/spec.md)                     | 무엇을 만드는지 (화면 · 기능 · 정책 · 일정)        |
| [docs/implementation.md](docs/implementation.md) | 지금 무엇이 어디까지 만들어졌는지                  |
| [docs/interaction.md](docs/interaction.md)       | 컴포넌트 상태별 동작, 화면 전환                    |
| [docs/design/](docs/design/)                     | 디자인 시스템 · 디자인 토큰 원본 (수정하지 않는다) |

## 1. 로컬에서 실행하기

### 1.1 준비물

| 도구    | 버전      | 비고                                     |
| ------- | --------- | ---------------------------------------- |
| Node.js | 24        | CI와 같은 버전                           |
| pnpm    | 12.18     | `package.json`의 `packageManager`에 고정 |
| Git     | 최신 버전 |                                          |

pnpm이 없으면 아래 둘 중 하나로 설치한다.

```bash
corepack enable
```

```bash
npm install -g pnpm
```

Windows PowerShell에서 `pnpm` 실행 시 "스크립트를 실행할 수 없습니다" 오류가 나면 실행 정책 때문이다. 현재 사용자 범위에서 `RemoteSigned`로 바꾸거나 Git Bash · 명령 프롬프트에서 실행한다.

### 1.2 설치와 실행

```bash
git clone https://github.com/nonstop-2026/nonstop-fe.git
cd nonstop-fe
pnpm install
pnpm dev
```

브라우저에서 `http://localhost:5173`을 연다. 기본은 **목 모드**라 백엔드 없이 모든 화면이 동작한다. 목 서버(MSW)가 브라우저 안에서 API 요청을 가로채 가짜 논문 45편을 돌려준다.

화면은 모바일 기준(최대 폭 480px)이므로 개발자 도구의 기기 모드(375 x 812 등)로 보는 것을 권장한다.

### 1.3 환경 변수

`.env.example`을 복사해 `.env.local`을 만들고 필요한 값만 채운다. `.env.local`은 커밋하지 않는다.

| 변수                | 값                                              | 기본 동작        |
| ------------------- | ----------------------------------------------- | ---------------- |
| `VITE_API_MOCK`     | `false`일 때만 실제 API, 그 외에는 MSW 목       | 목 모드          |
| `VITE_API_BASE_URL` | 백엔드 주소 (`https://nonstop-be.onrender.com`) | 같은 출처로 요청 |
| `VITE_DEMO_TOOLS`   | `true`일 때만 시연 도구(`/demo`) 등록           | 등록하지 않음    |

환경 변수를 바꾼 뒤에는 개발 서버를 다시 시작한다.

**시연 도구 켜기.** `.env.local`에 `VITE_DEMO_TOOLS=true`를 넣으면 `/demo`에서 출석 스트릭을 12일째로 맞추거나 기기 데이터를 초기화할 수 있다.

**실제 백엔드에 연결하기.** `.env.local`에 아래 두 줄을 넣고 개발 서버를 다시 시작한다. 배포된 백엔드는 `http://localhost:5173`을 CORS 허용 출처로 두고 있어 개발 서버에서 바로 붙는다. 끝나면 `VITE_API_MOCK`을 지워 목 모드로 되돌린다.

```
VITE_API_BASE_URL=https://nonstop-be.onrender.com
VITE_API_MOCK=false
```

백엔드는 Render 무료 서버라 15분 동안 요청이 없으면 잠든다. 깨어나는 첫 요청은 1분 가까이 걸리며, 이때 화면 위에 "서버를 깨우는 중이에요" 안내가 뜬다. 백엔드를 로컬에서 띄울 때는 백엔드 `CLAUDE.md`의 실행 방법을 따르고 주소를 `http://localhost:8000`으로 바꾼다.

### 1.4 명령어

| 명령             | 하는 일                                         |
| ---------------- | ----------------------------------------------- |
| `pnpm dev`       | 개발 서버                                       |
| `pnpm build`     | 타입 검사 후 배포용 빌드(`dist/`)               |
| `pnpm preview`   | 빌드 결과를 로컬에서 미리 보기                  |
| `pnpm lint`      | ESLint (디자인 토큰 규칙 포함)                  |
| `pnpm typecheck` | TypeScript 검사                                 |
| `pnpm test`      | Vitest 1회 실행 (`pnpm test:watch`는 감시 모드) |
| `pnpm format`    | Prettier로 정리 (`pnpm format:check`는 검사만)  |
| `pnpm gen:api`   | `../nonstop-be/openapi.yaml`에서 API 타입 생성  |

PR을 올리기 전에 `format:check`, `lint`, `typecheck`, `test`, `build`가 모두 통과해야 한다. GitHub Actions CI도 같은 순서로 검사한다.

Windows에서 `core.autocrlf=true`이면 줄바꿈이 CRLF로 바뀌어 `format:check`가 실패할 수 있다. 이 경우 `pnpm format`을 한 번 실행한다.

### 1.5 처음 화면부터 다시 보기

데이터는 브라우저 localStorage의 `nonstop:v1:` 접두사 키에 저장된다. 온보딩부터 다시 보려면 메뉴 > 기기 데이터 > 기기 데이터 초기화를 누르거나, 개발자 도구에서 해당 키를 지운다.

## 2. 기술 스택

| 영역       | 사용 기술                        |
| ---------- | -------------------------------- |
| 화면       | React 19, TypeScript 6.0, Vite 8 |
| 라우팅     | React Router 8                   |
| 스타일     | Tailwind CSS 4 + 디자인 토큰     |
| 서버 상태  | TanStack Query 5                 |
| 기기 저장  | Zustand 5 `persist`              |
| 애니메이션 | Motion                           |
| 목 서버    | MSW 3                            |
| 테스트     | Vitest, Testing Library          |
| 배포       | Firebase Hosting                 |

## 3. 파일 구조

```
nonstop-fe/
├─ docs/                 명세 · 구현 현황 · 디자인 문서
├─ public/               파비콘, MSW 서비스 워커(mockServiceWorker.js)
├─ src/
│  ├─ app/               진입점, 라우터, 레이아웃(하단 4탭), 전역 CSS(디자인 토큰)
│  ├─ features/          화면 단위 폴더. 서로 import하지 않는다
│  │  ├─ start/            시작 화면
│  │  ├─ onboarding/       관심 분야 선택 · 카드 10장 평가 · 완료
│  │  ├─ home/             홈 (출석 스트릭, 오늘의 논문, 추천)
│  │  ├─ feed/             피드 (세로 스냅, 무한 스크롤)
│  │  ├─ paper/            논문 상세, 출석 인정
│  │  ├─ saves/            저장함
│  │  ├─ menu/             메뉴 · 관심 키워드 · 설정
│  │  ├─ terms/            이용약관
│  │  └─ demo/             시연 도구
│  ├─ shared/            여러 화면이 함께 쓰는 코드
│  │  ├─ api/              fetch 래퍼(client.ts), 쿼리 훅(queries.ts), 생성 타입(schema.d.ts) · 별칭(types.ts)
│  │  ├─ store/            localStorage 저장(device.ts), 토스트, 서버 깨우는 중 상태
│  │  ├─ lib/              출석 판정(streak.ts), 날짜 · 파라미터 포맷, 공유
│  │  ├─ ui/               PaperCover · PaperCard · 버튼 · 칩 · 바텀시트 등 공통 컴포넌트
│  │  ├─ constants/        분야 · 키워드 · 읽기 수준 라벨
│  │  └─ config/           환경 변수
│  ├─ mocks/             MSW 핸들러(API 6개)와 목 논문 데이터
│  └─ test/              Vitest 설정
├─ eslint.config.js      린트 규칙 (16진 색 · 임의 값 · 그라데이션 등 금지)
├─ vite.config.ts        Vite · Vitest 설정, `@` 경로 별칭(`@/` = `src/`)
└─ firebase.json         Firebase Hosting 설정
```

- 새 화면은 `src/features/<이름>/`에 만들고 `src/app/router.tsx`에 경로를 등록한다.
- 두 곳 이상에서 쓰는 코드는 `src/shared/`로 옮긴다.
- `src/shared/ui/PaperCover.tsx`는 팀원 원본이라 Prettier 대상에서 제외한다.

## 4. 명세 요약

### 4.1 화면

| 경로                    | 화면                                                      |
| ----------------------- | --------------------------------------------------------- |
| `/`                     | 시작. 온보딩을 마쳤으면 `/home`으로 이동                  |
| `/onboarding/interests` | 관심 분야 선택 (키워드 15개 중 3개 이상)                  |
| `/onboarding/swipe`     | 논문 카드 10장 평가 (별로예요 · 건너뛰기 · 흥미로워요)    |
| `/onboarding/done`      | 취향 분석 결과, 기본 읽기 수준 선택                       |
| `/home`                 | 출석 스트릭, 오늘의 논문, 추천 논문                       |
| `/feed`                 | 세로로 한 장씩 넘기는 피드 (어두운 배경)                  |
| `/papers/:paperId`      | 논문 상세 (읽기 수준별 요약, 원문 보기)                   |
| `/saves`                | 저장함                                                    |
| `/menu`                 | 메뉴 (기본 읽기 수준, 관심 키워드, 기기 데이터, 이용약관) |
| `/terms`                | 이용약관                                                  |
| `/demo`                 | 시연 도구 (`VITE_DEMO_TOOLS=true`일 때만)                 |

하단 탭은 홈 · 피드 · 저장함 · 메뉴 4개다.

### 4.2 API

API 형식은 백엔드 `openapi.yaml`이 기준이다. `pnpm gen:api`가 백엔드 저장소(`../nonstop-be`)의 명세로 `src/shared/api/schema.d.ts`를 만들고, `types.ts`가 이를 화면에서 쓰는 이름으로 다시 내보낸다. 인증 헤더 없이 요청하고, 오류는 RFC 9457 Problem Details 형식이다.

| 메서드 | 경로                   | 사용처                             |
| ------ | ---------------------- | ---------------------------------- |
| GET    | /v1/onboarding/cards   | 온보딩 카드 10장                   |
| POST   | /v1/onboarding/weights | 온보딩 완료, 키워드 가중치 계산    |
| GET    | /v1/home               | 홈, 출석 판정용 오늘 날짜(`today`) |
| GET    | /v1/feed               | 피드 (커서 페이지네이션)           |
| GET    | /v1/papers/{paperId}   | 논문 상세 (`level`)                |
| GET    | /v1/papers             | 저장함 (`ids`)                     |

API가 바뀌면 `pnpm gen:api`를 다시 실행하고 `src/mocks/handlers.ts`를 함께 고친다. 백엔드는 Render 무료 서버라 첫 요청이 1분가량 걸릴 수 있어, 요청이 3초를 넘으면 "서버를 깨우는 중이에요" 안내를 띄우고 70초에서 끊는다.

### 4.3 기기 저장 (localStorage)

| 키                   | 내용                                                              |
| -------------------- | ----------------------------------------------------------------- |
| `nonstop:v1:profile` | 직접 고른 키워드, 키워드 가중치, 기본 읽기 수준, 온보딩 완료 시각 |
| `nonstop:v1:saves`   | 저장한 논문 ID와 저장 시각                                        |
| `nonstop:v1:streak`  | 현재 · 최장 연속 출석일, 마지막 출석일, 최근 7일                  |
| `nonstop:v1:read`    | 최근 읽은 논문 ID 최대 50개 (홈 추천 제외용)                      |

출석은 한국 날짜 기준으로 그날 논문 상세를 한 번 이상 열면 인정한다. 날짜는 기기 시계가 아니라 `GET /v1/home` 응답의 `today`를 쓴다.

### 4.4 지켜야 할 규칙

- 원문 보기는 arXiv 초록 페이지를 새 탭으로 열기만 한다. PDF를 앱 안에 띄우지 않는다.
- AI가 만든 내용에는 항상 "AI 요약" 배지를 붙인다.
- 개인정보를 서버에 보내지 않는다. 개인화에는 관심 키워드와 읽은 논문 ID만 요청 파라미터로 보낸다.
- 색은 디자인 토큰 유틸리티(`bg-surface`, `text-fg` 등)로만 쓴다. 16진 색, `[...]` 임의 값, 그라데이션, 블러는 린트에서 막는다.
- 화면 문구는 한국어 해요체로 쓰고 줄표 · 느낌표 · 이모지를 쓰지 않는다.
- 로딩은 스켈레톤만 쓴다.

세부 규칙은 [CLAUDE.md](CLAUDE.md)와 [docs/design/](docs/design/)을 따른다.

## 5. 브랜치와 커밋

- `main`에 직접 커밋하지 않는다. 최신 `main`에서 `<type>/<짧은-설명>` 브랜치를 만들고 PR로 병합한다.
- 커밋 메시지는 Conventional Commits 형식(`feat:`, `fix:`, `docs:` 등)을 쓴다.
