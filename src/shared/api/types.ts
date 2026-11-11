/**
 * API 타입. 백엔드 nonstop-be/openapi.yaml(v0.1.1)에서 `pnpm gen:api`로 만든 schema.d.ts를
 * 화면 코드에서 쓰기 쉬운 이름으로 다시 내보낸다. 이 파일에서 형식을 직접 정의하지 않는다.
 * openapi.yaml이 바뀌면 `pnpm gen:api`를 다시 실행하고 MSW 핸들러(src/mocks/handlers.ts)를 같이 고친다.
 */
import type { components } from './schema'

type Schemas = components['schemas']

export type Level = Schemas['Level']
export type FieldSlug = Schemas['FieldSlug']
export type KeywordSlug = Schemas['KeywordSlug']

/** 카드 크기 논문 데이터. 홈 · 피드 · 온보딩 · 저장함에서 쓴다 */
export type PaperSummary = Schemas['PaperSummary']
export type Card = Schemas['Card']
export type PaperDetail = Schemas['PaperDetail']
export type PaperList = Schemas['PaperList']

/** today는 한국 날짜(YYYY-MM-DD). 출석 판정에 쓴다 */
export type HomeResponse = Schemas['HomeResponse']
export type FeedResponse = Schemas['FeedResponse']

export type Reaction = Schemas['Reaction']
export type OnboardingWeightsRequest = Schemas['OnboardingWeightsRequest']
export type OnboardingWeightsResponse = Schemas['OnboardingWeightsResponse']
export type InterestWeight = OnboardingWeightsResponse['interests'][number]

/** RFC 9457 Problem Details + code */
export type Problem = Schemas['Problem']
export type ProblemCode = Problem['code']
