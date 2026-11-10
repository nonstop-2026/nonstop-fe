import type { ReactNode } from 'react'
import { Link } from 'react-router'
import type { PaperSummary } from '@/shared/api/types'
import { KEYWORD_LABEL } from '@/shared/constants/keywords'
import { cn } from '@/shared/lib/cn'
import { paperPath, shortAuthors, venueOrYear, yearOf } from '@/shared/lib/format'
import { AiBadge, Highlight } from './controls'
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

function TopLine({ paper }: { paper: PaperSummary }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="truncate text-caption text-fg-tertiary">
        <span className="font-semibold text-fg-secondary">{paper.primaryCategory}</span>
        <span className="ml-2 slashed-zero tabular-nums">{venueOrYear(paper)}</span>
      </p>
      <AiBadge />
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

/** 카드 본문 (윗줄 ~ 메타). 피드 · 온보딩에서도 그대로 쓴다 */
export function CardBody({ paper, large = false }: { paper: PaperSummary; large?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <TopLine paper={paper} />
      <h3 className="text-paper-title text-fg">{paper.titleKo}</h3>
      <p className="-mt-1 text-caption text-fg-tertiary">{paper.title}</p>
      <p className={cn('text-fg', large ? 'text-body' : 'text-body-sm')}>
        <Highlight>{paper.oneLine}</Highlight>
      </p>
      <MetaLine paper={paper} />
    </div>
  )
}

/** hero: 홈 오늘의 논문, 저장함. 카드 전체가 상세 링크 */
export function HeroCard({ paper, action }: { paper: PaperSummary; action?: ReactNode }) {
  return (
    <article className="relative overflow-hidden rounded-card border border-line-divider bg-surface">
      <Link to={paperPath(paper.paperId)} className="block">
        <Cover paper={paper} />
        <div className="p-4">
          <CardBody paper={paper} />
        </div>
      </Link>
      {action && <div className="absolute right-2 bottom-2">{action}</div>}
    </article>
  )
}

/** list: 카드 테두리 없이 행 구분선, 왼쪽에 thumb */
export function ListRow({ paper }: { paper: PaperSummary }) {
  return (
    <Link to={paperPath(paper.paperId)} className="flex items-center gap-3 py-3">
      <PaperCover
        paperId={paper.paperId}
        arxivId={paper.arxivId}
        primaryCategory={paper.primaryCategory}
        variant="thumb"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-caption text-fg-tertiary">
          <span className="font-semibold text-fg-secondary">{paper.primaryCategory}</span>
          <span className="ml-2 slashed-zero tabular-nums">{venueOrYear(paper)}</span>
        </p>
        <p className="line-clamp-2 text-body-sm font-semibold text-fg">{paper.titleKo}</p>
        <p className="truncate text-caption text-fg-tertiary">{paper.title}</p>
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
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3 w-1/3 rounded-mark bg-surface-muted" />
        <div className="h-6 w-4/5 rounded-mark bg-surface-muted" />
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
        <div key={i} className="flex items-center gap-3 py-3">
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
