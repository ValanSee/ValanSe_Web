import { isAxiosError } from 'axios'
import { publicApi } from '../../instance/publicApi'

/** trending 응답 내 선택지 */
export type TrendingVoteOption = {
  optionId: number
  content: string
  imageUrl: string | null
  vote_count: number
}

/** 기간별 인기 급상승 투표 1건 (최대 5위) */
export type TrendingVoteItem = {
  /** 노출 순위 (1부터) */
  displayOrder: number
  /** PINNED: 관리자 고정 · RANKED: 반응성 순위 */
  displayType: 'PINNED' | 'RANKED'
  voteId: number
  title: string
  content: string
  category: string
  reactivityScore: number
  voteReactionCount: number
  commentReactionCount: number
  totalParticipants: number
  createdBy: string
  creatorTitle: string | null
  createdAt: string
  options: TrendingVoteOption[]
}

/** GET /votes/trending 응답 */
export type TrendingVotesResponse = {
  requestedDays: number
  from: string
  to: string
  /** PERIOD: 기간 내 반응 기준 · ALL_TIME: 전체 누적 폴백 */
  scoreType: 'PERIOD' | 'ALL_TIME'
  /** 기간 내 반응이 없어 전체 누적으로 폴백됐는지 */
  fallbackApplied: boolean
  votes: TrendingVoteItem[]
}

/**
 * 기간별 인기 급상승 밸런스 게임 조회 (최대 5개).
 * @param days 조회 기간(일). hotissue/trending 통합 API의 필수 파라미터.
 */
export async function fetchTrendingVotes(days: number) {
  try {
    const res = await publicApi.get<TrendingVotesResponse>('/votes/trending', {
      params: { days },
    })
    return res.data
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null
    }
    throw error
  }
}
