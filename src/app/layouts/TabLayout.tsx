import { motion } from 'motion/react'
import { Navigate, NavLink, Outlet, useLocation } from 'react-router'
import { cn } from '@/shared/lib/cn'
import { useProfile } from '@/shared/store/device'
import { BookmarkIcon, FeedIcon, HomeIcon, MenuIcon } from '@/shared/ui/icons'

const TABS = [
  { to: '/home', label: '홈', icon: HomeIcon },
  { to: '/feed', label: '피드', icon: FeedIcon },
  { to: '/saves', label: '저장함', icon: BookmarkIcon },
  { to: '/menu', label: '메뉴', icon: MenuIcon },
] as const

/** 하단 4탭. 프로필이 없으면(처음 방문) 온보딩으로 보낸다 */
export function TabLayout() {
  const { pathname } = useLocation()
  const onboarded = useProfile((s) => s.onboardedAt !== null)
  if (!onboarded) return <Navigate to="/onboarding/interests" replace />
  // 피드는 어두운 화면이라 하단 탭도 같은 색으로 맞춘다
  const dark = pathname === '/feed'

  return (
    <>
      <main className="flex flex-1 flex-col">
        {/* 탭을 옮기면 내용만 짧게 나타난다 (docs/interaction.md 2절) */}
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-1 flex-col"
        >
          <Outlet />
        </motion.div>
      </main>
      <nav
        aria-label="주요 메뉴"
        className={cn(
          // fixed로 화면 기준 가운데에 두면 스크롤바 자리만큼 앱 영역과 어긋나므로(피드),
          // 앱 영역 안에서 sticky로 아래에 붙인다
          'sticky bottom-0 z-40 w-full border-t border-line-divider bg-surface pb-[env(safe-area-inset-bottom)] transition-colors duration-200 ease-out motion-reduce:transition-none',
          dark && 'theme-dark',
        )}
      >
        <ul className="grid h-14 grid-cols-4">
          {TABS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex h-full flex-col items-center justify-center gap-0.5 text-caption transition-colors duration-150 ease-out active:scale-95 motion-reduce:transition-none',
                    isActive ? 'font-semibold text-fg' : 'text-fg-tertiary hover:text-fg-secondary',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={24} filled={isActive} />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
