import { authApi } from './instance/authApi'

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

export type VoteCategory = 'FOOD' | 'LOVE' | 'ETC' | 'ALL'
