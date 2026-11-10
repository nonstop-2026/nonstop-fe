import { Outlet } from 'react-router'
import { Toaster, WakeBanner } from '@/shared/ui/feedback'

/** 모든 화면의 바깥 틀. 데스크톱에서는 가운데 480px 폭 */
export function AppShell() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-app flex-col bg-canvas">
      <WakeBanner />
      <Outlet />
      <Toaster />
    </div>
  )
}
