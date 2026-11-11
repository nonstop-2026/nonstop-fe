import { motion } from 'motion/react'
import { Outlet, useLocation, useNavigationType } from 'react-router'
import { Toaster, WakeBanner } from '@/shared/ui/feedback'

/** 하단 탭 화면. 탭끼리 옮길 때는 TabLayout이 안쪽만 바꾸므로 바깥 틀은 다시 그리지 않는다 */
const TAB_PATHS = new Set(['/home', '/feed', '/saves', '/menu'])

/** 화면 전환 (docs/interaction.md 2절). 새 화면은 오른쪽에서, 뒤로 가기는 왼쪽에서 살짝 들어온다 */
const SLIDE_PX = 16

/**
 * 모든 화면의 바깥 틀. 데스크톱에서는 가운데 480px 폭이고,
 * 바깥 배경(backdrop)과 구분되게 좌우 구분선을 둔다.
 */
export function AppShell() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()
  const isTab = TAB_PATHS.has(pathname)
  const offset = isTab ? 0 : navigationType === 'POP' ? -SLIDE_PX : SLIDE_PX

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-app flex-col bg-canvas sm:border-x sm:border-line-divider">
      <WakeBanner />
      <motion.div
        key={isTab ? 'tabs' : pathname}
        initial={{ opacity: 0, x: offset }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-1 flex-col"
      >
        <Outlet />
      </motion.div>
      <Toaster />
    </div>
  )
}
