import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { ChevronLeftIcon } from './icons'

/** 상단 바: 뒤로 · 제목 · 오른쪽 아이콘 하나까지 */
export function TopBar({ title, right }: { title?: string; right?: ReactNode }) {
  const navigate = useNavigate()
  const goBack = () => (window.history.length > 1 ? navigate(-1) : navigate('/home'))

  return (
    <header className="sticky top-0 z-30 grid h-14 grid-cols-[3rem_1fr_3rem] items-center border-b border-line-divider bg-surface px-1">
      <button
        type="button"
        onClick={goBack}
        aria-label="뒤로 가기"
        className="grid min-h-11 min-w-11 place-items-center text-fg"
      >
        <ChevronLeftIcon size={24} />
      </button>
      <h1 className="truncate text-center text-headline text-fg">{title}</h1>
      <div className="flex justify-end">{right}</div>
    </header>
  )
}
