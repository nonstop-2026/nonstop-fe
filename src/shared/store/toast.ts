import { create } from 'zustand'

interface ToastAction {
  label: string
  onClick: () => void
}

interface ToastState {
  message: string | null
  action: ToastAction | null
  id: number
  show: (message: string, action?: ToastAction) => void
  hide: () => void
}

/** 화면 아래에 잠깐 뜨는 안내. 행동 버튼은 하나까지 */
export const useToast = create<ToastState>()((set) => ({
  message: null,
  action: null,
  id: 0,
  show: (message, action) => set((s) => ({ message, action: action ?? null, id: s.id + 1 })),
  hide: () => set({ message: null, action: null }),
}))
