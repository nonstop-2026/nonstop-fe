/**
 * API 타입. 백엔드 nonstop-be/openapi.yaml v0.1.1 기준으로 옮겨 적었다.
 * openapi.yaml이 바뀌면 이 파일을 같이 고친다.
 */

export type Level = 'easy' | 'basic' | 'expert'

export type FieldSlug = 'ai' | 'nlp' | 'cv' | 'hci' | 'se'

export type KeywordSlug =
  | 'agents'
  | 'reasoning'
  | 'planning'
  | 'llm'
  | 'rag'
  | 'translation'
  | 'image-generation'
  | 'multimodal'
  | '3d-vision'
  | 'ux-research'
  | 'xr'
  | 'accessibility'
  | 'code-generation'
  | 'software-testing'
  | 'developer-tools'

/** 카드 크기 논문 데이터. 홈 · 피드 · 온보딩 · 저장함에서 쓴다 */
export interface PaperSummary {
  paperId: string
  arxivId: string
  version: number
  /** arXiv 영어 원제. 항상 titleKo 아래에 표시한다 */
  title: string
  /** AI가 만든 한국어 제목 */
  titleKo: string
  primaryCategory: string
  /** arXiv journal_ref. 없으면 null이고 publishedAt의 연도만 표시한다 */
  venue: string | null
  publishedAt: string
  authors: string[]
  tags: KeywordSlug[]
  level: Level
  oneLine: string
}

export interface Card {
  oneLine: string
  whyImportant: string
  keyPoints: string[]
  method: string | null
  dataset: string | null
  limitation: string | null
}

export interface PaperDetail extends PaperSummary {
  abstractUrl: string
  pdfUrl: string
  license: string | null
  card: Card
}

export interface PaperList {
  items: PaperSummary[]
}

export interface HomeResponse {
  /** 한국 날짜(YYYY-MM-DD). 출석 판정에 쓴다 */
  today: string
  todayPaper: PaperSummary | null
  recommendations: PaperSummary[]
  isFallback: boolean
}

export interface FeedResponse {
  items: PaperSummary[]
  nextCursor: string | null
}

export type Reaction = 'like' | 'dislike' | 'skip'

export interface OnboardingWeightsRequest {
  keywords: KeywordSlug[]
  swipes: { paperId: string; reaction: Reaction }[]
}

export interface InterestWeight {
  keyword: KeywordSlug
  weight: number
}

export interface OnboardingWeightsResponse {
  interests: InterestWeight[]
}

export type ProblemCode =
  | 'INVALID_PARAMETER'
  | 'TOO_FEW_KEYWORDS'
  | 'PAPER_NOT_FOUND'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE'

/** RFC 9457 Problem Details + code */
export interface Problem {
  type: string
  title: string
  status: number
  detail?: string
  instance?: string
  code: ProblemCode
}
