import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, type ReactNode } from 'react'
import mascot from '@/assets/hamster.webp'
import { ApiError } from '@/shared/api/client'
import { cn } from '@/shared/lib/cn'
import { useToast } from '@/shared/store/toast'
import { useWake } from '@/shared/store/wake'
import { Button } from './controls'
import { CloseIcon } from './icons'

// ---- 마스코트 (루틴 면에만: 첫 화면, 온보딩 완료, 스트릭 기념, 빈 화면, 오류) ---------

export function Mascot({ className }: { className?: string }) {
  return (
    <img
      src={mascot}
      alt=""
      draggable={false}
      className={cn('size-24 object-contain', className)}
    />
  )
}

// ---- 빈 화면 · 오류 ---------------------------------------------------------

export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 px-5 py-12 text-center">
      <Mascot />
      <p className="text-body-sm text-fg-secondary">{message}</p>
      {action}
    </div>
  )
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const title = error instanceof ApiError ? error.title : '논문을 불러오지 못했어요'
  return (
    <div role="alert" className="flex flex-col items-center gap-4 px-5 py-12 text-center">
      <Mascot />
      <div>
        <p className="text-headline text-fg">{title}</p>
        <p className="mt-1 text-body-sm text-danger">다시 시도해 주세요</p>
      </div>
      <Button variant="secondary" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  )
}

// ---- 서버 깨우는 중 (첫 요청이 3초를 넘으면) ----------------------------------

export function WakeBanner() {
  const slow = useWake((s) => s.slow)
  if (slow === 0) return null
  return (
    <p
      role="status"
      className="fixed inset-x-0 top-0 z-50 mx-auto max-w-app bg-surface px-5 py-3 text-center text-body-sm text-fg-secondary shadow-overlay"
    >
      서버를 깨우는 중이에요. 잠시만 기다려 주세요
    </p>
  )
}

// ---- 토스트 (3~5초, 행동 버튼 하나까지) -----------------------------------------

export function Toaster() {
  const { message, action, id, hide } = useToast()

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(hide, 4000)
    return () => clearTimeout(timer)
  }, [message, id, hide])

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-50 mx-auto flex max-w-app justify-center px-5 pb-[env(safe-area-inset-bottom)]"
    >
      <AnimatePresence>
        {message && (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex items-center gap-3 rounded-card bg-primary px-4 py-3 text-body-sm text-on-primary shadow-overlay"
          >
            {message}
            {action && (
              <button
                type="button"
                onClick={() => {
                  action.onClick()
                  hide()
                }}
                className="font-semibold underline underline-offset-2"
              >
                {action.label}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ---- 바텀시트 (손잡이 + 닫기 버튼 필수) ---------------------------------------

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            className="absolute inset-0 bg-fg/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-app rounded-t-card bg-surface px-5 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-overlay"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div aria-hidden="true" className="mx-auto h-1 w-10 rounded-pill bg-line-divider" />
            <div className="mt-2 flex items-center justify-between">
              <h2 id={titleId} className="text-headline text-fg">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="grid min-h-11 min-w-11 place-items-center text-fg-secondary"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="mt-2">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
