import type { ReactNode } from 'react'
import { useGoBack } from '@/shared/lib/navigation'
import { ChevronLeftIcon } from './icons'

/** 상단 바: 뒤로 · 제목 · 오른쪽 아이콘 하나까지 */
export function TopBar({ title, right }: { title?: string; right?: ReactNode }) {
  const goBack = useGoBack()

  return (
    <header className="sticky top-0 z-30 grid h-14 grid-cols-[3rem_1fr_3rem] items-center border-b border-line-divider bg-surface px-1">
      <button
        type="button"
        onClick={goBack}
        aria-label="뒤로 가기"
        className="grid min-h-11 min-w-11 cursor-pointer place-items-center rounded-control text-fg transition-colors duration-150 ease-out hover:bg-surface-muted active:scale-95 motion-reduce:transition-none"
      >
        <ChevronLeftIcon size={24} />
      </button>
      <h1 className="truncate text-center text-headline text-fg">{title}</h1>
      <div className="flex justify-end">{right}</div>
    </header>
  )
}
