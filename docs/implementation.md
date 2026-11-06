# 논스톱 프론트엔드 구현 현황

| 항목      | 내용                                                                      |
| --------- | ------------------------------------------------------------------------- |
| 문서 버전 | 0.1                                                                       |
| 기준 시점 | 2026-11-06                                                                |
| 관련 문서 | [spec.md](spec.md) (무엇을 만들지), [CLAUDE.md](../CLAUDE.md) (작업 규칙) |

## 1. 이 문서와 spec.md의 차이

| 문서                | 답하는 질문                            | 바뀌는 때             |
| ------------------- | -------------------------------------- | --------------------- |
| `spec.md`           | 무엇을 만들어야 하나 (요구사항 · 정책) | 기획 · 범위가 바뀔 때 |
| `implementation.md` | 무엇으로, 어떻게, 어디까지 만들었나    | 코드가 바뀔 때마다    |

- spec.md는 목표, 이 문서는 현재 상태임. 둘이 다르면 아직 못 만든 부분이거나 문서를 갱신해야 하는 부분임.

## 2. 기술 스택

| 영역          | 사용한 것                                         | 버전            | 용도                                                           |
| ------------- | ------------------------------------------------- | --------------- | -------------------------------------------------------------- |
| UI 라이브러리 | React                                             | 19.3            | 화면을 컴포넌트로 구성                                         |
| 빌드 · 개발   | Vite                                              | 8.3             | 개발 서버, 배포용 빌드(`dist/`)                                |
| 언어          | TypeScript                                        | 6.0             | 타입 검사. 7.0은 typescript-eslint 미지원으로 사용 안 함       |
| 라우팅        | React Router                                      | 8.5             | 주소 ↔ 화면 연결, 하단 탭 레이아웃                             |
| 스타일        | Tailwind CSS                                      | 4.3             | 클래스 조합 스타일, `@theme` 디자인 토큰                       |
| 글꼴          | Pretendard                                        | 1.3             | 한국어 본문 글꼴(npm 패키지로 내장)                            |
| 서버 상태     | TanStack Query                                    | 5.106           | API 요청 · 캐시 · 무한 스크롤 · 낙관적 업데이트                |
| 전역 UI 상태  | Zustand                                           | 5.0             | 기기 설정 · 최근 검색어 · 토스트 · 온보딩 진행 상태            |
| 애니메이션    | Motion                                            | 14.9            | 온보딩 카드 드래그, 바텀시트, 토스트                           |
| 인증          | Firebase JS SDK (`firebase/app`, `firebase/auth`) | 13.2            | ID Token 발급. 초기화 코드만 있음, 로그인 연결 전              |
| 목 서버       | MSW                                               | 3.0             | 백엔드 없이 가짜 API 응답(브라우저 · 테스트 공용)              |
| API 타입 생성 | openapi-typescript                                | 7.13            | `openapi.yaml`이 나오면 타입 자동 생성(`pnpm gen:api`). 미사용 |
| PWA           | vite-plugin-pwa + workbox-window                  | 2.0 / 7.4       | 매니페스트 · 서비스 워커 생성                                  |
| 테스트        | Vitest + Testing Library + jsdom                  | 5.1 / 16.3 / 30 | 단위 · 컴포넌트 테스트                                         |
| 코드 품질     | ESLint + Prettier                                 | 10.14 / 3.9     | 실수 검사 · 코드 모양 통일                                     |
| 패키지 관리   | pnpm                                              | 12.18           | 설치 · 명령 실행                                               |
| CI            | GitHub Actions                                    | -               | PR마다 포맷 · 린트 · 타입 · 테스트 · 빌드                      |
| 배포          | Firebase Hosting                                  | -               | `firebase.json`만 작성. 아직 배포 안 함                        |

## 3. 기능별 구현 현황

### 3.1 상태 표기

| 상태     | 의미                                                     |
| -------- | -------------------------------------------------------- |
| `동작`   | 목 데이터 기준으로 끝까지 동작함                         |
| `기기만` | 동작하지만 서버가 아닌 브라우저(localStorage)에만 저장함 |
| `UI만`   | 화면은 있으나 실제 처리(서버 · 로그인)는 연결 전         |
| `미구현` | 아직 없음                                                |

### 3.2 화면 · 기능

