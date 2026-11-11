import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { ApiError } from '@/shared/api/client'
import { useComputeWeights } from '@/shared/api/queries'
import type { Level } from '@/shared/api/types'
import { KEYWORD_LABEL, MIN_KEYWORDS } from '@/shared/constants/keywords'
import { useProfile } from '@/shared/store/device'
import { Button, ProgressSegments } from '@/shared/ui/controls'
import { Mascot } from '@/shared/ui/feedback'
import { LevelSelector } from '@/shared/ui/LevelSelector'
import { useOnboarding } from './store'

/** 취향 분석 완료: 가중치를 받아 상위 키워드 1~3위를 보여 주고, 기본 읽기 수준을 고른다 */
export function DonePage() {
  const navigate = useNavigate()
  const { keywords, swipes, reset } = useOnboarding()
  const completeOnboarding = useProfile((s) => s.completeOnboarding)
  const weights = useComputeWeights()
  const [level, setLevel] = useState<Level>('basic')
  // 시작하기를 누른 뒤 임시 상태를 비울 때 "키워드 없음" 리다이렉트가 먼저 일어나지 않게 막는다
  const [finished, setFinished] = useState(false)
  const { mutate } = weights

  useEffect(() => {
    if (keywords.length >= MIN_KEYWORDS) mutate({ keywords, swipes })
  }, [keywords, swipes, mutate])

  if (keywords.length < MIN_KEYWORDS && !finished)
    return <Navigate to="/onboarding/interests" replace />

  const liked = swipes.filter((s) => s.reaction === 'like').length
  const top = weights.data?.interests.slice(0, 3) ?? []

  const start = () => {
    if (!weights.data) return
    completeOnboarding(keywords, weights.data.interests, level)
    setFinished(true)
    reset()
    navigate('/home', { replace: true })
  }

  return (
    <main className="flex flex-1 flex-col px-5 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
      <ProgressSegments total={3} current={3} />

      <div className="mt-8 flex flex-col items-center text-center">
        <Mascot />
        <h1 className="mt-4 text-title text-fg">취향 분석을 마쳤어요</h1>
        <p className="mt-1 text-body-sm text-fg-secondary tabular-nums">
          흥미로운 논문 {liked}편을 골랐어요
        </p>
      </div>

      <section className="mt-8 rounded-card border border-line-divider bg-surface p-4">
        <h2 className="text-caption text-fg-secondary">상위 관심 키워드</h2>
        {weights.isPending && (
          <div aria-hidden="true" className="mt-3 flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-5 w-2/3 rounded-mark bg-surface-muted" />
            ))}
          </div>
        )}
        {weights.isError && (
          <div role="alert" className="mt-3 flex flex-col items-start gap-3">
            <p className="text-body-sm text-danger">{weightsErrorMessage(weights.error)}</p>
            <Button variant="secondary" onClick={() => mutate({ keywords, swipes })}>
              다시 시도
            </Button>
          </div>
        )}
        {top.length > 0 && (
          <ol className="mt-3 flex flex-col gap-2">
            {top.map(({ keyword }, i) => (
              <li key={keyword} className="flex items-center gap-3 text-body text-fg">
                <span className="w-5 text-headline tabular-nums">{i + 1}</span>
                {KEYWORD_LABEL[keyword]}
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className="mt-4">
        <LevelSelector label="기본 읽기 수준" value={level} onChange={setLevel} />
      </div>

      <div className="mt-auto pt-8">
        <Button fullWidth onClick={start} disabled={!weights.data}>
          시작하기
        </Button>
      </div>
    </main>
  )
}

/** 503(서버가 논문 데이터를 못 불러옴) · 400 등 서버 문구가 있으면 그대로, 없으면 기본 문구 */
function weightsErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.code !== 'NETWORK_ERROR' && error.code !== 'TIMEOUT')
    return error.detail ? `${error.title}. ${error.detail}` : error.title
  return '취향을 계산하지 못했어요. 다시 시도해 주세요'
}
