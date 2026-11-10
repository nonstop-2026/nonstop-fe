import { Link, Navigate, useNavigate } from 'react-router'
import { useProfile } from '@/shared/store/device'
import { Button } from '@/shared/ui/controls'
import { Mascot } from '@/shared/ui/feedback'

/** 시작: 저장된 프로필이 있으면 홈으로 */
export function StartPage() {
  const navigate = useNavigate()
  const onboarded = useProfile((s) => s.onboardedAt !== null)
  if (onboarded) return <Navigate to="/home" replace />

  return (
    <main className="flex flex-1 flex-col px-5 pt-24 pb-[calc(2rem+env(safe-area-inset-bottom))]">
      <div className="flex flex-1 flex-col items-start gap-6">
        <Mascot className="size-28" />
        <div>
          <h1 className="text-display text-fg">논스톱</h1>
          <p className="mt-2 text-body text-fg-secondary">
            매일 논문 한 편, AI 요약 카드로 가볍게 읽어요.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Button fullWidth onClick={() => navigate('/onboarding/interests')}>
          시작하기
        </Button>
        <p className="text-center text-caption text-fg-tertiary">
          시작하면{' '}
          <Link to="/terms" className="underline underline-offset-2">
            이용약관
          </Link>
          에 동의한 것으로 봐요
        </p>
      </div>
    </main>
  )
}