| ID            | 기능                       | 상태     | 구현에 사용한 것                                                                                                    | 주요 파일                                                          |
| ------------- | -------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| SC-01         | 스플래시 · 로그인 화면     | `UI만`   | 버튼 3개. 구글 → 가입 동의로 이동, 카카오 → "준비 중" 토스트                                                        | `features/auth/LandingPage.tsx`                                    |
| FR-01-01      | 구글 로그인                | `미구현` | Firebase 초기화 · ID Token 조회 함수만 준비                                                                         | `shared/lib/firebase.ts`                                           |
| FR-01-02      | 카카오 로그인              | `미구현` | -                                                                                                                   | -                                                                  |
| FR-01-03      | 둘러보기                   | `UI만`   | "먼저 둘러볼게요" → 홈. 저장 시 로그인 유도는 없음                                                                  | `LandingPage.tsx`                                                  |
| -             | 가입 동의                  | `UI만`   | 체크박스 3개 + 전체 동의, 모두 체크해야 다음 활성. 서버 제출 없음                                                   | `features/auth/SignupPage.tsx`                                     |
| FR-02-01      | 관심 분야 선택 (SC-03)     | `동작`   | 칩 선택 · 키워드 검색 · 더 보기, 3개 미만이면 다음 비활성. Zustand에 임시 보관                                      | `features/onboarding/InterestsPage.tsx`, `store.ts`                |
| FR-02-03      | 카드 스와이프 평가 (SC-04) | `동작`   | Motion `drag="x"`로 좌우 드래그, ←→ 키, 되돌리기 1회, 건너뛰기. 카드 10장은 `GET /v1/feed?limit=10`                 | `features/onboarding/SwipePage.tsx`                                |
| FR-02-05      | 취향 분석 완료 (SC-05)     | `동작`   | 태그 비율 계산 · 알림 토글 · 수준 슬라이더, `POST /v1/onboarding/preferences`, `history.pushState`로 뒤로 가기 차단 | `features/onboarding/DonePage.tsx`                                 |
| FR-03-02 · 03 | 오늘의 대표 논문 · 추천    | `동작`   | TanStack Query `useQuery`로 `GET /v1/home`. 추천은 가로 스크롤 목록                                                 | `features/home/HomePage.tsx`, `shared/api/home.ts`                 |
| -             | 홈 보기 칩 · 화제의 논문   | `동작`   | 오늘의 · 핫한 · 나를 위한 · 분야별 전환(같은 응답을 다르게 보여줌)                                                  | `HomePage.tsx`                                                     |
| FR-03-05      | 키워드 추천 칩             | `동작`   | 누르면 `/search?q=키워드`로 이동                                                                                    | `HomePage.tsx`                                                     |
| FR-03-06      | 콘텐츠 공백 · 지연 안내    | `동작`   | 응답의 `isFallback` · `isDelayed`로 안내 문구 표시                                                                  | `HomePage.tsx`                                                     |
| FR-04-01      | 세로 스와이프 피드 (SC-07) | `동작`   | CSS scroll-snap, `useInfiniteQuery` 커서 페이지네이션, 끝에서 3장 남으면 다음 요청, 보던 위치 기억                  | `features/feed/FeedPage.tsx`, `shared/api/papers.ts`               |
| -             | 피드 제스처                | `동작`   | 포인터 이벤트로 오른쪽 스와이프 = 상세, 두 번 누르기 = 좋아요, 길게 누르기 = 바텀시트. ↑↓ · → 키                    | `features/feed/FeedItem.tsx`                                       |
| FR-04-02      | 우측 레일                  | `동작`   | 좋아요 · 저장은 `useMutation` 낙관적 업데이트, 공유는 Web Share API(미지원 시 링크 복사 + 토스트)                   | `FeedItem.tsx`, `shared/api/papers.ts`, `shared/lib/share.ts`      |
| FR-05-01      | 검색 (SC-08)               | `동작`   | 입력 0.3초 후 `GET /v1/search`, 최근 검색어 10건은 Zustand `persist`, 결과에서 바로 저장                            | `features/search/SearchPage.tsx`, `shared/store/recentSearches.ts` |
| FR-06-01      | 읽기 수준 슬라이더         | `동작`   | `<input type="range">` 기반 슬라이더, `keepPreviousData`로 바꾸는 동안 내용 유지                                    | `shared/ui/LevelSlider.tsx`, `features/paper/PaperPage.tsx`        |
| FR-06-05      | 편집팀 해설                | `동작`   | `editorNote`가 있을 때만 적갈색 보더 박스                                                                           | `PaperPage.tsx`                                                    |
| FR-06-07      | 원문 보기                  | `동작`   | `<a target="_blank" rel="noopener noreferrer">`로 arXiv 초록 페이지                                                 | `PaperPage.tsx`                                                    |
| FR-07-01      | 논문 챗봇 (SC-10)          | `미구현` | -                                                                                                                   | -                                                                  |
| SC-11         | 저장함                     | `동작`   | `GET /v1/me/saves`, 전체 · 최근 저장(7일) · 태그 필터, 저장 취소                                                    | `features/saves/SavesPage.tsx`                                     |
| FR-08-04      | 폴더 (SC-12)               | `동작`   | 목록 + 만들기(`POST /v1/me/folders`)만. 이름 변경 · 삭제 · 이동 없음                                                | `SavesPage.tsx`                                                    |
| FR-08-05      | 오프라인 열람              | `미구현` | -                                                                                                                   | -                                                                  |
| SC-13         | 메뉴                       | `동작`   | 프로필 카드(로그인 전엔 "둘러보는 중") + 하위 메뉴, 저장 · 폴더 개수 표시                                           | `features/menu/MenuPage.tsx`                                       |
| SC-14         | 키워드 관리                | `기기만` | 관심 분야 칩 선택(최소 3개 유지). 가중치 초기화는 토스트만                                                          | `features/menu/SimpleMenuPages.tsx`                                |
| SC-15         | 환경설정                   | `기기만` | 알림 토글 · 시간, 기본 읽기 수준을 Zustand `persist`로 저장. 다크 모드는 비활성                                     | `features/menu/SettingsPage.tsx`, `shared/store/preferences.ts`    |
| SC-16         | 계정 관리                  | `UI만`   | 로그아웃(토스트), 탈퇴 2단계 확인(시트 → "탈퇴" 입력)                                                               | `SimpleMenuPages.tsx`                                              |
| -             | 부가 기능                  | `UI만`   | 약관 · 개인정보 · 오픈소스 · 신고 항목, 누르면 "준비 중" 토스트                                                     | `SimpleMenuPages.tsx`                                              |
| FR-10-01      | 일간 알림                  | `기기만` | 알림 설정값만 저장. 브라우저 권한 요청 · FCM 토큰 없음                                                              | `SettingsPage.tsx`, `DonePage.tsx`                                 |
| FR-11-02      | 개정판 안내                | `동작`   | `status === 'revised'`면 상세에 안내 문구                                                                           | `PaperPage.tsx`                                                    |
| -             | 404                        | `동작`   | 없는 주소는 안내 + 홈 버튼                                                                                          | `app/NotFoundPage.tsx`                                             |

