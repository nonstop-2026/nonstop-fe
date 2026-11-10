import { create } from 'zustand'

interface WakeState {
  /** 3초 넘게 응답이 없는 요청 수. 0보다 크면 "서버를 깨우는 중" 안내를 보여 준다 */
  slow: number
  inc: () => void
  dec: () => void
}

export const useWake = create<WakeState>()((set) => ({
  slow: 0,
  inc: () => set((s) => ({ slow: s.slow + 1 })),
  dec: () => set((s) => ({ slow: Math.max(0, s.slow - 1) })),
}))
