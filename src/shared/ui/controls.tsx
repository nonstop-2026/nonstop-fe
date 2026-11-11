import { useId, useRef, type ButtonHTMLAttributes, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { CheckIcon } from './icons'

/*
 * 상태별 동작은 docs/interaction.md를 따른다.
 * 공통: 색 변화는 duration-150 ease-out, 눌림은 active:scale-98, 포커스는 전역 focus-visible 외곽선,
 * motion-reduce에서는 전환 없이 바로 바뀐다. hover는 마우스가 있는 기기에서만 적용된다.
 */
const TRANSITION = 'transition duration-150 ease-out motion-reduce:transition-none'

// ---- Button (디자인 시스템 10.1) -------------------------------------------

type ButtonVariant = 'primary' | 'secondary' | 'text' | 'accent'

const BUTTON: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-on-primary hover:opacity-90 disabled:bg-surface-muted disabled:text-fg-tertiary disabled:opacity-100',
  secondary:
    'border border-line-control bg-surface text-fg hover:bg-surface-muted disabled:border-line-divider disabled:bg-surface disabled:text-fg-tertiary',
  text: 'text-fg-secondary hover:bg-surface-muted hover:text-fg disabled:bg-transparent disabled:text-fg-tertiary',
  accent: 'bg-accent text-on-accent hover:opacity-90 disabled:opacity-50',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  fullWidth,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-control px-5 text-body-sm font-semibold active:scale-98 disabled:cursor-not-allowed disabled:active:scale-100',
        TRANSITION,
        BUTTON[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    />
  )
}

// ---- Chip (디자인 시스템 10.2) ---------------------------------------------
// 팀 피드백(알약 모양이 너무 많음)에 따라 rounded-pill 대신 rounded-control을 쓴다.

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
}

export function Chip({ selected, className, type = 'button', children, ...props }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        'inline-flex h-9 shrink-0 cursor-pointer items-center gap-1 rounded-control px-3 text-body-sm active:scale-98',
        TRANSITION,
        selected
          ? 'bg-primary font-semibold text-on-primary hover:opacity-90'
          : 'border border-line-control bg-surface text-fg hover:bg-surface-muted',
        className,
      )}
      {...props}
    >
      {selected && <CheckIcon size={20} className="-ml-0.5" aria-hidden="true" />}
      {children}
    </button>
  )
}

// ---- Segmented (세그먼트, 하나만 고르는 선택지) ---------------------------------
// 마크업은 radiogroup이라 좌우 방향키와 스크린리더로 조작할 수 있다.

interface SegmentedProps<T extends string> {
  label: string
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  /** 라벨을 화면에 보여 줄지. false면 스크린리더에만 읽힌다 */
  showLabel?: boolean
}

export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  showLabel = true,
}: SegmentedProps<T>) {
  const name = useId()
  const labelId = useId()
  const inputs = useRef<(HTMLInputElement | null)[]>([])
  const index = options.findIndex((o) => o.value === value)

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? 1
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? -1
          : 0
    if (step === 0) return
    e.preventDefault()
    const next = Math.min(options.length - 1, Math.max(0, index + step))
    onChange(options[next].value)
    inputs.current[next]?.focus()
  }

  return (
    <div>
      <p id={labelId} className={showLabel ? 'mb-2 text-caption text-fg-secondary' : 'sr-only'}>
        {label}
      </p>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        onKeyDown={onKeyDown}
        className="flex gap-1 rounded-control border border-line-divider bg-surface-muted p-1"
      >
        {options.map((option, i) => {
          const checked = i === index
          return (
            <label key={option.value} className="flex-1">
              <input
                ref={(el) => {
                  inputs.current[i] = el
                }}
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                tabIndex={checked ? 0 : -1}
                onChange={() => onChange(option.value)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  'flex h-10 cursor-pointer items-center justify-center rounded-control text-body-sm select-none peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus active:scale-98',
                  TRANSITION,
                  checked
                    ? 'bg-primary font-semibold text-on-primary'
                    : 'text-fg-secondary hover:bg-surface hover:text-fg',
                )}
              >
                {option.label}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

// ---- Badge (외곽선형만, 데모는 "AI 요약" 하나) -------------------------------

export function AiBadge() {
  return (
    <span className="inline-flex h-6 shrink-0 items-center rounded-mark border border-line-control px-1.5 text-caption text-fg-secondary">
      AI 요약
    </span>
  )
}

// ---- 읽음 표시 (이미 연 논문) ------------------------------------------------

export function ReadMark() {
  return (
    <span className="inline-flex shrink-0 items-center gap-0.5 text-caption text-fg-tertiary">
      <CheckIcon size={20} aria-hidden="true" className="-my-1" />
      읽음
    </span>
  )
}

// ---- Highlight (oneLine 전용 형광펜) -----------------------------------------

export function Highlight({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded-mark bg-highlight box-decoration-clone px-1 text-fg">{children}</mark>
  )
}

// ---- 아이콘 버튼 (터치 영역 44px) --------------------------------------------

export function IconButton({
  label,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'grid min-h-11 min-w-11 cursor-pointer place-items-center rounded-control text-fg-secondary hover:bg-surface-muted hover:text-fg active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:active:scale-100',
        TRANSITION,
        className,
      )}
      {...props}
    />
  )
}

// ---- 온보딩 진행 막대 ------------------------------------------------------

export function ProgressSegments({ total, current }: { total: number; current: number }) {
  return (
    <div
      role="progressbar"
      aria-label="온보딩 진행"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      className="flex gap-1.5"
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            'h-1 flex-1 rounded-pill transition-colors duration-200 ease-out motion-reduce:transition-none',
            i < current ? 'bg-primary' : 'bg-surface-muted',
          )}
        />
      ))}
    </div>
  )
}
