import type { Level } from '@/shared/api/types'
import { LEVEL_DESCRIPTION, LEVEL_LABEL, LEVELS } from '@/shared/constants/levels'
import { Segmented } from './controls'

interface LevelSelectorProps {
  value: Level
  onChange: (level: Level) => void
  label: string
}

const OPTIONS = LEVELS.map((level) => ({ value: level, label: LEVEL_LABEL[level] }))

/**
 * 읽기 수준 (디자인 시스템 10.6). 팀 피드백(누를 수 있는 버튼인지 알기 어려움)에 따라
 * 슬라이더 모양 대신 세그먼트 버튼으로 그린다. 마크업은 그대로 radiogroup이다.
 * 고른 수준의 설명을 아래에 한 줄로 보여 준다. 상세 · 메뉴 · 온보딩 완료에서 같이 쓴다.
 */
export function LevelSelector({ value, onChange, label }: LevelSelectorProps) {
  return (
    <div>
      <Segmented label={label} options={OPTIONS} value={value} onChange={onChange} />
      <p aria-live="polite" className="mt-2 text-caption text-fg-tertiary">
        {LEVEL_DESCRIPTION[value]}
      </p>
    </div>
  )
}
