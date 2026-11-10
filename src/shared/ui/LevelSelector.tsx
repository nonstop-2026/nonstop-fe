import { useId, useRef, type KeyboardEvent } from 'react'
import type { Level } from '@/shared/api/types'
import { LEVEL_LABEL, LEVELS } from '@/shared/constants/levels'
import { cn } from '@/shared/lib/cn'

interface LevelSelectorProps {
  value: Level
  onChange: (level: Level) => void
  label: string
}

/**
 * 읽기 수준 (디자인 시스템 10.6). 보기에는 슬라이더지만 마크업은 radiogroup이라
 * 좌우 방향키와 스크린리더로 조작할 수 있다. 상세와 설정에서 같이 쓴다.
 */
export function LevelSelector({ value, onChange, label }: LevelSelectorProps) {
  const name = useId()
  const labelId = useId()
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const index = LEVELS.indexOf(value)

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step =
      e.key === 'ArrowRight' || e.key === 'ArrowUp'
        ? 1
        : e.key === 'ArrowLeft' || e.key === 'ArrowDown'
          ? -1
          : 0
    if (step === 0) return
    e.preventDefault()
    const next = Math.min(LEVELS.length - 1, Math.max(0, index + step))
    onChange(LEVELS[next])
    inputs.current[next]?.focus()
  }

  return (
    <div className="rounded-card border border-line-divider bg-surface px-4 pt-3 pb-2">
      <p id={labelId} className="text-caption text-fg-secondary">
        {label}
      </p>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        onKeyDown={onKeyDown}
        className="relative mt-2"
      >
        {/* 슬라이더 모양 트랙 */}
        <div aria-hidden="true" className="absolute top-3 right-6 left-6 h-px bg-line-control" />
        <div className="relative grid grid-cols-3">
          {LEVELS.map((level, i) => {
            const checked = i === index
            return (
              <label
                key={level}
                className="flex min-h-11 cursor-pointer flex-col items-center gap-1"
              >
                <input
                  ref={(el) => {
                    inputs.current[i] = el
                  }}
                  type="radio"
                  name={name}
                  value={level}
                  checked={checked}
                  tabIndex={checked ? 0 : -1}
                  onChange={() => onChange(level)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-1.5 size-3 rounded-pill border-2 transition duration-150 ease-out peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus motion-reduce:transition-none',
                    checked ? 'size-4 border-primary bg-primary' : 'border-line-control bg-surface',
                  )}
                />
                <span
                  className={cn(
                    'text-caption',
                    checked ? 'font-semibold text-fg' : 'text-fg-tertiary',
                  )}
                >
                  {LEVEL_LABEL[level]}
                </span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}
