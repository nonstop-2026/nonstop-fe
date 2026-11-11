import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useGoBack } from '@/shared/lib/navigation'
import { ApiError } from '@/shared/api/client'
import { fetchToday, usePaper, usePersonalization } from '@/shared/api/queries'
import type { Level, PaperDetail } from '@/shared/api/types'
import { KEYWORD_LABEL } from '@/shared/constants/keywords'
import { useProfile, useRead, useSaves, useStreak } from '@/shared/store/device'
import { useToast } from '@/shared/store/toast'
import { AiBadge, Button, Highlight, IconButton } from '@/shared/ui/controls'
import { BottomSheet, EmptyState, ErrorState, Mascot } from '@/shared/ui/feedback'
import { BookmarkIcon, CheckIcon, ChevronDownIcon, ExternalIcon } from '@/shared/ui/icons'
import { LevelSelector } from '@/shared/ui/LevelSelector'
import { MetaLine } from '@/shared/ui/PaperCard'
import { TopBar } from '@/shared/ui/TopBar'

const MILESTONES = [7, 30]

/** 논문 상세. 내용이 화면에 표시된 시점에 출석을 인정한다 */
export function PaperPage() {
  const paperId = useParams().paperId ?? ''
  const defaultLevel = useProfile((s) => s.defaultLevel)
  // 여기서 바꾼 읽기 수준은 이 논문에만 적용하고 기본값은 그대로 둔다
  const [level, setLevel] = useState<Level>(defaultLevel)
  const paper = usePaper(paperId, level)
  const saved = useSaves((s) => s.items.some((i) => i.paperId === paperId))
  const toggleSave = useSaves((s) => s.toggle)
  const toast = useToast((s) => s.show)
  const milestone = useAttendance(paperId, Boolean(paper.data) && !paper.isPlaceholderData)

  return (
    <>
      <TopBar
        right={
          paper.data && (
            <IconButton
              label={saved ? '저장 취소' : '저장'}
              aria-pressed={saved}
              onClick={() => toast(toggleSave(paperId) ? '저장했어요' : '저장을 취소했어요')}
              className="text-fg"
            >
              <BookmarkIcon size={24} filled={saved} />
            </IconButton>
          )
        }
      />

      {paper.isPending && <DetailSkeleton />}

      {paper.isError &&
        (paper.error instanceof ApiError && paper.error.code === 'PAPER_NOT_FOUND' ? (
          <EmptyState message="논문을 찾을 수 없어요. 홈에서 다른 논문을 골라 보세요" />
        ) : (
          <ErrorState error={paper.error} onRetry={() => paper.refetch()} />
        ))}

      {paper.data && <Body paper={paper.data} level={level} onLevelChange={setLevel} />}

      <BottomSheet
        open={milestone !== null}
        onClose={milestone?.close ?? (() => {})}
        title={`${milestone?.days ?? 0}일째예요`}
      >
        <div className="flex flex-col items-center gap-3 pb-2 text-center">
          <Mascot className="size-28" />
          <p className="text-body text-fg-secondary">
            {milestone?.days}일 동안 하루도 빠짐없이 논문을 읽었어요
          </p>
        </div>
      </BottomSheet>
    </>
  )
}

