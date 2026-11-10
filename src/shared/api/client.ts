import { config } from '@/shared/config/env'
import { useWake } from '@/shared/store/wake'
import type { Problem, ProblemCode } from './types'

/** Render 무료 서버는 깨어나는 데 약 1분이 걸린다 */
const TIMEOUT_MS = 70_000
/** 이 시간이 지나면 "서버를 깨우는 중" 안내를 보여 준다 */
const SLOW_MS = 3_000

/** API 오류. 서버가 Problem Details로 답하면 title · detail · code를 그대로 담는다 */
export class ApiError extends Error {
  readonly status: number
  readonly code: ProblemCode | 'NETWORK_ERROR' | 'TIMEOUT' | 'UNKNOWN'
  readonly title: string
  readonly detail?: string

  constructor(status: number, problem: Partial<Problem> | null, fallbackCode?: ApiError['code']) {
    const title = problem?.title ?? '논문을 불러오지 못했어요'
    super(title)
    this.name = 'ApiError'
    this.status = status
    this.code = problem?.code ?? fallbackCode ?? 'UNKNOWN'
    this.title = title
    this.detail = problem?.detail
  }
}

type Query = Record<string, string | number | null | undefined>

interface RequestOptions {
  method?: 'GET' | 'POST'
  query?: Query
  body?: unknown
  signal?: AbortSignal
}

function buildUrl(path: string, query?: Query): string {
  const url = new URL(`${config.apiBaseUrl}${path}`, window.location.origin)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== '')
      url.searchParams.set(key, String(value))
  }
  return url.toString()
}

async function readProblem(res: Response): Promise<Partial<Problem> | null> {
  try {
    const body: unknown = await res.json()
    return body && typeof body === 'object' ? (body as Partial<Problem>) : null
  } catch {
    return null
  }
}

/** 백엔드 호출. 인증 헤더 없이 요청한다 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const timeout = new AbortController()
  const timeoutId = setTimeout(() => timeout.abort(), TIMEOUT_MS)
  const onOuterAbort = () => timeout.abort()
  options.signal?.addEventListener('abort', onOuterAbort)

  let markedSlow = false
  const slowId = setTimeout(() => {
    markedSlow = true
    useWake.getState().inc()
  }, SLOW_MS)

  try {
    const res = await fetch(buildUrl(path, options.query), {
      method: options.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        ...(options.body !== undefined && { 'Content-Type': 'application/json' }),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: timeout.signal,
    })
    if (!res.ok) throw new ApiError(res.status, await readProblem(res))
    return (await res.json()) as T
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (options.signal?.aborted) throw error
    if (timeout.signal.aborted) throw new ApiError(0, null, 'TIMEOUT')
    throw new ApiError(0, null, 'NETWORK_ERROR')
  } finally {
    clearTimeout(timeoutId)
    clearTimeout(slowId)
    options.signal?.removeEventListener('abort', onOuterAbort)
    if (markedSlow) useWake.getState().dec()
  }
}
