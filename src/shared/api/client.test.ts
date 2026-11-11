import { http, HttpResponse } from 'msw'
import { server } from '@/mocks/node'
import { useWake } from '@/shared/store/wake'
import { ApiError, apiFetch } from './client'
import type { HomeResponse } from './types'

describe('apiFetch', () => {
  it('목 API에서 홈 데이터를 받는다', async () => {
    const home = await apiFetch<HomeResponse>('/v1/home')
    expect(home.today).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(home.todayPaper?.titleKo).toBeTruthy()
  })

  it('Problem Details 오류를 ApiError로 읽는다', async () => {
    server.use(
      http.post('*/v1/onboarding/weights', () =>
        HttpResponse.json(
          {
            type: 'about:blank',
            title: '요청을 처리할 수 없어요',
            status: 400,
            detail: '관심 키워드를 3개 이상 골라 주세요.',
            code: 'TOO_FEW_KEYWORDS',
          },
          { status: 400, headers: { 'Content-Type': 'application/problem+json' } },
        ),
      ),
    )
    const error = await apiFetch('/v1/onboarding/weights', {
      method: 'POST',
      body: { keywords: ['llm'], swipes: [] },
    }).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({
      status: 400,
      code: 'TOO_FEW_KEYWORDS',
      title: '요청을 처리할 수 없어요',
      detail: '관심 키워드를 3개 이상 골라 주세요.',
    })
  })

  it('본문이 JSON이 아니어도 상태 코드로 ApiError를 만든다', async () => {
    server.use(http.get('*/v1/home', () => new HttpResponse('oops', { status: 500 })))
    await expect(apiFetch('/v1/home')).rejects.toMatchObject({ status: 500, code: 'UNKNOWN' })
  })

  it('503 SERVICE_UNAVAILABLE을 온보딩 가중치 요청에서도 같은 ApiError로 읽는다', async () => {
    server.use(
      http.post('*/v1/onboarding/weights', () =>
        HttpResponse.json(
          {
            type: 'about:blank',
            title: '지금은 논문을 불러올 수 없어요',
            status: 503,
            detail: '잠시 후 다시 시도해 주세요.',
            code: 'SERVICE_UNAVAILABLE',
          },
          { status: 503, headers: { 'Content-Type': 'application/problem+json' } },
        ),
      ),
    )
    await expect(
      apiFetch('/v1/onboarding/weights', {
        method: 'POST',
        body: { keywords: ['llm', 'rag', 'agents'], swipes: [] },
      }),
    ).rejects.toMatchObject({ status: 503, code: 'SERVICE_UNAVAILABLE' })
  })

  it('응답이 3초를 넘으면 서버를 깨우는 중 상태를 켜고, 끝나면 끈다', async () => {
    vi.useFakeTimers()
    let respond: (res: Response) => void = () => {}
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(() => new Promise<Response>((resolve) => (respond = resolve)))
    try {
      const pending = apiFetch<HomeResponse>('/v1/home')
      await vi.advanceTimersByTimeAsync(2_900)
      expect(useWake.getState().slow).toBe(0)
      await vi.advanceTimersByTimeAsync(200)
      expect(useWake.getState().slow).toBe(1)
      respond(Response.json({ ok: true }))
      await pending
      expect(useWake.getState().slow).toBe(0)
    } finally {
      fetchSpy.mockRestore()
      vi.useRealTimers()
    }
  })
})
