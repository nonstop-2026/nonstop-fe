import { delay, http, HttpResponse } from 'msw'
import type {
  FeedResponse,
  HomeResponse,
  KeywordSlug,
  Level,
  OnboardingWeightsRequest,
  OnboardingWeightsResponse,
  PaperList,
  Problem,
} from '@/shared/api/types'
import { CATALOG, findEntry, toDetail, toSummary } from './data/papers'

/**
 * MSW 목 API. 경로 · 파라미터 · 응답은 백엔드 openapi.yaml v0.1.1을 따른다.
 * '*'로 시작해서 API 주소(VITE_API_BASE_URL)가 무엇이든 가로챈다.
 */

const problem = (status: number, code: Problem['code'], title: string, detail?: string) =>
  HttpResponse.json<Problem>(
    { type: 'about:blank', title, status, code, ...(detail && { detail }) },
    { status, headers: { 'Content-Type': 'application/problem+json' } },
  )

function readLevel(url: URL): Level {
  const level = url.searchParams.get('level')
  return level === 'easy' || level === 'expert' ? level : 'basic'
}

function readInterests(url: URL): Map<string, number> {
  const raw = url.searchParams.get('interests') ?? ''
  return new Map(
    raw
      .split(',')
      .filter(Boolean)
      .map((pair) => {
        const [k, w] = pair.split(':')
        return [k, Number(w)] as const
      }),
  )
}

function readList(url: URL, name: string): string[] {
  return (url.searchParams.get(name) ?? '').split(',').filter(Boolean)
}

/** 관심 키워드 점수가 높은 순, 같으면 최신순 */
function ranked(interests: Map<string, number>, exclude: string[]) {
  const score = (tags: string[]) => tags.reduce((sum, t) => sum + (interests.get(t) ?? 0), 0)
  return CATALOG.filter((e) => !exclude.includes(e.paperId)).sort(
    (a, b) => score(b.tags) - score(a.tags) || b.publishedAt.localeCompare(a.publishedAt),
  )
}

/** 한국 날짜 YYYY-MM-DD */
function seoulToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date())
}

export const handlers = [
  http.get('*/v1/onboarding/cards', async ({ request }) => {
    await delay(300)
    const keywords = readList(new URL(request.url), 'keywords')
    const preferred = CATALOG.slice(0, 15).sort(
      (a, b) =>
        b.tags.filter((t) => keywords.includes(t)).length -
        a.tags.filter((t) => keywords.includes(t)).length,
    )
    const body: PaperList = { items: preferred.slice(0, 10).map((e) => toSummary(e, 'basic')) }
    return HttpResponse.json(body)
  }),

  http.post('*/v1/onboarding/weights', async ({ request }) => {
    await delay(400)
    const { keywords, swipes } = (await request.json()) as OnboardingWeightsRequest
    if (keywords.length < 3)
      return problem(
        400,
        'TOO_FEW_KEYWORDS',
        '요청을 처리할 수 없어요',
        '관심 키워드를 3개 이상 골라 주세요.',
      )
    const weights = new Map<KeywordSlug, number>(keywords.map((k) => [k, 0.5]))
    for (const { paperId, reaction } of swipes) {
      const entry = findEntry(paperId)
      if (!entry || reaction === 'skip') continue
      for (const tag of entry.tags)
        weights.set(tag, (weights.get(tag) ?? 0.3) + (reaction === 'like' ? 0.15 : -0.1))
    }
    const max = Math.max(...weights.values(), 1)
    const body: OnboardingWeightsResponse = {
      interests: [...weights.entries()]
        .map(([keyword, w]) => ({
          keyword,
          weight: Math.round((Math.max(w, 0) / max) * 100) / 100,
        }))
        .filter((i) => i.weight > 0)
        .sort((a, b) => b.weight - a.weight),
    }
    return HttpResponse.json(body)
  }),

  http.get('*/v1/home', async ({ request }) => {
    await delay(350)
    const url = new URL(request.url)
    const level = readLevel(url)
    // 백엔드와 같은 규칙: 가장 최근 게시일 묶음에서 점수 1위가 오늘의 논문,
    // 나머지 전체에서 점수순 10편이 추천
    const list = ranked(readInterests(url), readList(url, 'exclude'))
    const latest = CATALOG.reduce((max, e) => (e.publishedAt > max ? e.publishedAt : max), '')
    const today = list.find((e) => e.publishedAt === latest)
    const body: HomeResponse = {
      today: seoulToday(),
      todayPaper: today ? toSummary(today, level) : null,
      recommendations: list
        .filter((e) => e !== today)
        .slice(0, 10)
        .map((e) => toSummary(e, level)),
      isFallback: false,
    }
    return HttpResponse.json(body)
  }),

  http.get('*/v1/feed', async ({ request }) => {
    await delay(400)
    const url = new URL(request.url)
    const level = readLevel(url)
    const list = ranked(readInterests(url), readList(url, 'exclude'))
    const limit = Math.min(Number(url.searchParams.get('limit')) || 10, 20)
    // 커서는 프론트가 해석하지 않는 값. 목에서는 시작 위치를 base64로 담는다
    const cursor = url.searchParams.get('cursor')
    const start = cursor ? Number(atob(cursor)) : 0
    const end = Math.min(start + limit, list.length)
    const body: FeedResponse = {
      items: list.slice(start, end).map((e) => toSummary(e, level)),
      nextCursor: end < list.length ? btoa(String(end)) : null,
    }
    return HttpResponse.json(body)
  }),

  http.get('*/v1/papers/:paperId', async ({ params, request }) => {
    await delay(300)
    const entry = findEntry(String(params.paperId))
    if (!entry) return problem(404, 'PAPER_NOT_FOUND', '논문을 찾을 수 없어요')
    return HttpResponse.json(toDetail(entry, readLevel(new URL(request.url))))
  }),

  http.get('*/v1/papers', async ({ request }) => {
    await delay(300)
    const url = new URL(request.url)
    const ids = readList(url, 'ids')
    if (ids.length === 0 || ids.length > 50)
      return problem(400, 'INVALID_PARAMETER', '요청을 처리할 수 없어요')
    const level = readLevel(url)
    const body: PaperList = {
      items: ids.flatMap((id) => {
        const entry = findEntry(id)
        return entry ? [toSummary(entry, level)] : []
      }),
    }
    return HttpResponse.json(body)
  }),
]
