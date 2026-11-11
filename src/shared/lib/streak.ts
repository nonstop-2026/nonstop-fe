/**
 * 출석 스트릭 판정. 순수 함수만 둔다.
 * 날짜는 YYYY-MM-DD 문자열을 UTC 자정으로 해석해 기기 시간대의 영향을 받지 않게 한다.
 */

export interface StreakData {
  current: number
  longest: number
  /** 마지막으로 인정된 날짜 (YYYY-MM-DD). 없으면 null */
  lastDate: string | null
  /** 인정된 최근 날짜 최대 7개, 오래된 것부터 */
  recentDates: string[]
}

export const EMPTY_STREAK: StreakData = { current: 0, longest: 0, lastDate: null, recentDates: [] }

const DAY_MS = 86_400_000

function toUtc(date: string): number {
  return Date.parse(`${date}T00:00:00Z`)
}

function fromUtc(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10)
}

export function addDays(date: string, days: number): string {
  return fromUtc(toUtc(date) + days * DAY_MS)
}

/** 오늘(today) 논문 상세를 열었을 때의 새 스트릭. 같은 날이면 그대로 돌려준다 */
export function applyAttendance(streak: StreakData, today: string): StreakData {
  if (streak.lastDate === today) return streak
  const current = streak.lastDate === addDays(today, -1) ? streak.current + 1 : 1
  const recentDates = [...streak.recentDates.filter((d) => d !== today), today].slice(-7)
  return {
    current,
    longest: Math.max(streak.longest, current),
    lastDate: today,
    recentDates,
  }
}

/** 오늘 기준으로 살아 있는 연속 일수. 어제까지 읽었으면 유지, 그보다 오래됐으면 0 */
export function displayCurrent(streak: StreakData, today: string): number {
  if (streak.lastDate === today || streak.lastDate === addDays(today, -1)) return streak.current
  return 0
}

/** today가 속한 주의 월요일부터 일요일까지 7개 날짜 */
export function weekOf(today: string): string[] {
  const weekday = (new Date(toUtc(today)).getUTCDay() + 6) % 7 // 월 = 0
  const monday = addDays(today, -weekday)
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

/** 시연 도구: today의 전날까지 days일 연속 읽은 상태 */
export function streakEndingYesterday(today: string, days: number): StreakData {
  const yesterday = addDays(today, -1)
  const recentDates = Array.from({ length: Math.min(days, 7) }, (_, i) =>
    addDays(yesterday, -(Math.min(days, 7) - 1 - i)),
  )
  return { current: days, longest: days, lastDate: yesterday, recentDates }
}
