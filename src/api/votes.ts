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

export const createVote = async (voteData: CreateVoteData) => {
  try {
    const response = await authApi.post('/votes', voteData)
    return response.data.voteId
  } catch (error) {
    throw error
  }
}
