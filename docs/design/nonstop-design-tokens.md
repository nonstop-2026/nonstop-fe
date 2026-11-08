# 논스톱 디자인 토큰

버전 0.2 / 2026-11-07

이 문서는 논스톱 웹 클라이언트가 쓰는 모든 시각 값의 단일 기준이다. 프론트엔드는 Tailwind CSS 4를 쓰므로 토큰은 `src/app/styles/index.css`의 `:root` 변수와 `@theme` 블록으로 정의한다. 사용 규칙은 `nonstop-design-system.md`를 따른다.

## 0. 확정 상태

| 항목               | 출처                                                                  | 상태           |
| ------------------ | --------------------------------------------------------------------- | -------------- |
| 색상               | 파비콘(햄스터 마스코트)에서 추출한 색을 OKLCH로 재구성                | 확정           |
| 서체               | Pretendard Variable (SIL OFL 1.1), npm 패키지로 번들                  | 확정           |
| 크기, 간격, 라운드 | 제안값. 와이어프레임이 실제 기기 크기와 1:1이 아니어서 측정값이 아님  | 시안 검증 필요 |
| 대비 수치          | WCAG 2.x 상대 휘도 공식으로 계산                                      | 계산값         |
| 테마               | 데모(2026-11-08 ~ 11-30)는 라이트 모드만 사용. 다크 값은 정의만 해 둠 | 확정           |

## 1. 계층 구조

| 계층            | 위치                                                     | 컴포넌트에서 사용 |
| --------------- | -------------------------------------------------------- | ----------------- |
| 원시(primitive) | `:root`의 `--ink-*`, `--apricot-*`, `--red-*`            | 금지              |
| 의미(semantic)  | `:root`의 `--c-*`, 테마별로 값이 바뀜                    | 직접 사용 금지    |
| 유틸리티        | `@theme inline`의 `--color-*` 등. Tailwind 클래스로 노출 | 이것만 사용       |

원시 색을 `@theme`에 넣지 않는 이유는 `bg-ink-900` 같은 클래스가 생기지 않게 하기 위해서다. Tailwind 기본 팔레트도 `--color-*: initial`로 지워서 `bg-blue-500`, `text-black` 같은 클래스가 만들어지지 않게 한다.

## 2. 색상

### 2.1 원칙

색은 두 가지만 쓴다. 학사모의 짙은 자두색에서 채도를 거의 뺀 잉크 계열, 털의 살구색이다. 빨강은 오류 문구 전용 예외다. 금색, 진홍색, 크림 배경, 보라 계열, 베이지, 노란 형광펜, 적갈색 보더는 쓰지 않는다.

| 파비콘 원색           | OKLCH (L, C, H)   | 역할                                |
| --------------------- | ----------------- | ----------------------------------- |
| 학사모 `#291931`      | 0.246, 0.049, 314 | 잉크 계열의 색상각(320)             |
| 털 `#FCB587`          | 0.829, 0.103, 54  | 살구 계열 (강조 면, 스트릭, 형광펜) |
| 학위증 리본 `#B62834` | 0.511, 0.177, 22  | 오류 빨강의 기준                    |

### 2.2 원시 값

| 변수        | 값        | 변수                 | 값        |
| ----------- | --------- | -------------------- | --------- |
| `--ink-0`   | `#FFFFFF` | `--ink-600`          | `#706971` |
| `--ink-25`  | `#FCFBFC` | `--ink-700`          | `#575058` |
| `--ink-50`  | `#F7F5F7` | `--ink-800`          | `#3C353E` |
| `--ink-100` | `#EFEBEF` | `--ink-900`          | `#251D26` |
| `--ink-200` | `#DFDBE0` | `--ink-950`          | `#150F16` |
| `--ink-300` | `#C7C2C8` | `--ink-dark-surface` | `#1E181F` |
| `--ink-400` | `#A8A2A9` | `--ink-dark-raised`  | `#2A242B` |
| `--ink-500` | `#8A848B` |                      |           |

| 변수                  | 값        | 쓰임                |
| --------------------- | --------- | ------------------- |
| `--apricot-50`        | `#FFF6F0` | 스트릭 영역 배경    |
| `--apricot-100`       | `#FFEADC` | 형광펜              |
| `--apricot-300`       | `#F8B78B` | 강조 면             |
| `--apricot-500`       | `#CA7839` | 스트릭 칸 등 그래픽 |
| `--apricot-700`       | `#874301` | 강조 텍스트         |
| `--apricot-dark-tint` | `#55341C` | 형광펜 (다크)       |
| `--red-300`           | `#FEB0AA` | 오류 문구 (다크)    |
| `--red-700`           | `#A21723` | 오류 문구           |

### 2.3 색 유틸리티

