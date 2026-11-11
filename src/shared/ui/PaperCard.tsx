import type { ReactNode } from 'react'
import { Link } from 'react-router'
import type { PaperSummary } from '@/shared/api/types'
import { KEYWORD_LABEL } from '@/shared/constants/keywords'
import { cn } from '@/shared/lib/cn'
import { paperPath, shortAuthors, venueOrYear, yearOf } from '@/shared/lib/format'
import { useIsRead } from '@/shared/store/device'
import { AiBadge, Highlight, ReadMark } from './controls'
import { PaperCover } from './PaperCover'

/**
 * 논문 카드 (디자인 시스템 10.3, 0.3).
 * 순서: 윗줄(분류 코드 · 학회/연도 · AI 요약) → 한국어 제목 → 영어 원제 → 형광펜 한 줄 → 메타데이터.
 * hero · swipe · feed 변형은 맨 위에 PaperCover(large), list 변형은 왼쪽에 PaperCover(thumb).
 */

const keywordLabels = (paper: PaperSummary) => paper.tags.map((t) => KEYWORD_LABEL[t])

export function Cover({ paper }: { paper: PaperSummary }) {
  return (
    <PaperCover
      paperId={paper.paperId}
      arxivId={paper.arxivId}
      primaryCategory={paper.primaryCategory}
      keywordLabels={keywordLabels(paper)}
    />
  )
}

export function TopLine({ paper }: { paper: PaperSummary }) {
  const read = useIsRead(paper.paperId)
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="truncate text-caption text-fg-tertiary">
        <span className="font-semibold text-fg-secondary">{paper.primaryCategory}</span>
        <span className="ml-2 slashed-zero tabular-nums">{venueOrYear(paper)}</span>
      </p>
      <div className="flex shrink-0 items-center gap-2">
        {read && <ReadMark />}
        <AiBadge />
      </div>
    </div>
  )
}

/** 메타데이터: 저자 (연도) · arXiv ID */
export function MetaLine({ paper }: { paper: PaperSummary }) {
  return (
    <p className="text-caption text-fg-tertiary">
      {shortAuthors(paper.authors)} (
      <span className="slashed-zero tabular-nums">{yearOf(paper.publishedAt)}</span>) ·{' '}
      <span className="slashed-zero tabular-nums">arXiv {paper.arxivId}</span>
    </p>
  )
}

/**
 * 카드 본문 (윗줄 ~ 메타). 온보딩 카드에서도 그대로 쓴다.
 * 한국어 제목을 크게, 영어 원제는 한 줄로 줄여 작게 둔다 (전체 원제는 상세에서).
 */
export function CardBody({ paper, large = false }: { paper: PaperSummary; large?: boolean }) {
  // 이미 읽은 논문은 제목을 회색으로 낮춰 읽은 느낌을 준다
  const read = useIsRead(paper.paperId)
  return (
    <div className="flex flex-col gap-3">
      <TopLine paper={paper} />
      <div>
        <h3
          className={cn(
            large ? 'text-title' : 'text-paper-title',
            read ? 'text-fg-tertiary' : 'text-fg',
          )}
        >
          {paper.titleKo}
        </h3>
        <p className="mt-1 truncate text-caption text-fg-tertiary" title={paper.title}>
          {paper.title}
        </p>
      </div>
      <p className="text-body-sm text-fg">
        <Highlight>{paper.oneLine}</Highlight>
      </p>
      <MetaLine paper={paper} />
    </div>
  )
}

/**
 * hero: 홈 오늘의 논문, 저장함. 카드 전체가 상세 링크.
 * footer는 카드 아래 구분선 밑 별도 줄에 둔다 (저장함의 저장 날짜 · 저장 취소 버튼)
 */
export function HeroCard({ paper, footer }: { paper: PaperSummary; footer?: ReactNode }) {
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-card border border-line-divider bg-surface transition-colors duration-150 ease-out hover:border-line-control motion-reduce:transition-none">
      <Link
        to={paperPath(paper.paperId)}
        className="flex flex-1 flex-col transition-transform duration-150 ease-out active:scale-99 motion-reduce:transition-none"
      >
        <Cover paper={paper} />
        <div className="p-5">
          <CardBody paper={paper} large />
        </div>
      </Link>
      {footer && (
        <div className="flex min-h-12 items-center justify-between gap-3 border-t border-line-divider px-5 py-1">
          {footer}
        </div>
      )}
    </article>
  )
}

/** list: 카드 테두리 없이 행 구분선, 왼쪽에 thumb */
export function ListRow({ paper }: { paper: PaperSummary }) {
  const read = useIsRead(paper.paperId)
  return (
    <Link
      to={paperPath(paper.paperId)}
      className="-mx-2 flex items-center gap-4 rounded-control px-2 py-4 transition-colors duration-150 ease-out hover:bg-surface-muted active:bg-surface-muted motion-reduce:transition-none"
    >
      <PaperCover
        paperId={paper.paperId}
        arxivId={paper.arxivId}
        primaryCategory={paper.primaryCategory}
        variant="thumb"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-caption text-fg-tertiary">
            <span className="font-semibold text-fg-secondary">{paper.primaryCategory}</span>
            <span className="ml-2 slashed-zero tabular-nums">{venueOrYear(paper)}</span>
          </p>
          {read && <ReadMark />}
        </div>
        <p
          className={cn(
            'mt-0.5 line-clamp-2 text-body font-semibold',
            read ? 'text-fg-tertiary' : 'text-fg',
          )}
        >
          {paper.titleKo}
        </p>
        <p className="mt-0.5 truncate text-caption text-fg-tertiary">{paper.title}</p>
      </div>
    </Link>
  )
}

// ---- 스켈레톤 (최종 레이아웃과 같은 모양) -----------------------------------------

export function HeroSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-card border border-line-divider bg-surface"
    >
      <div className="aspect-video w-full bg-surface-muted" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-3 w-1/3 rounded-mark bg-surface-muted" />
        <div className="h-7 w-4/5 rounded-mark bg-surface-muted" />
        <div className="h-3 w-3/5 rounded-mark bg-surface-muted" />
        <div className="h-5 w-full rounded-mark bg-surface-muted" />
      </div>
    </div>
  )
}

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div aria-hidden="true" className="divide-y divide-line-divider">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 py-4">
          <div className="size-14 rounded-control bg-surface-muted" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-3 w-1/4 rounded-mark bg-surface-muted" />
            <div className="h-4 w-4/5 rounded-mark bg-surface-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
