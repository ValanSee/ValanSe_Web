import { publicApi } from '../instance/publicApi'

export interface MostVotedVoteOption {
  optionId: number
  content: string
  vote_count: number
}

export interface MostVotedVoteResponse {
  voteId: number
  title: string
  category: string
  totalParticipants: number
  createdBy: string
  createdAt: string
  options: MostVotedVoteOption[]
}

export async function fetchMostVotedVote(): Promise<MostVotedVoteResponse> {
  const res = await publicApi.get<MostVotedVoteResponse>('/votes/best')
  return res.data
}
