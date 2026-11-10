import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/** 테스트(Vitest)용 MSW */
export const server = setupServer(...handlers)
