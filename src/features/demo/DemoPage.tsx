import { useState } from 'react'
import { useNavigate } from 'react-router'
import { fetchToday, queryClient, usePersonalization } from '@/shared/api/queries'
import { streakEndingYesterday } from '@/shared/lib/streak'
import { resetDevice, useStreak } from '@/shared/store/device'
import { useToast } from '@/shared/store/toast'
import { Button } from '@/shared/ui/controls'
import { TopBar } from '@/shared/ui/TopBar'

/**
 * 시연 도구 (VITE_DEMO_TOOLS=true일 때만 등록).
 * 발표 직전에 "12일째로 설정"을 누르고, 시연에서 논문을 열어 13일째로 올라가는 장면을 보여 준다.
 */
export function DemoPage() {
  const navigate = useNavigate()
  const params = usePersonalization()
  const replace = useStreak((s) => s.replace)
  const streak = useStreak()
  const toast = useToast((s) => s.show)
  const [busy, setBusy] = useState(false)

  const setTwelve = async () => {
    setBusy(true)
    try {
      const today = await fetchToday(params)
      replace(streakEndingYesterday(today, 12))
      toast('12일째로 설정했어요')
    } catch {
      toast('오늘 날짜를 받지 못했어요. 다시 시도해 주세요')
    } finally {
      setBusy(false)
    }
  }

  const reset = () => {
    resetDevice()
    queryClient.clear()
    navigate('/', { replace: true })
  }

  return (
    <>
      <TopBar title="시연 도구" />
      <main className="flex flex-col gap-4 px-5 pt-6 pb-8">
        <p className="text-body-sm text-fg-secondary slashed-zero tabular-nums">
          현재 {streak.current}일 · 최장 {streak.longest}일 · 마지막 인정일{' '}
          {streak.lastDate ?? '없음'}
        </p>
        <Button onClick={setTwelve} disabled={busy}>
          12일째로 설정
        </Button>
        <Button variant="secondary" onClick={reset}>
          기기 데이터 초기화
        </Button>
      </main>
    </>
  )
}
