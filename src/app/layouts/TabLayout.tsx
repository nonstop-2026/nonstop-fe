import { Navigate, NavLink, Outlet } from 'react-router'
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
  const onboarded = useProfile((s) => s.onboardedAt !== null)
  if (!onboarded) return <Navigate to="/onboarding/interests" replace />

  return (
    <>
      <main className="flex flex-1 flex-col pb-[calc(3.5rem+env(safe-area-inset-bottom))]">
        <Outlet />
      </main>
      <nav
        aria-label="주요 메뉴"
        className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-app border-t border-line-divider bg-surface pb-[env(safe-area-inset-bottom)]"
      >
        <ul className="grid h-14 grid-cols-4">
          {TABS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex h-full flex-col items-center justify-center gap-0.5 text-caption',
                    isActive ? 'font-semibold text-fg' : 'text-fg-tertiary',
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
