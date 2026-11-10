import { addDays, applyAttendance, EMPTY_STREAK, streakEndingYesterday, weekOf } from './streak'

describe('applyAttendance', () => {
  it('첫 출석은 1일째', () => {
    expect(applyAttendance(EMPTY_STREAK, '2026-11-10')).toMatchObject({
      current: 1,
      longest: 1,
      lastDate: '2026-11-10',
      recentDates: ['2026-11-10'],
    })
  })

  it('같은 날 두 번 열면 바뀌지 않는다', () => {
    const once = applyAttendance(EMPTY_STREAK, '2026-11-10')
    expect(applyAttendance(once, '2026-11-10')).toBe(once)
  })

  it('연속일이면 1 늘어난다', () => {
    const day1 = applyAttendance(EMPTY_STREAK, '2026-11-10')
    expect(applyAttendance(day1, '2026-11-11').current).toBe(2)
  })

  it('하루 건너뛰면 1부터 다시 시작하고 최장 기록은 유지한다', () => {
    const start = { current: 5, longest: 5, lastDate: '2026-11-10', recentDates: [] }
    const next = applyAttendance(start, '2026-11-12')
    expect(next.current).toBe(1)
    expect(next.longest).toBe(5)
  })

  it('월말과 연말 경계도 연속으로 본다', () => {
    const nov = { current: 3, longest: 3, lastDate: '2026-11-30', recentDates: [] }
    expect(applyAttendance(nov, '2026-12-01').current).toBe(4)
    const dec = { current: 3, longest: 3, lastDate: '2026-12-31', recentDates: [] }
    expect(applyAttendance(dec, '2027-01-01').current).toBe(4)
  })

  it('최근 날짜는 7개만 남긴다', () => {
    let streak = EMPTY_STREAK
    for (let i = 0; i < 9; i++) streak = applyAttendance(streak, addDays('2026-11-01', i))
    expect(streak.recentDates).toHaveLength(7)
    expect(streak.recentDates.at(-1)).toBe('2026-11-09')
  })
})

describe('날짜 도우미', () => {
  it('weekOf는 월요일부터 일요일까지 돌려준다', () => {
    expect(weekOf('2026-11-10')).toEqual([
      '2026-11-09',
      '2026-11-10',
      '2026-11-11',
      '2026-11-12',
      '2026-11-13',
      '2026-11-14',
      '2026-11-15',
    ])
  })

  it('시연 도구: 12일째, 마지막 인정일은 전날', () => {
    const s = streakEndingYesterday('2026-11-18', 12)
    expect(s).toMatchObject({ current: 12, longest: 12, lastDate: '2026-11-17' })
    expect(s.recentDates).toEqual([
      '2026-11-11',
      '2026-11-12',
      '2026-11-13',
      '2026-11-14',
      '2026-11-15',
      '2026-11-16',
      '2026-11-17',
    ])
    expect(applyAttendance(s, '2026-11-18').current).toBe(13)
  })
})
