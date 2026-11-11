import { createBrowserRouter, Navigate, type RouteObject } from 'react-router'
import { DemoPage } from '@/features/demo/DemoPage'
import { FeedPage } from '@/features/feed/FeedPage'
import { HomePage } from '@/features/home/HomePage'
import { KeywordsPage } from '@/features/menu/KeywordsPage'
import { MenuPage } from '@/features/menu/MenuPage'
import { SettingsPage } from '@/features/menu/SettingsPage'
import { DonePage } from '@/features/onboarding/DonePage'
import { InterestsPage } from '@/features/onboarding/InterestsPage'
import { SwipePage } from '@/features/onboarding/SwipePage'
import { PaperPage } from '@/features/paper/PaperPage'
import { SavesPage } from '@/features/saves/SavesPage'
import { StartPage } from '@/features/start/StartPage'
import { TermsPage } from '@/features/terms/TermsPage'
import { config } from '@/shared/config/env'
import { AppShell } from './layouts/AppShell'
import { TabLayout } from './layouts/TabLayout'
import { NotFoundPage } from './NotFoundPage'

const routes: RouteObject[] = [
  { path: '/', element: <StartPage /> },
  {
    path: '/onboarding',
    children: [
      { index: true, element: <Navigate to="interests" replace /> },
      { path: 'interests', element: <InterestsPage /> },
      { path: 'swipe', element: <SwipePage /> },
      { path: 'done', element: <DonePage /> },
    ],
  },
  {
    element: <TabLayout />,
    children: [
      { path: '/home', element: <HomePage /> },
      { path: '/feed', element: <FeedPage /> },
      { path: '/saves', element: <SavesPage /> },
      { path: '/menu', element: <MenuPage /> },
    ],
  },
  { path: '/papers/:paperId', element: <PaperPage /> },
  { path: '/menu/keywords', element: <KeywordsPage /> },
  { path: '/menu/settings', element: <SettingsPage /> },
  { path: '/terms', element: <TermsPage /> },
  // 시연 도구는 VITE_DEMO_TOOLS=true일 때만 등록한다
  ...(config.demoTools ? [{ path: '/demo', element: <DemoPage /> }] : []),
  { path: '*', element: <NotFoundPage /> },
]

export const router = createBrowserRouter([{ element: <AppShell />, children: routes }])
