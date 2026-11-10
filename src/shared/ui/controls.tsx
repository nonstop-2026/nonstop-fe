import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

// ---- Button (디자인 시스템 10.1) -------------------------------------------

type ButtonVariant = 'primary' | 'secondary' | 'text' | 'accent'

const BUTTON: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary disabled:bg-surface-muted disabled:text-fg-tertiary',
  secondary: 'border border-line-control text-fg disabled:text-fg-tertiary',
  text: 'text-fg-secondary',
  accent: 'bg-accent text-on-accent',
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
        'inline-flex h-12 items-center justify-center gap-2 rounded-control px-5 text-body-sm font-semibold transition duration-150 ease-out active:scale-98 disabled:active:scale-100 motion-reduce:transition-none',
        BUTTON[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    />
  )
}

// ---- Chip (디자인 시스템 10.2) ---------------------------------------------

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
}

export function Chip({ selected, className, type = 'button', ...props }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        'inline-flex h-9 shrink-0 items-center rounded-pill px-4 text-body-sm transition duration-150 ease-out motion-reduce:transition-none',
        selected
          ? 'bg-primary font-semibold text-on-primary'
          : 'border border-line-control text-fg',
        className,
      )}
      {...props}
    />
  )
}

// ---- Badge (외곽선형만, 데모는 "AI 요약" 하나) -------------------------------

export function AiBadge() {
  return (
    <span className="inline-flex h-6 shrink-0 items-center rounded-pill border border-line-control px-2 text-caption text-fg-secondary">
      AI 요약
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
        'grid min-h-11 min-w-11 place-items-center rounded-control text-fg-secondary hover:text-fg',
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
          className={cn('h-1 flex-1 rounded-pill', i < current ? 'bg-primary' : 'bg-surface-muted')}
        />
      ))}
    </div>
  )
}
