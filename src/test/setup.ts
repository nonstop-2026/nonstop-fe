import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { server } from '@/mocks/node'

// 테스트에서 나가는 API 요청은 MSW가 받는다. 핸들러가 없는 요청은 실패로 본다.
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(() => {
  server.resetHandlers()
  cleanup()
  localStorage.clear()
})
afterAll(() => server.close())