## 4. 공통 구조

### 4.1 요청이 화면까지 가는 길

```
화면 컴포넌트 ─ useHomeQuery / useFeedQuery 등 (shared/api/home.ts · papers.ts, TanStack Query)
      └─ apiFetch (shared/api/client.ts)  ← Firebase ID Token을 Authorization 헤더에 붙임, 401이면 1회 재시도
            └─ fetch
                 ├─ 목 모드(기본): MSW가 가로채 응답 (mocks/handlers.ts, mocks/data/papers.ts)
                 └─ VITE_API_MOCK=false: 실제 백엔드
```

### 4.2 공통 UI 부품 (`src/shared/ui/`)

| 부품                                               | 용도                                     |
| -------------------------------------------------- | ---------------------------------------- |
| `Button`                                           | 검정 · 테두리 · 글자 버튼                |
| `Chip`, `Tag`                                      | 선택 칩(선택 시 검정), 태그 표시         |
| `Highlight`                                        | AI 한 줄 요약 노란 하이라이트            |
| `LevelSlider`                                      | 읽기 수준 슬라이더                       |
| `Toggle`                                           | 켜기 · 끄기 스위치                       |
| `TopBar`, `IconButton`                             | ‹ 뒤로 · 제목 · 오른쪽 아이콘 상단 바    |
| `BottomSheet`                                      | 아래에서 올라오는 시트 (Motion)          |
| `Toaster`                                          | 짧은 안내 문구 (Zustand + Motion)        |
| `Skeleton`, `EmptyState`, `SectionHeader`, `Thumb` | 로딩 · 빈 화면 · 섹션 제목 · 썸네일 자리 |
| `ProgressSegments`                                 | 온보딩 3칸 진행 막대                     |
| `icons`                                            | 선 아이콘 모음(SVG 직접 작성)            |

### 4.3 디자인 토큰

- `src/app/styles/index.css`의 `@theme`에 노션 와이어프레임 v3 색을 토큰으로 정의함. 목록은 spec.md FP-03 참조.

### 4.4 테스트 (3개 파일, 5개)

| 파일                                         | 확인하는 것                                        |
| -------------------------------------------- | -------------------------------------------------- |
| `shared/api/client.test.ts`                  | 홈 데이터 수신, 커서로 다음 묶음, 실패 시 ApiError |
| `shared/ui/LevelSlider.test.tsx`             | 슬라이더 · 라벨로 읽기 수준 변경                   |
| `features/onboarding/InterestsPage.test.tsx` | 3개 미만이면 다음 버튼 비활성                      |

## 5. 임시 처리 · 남은 일

- **API 형식:** 백엔드 `openapi.yaml`이 없어 `shared/api/types.ts`에 직접 정의함. `[협의]` 필드(영어 원제, 학회, 읽기 시간, 좋아요 수, 일치율, 화제의 논문)는 목 데이터에만 있음.
- **좋아요 경로:** `POST · DELETE /v1/papers/{paperId}/like`는 임시 경로임 `[BE #19]`.
- **로그인:** Firebase 웹 설정값이 없어 로그인 · 토큰은 동작하지 않음. 모든 화면이 로그인 없이 열림.
- **PWA:** 매니페스트 · 아이콘 · 서비스 워커 생성까지만. 등록은 배포 빌드 + 실제 API 모드에서만 함(목 모드에서는 MSW 워커와 충돌).
- **성능:** 라우트 단위 코드 분할 미적용(spec.md NFR-F-03과 다름).
- **목 상태:** 좋아요 · 저장 · 폴더는 MSW 메모리에만 있어 새로고침하면 초기화됨.

## 6. 변경 이력

| 버전 | 날짜       | 내용      |
| ---- | ---------- | --------- |
| 0.1  | 2026-11-06 | 최초 작성 |
