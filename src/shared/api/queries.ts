import {
  keepPreviousData,
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from '@tanstack/react-query'
import { excludeParam, interestsParam } from '@/shared/lib/format'
import { useProfile, useRead } from '@/shared/store/device'
import { ApiError, apiFetch } from './client'
import type {
  FeedResponse,
  HomeResponse,
  KeywordSlug,
  Level,
  OnboardingWeightsRequest,
  OnboardingWeightsResponse,
  PaperDetail,
  PaperList,
} from './types'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      // 4xx는 다시 해도 같으므로 재시도하지 않는다
      retry: (count, error) =>
        !(error instanceof ApiError && error.status >= 400 && error.status < 500) && count < 1,
    },
  },
})

/** 홈 · 피드에 공통으로 붙는 개인화 파라미터 (기기 저장 값에서 만든다) */
export function usePersonalization() {
  const interests = useProfile((s) => s.interests)
  const level = useProfile((s) => s.defaultLevel)
  const readIds = useRead((s) => s.ids)
  return { interests: interestsParam(interests), exclude: excludeParam(readIds), level }
}

type HomeParams = ReturnType<typeof usePersonalization>

export const homeQuery = (params: HomeParams) => ({
  queryKey: ['home', params] as const,
  queryFn: ({ signal }: { signal: AbortSignal }) =>
    apiFetch<HomeResponse>('/v1/home', { query: params, signal }),
})

/** 홈 캐시에 있는 today. 없으면 null */
export function cachedToday(): string | null {
  const cached = queryClient.getQueriesData<HomeResponse>({ queryKey: ['home'] })
  return cached.find(([, data]) => data?.today)?.[1]?.today ?? null
}

/** 출석 판정에 쓰는 today를 얻는다. 홈 캐시가 있으면 쓰고, 없으면 홈을 받아 온다 */
export async function fetchToday(params: HomeParams): Promise<string> {
  const hit = cachedToday()
  if (hit) return hit
  const data = await queryClient.fetchQuery(homeQuery(params))
  return data.today
}

export function useHome() {
  const params = usePersonalization()
  return useQuery({ ...homeQuery(params), placeholderData: keepPreviousData })
}

const FEED_PAGE = 10

export function useFeed() {
  const { interests, level } = usePersonalization()
  return useInfiniteQuery({
    queryKey: ['feed', interests, level],
    queryFn: ({ pageParam, signal }) =>
      apiFetch<FeedResponse>('/v1/feed', {
        query: { interests, level, cursor: pageParam, limit: FEED_PAGE },
        signal,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  })
}

/** 상세. 읽기 수준을 바꾸는 동안 이전 내용을 유지한다 */
export function usePaper(paperId: string, level: Level) {
  return useQuery({
    queryKey: ['paper', paperId, level],
    queryFn: ({ signal }) =>
      apiFetch<PaperDetail>(`/v1/papers/${encodeURIComponent(paperId)}`, {
        query: { level },
        signal,
      }),
    placeholderData: keepPreviousData,
  })
}

/** 저장함: 여러 논문을 한 번에 (최대 50개) */
export function usePapersByIds(ids: string[], level: Level) {
  return useQuery({
    queryKey: ['papers', ids, level],
    queryFn: ({ signal }) =>
      apiFetch<PaperList>('/v1/papers', {
        query: { ids: ids.slice(0, 50).join(','), level },
        signal,
      }),
    enabled: ids.length > 0,
    placeholderData: keepPreviousData,
  })
}

export function useOnboardingCards(keywords: KeywordSlug[]) {
  return useQuery({
    queryKey: ['onboarding-cards', keywords],
    queryFn: ({ signal }) =>
      apiFetch<PaperList>('/v1/onboarding/cards', {
        query: { keywords: keywords.join(',') },
        signal,
      }),
    staleTime: Infinity,
  })
}

export function useComputeWeights() {
  return useMutation({
    mutationFn: (body: OnboardingWeightsRequest) =>
      apiFetch<OnboardingWeightsResponse>('/v1/onboarding/weights', { method: 'POST', body }),
  })
}
