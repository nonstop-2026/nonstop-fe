import type { InterestWeight, PaperSummary } from '@/shared/api/types'

/** 'Kim' / 'Kim, Lee' / 'Kim 외 3명' */
export function shortAuthors(authors: string[]): string {
  if (authors.length <= 2) return authors.join(', ')
  return `${authors[0]} 외 ${authors.length - 1}명`
}

export function yearOf(date: string): string {
  return date.slice(0, 4)
}

/** 카드 윗줄의 학회 · 연도. 학회가 없으면 연도만 */
export function venueOrYear(paper: Pick<PaperSummary, 'venue' | 'publishedAt'>): string {
  return paper.venue ?? yearOf(paper.publishedAt)
}

/** 서버로 보내는 interests 파라미터: 'hci:0.62,llm:0.48' (최대 15쌍, 소수 둘째 자리) */
export function interestsParam(interests: InterestWeight[]): string | undefined {
  if (interests.length === 0) return undefined
  return interests
    .slice(0, 15)
    .map(({ keyword, weight }) => `${keyword}:${Math.min(1, Math.max(0, weight)).toFixed(2)}`)
    .join(',')
}

/** 서버로 보내는 exclude 파라미터: 쉼표 구분, 최대 50개 */
export function excludeParam(ids: string[]): string | undefined {
  return ids.length > 0 ? ids.slice(0, 50).join(',') : undefined
}

/** '2026-11-10' → '11월 10일 화요일' */
export function formatKoreanDate(date: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

export function isWithinDays(iso: string, days: number): boolean {
  return Date.now() - new Date(iso).getTime() < days * 86_400_000
}

export function paperPath(paperId: string): string {
  return `/papers/${encodeURIComponent(paperId)}`
}
