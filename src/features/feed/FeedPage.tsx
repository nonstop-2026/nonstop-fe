import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useFeed, usePaper } from '@/shared/api/queries'
import type { PaperDetail, PaperSummary } from '@/shared/api/types'
import { KEYWORD_LABEL } from '@/shared/constants/keywords'
import { cn } from '@/shared/lib/cn'
import { paperPath } from '@/shared/lib/format'
import { sharePaper } from '@/shared/lib/share'
import { useIsRead, useProfile, useSaves } from '@/shared/store/device'
import { useToast } from '@/shared/store/toast'
import { ErrorState } from '@/shared/ui/feedback'
import { Highlight } from '@/shared/ui/controls'
import { BookmarkIcon, ChevronRightIcon, ShareIcon } from '@/shared/ui/icons'
import { MetaLine, TopLine } from '@/shared/ui/PaperCard'

const SWIPE_DISTANCE = 60
/** 왼쪽 가장자리에서 시작한 제스처는 브라우저 뒤로 가기와 겹치므로 무시한다 */
const EDGE_IGNORE_PX = 20
/** 끝에서 이만큼 남으면 다음 묶음을 받는다 */
const PREFETCH_LEFT = 3
/** 보고 있는 카드 앞뒤로 이만큼까지 상세(방법 · 핵심 포인트)를 미리 받는다 */
const DETAIL_RANGE = 1

/** 상세에 다녀와도 보던 카드로 돌아오게 기억한다 */
const position = { index: 0 }
const rememberIndex = (i: number) => {
  position.index = i
}

/**
 * 피드: 논문 하나당 한 화면, 세로 스냅, 커서 페이지네이션 무한 스크롤.
 * 팀 피드백에 따라 표지 카드 대신 어두운 배경에 글을 바로 보여 준다 (.theme-dark).
 */
export function FeedPage() {
  const navigate = useNavigate()
  const feed = useFeed()
  const papers = useMemo(() => feed.data?.pages.flatMap((p) => p.items) ?? [], [feed.data])
  const scroller = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(position.index)

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
    setCurrent(i)
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
      className="theme-dark no-scrollbar h-[calc(100dvh-3.5rem-env(safe-area-inset-bottom))] snap-y snap-mandatory overflow-y-scroll overscroll-contain bg-canvas text-fg"
    >
      {feed.isPending && <FeedSkeleton />}
      {feed.isError && <ErrorState error={feed.error} onRetry={() => feed.refetch()} />}
      {papers.map((paper, i) => (
        <FeedItem
          key={paper.paperId}
          paper={paper}
          near={Math.abs(i - current) <= DETAIL_RANGE}
          onOpen={() => openDetail(paper)}
        />
      ))}
      {feed.isFetchingNextPage && <FeedSkeleton />}
      {feed.isSuccess && !feed.hasNextPage && papers.length > 0 && (
        <p className="flex h-24 snap-end items-center justify-center text-caption text-fg-tertiary">
          오늘 준비한 논문을 모두 봤어요
        </p>
      )}
    </div>
  )
}

