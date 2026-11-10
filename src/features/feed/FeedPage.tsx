import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useFeed } from '@/shared/api/queries'
import type { PaperSummary } from '@/shared/api/types'
import { paperPath } from '@/shared/lib/format'
import { sharePaper } from '@/shared/lib/share'
import { useSaves } from '@/shared/store/device'
import { useToast } from '@/shared/store/toast'
import { ErrorState } from '@/shared/ui/feedback'
import { BookmarkIcon, ShareIcon } from '@/shared/ui/icons'
import { CardBody, Cover, HeroSkeleton } from '@/shared/ui/PaperCard'

const SWIPE_DISTANCE = 60
/** 왼쪽 가장자리에서 시작한 제스처는 브라우저 뒤로 가기와 겹치므로 무시한다 */
const EDGE_IGNORE_PX = 20
/** 끝에서 이만큼 남으면 다음 묶음을 받는다 */
const PREFETCH_LEFT = 3

/** 상세에 다녀와도 보던 카드로 돌아오게 기억한다 */
const position = { index: 0 }
const rememberIndex = (i: number) => {
  position.index = i
}

/** 피드: 논문 하나당 한 화면, 세로 스냅, 커서 페이지네이션 무한 스크롤 */
export function FeedPage() {
  const navigate = useNavigate()
  const feed = useFeed()
  const papers = useMemo(() => feed.data?.pages.flatMap((p) => p.items) ?? [], [feed.data])
  const scroller = useRef<HTMLDivElement>(null)

  const openDetail = useCallback(
    (paper?: PaperSummary) => paper && navigate(paperPath(paper.paperId)),
    [navigate],
  )
  const currentIndex = () => {
    const el = scroller.current
    return el ? Math.round(el.scrollTop / el.clientHeight) : 0
  }

  // 돌아왔을 때 보던 카드로 이동 (처음 데이터가 그려질 때 한 번)
  const hasData = papers.length > 0
  useLayoutEffect(() => {
    const el = scroller.current
    if (el && hasData && position.index > 0) el.scrollTop = position.index * el.clientHeight
  }, [hasData])

  const onScroll = () => {
    const i = currentIndex()
    rememberIndex(i)
    if (i >= papers.length - PREFETCH_LEFT && feed.hasNextPage && !feed.isFetchingNextPage)
      feed.fetchNextPage()
  }

  // 키보드: 위 · 아래 방향키로 이동, 오른쪽 방향키로 상세
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = scroller.current
      if (!el) return
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        el.scrollBy({ top: (e.key === 'ArrowDown' ? 1 : -1) * el.clientHeight, behavior: 'smooth' })
      } else if (e.key === 'ArrowRight') {
        openDetail(papers[currentIndex()])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [papers, openDetail])

  return (
    <div
      ref={scroller}
      onScroll={onScroll}
      className="no-scrollbar h-[calc(100dvh-3.5rem-env(safe-area-inset-bottom))] snap-y snap-mandatory overflow-y-scroll overscroll-contain"
    >
      {feed.isPending && (
        <div className="h-full px-5 pt-4">
          <HeroSkeleton />
        </div>
      )}
      {feed.isError && <ErrorState error={feed.error} onRetry={() => feed.refetch()} />}
      {papers.map((paper) => (
        <FeedItem key={paper.paperId} paper={paper} onOpen={() => openDetail(paper)} />
      ))}
      {feed.isFetchingNextPage && (
        <div className="h-full snap-start px-5 pt-4">
          <HeroSkeleton />
        </div>
      )}
      {feed.isSuccess && !feed.hasNextPage && papers.length > 0 && (
        <p className="flex h-24 snap-end items-center justify-center text-caption text-fg-tertiary">
          오늘 준비한 논문을 모두 봤어요
        </p>
      )}
    </div>
  )
}

function FeedItem({ paper, onOpen }: { paper: PaperSummary; onOpen: () => void }) {
  const start = useRef<{ x: number; y: number } | null>(null)
  const saved = useSaves((s) => s.items.some((i) => i.paperId === paper.paperId))
  const toggleSave = useSaves((s) => s.toggle)
  const toast = useToast((s) => s.show)

  const onPointerUp = (e: React.PointerEvent) => {
    const s = start.current
    start.current = null
    if (!s) return
    const dx = e.clientX - s.x
    const dy = e.clientY - s.y
    const isTap = Math.hypot(dx, dy) < 10
    const isRightSwipe = dx > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.5
    if (isTap || isRightSwipe) onOpen()
  }

  const onSave = () => {
    const nowSaved = toggleSave(paper.paperId)
    toast(nowSaved ? '저장했어요' : '저장을 취소했어요')
  }

  const onShare = async () => {
    const message = await sharePaper(paper)
    if (message) toast(message)
  }

  return (
    <article
      aria-label={paper.titleKo}
      className="relative h-full snap-start snap-always px-5 pt-4 pb-6"
    >
      <div
        role="link"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onOpen()}
        onPointerDown={(e) => {
          start.current = e.clientX < EDGE_IGNORE_PX ? null : { x: e.clientX, y: e.clientY }
        }}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (start.current = null)}
        className="cursor-pointer touch-pan-y overflow-hidden rounded-card border border-line-divider bg-surface select-none"
      >
        <Cover paper={paper} />
        <div className="p-4 pr-16">
          <CardBody paper={paper} large />
        </div>
      </div>

      {/* 우측 레일: 저장 · 공유 */}
      <div className="absolute right-7 bottom-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={onSave}
          aria-label={saved ? '저장 취소' : '저장'}
          aria-pressed={saved}
          className="grid min-h-11 min-w-11 place-items-center rounded-pill border border-line-divider bg-surface text-fg"
        >
          <BookmarkIcon filled={saved} />
        </button>
        <button
          type="button"
          onClick={onShare}
          aria-label="공유"
          className="grid min-h-11 min-w-11 place-items-center rounded-pill border border-line-divider bg-surface text-fg"
        >
          <ShareIcon />
        </button>
      </div>
    </article>
  )
}
