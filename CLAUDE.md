# CLAUDE.md

이 파일은 Claude Code가 **논스톱(NonStop) 프론트엔드 저장소**에서 작업할 때 따라야 할 지침이다.

## 기준 문서

문서끼리 충돌하면 아래 순서를 따른다.

1. 백엔드 개발자가 작성한 프론트엔드 작업 지시서(2026-11-07, 저장소 밖 파일). 범위 · 라우트 · 기기 저장 · 출석 스트릭 · API · 커밋 계획을 정한다.
2. [docs/design/nonstop-design-system.md](docs/design/nonstop-design-system.md), [docs/design/nonstop-design-tokens.md](docs/design/nonstop-design-tokens.md). 색 · 서체 · 컴포넌트 · 제스처 · 문구 규칙을 정한다. 이 두 문서는 원본 그대로 두고 수정하지 않는다.
3. 백엔드 저장소(`nonstop-be`)의 `CLAUDE.md`, `docs/spec.md`, `docs/decisions.md`, `openapi.yaml`(작성 전). API 계약의 기준이다. 프론트에서 임의로 API 형식을 정하지 않는다.
4. 노션 개발문서. 위 문서와 충돌하지 않는 화면 흐름만 참고한다. 노션 와이어프레임 v3의 색 · 탭 · 마스코트 · 하이라이트 · 제스처 규칙은 2번 문서로 대체됐다.

프론트 저장소 안의 문서는 다음과 같다.

| 문서                                             | 내용                                        |
| ------------------------------------------------ | ------------------------------------------- |
| [docs/spec.md](docs/spec.md)                     | 무엇을 만드는지 (화면 · 기능 · 정책 · 일정) |
| [docs/implementation.md](docs/implementation.md) | 지금 무엇이 어디까지 만들어졌는지           |
| `docs/design/`                                   | 디자인 시스템 · 디자인 토큰 (원본)          |
| `docs/plan/`, `docs/learn/`                      | 사용자 개인용. `.gitignore`로 커밋하지 않음 |

- 기능을 만들거나 바꾸면 `docs/implementation.md`를 같이 갱신한다.

## 현재 상태 (2026-11-11)

- 개발 브랜치는 `feat/demo-rebuild`다. 전 화면을 구현했고, 배포 백엔드(`https://nonstop-be.onrender.com`)로 API 6개 연동을 확인했다. 개발 기본값은 계속 MSW 목 모드다.
- API 계약은 백엔드 `openapi.yaml` v0.1.1을 따른다. `pnpm gen:api`로 만든 `src/shared/api/schema.d.ts`를 `types.ts`가 다시 내보낸다.
- 화면 · 디자인 기준은 `docs/design/` 디자인 시스템 0.3이다. 논문 카드 표지는 `src/shared/ui/PaperCover.tsx`(팀원 원본)를 쓴다. 팀 피드백으로 달라진 부분과 상태별 동작은 `docs/interaction.md`에 있다.
- 이전에 만든 코드는 로컬 브랜치 `feat/demo-scope-no-login`에 보관한다.

## 작업 방식

- **사용자가 직접 개발을 주도한다.** Claude는 사용자가 지시한 범위만 작업한다. 방향 제안을 요청받으면 제안만 하고 구현하지 않는다. 계획서나 작업 지시서에 다음 단계가 적혀 있어도 사용자가 진행을 지시하기 전에는 실행하지 않는다.
- 커밋과 브랜치 생성은 사용자가 요청할 때만 한다. **push는 사용자가 직접 하며 Claude는 하지 않는다.**
- 코드를 작성하거나 고치면 무엇을 왜 바꿨는지 파일 단위로 설명한다.
- 문서는 이모지 없이 문서체로 쓴다.
- MSW 목을 끝까지 유지하고, 환경 변수로 실제 API와 목을 전환한다. 발표 시연이 백엔드 상태에 묶이지 않게 하기 위해서다.

## 프로젝트 개요

**논스톱(NonStop)** 은 arXiv 논문을 AI가 카드로 재구성해 매일 한 편씩 읽게 하는 웹 서비스다. 캐릭터는 쳇바퀴를 달리는 햄스터다.

| 항목      | 내용                                                            |
| --------- | --------------------------------------------------------------- |
| 범위      | 2026 ITM전공 IT 서비스 공모전 출품용 데모                       |
| 타깃      | IT 관련 분야 학부생과 대학원생                                  |
| 마감      | 2026-11-18 발표 · 제출                                          |
| 운영 기간 | 2026-11-08 ~ 2026-11-30 (이용약관 시행일 2026-11-08)            |
| 팀        | 프론트 2명(구현은 사용자 1명, 다른 1명은 PR 피드백), 백엔드 2명 |
| 로그인    | 없음. 사용자 데이터는 브라우저 localStorage에만 저장            |
| 백엔드    | FastAPI, Render 무료 웹 서비스(콜드 스타트 약 1분)              |

## 기술 스택

