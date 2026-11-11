import { Link } from 'react-router'
import { cachedToday } from '@/shared/api/queries'
import { CONTACT_EMAIL } from '@/shared/config/env'
import { displayCurrent } from '@/shared/lib/streak'
import { useProfile, useStreak } from '@/shared/store/device'
import { ChevronRightIcon } from '@/shared/ui/icons'
import { LevelSelector } from '@/shared/ui/LevelSelector'

const ROWS = [
  { to: '/menu/keywords', title: '관심 키워드', desc: '고른 분야를 바꿀 수 있어요' },
  {
    to: '/menu/settings',
    title: '기기 데이터',
    desc: '이 기기에 저장된 기록을 초기화할 수 있어요',
  },
  { to: '/terms', title: '이용약관', desc: null },
]

/** 메뉴: 스트릭 요약 → 기본 읽기 수준 → 관심 키워드 · 기기 데이터 · 이용약관 → 개인정보 안내 → 문의 */
export function MenuPage() {
  const streak = useStreak()
  const defaultLevel = useProfile((s) => s.defaultLevel)
  const setDefaultLevel = useProfile((s) => s.setDefaultLevel)
  // 홈에서 받은 today가 있으면 끊긴 연속 기록은 0일로 보여 준다
  const today = cachedToday()
  const current = today ? displayCurrent(streak, today) : streak.current
  const longest = streak.longest

  return (
    <div className="flex flex-col gap-8 px-5 pt-6 pb-8">
      <h1 className="text-title text-fg">메뉴</h1>

      <section aria-label="출석 기록" className="grid grid-cols-2 rounded-card bg-accent-soft p-4">
        <div>
          <p className="text-caption text-accent-fg">현재</p>
          <p className="text-display text-fg slashed-zero tabular-nums">{current}일</p>
        </div>
        <div>
          <p className="text-caption text-accent-fg">최장 기록</p>
          <p className="text-display text-fg slashed-zero tabular-nums">{longest}일</p>
        </div>
      </section>

      <LevelSelector label="기본 읽기 수준" value={defaultLevel} onChange={setDefaultLevel} />

      <ul className="divide-y divide-line-divider border-y border-line-divider">
        {ROWS.map((row) => (
          <li key={row.to}>
            <Link
              to={row.to}
              className="-mx-2 flex min-h-11 items-center justify-between rounded-control px-2 py-3 transition-colors duration-150 ease-out hover:bg-surface-muted active:bg-surface-muted motion-reduce:transition-none"
            >
              <div>
                <p className="text-body text-fg">{row.title}</p>
                {row.desc && <p className="text-caption text-fg-tertiary">{row.desc}</p>}
              </div>
              <ChevronRightIcon className="text-fg-tertiary" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2 text-body-sm text-fg-secondary">
        <p>
          논스톱은 회원 정보를 받지 않아요. 관심 분야, 저장 목록, 출석 기록은 이 기기에만 저장돼요.
        </p>
        <p>
          문의{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-fg underline underline-offset-2">
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </div>
  )
}
