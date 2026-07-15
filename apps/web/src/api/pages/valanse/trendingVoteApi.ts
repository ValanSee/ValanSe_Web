import { isAxiosError } from 'axios'
import { publicApi } from '../../instance/publicApi'
import { PinType } from '@/types/balanse/vote'

export type TrendingVoteResponse = {
  voteId: number
  title: string
  content: string
  category: string
  totalParticipants: number
  createdBy: string
  creatorTitle: string | null
  createdAt: string
  pinType: PinType
  options: {
    optionId: number
    content: string
    vote_count: number
  }[]
}

export async function fetchTrendingVotes() {
  try {
    const res = await publicApi.get<TrendingVoteResponse>('/votes/trending')
    return res.data
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null
    }
    throw error
  }
}
