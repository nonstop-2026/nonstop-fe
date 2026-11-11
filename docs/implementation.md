# 논스톱 프론트엔드 구현 현황

| 항목      | 내용                                                                                                                              |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 문서 버전 | 0.6                                                                                                                               |
| 기준 시점 | 2026-11-11, 브랜치 `feat/demo-rebuild`                                                                                            |
| API 기준  | 백엔드 `openapi.yaml` v0.1.1                                                                                                      |
| 관련 문서 | [spec.md](spec.md) (무엇을 만들지), [interaction.md](interaction.md) (상태별 동작), [CLAUDE.md](../CLAUDE.md), [design/](design/) |

현재 코드 상태를 기록함. 기능을 만들거나 바꾸면 이 문서를 같이 갱신함.

## 1. 기술 스택

| 영역        | 사용 기술                        | 용도                                                     |
| ----------- | -------------------------------- | -------------------------------------------------------- |
| 화면        | React 19, TypeScript 6.0         | 컴포넌트 기반 화면 구성                                  |
| 빌드        | Vite 8                           | 개발 서버, 배포용 빌드                                   |
| 라우팅      | React Router 8                   | 주소와 화면 연결, 하단 4탭 레이아웃                      |
| 스타일      | Tailwind CSS 4, Pretendard       | 디자인 토큰 문서 6절 CSS 그대로, 기본 팔레트 제거        |
| 서버 상태   | TanStack Query 5                 | API 요청 · 캐시 · 피드 무한 스크롤                       |
| 기기 저장   | Zustand 5 `persist`              | 프로필 · 저장 목록 · 출석 기록 · 읽은 논문               |
| 애니메이션  | Motion 14                        | 온보딩 카드 드래그, 스트릭 갱신, 바텀시트 · 토스트       |
| 목 서버     | MSW 3                            | API 6개 목. 기본 모드                                    |
| API 타입    | openapi-typescript               | `pnpm gen:api`로 `openapi.yaml`에서 `schema.d.ts` 생성   |
| 테스트      | Vitest, Testing Library          | 5개 파일, 18개                                           |
| 코드 품질   | ESLint 10, Prettier              | 디자인 토큰 규칙(16진 색 · 임의 값 · 그라데이션 등 금지) |
| 패키지 관리 | pnpm                             | 설치 · 명령 실행                                         |
| CI · 배포   | GitHub Actions, Firebase Hosting | PR 검사, 정적 파일 배포 (`firebase.json`, 배포 전)       |

- `eslint-plugin-jsx-a11y` 6.10.2는 ESLint 10을 지원하지 않아 넣지 않음 (peer 범위 ESLint 9까지).

## 2. 화면 구현 현황

| 경로                    | 화면             | 상태                 | 비고                                                                      |
| ----------------------- | ---------------- | -------------------- | ------------------------------------------------------------------------- |
| `/`                     | 시작             | 완료(목 데이터 기준) | 프로필이 있으면 `/home`, 약관 링크                                        |
| `/onboarding/interests` | 관심 분야 선택   | 완료                 | 5개 분야 15개 키워드, 3개 미만이면 다음 비활성                            |
| `/onboarding/swipe`     | 카드 10장 평가   | 연동 완료            | 드래그 방향 라벨, 방향 화살표 버튼 3개, 되돌리기 1회                      |
| `/onboarding/done`      | 취향 분석 완료   | 연동 완료            | 가중치 API(503 포함 오류 안내), 상위 키워드 1~3위, 기본 읽기 수준         |
| `/home`                 | 홈               | 연동 완료            | 스트릭, 오늘의 논문 가로 넘김(같은 날 최대 5편), 추천 영역(list), 읽음    |
| `/feed`                 | 피드             | 연동 완료            | 어두운 배경 글 위주, 방법 · 핵심 포인트, 10개씩 무한 스크롤, 저장 · 공유  |
| `/papers/:paperId`      | 논문 상세        | 연동 완료            | 읽기 수준, 요약 섹션, 원문 보기 · 다 읽었어요, 출석 인정, 7일 · 30일 축하 |
| `/saves`                | 저장함           | 연동 완료            | `GET /v1/papers?ids=`, 최근 7일 필터, hero 카드(저장 날짜 · 취소 줄)      |
| `/menu`                 | 메뉴             | 완료                 | 스트릭 요약, 기본 읽기 수준, 키워드 · 기기 데이터 · 약관, 문의            |
| `/menu/keywords`        | 관심 키워드 관리 | 연동 완료            | 직접 고른 키워드 표시, 저장 시 가중치 API로 다시 계산                     |
| `/menu/settings`        | 기기 데이터      | 완료                 | 기기 데이터 초기화(확인 시트)                                             |
| `/terms`                | 이용약관         | 완료                 | 작업 지시서 부록 A 본문                                                   |
| `/demo`                 | 시연 도구        | 완료                 | `VITE_DEMO_TOOLS=true`일 때만. 12일째로 설정, 초기화                      |
| `*`                     | 404              | 완료                 |                                                                           |