/** 출석 인정 + 읽은 논문 기록. 7일 · 30일에 도달하면 축하 시트를 연다 */
function useAttendance(paperId: string, ready: boolean) {
  const params = usePersonalization()
  const attend = useStreak((s) => s.attend)
  const addRead = useRead((s) => s.add)
  const toast = useToast((s) => s.show)
  const [days, setDays] = useState<number | null>(null)
  const handled = useRef<string | null>(null)

  useEffect(() => {
    if (!ready || handled.current === paperId) return
    handled.current = paperId
    addRead(paperId)
    fetchToday(params)
      .then((today) => {
        const next = attend(today)
        if (next && MILESTONES.includes(next.current)) {
          setDays(next.current)
          toast(`${next.current}일 연속으로 읽었어요`)
        }
      })
      .catch(() => {
        // 날짜를 못 받으면 오늘은 인정하지 않는다. 다음에 상세를 열 때 다시 시도한다
        handled.current = null
      })
    // params는 홈 캐시가 없을 때만 쓰므로 바뀌어도 다시 판정하지 않는다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, paperId])

  return days === null ? null : { days, close: () => setDays(null) }
}

function Body({
  paper,
  level,
  onLevelChange,
}: {
  paper: PaperDetail
  level: Level
  onLevelChange: (level: Level) => void
}) {
  const { card } = paper
  const goBack = useGoBack()
  const details = [
    ['방법', card.method],
    ['데이터', card.dataset],
    ['한계', card.limitation],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]))

  return (
    <article className="flex flex-col gap-8 px-5 pt-5 pb-12">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-caption text-fg-tertiary">
            <span className="font-semibold text-fg-secondary">{paper.primaryCategory}</span>
            {paper.venue && <span className="ml-2">{paper.venue}</span>}
          </p>
          <AiBadge />
        </div>
        <h2 className="text-paper-title text-fg">{paper.titleKo}</h2>
        <p className="-mt-1 text-caption text-fg-tertiary">{paper.title}</p>
        <MetaLine paper={paper} />
      </header>

      <LevelSelector label="읽기 수준" value={level} onChange={onLevelChange} />

      <Section title="한 줄 요약">
        <p className="text-body text-fg">
          <Highlight>{card.oneLine}</Highlight>
        </p>
      </Section>

      <Section title="왜 중요한가">
        <p className="text-body text-fg">{card.whyImportant}</p>
      </Section>

      <Section title="핵심 포인트">
        <ul className="flex list-disc flex-col gap-1 pl-5 text-body text-fg marker:text-fg-tertiary">
          {card.keyPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </Section>

      {details.length > 0 && (
        <details className="group border-y border-line-divider">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between py-3 text-headline text-fg">
            방법 · 데이터 · 한계
            <ChevronDownIcon className="text-fg-tertiary transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" />
          </summary>
          <dl className="flex flex-col gap-4 pb-4">
            {details.map(([term, desc]) => (
              <div key={term}>
                <dt className="text-caption text-fg-tertiary">{term}</dt>
                <dd className="mt-1 text-body-sm text-fg">{desc}</dd>
              </div>
            ))}
          </dl>
        </details>
      )}

      <Section title="논문 정보">
        <dl className="grid grid-cols-[4.5rem_1fr] gap-x-3 gap-y-2 text-body-sm">
          <dt className="text-fg-tertiary">저자</dt>
          <dd className="text-fg">{paper.authors.join(', ')}</dd>
          <dt className="text-fg-tertiary">게시일</dt>
          <dd className="text-fg slashed-zero tabular-nums">{paper.publishedAt}</dd>
          <dt className="text-fg-tertiary">분류</dt>
          <dd className="text-fg">
            {paper.primaryCategory}
            {paper.tags.length > 0 && ` · ${paper.tags.map((t) => KEYWORD_LABEL[t]).join(', ')}`}
          </dd>
          <dt className="text-fg-tertiary">arXiv</dt>
          <dd className="text-fg slashed-zero tabular-nums">
            {paper.arxivId}v{paper.version}
          </dd>
          {paper.license && (
            <>
              <dt className="text-fg-tertiary">라이선스</dt>
              <dd className="break-all text-fg">{paper.license}</dd>
            </>
          )}
        </dl>
      </Section>

      <div>
        <div className="grid grid-cols-2 gap-2">
          {/* 원문은 arXiv 초록 페이지를 새 탭으로 열기만 한다 */}
          <a
            href={paper.abstractUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-control border border-line-control bg-surface text-body-sm font-semibold text-fg transition duration-150 ease-out hover:bg-surface-muted active:scale-98 motion-reduce:transition-none"
          >
            원문 보기
            <ExternalIcon />
          </a>
          {/* 다 읽은 뒤 들어온 곳(피드 · 홈 · 저장함)으로 돌아간다 */}
          <Button onClick={goBack}>
            <CheckIcon />다 읽었어요
          </Button>
        </div>
        <p className="mt-3 text-center text-caption text-fg-tertiary">
          AI 요약에는 오류가 있을 수 있어요. 인용할 때는 원문을 확인해 주세요
        </p>
      </div>
    </article>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-caption font-semibold text-fg-tertiary">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function DetailSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3 px-5 pt-5">
      <div className="h-3 w-1/4 rounded-mark bg-surface-muted" />
      <div className="h-7 w-4/5 rounded-mark bg-surface-muted" />
      <div className="h-3 w-3/5 rounded-mark bg-surface-muted" />
      <div className="mt-6 h-20 rounded-card bg-surface-muted" />
      <div className="mt-6 h-5 w-full rounded-mark bg-surface-muted" />
      <div className="h-5 w-4/5 rounded-mark bg-surface-muted" />
    </div>
  )
}
