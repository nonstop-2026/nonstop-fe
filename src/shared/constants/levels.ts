import type { Level } from '@/shared/api/types'

export const LEVELS: Level[] = ['easy', 'basic', 'expert']
export const LEVEL_LABEL: Record<Level, string> = { easy: '쉽게', basic: '기본', expert: '전문' }
