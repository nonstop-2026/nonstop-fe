import { useNavigate } from 'react-router'
import { useHome } from '@/shared/api/queries'
import type { HomeResponse } from '@/shared/api/types'
import { formatKoreanDate } from '@/shared/lib/format'
import { Button } from '@/shared/ui/controls'
import { EmptyState, ErrorState } from '@/shared/ui/feedback'
import { HeroSkeleton, ListRow, ListSkeleton } from '@/shared/ui/PaperCard'
import { StreakStrip } from '@/shared/ui/StreakStrip'
import { TodayCarousel } from './TodayCarousel'

/** 오늘의 논문 가로 넘김에 넣을 최대 편수 */
const TODAY_MAX = 5

/**
 * 오늘의 논문과 추천을 나눈다. 백엔드는 가장 최근 게시일 묶음에서 관심 점수 1위를 todayPaper로,
 * 나머지 전체에서 점수순 10편을 recommendations로 준다. 추천 중 todayPaper와 게시일이 같은 논문은
 * 같은 날 묶음의 다음 순위이므로 오늘의 논문 쪽으로 옮겨 가로로 넘겨 보게 한다.
 */
function splitHome({ todayPaper, recommendations }: HomeResponse) {
  if (!todayPaper) return { today: [], others: recommendations }
  const sameDay = recommendations
    .filter((p) => p.publishedAt === todayPaper.publishedAt)
    .slice(0, TODAY_MAX - 1)
  const today = [todayPaper, ...sameDay]
  return { today, others: recommendations.filter((p) => !sameDay.includes(p)) }
}

/** 홈: 헤더 → 출석 스트릭 → 오늘의 논문(가로 넘김) → 나를 위한 추천(구분된 영역) */
export function HomePage() {
  const home = useHome()
  const navigate = useNavigate()
  const split = home.data ? splitHome(home.data) : null

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-8 px-5 pt-6 pb-10">
        <header>
          <h1 className="text-title text-fg">논스톱</h1>
          {home.data && (
            <p className="mt-1 text-caption text-fg-tertiary">
              {formatKoreanDate(home.data.today)}
            </p>
          )}
        </header>

        {home.isPending && (
          <>
            <div aria-hidden="true" className="h-32 rounded-card bg-surface-muted" />
            <HeroSkeleton />
          </>
        )}

        {home.isError && <ErrorState error={home.error} onRetry={() => home.refetch()} />}

        {home.data && split && (
          <>
            <StreakStrip today={home.data.today} />

            <section aria-labelledby="today-paper">
              <SectionHeader
                id="today-paper"
                title="오늘의 논문"
                description={
                  home.data.isFallback
                    ? '오늘 새 논문이 없어 최근 논문을 모았어요'
                    : split.today.length > 1
                      ? `가장 최근 논문 중 관심사에 가까운 ${split.today.length}편이에요. 옆으로 넘겨 보세요`
                      : '가장 최근 논문 중 관심사에 가장 가까운 논문이에요'
                }
              />
              <div className="mt-4">
                {split.today.length > 0 ? (
                  <TodayCarousel papers={split.today} />
                ) : (
                  <EmptyState
                    message="오늘 준비한 논문을 모두 읽었어요. 피드에서 더 둘러보세요"
                    action={<Button onClick={() => navigate('/feed')}>피드 보기</Button>}
                  />
                )}
              </div>
            </section>
          </>
        )}
      </div>

      {/* 추천은 바탕색과 구분선으로 오늘의 논문과 다른 영역임을 보여 준다 */}
      {home.isPending && (
        <div className="flex-1 border-t border-line-divider bg-surface px-5 pt-6 pb-8">
          <ListSkeleton />
        </div>
      )}
      {split && split.others.length > 0 && (
        <section
          aria-labelledby="for-you"
          className="flex-1 border-t border-line-divider bg-surface px-5 pt-8 pb-8"
        >
          <SectionHeader
            id="for-you"
            title="나를 위한 추천"
            description="관심 키워드에 맞춰 지난 논문까지 골랐어요"
          />
          <ul className="mt-2 divide-y divide-line-divider">
            {split.others.map((paper) => (
              <li key={paper.paperId}>
                <ListRow paper={paper} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function SectionHeader({
  id,
  title,
  description,
}: {
  id: string
  title: string
  description: string
}) {
  return (
    <div>
      <h2 id={id} className="text-headline text-fg">
        {title}
      </h2>
      <p className="mt-0.5 text-caption text-fg-tertiary">{description}</p>
    </div>
  )
}