function FeedItem({
  paper,
  near,
  onOpen,
}: {
  paper: PaperSummary
  near: boolean
  onOpen: () => void
}) {
  const start = useRef<{ x: number; y: number } | null>(null)
  // 피드 응답에는 카드 본문이 없어서 화면 근처 논문만 상세를 받는다. 상세 화면과 캐시를 같이 쓴다
  const level = useProfile((s) => s.defaultLevel)
  const detail = usePaper(paper.paperId, level, near)
  const read = useIsRead(paper.paperId)
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
    <article aria-label={paper.titleKo} className="relative h-full snap-start snap-always">
      <div
        role="link"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onOpen()}
        onPointerDown={(e) => {
          start.current = e.clientX < EDGE_IGNORE_PX ? null : { x: e.clientX, y: e.clientY }
        }}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (start.current = null)}
        className="group flex h-full cursor-pointer touch-pan-y flex-col justify-center-safe gap-3 overflow-hidden px-5 py-8 pr-20 select-none"
      >
        <TopLine paper={paper} />
        <div>
          <h2 className={cn('text-title', read ? 'text-fg-tertiary' : 'text-fg')}>
            {paper.titleKo}
          </h2>
          <p className="mt-1 line-clamp-2 text-caption text-fg-tertiary">{paper.title}</p>
        </div>
        <p className="mt-1 text-body text-fg">
          <Highlight>{paper.oneLine}</Highlight>
        </p>
        <FeedDetail card={detail.data?.card} loading={near && detail.isPending} />
        {paper.tags.length > 0 && (
          <p className="text-caption text-fg-secondary">
            {paper.tags.map((t) => KEYWORD_LABEL[t]).join(' · ')}
          </p>
        )}
        <MetaLine paper={paper} />
        <p className="mt-4 inline-flex items-center gap-1 text-body-sm font-semibold text-fg-secondary transition-colors duration-150 ease-out group-hover:text-fg motion-reduce:transition-none">
          자세히 보기
          <ChevronRightIcon aria-hidden="true" />
        </p>
      </div>

      {/* 우측 레일: 저장 · 공유 */}
      <div className="absolute right-3 bottom-8 flex flex-col gap-3">
        <RailButton label={saved ? '저장 취소' : '저장'} pressed={saved} onClick={onSave}>
          <BookmarkIcon size={24} filled={saved} />
        </RailButton>
        <RailButton label="공유" onClick={onShare}>
          <ShareIcon size={24} />
        </RailButton>
      </div>
    </article>
  )
}

/** 형광펜 한 줄 아래 덧붙이는 설명: 방법과 핵심 포인트 2개 */
function FeedDetail({ card, loading }: { card?: PaperDetail['card']; loading: boolean }) {
  if (loading)
    return (
      <div aria-hidden="true" className="flex flex-col gap-2">
        <div className="h-4 w-full rounded-mark bg-surface-muted" />
        <div className="h-4 w-5/6 rounded-mark bg-surface-muted" />
        <div className="h-4 w-2/3 rounded-mark bg-surface-muted" />
      </div>
    )
  if (!card) return null
  const points = card.keyPoints.slice(0, 2)
  return (
    <div className="flex flex-col gap-3 border-l-2 border-line-divider pl-3 text-body-sm text-fg-secondary">
      {card.method && (
        <div>
          <p className="text-caption font-semibold text-fg-tertiary">방법</p>
          <p className="mt-1 line-clamp-3">{card.method}</p>
        </div>
      )}
      {points.length > 0 && (
        <div>
          <p className="text-caption font-semibold text-fg-tertiary">핵심 포인트</p>
          <ul className="mt-1 flex list-disc flex-col gap-1 pl-4 marker:text-fg-tertiary">
            {points.map((point) => (
              <li key={point}>
                {/* line-clamp는 display를 바꿔 글머리 점을 없애므로 안쪽 span에 건다 */}
                <span className="line-clamp-2">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function RailButton({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string
  pressed?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className="flex min-w-12 cursor-pointer flex-col items-center gap-0.5 rounded-control py-1.5 text-caption text-fg-secondary transition duration-150 ease-out hover:bg-surface-muted hover:text-fg active:scale-95 motion-reduce:transition-none"
    >
      <span className="text-fg">{children}</span>
      {label}
    </button>
  )
}

/** 피드 스켈레톤: 최종 레이아웃과 같은 글줄 모양 */
function FeedSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex h-full snap-start flex-col justify-center gap-3 px-5 py-8 pr-20"
    >
      <div className="h-3 w-1/3 rounded-mark bg-surface-muted" />
      <div className="h-7 w-11/12 rounded-mark bg-surface-muted" />
      <div className="h-7 w-2/3 rounded-mark bg-surface-muted" />
      <div className="h-4 w-1/2 rounded-mark bg-surface-muted" />
      <div className="mt-2 h-5 w-full rounded-mark bg-surface-muted" />
      <div className="h-5 w-4/5 rounded-mark bg-surface-muted" />
      <div className="h-3 w-2/5 rounded-mark bg-surface-muted" />
    </div>
  )
}
