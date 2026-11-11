import { useRef, useState, type MouseEvent, type PointerEvent } from 'react'
import type { PaperSummary } from '@/shared/api/types'
import { cn } from '@/shared/lib/cn'
import { IconButton } from '@/shared/ui/controls'
import { ChevronLeftIcon, ChevronRightIcon } from '@/shared/ui/icons'
import { HeroCard } from '@/shared/ui/PaperCard'

/** 카드 사이 간격 (gap-3) */
const GAP_PX = 12
/** 마우스로 이만큼 넘게 끌면 옆 카드로 넘긴다 */
const DRAG_PX = 40

/**
 * 오늘의 논문 가로 넘김.
 * - 터치: 브라우저 가로 스크롤 + scroll-snap
 * - 마우스: 가로 스크롤 영역을 끌 수 없으므로 끌기를 직접 처리하고, 끈 뒤의 클릭(상세 이동)은 막는다
 * - 버튼 · 키보드: 아래 이전 · 다음 버튼
 * 다음 카드가 오른쪽에 살짝 보여서 옆으로 넘길 수 있다는 것을 알려 준다.
 */
export function TodayCarousel({ papers }: { papers: PaperSummary[] }) {
  const track = useRef<HTMLUListElement>(null)
  const drag = useRef<{ x: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)
  const [index, setIndex] = useState(0)
  const many = papers.length > 1

  const step = () => {
    const first = track.current?.firstElementChild as HTMLElement | null
    return first ? first.offsetWidth + GAP_PX : 1
  }

  const goTo = (i: number) => {
    const next = Math.max(0, Math.min(papers.length - 1, i))
    track.current?.scrollTo({ left: next * step(), behavior: 'smooth' })
    setIndex(next)
  }

  const onScroll = () => {
    const el = track.current
    if (el) setIndex(Math.min(papers.length - 1, Math.round(el.scrollLeft / step())))
  }

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    drag.current = { x: e.clientX, moved: false }
  }
  const onPointerMove = (e: PointerEvent) => {
    if (drag.current && Math.abs(e.clientX - drag.current.x) > 5) drag.current.moved = true
  }
  const onPointerUp = (e: PointerEvent) => {
    const d = drag.current
    drag.current = null
    if (!d?.moved) return
    suppressClick.current = true
    const dx = e.clientX - d.x
    if (Math.abs(dx) > DRAG_PX) goTo(index + (dx < 0 ? 1 : -1))
  }
  const onClickCapture = (e: MouseEvent) => {
    if (!suppressClick.current) return
    suppressClick.current = false
    e.preventDefault()
    e.stopPropagation()
  }

  if (!many) return <HeroCard paper={papers[0]} />

  return (
    <div>
      <ul
        ref={track}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => (drag.current = null)}
        onClickCapture={onClickCapture}
        // 링크 · 이미지를 끌 때 브라우저 기본 끌어 놓기가 끼어들지 않게 한다
        onDragStart={(e) => e.preventDefault()}
        aria-label={`오늘의 논문 ${papers.length}편`}
        className="-mx-5 no-scrollbar flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto overscroll-x-contain px-5 select-none"
      >
        {papers.map((paper, i) => (
          <li
            key={paper.paperId}
            aria-label={`${papers.length}편 중 ${i + 1}번째`}
            className="w-5/6 shrink-0 snap-start snap-always"
          >
            <HeroCard paper={paper} />
          </li>
        ))}
      </ul>

      <div className="mt-2 flex items-center justify-between">
        <IconButton label="이전 논문" onClick={() => goTo(index - 1)} disabled={index === 0}>
          <ChevronLeftIcon />
        </IconButton>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {papers.map((paper, i) => (
            <span
              key={paper.paperId}
              className={cn(
                'h-1.5 rounded-pill transition-all duration-200 ease-out motion-reduce:transition-none',
                i === index ? 'w-4 bg-primary' : 'w-1.5 bg-line-divider',
              )}
            />
          ))}
        </div>
        <IconButton
          label="다음 논문"
          onClick={() => goTo(index + 1)}
          disabled={index === papers.length - 1}
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
    </div>
  )
}