| 영역          | 선택                                                                  |
| ------------- | --------------------------------------------------------------------- |
| 프레임워크    | React + Vite (SPA), TypeScript                                        |
| 스타일        | Tailwind CSS 4 + 디자인 토큰 (`docs/design/nonstop-design-tokens.md`) |
| 데이터 · 상태 | TanStack Query (서버 상태), Zustand `persist` (기기 저장)             |
| API           | `openapi.yaml` → openapi-typescript 타입 생성, 개발 중에는 MSW 목     |
| 제스처        | 피드는 CSS scroll-snap + 포인터 이벤트, 온보딩 카드 드래그는 Motion   |
| 도구          | pnpm, ESLint + Prettier, Vitest + Testing Library, GitHub Actions CI  |
| 배포          | Firebase Hosting (배포에만 사용, Firebase JS SDK는 쓰지 않음)         |

- Firebase JS SDK, PWA(서비스 워커), FCM은 데모 범위에서 빠져 쓰지 않는다.

## 명령어

| 명령             | 하는 일                                         |
| ---------------- | ----------------------------------------------- |
| `pnpm dev`       | 개발 서버 (기본은 MSW 목 모드)                  |
| `pnpm build`     | 타입 검사 후 배포용 빌드(`dist/`)               |
| `pnpm lint`      | ESLint                                          |
| `pnpm typecheck` | TypeScript 검사                                 |
| `pnpm test`      | Vitest 1회 실행 (`pnpm test:watch`는 감시 모드) |
| `pnpm format`    | Prettier로 정리 (`format:check`는 검사만)       |
| `pnpm gen:api`   | `../nonstop-be/openapi.yaml`에서 API 타입 생성  |

- 커밋 전에 `format:check`, `lint`, `typecheck`, `test`, `build`가 모두 통과해야 한다. CI도 같은 순서로 검사한다.

| 환경 변수           | 내용                                      |
| ------------------- | ----------------------------------------- |
| `VITE_API_BASE_URL` | 백엔드 주소. 비우면 같은 출처             |
| `VITE_API_MOCK`     | `false`일 때만 실제 API, 그 외에는 MSW 목 |
| `VITE_DEMO_TOOLS`   | `true`일 때만 시연 도구(`/demo`) 등록     |

## 버전 메모

- TypeScript는 6.0을 쓴다. 7.0은 typescript-eslint가 아직 지원하지 않는다.
- MSW는 v3다. 처리되지 않은 요청 옵션 이름이 `onUnhandledFrame`이다(v2의 `onUnhandledRequest` 아님).
- 이 PC는 `core.autocrlf=true`라 git 작업 뒤 줄바꿈이 CRLF로 바뀌어 `pnpm format:check`가 실패할 수 있다. 이 경우 `pnpm format`으로 다시 정리한다.

## 디자인 원칙 (요약)

세부 규칙은 `docs/design/` 두 문서를 따른다. 아래는 요약이다.

- 색은 잉크 계열과 살구색 두 가지만 쓴다. 살구색 면(`bg-accent`)은 한 화면에 하나만 둔다. 형광펜(`bg-highlight`)은 논문의 한 줄 요약(`oneLine`)에만 쓴다.
- 화면을 읽기 면(피드, 논문 카드, 상세, 저장함)과 루틴 면(출석 스트릭, 온보딩, 빈 화면, 오류)으로 나눈다. 마스코트와 살구색 면은 루틴 면에만 쓴다.
- 서체는 Pretendard 하나다. 논문 제목 아래에 영어 원제를 항상 함께 표기하고, arXiv ID · 날짜 · 일수에는 `tabular-nums slashed-zero`를 쓴다.
- 라이트 모드만 쓴다. 단, 피드는 팀 피드백(2026-11-11)에 따라 어두운 배경(`.theme-dark`)으로 둔다.
- 하단 탭은 홈 · 피드 · 저장함 · 메뉴 4개다.
- 가로 제스처는 피드에서 상세로 가는 오른쪽 스와이프와, 홈 오늘의 논문 가로 넘김(팀 피드백 2026-11-11)만 쓴다. 화면 왼쪽 가장자리 20px 안에서 시작한 제스처는 무시한다. 두 번 누르기, 길게 누르기는 쓰지 않는다.
- 로딩은 스켈레톤만 쓴다. 원형 스피너와 햄스터 로더는 쓰지 않는다.
- 색은 토큰 유틸리티로만 쓴다. 16진 색, 대괄호 임의 값, 그라데이션, 블러, 장식 그림자를 쓰지 않는다.
- 문구는 해요체로 쓰고, 줄표 · 느낌표 · 이모지를 쓰지 않는다. AI 생성물에는 항상 "AI 요약" 배지를 붙인다.
- 화면 문구는 한국어만 쓴다.

## 절대 규칙