| Tailwind 이름    | 예시 클래스           | 라이트        | 다크                | 용도                     |
| ---------------- | --------------------- | ------------- | ------------------- | ------------------------ |
| `canvas`         | `bg-canvas`           | `ink-25`      | `ink-950`           | 화면 배경                |
| `surface`        | `bg-surface`          | `ink-0`       | `ink-dark-surface`  | 카드, 시트               |
| `surface-muted`  | `bg-surface-muted`    | `ink-50`      | `ink-dark-raised`   | 비활성 칸, 스켈레톤      |
| `fg`             | `text-fg`             | `ink-900`     | `ink-50`            | 본문, 제목               |
| `fg-secondary`   | `text-fg-secondary`   | `ink-700`     | `ink-300`           | 부제, 설명               |
| `fg-tertiary`    | `text-fg-tertiary`    | `ink-600`     | `ink-400`           | 메타데이터, 캡션         |
| `line-control`   | `border-line-control` | `ink-500`     | `ink-500`           | 외곽선 버튼, 칩 테두리   |
| `line-divider`   | `border-line-divider` | `ink-200`     | `ink-dark-raised`   | 구분선                   |
| `primary`        | `bg-primary`          | `ink-900`     | `ink-50`            | 주요 버튼, 선택된 칩     |
| `on-primary`     | `text-on-primary`     | `ink-0`       | `ink-950`           | 주요 버튼 글자           |
| `accent`         | `bg-accent`           | `apricot-300` | `apricot-300`       | 강조 면 (한 화면에 하나) |
| `on-accent`      | `text-on-accent`      | `ink-900`     | `ink-950`           | 강조 면 글자             |
| `accent-fg`      | `text-accent-fg`      | `apricot-700` | `apricot-300`       | 강조 텍스트              |
| `accent-graphic` | `bg-accent-graphic`   | `apricot-500` | `apricot-300`       | 스트릭 칸                |
| `accent-soft`    | `bg-accent-soft`      | `apricot-50`  | `ink-dark-raised`   | 스트릭 영역 배경         |
| `highlight`      | `bg-highlight`        | `apricot-100` | `apricot-dark-tint` | 형광펜                   |
| `danger`         | `text-danger`         | `red-700`     | `red-300`           | 오류 문구                |
| `focus`          | `outline-focus`       | `ink-900`     | `ink-50`            | 포커스 링                |

성공, 경고, 정보용 색은 없다. 아이콘과 문구로 상태를 전달한다.

### 2.4 대비 검증

텍스트는 4.5:1, 경계선과 그래픽은 3:1(WCAG 1.4.11) 이상이어야 한다.

| 조합                         | 라이트 | 다크  | 기준   |
| ---------------------------- | ------ | ----- | ------ |
| `fg` / `canvas`              | 15.86  | 17.41 | 텍스트 |
| `fg-secondary` / 배경        | 7.55   | 9.94  | 텍스트 |
| `fg-tertiary` / 배경         | 5.15   | 6.97  | 텍스트 |
| `line-control` / `surface`   | 3.65   | 4.77  | 그래픽 |
| `on-primary` / `primary`     | 16.38  | 10.92 | 텍스트 |
| `on-accent` / `accent`       | 9.46   | 10.92 | 텍스트 |
| `fg` / `highlight`           | 14.08  | 10.22 | 텍스트 |
| `accent-fg` / 배경           | 7.18   | 10.07 | 텍스트 |
| `accent-graphic` / `surface` | 3.36   | 10.07 | 그래픽 |
| `danger` / 배경              | 7.58   | 9.96  | 텍스트 |

다크 수치는 `surface` 기준이다.

## 3. 서체

| 항목         | 값                                                                                 |
| ------------ | ---------------------------------------------------------------------------------- |
| 패밀리       | Pretendard Variable 하나. 클래스 `font-sans`                                       |
| 수식         | 논문 제목·초록의 LaTeX 수식 구간에만 KaTeX 내장 폰트 (데모에서 수식이 나오면 적용) |
| 한자, 이모지 | 시스템 대체 폰트에 맡김                                                            |
| 숫자         | arXiv ID, 날짜, 일수, 개수에는 `tabular-nums slashed-zero`                         |

Pretendard Variable 1.3.9 파일을 직접 확인한 결과 `tnum`, `zero`, `sups`, `subs`, `frac` 기능과 그리스 소문자 전체가 있고, `∇`, `∈` 기호와 한자는 없다.

### 3.1 글자 크기

기준 화면 폭 375px, 본문 16px. 행간·자간·굵기가 함께 묶인 토큰이라 `text-*` 클래스 하나로 적용된다.

