import { useNavigate } from 'react-router'
import { useHome } from '@/shared/api/queries'
import { formatKoreanDate } from '@/shared/lib/format'
import { Button } from '@/shared/ui/controls'
import { EmptyState, ErrorState } from '@/shared/ui/feedback'
import { HeroCard, HeroSkeleton, ListRow, ListSkeleton } from '@/shared/ui/PaperCard'
import { StreakStrip } from '@/shared/ui/StreakStrip'

/** 홈: 헤더 → 출석 스트릭 → 대체 안내 → 오늘의 논문 → 나를 위한 추천 */
export function HomePage() {
  const home = useHome()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-8 px-5 pt-6 pb-8">
      <header>
        <h1 className="text-title text-fg">논스톱</h1>
        {home.data && (
          <p className="mt-1 text-caption text-fg-tertiary">{formatKoreanDate(home.data.today)}</p>
        )}
      </header>

      {home.isPending && (
        <>
          <div aria-hidden="true" className="h-32 rounded-card bg-surface-muted" />
          <HeroSkeleton />
          <ListSkeleton />
        </>
      )}

      {home.isError && <ErrorState error={home.error} onRetry={() => home.refetch()} />}

      {home.data && (
        <>
          <StreakStrip today={home.data.today} />

          {home.data.isFallback && (
            <p role="status" className="-mb-4 text-body-sm text-fg-secondary">
              최근 논문을 모았어요
            </p>
          )}

          <section aria-labelledby="today-paper">
            <h2 id="today-paper" className="text-headline text-fg">
              오늘의 논문
            </h2>
            <div className="mt-3">
              {home.data.todayPaper ? (
                <HeroCard paper={home.data.todayPaper} />
              ) : (
                <EmptyState
                  message="오늘 준비한 논문을 모두 읽었어요. 피드에서 더 둘러보세요"
                  action={<Button onClick={() => navigate('/feed')}>피드 보기</Button>}
                />
              )}
            </div>
          </section>

          {home.data.recommendations.length > 0 && (
            <section aria-labelledby="for-you">
              <h2 id="for-you" className="text-headline text-fg">
                나를 위한 추천
              </h2>
              <ul className="mt-3 divide-y divide-line-divider border-y border-line-divider">
                {home.data.recommendations.map((paper) => (
                  <li key={paper.paperId}>
                    <ListRow paper={paper} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  )
}
