import { resetDevice, STORAGE_PREFIX, useProfile, useSaves, useStreak } from './device'

describe('기기 저장', () => {
  it('저장소가 비어 있으면 처음 방문으로 본다', () => {
    expect(useProfile.getState().onboardedAt).toBeNull()
    expect(useSaves.getState().items).toEqual([])
  })

  it('값을 nonstop:v1: 키로 저장한다', () => {
    useProfile.getState().completeOnboarding(['xr'], [{ keyword: 'xr', weight: 0.6 }], 'easy')
    useSaves.getState().toggle('2611.00101')
    expect(localStorage.getItem(`${STORAGE_PREFIX}profile`)).toContain('"xr"')
    expect(localStorage.getItem(`${STORAGE_PREFIX}saves`)).toContain('2611.00101')
  })

  it('초기화하면 nonstop:v1: 키를 모두 지우고 다른 키는 남긴다', () => {
    useStreak.getState().attend('2026-11-10')
    localStorage.setItem('other-app', 'keep')
    resetDevice()
    const keys = Object.keys(localStorage)
    expect(keys.filter((k) => k.startsWith(STORAGE_PREFIX))).toEqual([])
    expect(keys).toContain('other-app')
    expect(useProfile.getState().onboardedAt).toBeNull()
    expect(useStreak.getState().current).toBe(0)
  })
})