| 클래스             | 크기 / 행간 | 굵기 | 자간    | 용도                        |
| ------------------ | ----------- | ---- | ------- | --------------------------- |
| `text-display`     | 28 / 36     | 700  | -0.02em | 스트릭 숫자, 온보딩 큰 제목 |
| `text-title`       | 22 / 30     | 700  | -0.02em | 화면 제목                   |
| `text-paper-title` | 20 / 28     | 650  | -0.02em | 논문 제목                   |
| `text-headline`    | 17 / 24     | 600  | -0.01em | 섹션 제목, 카드 제목        |
| `text-body`        | 16 / 26     | 400  | 0       | 본문, 요약                  |
| `text-body-sm`     | 14 / 22     | 400  | 0       | 버튼, 칩, 목록              |
| `text-caption`     | 12 / 18     | 400  | 0       | 메타데이터, 탭 라벨         |

12px 미만은 쓰지 않는다. 굵기를 바꿔야 하면 `font-regular`, `font-medium`, `font-semibold`, `font-title`(650), `font-bold`만 쓴다.

## 4. 간격, 크기

Tailwind 4의 간격은 `--spacing`(0.25rem) 배수다. 다음 값만 쓴다.

| 용도             | 클래스                    | 값                                   |
| ---------------- | ------------------------- | ------------------------------------ |
| 화면 좌우 여백   | `px-5`                    | 20px                                 |
| 카드 내부 여백   | `p-4`                     | 16px                                 |
| 섹션 간격        | `gap-8`, `mt-8`           | 32px                                 |
| 섹션 제목과 내용 | `mt-3`                    | 12px                                 |
| 요소 사이 기본   | `gap-2`, `gap-3`, `gap-4` | 8, 12, 16px                          |
| 버튼 높이        | `h-12`                    | 48px                                 |
| 칩 높이          | `h-9`                     | 36px (상하 여백 포함 터치 영역 44px) |
| 최소 터치 영역   | `min-h-11 min-w-11`       | 44px                                 |
| 앱 최대 폭       | `max-w-app`               | 480px                                |

## 5. 모양, 깊이, 움직임

| 클래스                                           | 값                               | 적용                                |
| ------------------------------------------------ | -------------------------------- | ----------------------------------- |
| `rounded-mark`                                   | 4px                              | 형광펜, 스트릭 칸                   |
| `rounded-control`                                | 10px                             | 버튼, 입력창, 세그먼트              |
| `rounded-card`                                   | 16px                             | 카드, 바텀시트 상단, 토스트         |
| `rounded-pill`                                   | 999px                            | 칩, 배지만                          |
| `shadow-overlay`                                 | 아래 CSS 참고                    | 바텀시트, 토스트만                  |
| `ease-out`                                       | `cubic-bezier(0.22, 1, 0.36, 1)` | 기본 이징                           |
| `duration-150` / `duration-200` / `duration-320` | 150 / 200 / 320ms                | 눌림 / 상태 변화 / 시트·스트릭 증가 |

구분은 1px 선(`border`)으로 하고, 그림자는 화면 위에 떠 있는 요소에만 쓴다. `motion-reduce:` 변형으로 `prefers-reduced-motion`에서 움직임을 끈다.

## 6. CSS 정의 (`src/app/styles/index.css`)

