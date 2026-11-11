import type { Level } from '@/shared/api/types'

export const LEVELS: Level[] = ['easy', 'basic', 'expert']
export const LEVEL_LABEL: Record<Level, string> = { easy: '쉽게', basic: '기본', expert: '전문' }
export const LEVEL_DESCRIPTION: Record<Level, string> = {
  easy: '처음 보는 분야도 이해할 수 있게 쉬운 말로 풀어요',
  basic: '전공 수업을 들은 학부생 눈높이로 설명해요',
  expert: '전문 용어를 그대로 쓰고 방법을 자세히 다뤄요',
}
