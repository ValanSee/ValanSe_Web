import { CreateVoteData } from '@/types/api/votes'
import { authApi } from './instance/authApi'
import { VoteCategory } from '@/types/_shared/vote'

export const fetchBestVote = async () => {
  try {
    const response = await authApi.get<BestVoteResponse>('/votes/best')
    return response.data
  } catch (error) {
    throw error
  }
}

export interface VoteOption {
  optionId: number
  content: string
  vote_count: number
}

export interface BestVoteResponse {
  voteId: number
  title: string
  category: VoteCategory
  totalParticipants: number
  createdBy: string
  createdAt: string
  options: VoteOption[]
}

// 투표 API 응답 타입
export interface VoteResponse {
  totalVoteCount: number
  voteOptionId: number
  voteOptionCount: number
  voted: boolean
}

// 투표/취소/재투표 API
export const voteOption = async (
  voteId: number | string,
  voteOptionId: number,
): Promise<VoteResponse> => {
  try {
    const response = await authApi.post<VoteResponse>(
      `/votes/${voteId}/vote-options/${voteOptionId}`,
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const createVote = async (voteData: CreateVoteData) => {
  try {
    const response = await authApi.post('/votes', voteData)
    return response.data.voteId
  } catch (error) {
    throw error
  }
}
