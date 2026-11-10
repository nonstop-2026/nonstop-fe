import { useState } from 'react'
import { useNavigate } from 'react-router'
import { queryClient } from '@/shared/api/queries'
import { resetDevice, useProfile } from '@/shared/store/device'
import { Button } from '@/shared/ui/controls'
import { BottomSheet } from '@/shared/ui/feedback'
import { LevelSelector } from '@/shared/ui/LevelSelector'
import { TopBar } from '@/shared/ui/TopBar'

/** 설정: 기본 읽기 수준, 기기 데이터 초기화 */
export function SettingsPage() {
  const navigate = useNavigate()
  const defaultLevel = useProfile((s) => s.defaultLevel)
  const setDefaultLevel = useProfile((s) => s.setDefaultLevel)
  const [confirming, setConfirming] = useState(false)

  const reset = () => {
    resetDevice()
    queryClient.clear()
    setConfirming(false)
    navigate('/', { replace: true })
  }

  return (
    <>
      <TopBar title="설정" />
      <main className="flex flex-col gap-8 px-5 pt-6 pb-8">
        <LevelSelector label="기본 읽기 수준" value={defaultLevel} onChange={setDefaultLevel} />

        <section className="flex flex-col items-start gap-3">
          <h2 className="text-headline text-fg">기기 데이터</h2>
          <p className="text-body-sm text-fg-secondary">
            관심 분야, 저장 목록, 출석 기록은 이 기기에만 저장돼요.
          </p>
          <Button variant="secondary" onClick={() => setConfirming(true)}>
            기기 데이터 초기화
          </Button>
        </section>
      </main>

      <BottomSheet
        open={confirming}
        onClose={() => setConfirming(false)}
        title="기기 데이터를 초기화할까요"
      >
        <p className="text-body-sm text-fg-secondary">
          관심 분야, 저장 목록, 출석 기록이 모두 지워지고 되돌릴 수 없어요.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => setConfirming(false)}>
            취소
          </Button>
          <Button onClick={reset}>초기화</Button>
        </div>
      </BottomSheet>
    </>
  )
}
