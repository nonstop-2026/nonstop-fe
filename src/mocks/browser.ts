import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

/** 브라우저용 MSW. main.tsx에서 목 모드일 때만 불러온다. */
export const worker = setupWorker(...handlers)
