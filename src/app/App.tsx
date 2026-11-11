import { QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'motion/react'
import { RouterProvider } from 'react-router'
import { queryClient } from '@/shared/api/queries'
import { router } from './router'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* 기기에서 동작 줄이기를 켜면 위치 이동 애니메이션을 끄고 투명도만 바꾼다 */}
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} />
      </MotionConfig>
    </QueryClientProvider>
  )
}
