import { motion } from 'motion/react'
import { useEffect } from 'react'
import { cn } from '@/shared/lib/cn'
import { displayCurrent, weekOf } from '@/shared/lib/streak'
import { useStreak } from '@/shared/store/device'

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일']

/**
 * 출석 스트릭 (디자인 시스템 10.5). 홈 상단에 둔다.
 * 하루가 막 인정됐으면 숫자가 한 칸 올라가는 장면을 한 번 재생한다.
 */
export function StreakStrip({ today }: { today: string }) {
  const streak = useStreak()
  const current = displayCurrent(streak, today)
  const attendedToday = streak.lastDate === today
  const week = weekOf(today)
  const doneDays = week.filter((d) => streak.recentDates.includes(d)).length
  const animate = streak.justAttended && attendedToday

  useEffect(() => {
    if (!animate) return
    const timer = setTimeout(streak.clearJustAttended, 800)
    return () => clearTimeout(timer)
  }, [animate, streak.clearJustAttended])

  return (
    <section aria-label="출석 스트릭" className="rounded-card bg-accent-soft p-4">
      <div className="flex items-end justify-between gap-3">
        <p className="text-display text-fg slashed-zero tabular-nums">
          {current === 0 ? (
            <span className="text-headline">오늘 첫 논문을 읽어 보세요</span>
          ) : (
            <motion.span
              key={current}
              initial={animate ? { y: 12, opacity: 0 } : false}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              {current}일째
            </motion.span>
          )}
        </p>
      </div>
      {current > 0 && (
        <p className="mt-1 text-body-sm text-accent-fg">
          {attendedToday ? '오늘도 읽었어요' : `오늘 한 편 읽으면 ${current + 1}일째예요`}
        </p>
      )}
      <ol aria-label={`이번 주 ${doneDays}일 읽음`} className="mt-4 grid grid-cols-7 gap-2">
        {week.map((date, i) => {
          const done = streak.recentDates.includes(date)
          const isToday = date === today
          return (
            <li key={date} className="flex flex-col items-center gap-1">
              <span
                aria-hidden="true"
                className={cn(
                  'h-8 w-full rounded-mark transition-colors duration-320 ease-out motion-reduce:transition-none',
                  done ? 'bg-accent-graphic' : 'bg-surface-muted',
                  isToday && !done && 'border-2 border-accent-graphic',
                )}
              />
              <span
                className={cn(
                  'text-caption',
                  isToday ? 'font-semibold text-fg' : 'text-fg-tertiary',
                )}
              >
                {WEEKDAYS[i]}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
