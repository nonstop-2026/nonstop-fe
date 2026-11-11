import { useState } from 'react'
import { useNavigate } from 'react-router'
import { usePapersByIds } from '@/shared/api/queries'
import { isWithinDays } from '@/shared/lib/format'
import { useProfile, useSaves } from '@/shared/store/device'
import { useToast } from '@/shared/store/toast'
import { Button, Segmented } from '@/shared/ui/controls'
import { EmptyState, ErrorState } from '@/shared/ui/feedback'
import { BookmarkIcon } from '@/shared/ui/icons'
import { HeroCard, HeroSkeleton } from '@/shared/ui/PaperCard'

const FILTERS = [
  { value: 'all', label: '전체' },
  { value: 'recent', label: '최근 7일' },
] as const
type Filter = (typeof FILTERS)[number]['value']

/** 저장함: 기기에 둔 저장 목록을 GET /v1/papers?ids= 로 한 번에 받아 카드로 보여 준다 */
export function SavesPage() {
  const navigate = useNavigate()
  const items = useSaves((s) => s.items)
  const toggle = useSaves((s) => s.toggle)
  const level = useProfile((s) => s.defaultLevel)
  const toast = useToast((s) => s.show)
  const [filter, setFilter] = useState<Filter>('all')

  const visible = filter === 'all' ? items : items.filter((i) => isWithinDays(i.savedAt, 7))
  const ids = visible.map((i) => i.paperId)
  const papers = usePapersByIds(ids, level)

  const unsave = (paperId: string) => {
    toggle(paperId)
    toast('저장을 취소했어요', { label: '되돌리기', onClick: () => toggle(paperId) })
  }

  return (
    <div className="flex flex-col gap-4 px-5 pt-6 pb-8">
      <h1 className="text-title text-fg">저장함</h1>
      <Segmented
        label="저장 시기"
        showLabel={false}
        options={FILTERS}
        value={filter}
        onChange={setFilter}
      />

      {ids.length === 0 && (
        <EmptyState
          message={
            items.length === 0
              ? '마음에 드는 논문을 저장하면 여기에 모여요'
              : '최근 7일 동안 저장한 논문이 없어요'
          }
          action={<Button onClick={() => navigate('/feed')}>피드 보기</Button>}
        />
      )}

      {ids.length > 0 && papers.isPending && (
        <>
          <HeroSkeleton />
          <HeroSkeleton />
        </>
      )}
      {papers.isError && <ErrorState error={papers.error} onRetry={() => papers.refetch()} />}

      {ids.length > 0 && papers.data && (
        <ul className="flex flex-col gap-4">
          {papers.data.items
            .filter((p) => ids.includes(p.paperId))
            .map((paper) => (
              <li key={paper.paperId}>
                <HeroCard
                  paper={paper}
                  footer={
                    <>
                      <span className="text-caption text-fg-tertiary slashed-zero tabular-nums">
                        {savedLabel(items.find((i) => i.paperId === paper.paperId)?.savedAt)}
                      </span>
                      <button
                        type="button"
                        onClick={() => unsave(paper.paperId)}
                        aria-label="저장 취소"
                        className="-mr-3 grid min-h-11 min-w-11 cursor-pointer place-items-center rounded-control text-fg transition-colors duration-150 ease-out hover:bg-surface-muted active:scale-95 motion-reduce:transition-none"
                      >
                        <BookmarkIcon filled />
                      </button>
                    </>
                  }
                />
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}

/** 저장 시각을 "11월 10일 저장" 형식으로 */
function savedLabel(savedAt?: string) {
  if (!savedAt) return ''
  const d = new Date(savedAt)
  return `${d.getMonth() + 1}월 ${d.getDate()}일 저장`
}
