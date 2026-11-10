import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { useOnboardingCards } from '@/shared/api/queries'
import type { PaperSummary, Reaction } from '@/shared/api/types'
import { MIN_KEYWORDS } from '@/shared/constants/keywords'
import { Button, ProgressSegments } from '@/shared/ui/controls'
import { ErrorState } from '@/shared/ui/feedback'
import { UndoIcon } from '@/shared/ui/icons'
import { CardBody, Cover, HeroSkeleton } from '@/shared/ui/PaperCard'
import { useOnboarding } from './store'

const SWIPE_OUT = 110

/** 카드 10장 평가: 좌 = 별로, 우 = 흥미로워요, 버튼으로 건너뛰기, 되돌리기 1회 */
export function SwipePage() {
  const navigate = useNavigate()
  const { keywords, swipes, swipe, undo, undoUsed } = useOnboarding()
  const cards = useOnboardingCards(keywords)
  const items = cards.data?.items ?? []
  const current = items[swipes.length]
  const done = items.length > 0 && swipes.length >= items.length

  useEffect(() => {
    if (done) navigate('/onboarding/done', { replace: true })
  }, [done, navigate])

  if (keywords.length < MIN_KEYWORDS) return <Navigate to="/onboarding/interests" replace />

  const answer = (reaction: Reaction) => current && swipe({ paperId: current.paperId, reaction })

  return (
    <main className="flex flex-1 flex-col px-5 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
      <ProgressSegments total={3} current={2} />
      <div className="mt-8 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-title text-fg">이 논문, 흥미로운가요</h1>
          <p className="mt-1 text-body-sm text-fg-secondary">좌우로 밀어 알려 주세요</p>
        </div>
        <p aria-live="polite" className="text-caption text-fg-tertiary slashed-zero tabular-nums">
          {Math.min(swipes.length + 1, items.length || 10)} / {items.length || 10}
        </p>
      </div>

      <div className="relative mt-6 min-h-96 flex-1">
        {cards.isPending && <HeroSkeleton />}
        {cards.isError && <ErrorState error={cards.error} onRetry={() => cards.refetch()} />}
        {current && <SwipeCard key={current.paperId} paper={current} onAnswer={answer} />}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2">
        <Button variant="secondary" onClick={() => answer('dislike')} disabled={!current}>
          별로예요
        </Button>
        <Button variant="secondary" onClick={() => answer('skip')} disabled={!current}>
          건너뛰기
        </Button>
        <Button variant="accent" onClick={() => answer('like')} disabled={!current}>
          흥미로워요
        </Button>
      </div>
      <Button
        variant="text"
        className="mx-auto mt-2"
        onClick={undo}
        disabled={undoUsed || swipes.length === 0}
      >
        <UndoIcon />
        되돌리기
      </Button>
    </main>
  )
}

function SwipeCard({ paper, onAnswer }: { paper: PaperSummary; onAnswer: (r: Reaction) => void }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-6, 6])

  const fly = (reaction: 'like' | 'dislike') => {
    animate(x, reaction === 'like' ? 480 : -480, { duration: 0.2 }).then(() => onAnswer(reaction))
  }

  return (
    <motion.article
      drag="x"
      dragSnapToOrigin
      // eslint-disable-next-line no-restricted-syntax -- 드래그 위치는 Motion이 매 프레임 계산해 style로만 넣을 수 있다
      style={{ x, rotate }}
      onDragEnd={(_, info) => {
        if (info.offset.x > SWIPE_OUT) fly('like')
        else if (info.offset.x < -SWIPE_OUT) fly('dislike')
      }}
      tabIndex={0}
      aria-label={`${paper.titleKo}. 오른쪽 방향키는 흥미로워요, 왼쪽 방향키는 별로예요`}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') fly('like')
        if (e.key === 'ArrowLeft') fly('dislike')
      }}
      className="absolute inset-0 cursor-grab touch-pan-y overflow-hidden rounded-card border border-line-divider bg-surface select-none active:cursor-grabbing"
    >
      <Cover paper={paper} />
      <div className="p-4">
        <CardBody paper={paper} />
      </div>
    </motion.article>
  )
}