1. **원문 보기는 arXiv 초록 페이지를 새 탭으로 열기만 한다.** PDF를 앱 안에 띄우거나 저장 · 프록시하지 않는다.
2. **AI 생성 카드는 항상 "AI 요약"으로 표시한다.** 편집팀 해설은 데모 범위 외다.
3. **Gemini를 프론트에서 직접 호출하지 않는다.** 비밀 키를 이 저장소에 두지 않는다. `.env`는 커밋하지 않고 `.env.example`에는 키 이름만 적는다.
4. **사용자 데이터는 기기에만 저장하고, 서버에 개인정보를 보내지 않는다.** 로그인 · 인증 헤더가 없다. 개인화에 필요한 관심 키워드와 이미 읽은 논문 ID만 요청 파라미터로 보낸다.
5. 회원 가입 · 동의 화면이 없다. 첫 화면에서 이용약관(`/terms`)을 확인할 수 있게 안내하고, 서비스 이용을 약관 동의로 본다.
6. 제외 범위(커뮤니티 · 댓글, 레벨 등 게이미피케이션, 읽기 기록 · 통계 화면, 홈 이어보기, 결제, 다국어)와 데모 범위 외 기능(로그인, 알림, PWA, 검색, 폴더, 좋아요, 챗봇, 편집팀 해설, 개정판 배지, 화제의 논문)은 명시적인 지시 없이 구현하지 않는다. 출석 스트릭은 2026-11-07 제외 범위에서 해제됐다.
7. API 형식은 백엔드 `openapi.yaml`이 기준이다. 프론트에서 임의로 바꾸지 않고, 바뀌면 `src/shared/api/types.ts`와 MSW 핸들러를 함께 고친다.
8. **`main`에 직접 커밋하지 않는다.** 모든 변경은 작업 브랜치에서 PR로 병합한다.

## 기기 저장 (localStorage)

| 키                   | 내용                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| `nonstop:v1:profile` | `keywords`(직접 고른 키워드), `interests`(키워드 슬러그와 가중치), `defaultLevel`, `onboardedAt` |
| `nonstop:v1:saves`   | `{ paperId, savedAt }` 배열                                                                      |
| `nonstop:v1:streak`  | `current`, `longest`, `lastDate`(YYYY-MM-DD), `recentDates`(최근 7개)                            |
| `nonstop:v1:read`    | 최근 읽은 `paperId` 최대 50개 (홈 추천 제외용)                                                   |

- 모든 읽기 · 쓰기는 실패할 수 있다고 보고 처리한다. 저장소가 비어 있으면 처음 방문으로 본다.
- 기기 데이터 초기화는 `nonstop:v1:` 접두사 키를 모두 지운다.
- 출석은 한국 날짜 기준 그날 논문 상세를 한 번 이상 열면 인정한다. 날짜는 기기 시계가 아니라 `GET /v1/home` 응답의 `today`를 쓴다.

## API (백엔드 `CLAUDE.md` 기준)

| 메서드 | 경로                   | 프론트 사용처              |
| ------ | ---------------------- | -------------------------- |
| GET    | /v1/onboarding/cards   | 온보딩 카드 평가 10장      |
| POST   | /v1/onboarding/weights | 온보딩 완료, 키워드 가중치 |
| GET    | /v1/home               | 홈, 출석 판정용 `today`    |
| GET    | /v1/feed               | 피드 (커서 페이지네이션)   |
| GET    | /v1/papers/{paperId}   | 상세 (`level`)             |
| GET    | /v1/papers             | 저장함 (`ids`)             |

- 인증 헤더 없이 요청한다. 오류 응답은 RFC 9457 Problem Details(`application/problem+json`)와 `code` 필드다.
- `paperId`는 버전 없는 arXiv ID이고, 구형 ID의 `/`는 `_`로 바뀐다. URL에 넣을 때 `encodeURIComponent`를 쓴다.
- 논문 `status`는 `ready`, `hidden`만 있고 `hidden`은 목록에서 거른다.
- 첫 요청 제한 시간은 70초로 두고, 3초가 지나면 "서버를 깨우는 중이에요. 잠시만 기다려 주세요"를 보여 준다.

## 브랜치 전략 (GitHub Flow, 백엔드와 동일)

- 최신 `main`에서 작업 하나당 브랜치 하나, 이름은 `<type>/<short-description>`. type은 Conventional Commits와 같다.
- PR은 리뷰 승인 없이 작성자가 직접 병합하고, merge commit을 쓴다.
- 커밋 메시지는 Conventional Commits 형식으로 성격별로 나눈다.

## 학습 문서 규칙

- 사용자는 React 경험이 조금 있다. 새 개념이 처음 등장하면 `docs/learn/`에 문서를 추가하거나 갱신하고 `docs/learn/README.md` 목록에 링크한다. 이 폴더는 커밋하지 않는다.
- 삭제한 기능의 학습 문서는 남겨 둬도 된다.
- 사용자가 준 메모와 참고 링크는 해당 학습 문서의 "내 메모" 절에 그대로 남긴다.
