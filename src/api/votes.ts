import { CreateVoteData, MineVotesResponse } from '@/types/api/votes'
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

export const createVote = async (voteData: CreateVoteData) => {
  try {
    const response = await authApi.post('/votes', voteData)
    return response.data.voteId
  } catch (error) {
    throw error
  }
}

export const fetchMineVotesCreated = async (
  category?: string,
  sort: string = 'latest',
) => {
  try {
    const params = new URLSearchParams()

    if (category) {
      params.append('category', category)
    }
    params.append('sort', sort)

    const response = await authApi.get<MineVotesResponse>(
      `/votes/mine/created?${params.toString()}`,
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const fetchMineVotesVoted = async () => {
  try {
    const response = await authApi.get<MineVotesResponse>('/votes/mine/voted')
    return response.data
  } catch (error) {
    throw error
  }
}
