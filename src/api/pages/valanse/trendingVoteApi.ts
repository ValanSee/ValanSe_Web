import { authApi } from '../../instance/authApi'
import { PinType } from '@/types/balanse/vote'

export type TrendingVoteResponse = {
  voteId: number
  title: string
  content: string
  category: string
  totalParticipants: number
  createdBy: string
  createdAt: string
  pinType: PinType
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
