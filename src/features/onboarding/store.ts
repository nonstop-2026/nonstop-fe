import { create } from 'zustand'
import type { KeywordSlug, Reaction } from '@/shared/api/types'

interface Swipe {
  paperId: string
  reaction: Reaction
}

interface OnboardingState {
  keywords: KeywordSlug[]
  swipes: Swipe[]
  /** 되돌리기는 1회만 */
  undoUsed: boolean
  toggleKeyword: (k: KeywordSlug) => void
  swipe: (s: Swipe) => void
  undo: () => void
  reset: () => void
}

/** 온보딩 3단계 동안만 들고 있는 임시 상태. 저장하지 않는다 */
export const useOnboarding = create<OnboardingState>()((set) => ({
  keywords: [],
  swipes: [],
  undoUsed: false,
  toggleKeyword: (k) =>
    set((s) => ({
      keywords: s.keywords.includes(k) ? s.keywords.filter((x) => x !== k) : [...s.keywords, k],
    })),
  swipe: (swipe) => set((s) => ({ swipes: [...s.swipes, swipe] })),
  undo: () =>
    set((s) =>
      s.undoUsed || s.swipes.length === 0 ? s : { swipes: s.swipes.slice(0, -1), undoUsed: true },
    ),
  reset: () => set({ keywords: [], swipes: [], undoUsed: false }),
}))