```css
@import 'tailwindcss';
/* Keep the existing Pretendard import from the npm package here */

/* Layer 1: primitives. Never referenced from components. */
:root {
  --ink-0: #ffffff;
  --ink-25: #fcfbfc;
  --ink-50: #f7f5f7;
  --ink-100: #efebef;
  --ink-200: #dfdbe0;
  --ink-300: #c7c2c8;
  --ink-400: #a8a2a9;
  --ink-500: #8a848b;
  --ink-600: #706971;
  --ink-700: #575058;
  --ink-800: #3c353e;
  --ink-900: #251d26;
  --ink-950: #150f16;
  --ink-dark-surface: #1e181f;
  --ink-dark-raised: #2a242b;

  --apricot-50: #fff6f0;
  --apricot-100: #ffeadc;
  --apricot-300: #f8b78b;
  --apricot-500: #ca7839;
  --apricot-700: #874301;
  --apricot-dark-tint: #55341c;

  --red-300: #feb0aa;
  --red-700: #a21723;
}

/* Layer 2: semantic values, light (demo default) */
:root {
  color-scheme: light;
  --c-canvas: var(--ink-25);
  --c-surface: var(--ink-0);
  --c-surface-muted: var(--ink-50);
  --c-fg: var(--ink-900);
  --c-fg-secondary: var(--ink-700);
  --c-fg-tertiary: var(--ink-600);
  --c-line-control: var(--ink-500);
  --c-line-divider: var(--ink-200);
  --c-primary: var(--ink-900);
  --c-on-primary: var(--ink-0);
  --c-accent: var(--apricot-300);
  --c-on-accent: var(--ink-900);
  --c-accent-fg: var(--apricot-700);
  --c-accent-graphic: var(--apricot-500);
  --c-accent-soft: var(--apricot-50);
  --c-highlight: var(--apricot-100);
  --c-danger: var(--red-700);
  --c-focus: var(--ink-900);
}

/* Layer 2: semantic values, dark. Defined but not enabled during the demo. */
:root[data-theme='dark'] {
  color-scheme: dark;
  --c-canvas: var(--ink-950);
  --c-surface: var(--ink-dark-surface);
  --c-surface-muted: var(--ink-dark-raised);
  --c-fg: var(--ink-50);
  --c-fg-secondary: var(--ink-300);
  --c-fg-tertiary: var(--ink-400);
  --c-line-divider: var(--ink-dark-raised);
  --c-primary: var(--ink-50);
  --c-on-primary: var(--ink-950);
  --c-on-accent: var(--ink-950);
  --c-accent-fg: var(--apricot-300);
  --c-accent-graphic: var(--apricot-300);
  --c-accent-soft: var(--ink-dark-raised);
  --c-highlight: var(--apricot-dark-tint);
  --c-danger: var(--red-300);
  --c-focus: var(--ink-50);
}

/* Remove Tailwind defaults so only project tokens produce utilities */
@theme {
  --color-*: initial;
  --font-*: initial;
  --text-*: initial;
  --font-weight-*: initial;
  --radius-*: initial;
  --shadow-*: initial;
  --inset-shadow-*: initial;
  --drop-shadow-*: initial;
  --blur-*: initial;
  --animate-*: initial;
  --ease-*: initial;

  --font-sans:
    'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui,
    'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji',
    sans-serif;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-title: 650;
  --font-weight-bold: 700;

  --text-display: 1.75rem;
  --text-display--line-height: 2.25rem;
  --text-display--letter-spacing: -0.02em;
  --text-display--font-weight: 700;
  --text-title: 1.375rem;
  --text-title--line-height: 1.875rem;
  --text-title--letter-spacing: -0.02em;
  --text-title--font-weight: 700;
  --text-paper-title: 1.25rem;
  --text-paper-title--line-height: 1.75rem;
  --text-paper-title--letter-spacing: -0.02em;
  --text-paper-title--font-weight: 650;
  --text-headline: 1.0625rem;
  --text-headline--line-height: 1.5rem;
  --text-headline--letter-spacing: -0.01em;
  --text-headline--font-weight: 600;
  --text-body: 1rem;
  --text-body--line-height: 1.625rem;
  --text-body-sm: 0.875rem;
  --text-body-sm--line-height: 1.375rem;
  --text-caption: 0.75rem;
  --text-caption--line-height: 1.125rem;

  --radius-mark: 4px;
  --radius-control: 10px;
  --radius-card: 16px;
  --radius-pill: 999px;

  --shadow-overlay: 0 8px 24px rgb(21 15 22 / 0.12), 0 2px 6px rgb(21 15 22 / 0.08);

  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);

  --container-app: 480px;
}

/* Expose semantic colors as utilities that follow the theme at runtime */
@theme inline {
  --color-canvas: var(--c-canvas);
  --color-surface: var(--c-surface);
  --color-surface-muted: var(--c-surface-muted);
  --color-fg: var(--c-fg);
  --color-fg-secondary: var(--c-fg-secondary);
  --color-fg-tertiary: var(--c-fg-tertiary);
  --color-line-control: var(--c-line-control);
  --color-line-divider: var(--c-line-divider);
  --color-primary: var(--c-primary);
  --color-on-primary: var(--c-on-primary);
  --color-accent: var(--c-accent);
  --color-on-accent: var(--c-on-accent);
  --color-accent-fg: var(--c-accent-fg);
  --color-accent-graphic: var(--c-accent-graphic);
  --color-accent-soft: var(--c-accent-soft);
  --color-highlight: var(--c-highlight);
  --color-danger: var(--c-danger);
  --color-focus: var(--c-focus);
}
```

`--container-app`은 `max-w-app` 클래스를 만든다. 위 `@theme` 문법은 Tailwind CSS 4의 네임스페이스 규칙을 따랐으며, 적용 후 `pnpm build`로 클래스가 생성되는지 확인한다.

## 7. 변경 이력

| 버전 | 날짜       | 내용                                                                                             |
| ---- | ---------- | ------------------------------------------------------------------------------------------------ |
| 0.1  | 2026-11-07 | 초안. 와이어프레임 회색 팔레트를 파비콘 기반 잉크·살구 2색 체계로 교체                           |
| 0.2  | 2026-11-07 | Tailwind CSS 4 `@theme` 형식으로 전환, 의미 색 이름을 유틸리티용으로 변경, 데모 라이트 모드 고정 |
