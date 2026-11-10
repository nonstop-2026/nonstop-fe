import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import type { InterestWeight, Level } from '@/shared/api/types'
import { applyAttendance, EMPTY_STREAK, type StreakData } from '@/shared/lib/streak'

/**
 * 기기 저장. 로그인이 없으므로 사용자 데이터는 모두 이 기기의 localStorage에만 둔다.
 * 저장소가 막혀 있거나(시크릿 모드 등) 값이 깨져 있어도 앱이 멈추지 않게 모든 접근을 try로 감싼다.
 */
export const STORAGE_PREFIX = 'nonstop:v1:'

const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name)
    } catch {
      return null
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value)
    } catch {
      // 저장 실패는 무시한다. 이번 방문 동안은 메모리 값으로 동작한다
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name)
    } catch {
      // 무시
    }
  },
}

const storage = createJSONStorage(() => safeStorage)

// ---- profile -------------------------------------------------------------

export interface ProfileData {
  interests: InterestWeight[]
  defaultLevel: Level
  /** 온보딩을 마친 시각(ISO). null이면 처음 방문 */
  onboardedAt: string | null
}

const EMPTY_PROFILE: ProfileData = { interests: [], defaultLevel: 'basic', onboardedAt: null }

interface ProfileState extends ProfileData {
  completeOnboarding: (interests: InterestWeight[], defaultLevel: Level) => void
  setInterests: (interests: InterestWeight[]) => void
  setDefaultLevel: (level: Level) => void
}

export const useProfile = create<ProfileState>()(
  persist(
    (set) => ({
      ...EMPTY_PROFILE,
      completeOnboarding: (interests, defaultLevel) =>
        set({ interests, defaultLevel, onboardedAt: new Date().toISOString() }),
      setInterests: (interests) => set({ interests }),
      setDefaultLevel: (defaultLevel) => set({ defaultLevel }),
    }),
    { name: `${STORAGE_PREFIX}profile`, storage },
  ),
)

// ---- saves ---------------------------------------------------------------

export interface SavedItem {
  paperId: string
  savedAt: string
}

interface SavesState {
  items: SavedItem[]
  toggle: (paperId: string) => boolean
}

/** 저장 목록. 최신 저장이 앞에 온다. 서버 조회 상한에 맞춰 최대 50개 */
export const useSaves = create<SavesState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (paperId) => {
        const exists = get().items.some((i) => i.paperId === paperId)
        set({
          items: exists
            ? get().items.filter((i) => i.paperId !== paperId)
            : [{ paperId, savedAt: new Date().toISOString() }, ...get().items].slice(0, 50),
        })
        return !exists
      },
    }),
    { name: `${STORAGE_PREFIX}saves`, storage },
  ),
)

// ---- streak --------------------------------------------------------------

interface StreakState extends StreakData {
  /** 방금 하루가 인정됐는지. 홈의 StreakStrip이 한 번 재생하고 지운다. 저장하지 않는다 */
  justAttended: boolean
  attend: (today: string) => StreakData | null
  replace: (data: StreakData) => void
  clearJustAttended: () => void
}

export const useStreak = create<StreakState>()(
  persist(
    (set, get) => ({
      ...EMPTY_STREAK,
      justAttended: false,
      attend: (today) => {
        const { current, longest, lastDate, recentDates } = get()
        const before = { current, longest, lastDate, recentDates }
        const after = applyAttendance(before, today)
        if (after === before) return null
        set({ ...after, justAttended: true })
        return after
      },
      replace: (data) => set({ ...data, justAttended: false }),
      clearJustAttended: () => set({ justAttended: false }),
    }),
    {
      name: `${STORAGE_PREFIX}streak`,
      storage,
      partialize: ({ current, longest, lastDate, recentDates }) => ({
        current,
        longest,
        lastDate,
        recentDates,
      }),
    },
  ),
)

// ---- read ----------------------------------------------------------------

interface ReadState {
  /** 최근 읽은 paperId 최대 50개. 홈 추천에서 빼 달라고 서버에 보낸다 */
  ids: string[]
  add: (paperId: string) => void
}

export const useRead = create<ReadState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (paperId) =>
        set({ ids: [paperId, ...get().ids.filter((id) => id !== paperId)].slice(0, 50) }),
    }),
    { name: `${STORAGE_PREFIX}read`, storage },
  ),
)

// ---- reset ---------------------------------------------------------------

/** 기기 데이터 초기화: 메모리 상태를 비우고 nonstop:v1: 키를 모두 지운다 */
export function resetDevice() {
  useProfile.setState(EMPTY_PROFILE)
  useSaves.setState({ items: [] })
  useStreak.setState({ ...EMPTY_STREAK, justAttended: false })
  useRead.setState({ ids: [] })
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => localStorage.removeItem(key))
  } catch {
    // 저장소 접근이 막혀 있으면 메모리 상태만 비운다
  }
}
