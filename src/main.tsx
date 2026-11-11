import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app/App'
import { config } from '@/shared/config/env'
import '@/app/styles/index.css'

/** 목 모드면 MSW를 먼저 켠다. 켜지기 전에 요청이 나가면 실제 서버로 가기 때문이다 */
async function enableMocking() {
  if (!config.useMock) return
  const { worker } = await import('@/mocks/browser')
  await worker.start({ onUnhandledFrame: 'bypass', quiet: true })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
