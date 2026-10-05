import { serverGetJson } from '@/api/instance/serverFetch'
import type { VoteListResponse } from '@/types/balanse/vote'
import type { TrendingVotesResponse } from './trendingVoteApi'

/** SSR 용 투표 목록 (비로그인). 실패 시 null → 클라이언트 조회로 대체 */
export async function fetchVotesForServer({
  category = 'ALL',
  sort = 'latest',
  size,
}: {
  category?: string
  sort?: 'latest' | 'popular'
  size: number
}): Promise<VoteListResponse | null> {
  const result = await serverGetJson<VoteListResponse>('/votes', {
    category,
    sort,
    size,
  })
  return result.status === 'ok' ? result.data : null
}

/** SSR 용 기간별 인기 급상승 (비로그인). 실패 시 null */
export async function fetchTrendingVotesForServer(
  days: number,
): Promise<TrendingVotesResponse | null> {
  const result = await serverGetJson<TrendingVotesResponse>('/votes/trending', {
    days,
  })
  return result.status === 'ok' ? result.data : null
}