- 상태 값: 미구현, 진행 중, 완료(목 데이터 기준), 연동 완료(실제 API 기준).
- 2026-11-11 배포 백엔드(`https://nonstop-be.onrender.com`)로 API 6개를 모두 확인함. 잠든 서버의 첫 응답은 약 45초였음.
- 개발 기본값은 계속 MSW 목 모드. 실제 API는 `.env.local`에 `VITE_API_MOCK=false`일 때만 씀.

## 3. 코드 구조

```
src/
├─ app/          라우터, AppShell(서버 깨우는 중 안내 · 토스트), TabLayout(4탭, 프로필 없으면 온보딩으로), 404, 디자인 토큰 CSS
├─ features/
│  ├─ start/       시작
│  ├─ onboarding/  관심 분야 · 카드 평가 · 완료, 온보딩 임시 상태(store.ts)
│  ├─ home/        홈, 오늘의 논문 가로 넘김(TodayCarousel)
│  ├─ feed/        피드 (보던 위치 기억, 왼쪽 가장자리 20px 제스처 무시)
│  ├─ paper/       논문 상세, 출석 인정(useAttendance)
│  ├─ saves/       저장함
│  ├─ menu/        메뉴 · 관심 키워드 · 설정
│  ├─ terms/       이용약관 화면과 본문(terms.ts)
│  └─ demo/        시연 도구
├─ shared/
│  ├─ api/         apiFetch(Problem Details · 70초 제한 · 3초 후 깨우는 중 안내), 쿼리 훅,
│  │               schema.d.ts(생성 파일), types.ts(생성 타입 별칭)
│  ├─ store/       device.ts(nonstop:v1: profile · saves · streak · read, 초기화), 토스트, 깨우는 중
│  ├─ lib/         streak.ts(출석 판정 순수 함수), 날짜 · 파라미터 포맷, 공유, 뒤로 가기(navigation.ts)
│  ├─ ui/          PaperCover(팀원 원본), PaperCard(hero · list · 본문 · 스켈레톤), StreakStrip,
│  │               LevelSelector, Button · Chip · Segmented · Badge · ReadMark · Highlight,
│  │               BottomSheet · Toaster · EmptyState, 아이콘
│  ├─ constants/   분야 · 키워드 슬러그와 한국어 라벨, 읽기 수준 라벨
│  └─ config/      환경 변수, 문의 이메일, 약관 버전
├─ mocks/        MSW 핸들러(API 6개)와 목 논문 45편(시드 15편 x 3)
└─ test/         Vitest 설정
```

- 기기 저장 `nonstop:v1:profile`에 직접 고른 키워드(`keywords`)를 추가함. 서버 가중치(`interests`)에는 좋아요한 논문의 키워드도 섞여 오므로 관심 키워드 화면은 `keywords`를 보여 줌.
- 디자인 시스템 0.3과 다르게 구현한 부분은 [interaction.md](interaction.md) 5절에 기록함.
- 기능 폴더끼리는 서로 import하지 않음. 여러 화면이 쓰는 것은 `shared/`에 둠.
- `src/shared/ui/PaperCover.tsx`는 `feat/cover-script` 원본 그대로이며 Prettier 대상에서 제외함.

## 4. 변경 이력

| 버전 | 날짜       | 내용                                                                  |
| ---- | ---------- | --------------------------------------------------------------------- |
| 0.1  | 2026-11-06 | 최초 작성                                                             |
| 0.2  | 2026-11-08 | 데모 범위 삭제 작업 반영                                              |
| 0.3  | 2026-11-08 | 개발 재시작 기준으로 초기화, 기술 스택 · 화면 현황 · 코드 구조만 남김 |
| 0.4  | 2026-11-10 | 전 화면 구현(목 데이터 기준), openapi.yaml v0.1.1 반영                |
| 0.5  | 2026-11-11 | 팀 피드백 반영, 상태별 동작 정의, 생성 타입 적용, 실제 API 연동 확인  |
| 0.6  | 2026-11-11 | 홈 오늘의 논문 가로 넘김 · 추천 구분, 피드 설명 추가, 읽은 제목 회색  |
