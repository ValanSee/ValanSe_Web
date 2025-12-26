import { authApi } from '../../instance/authApi'

export type TrendingVoteResponse = {
  voteId: number
  title: string
  content: string
  category: string
  totalParticipants: number
  createdBy: string
  createdAt: string
  options: {
    optionId: number
    content: string
    vote_count: number
  }[]
}

export async function fetchTrendingVotes() {
  const res = await authApi.get<TrendingVoteResponse>('/votes/trending')
  return res.data
}
