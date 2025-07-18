import { publicApi } from '../../instance/publicApi'
import { VoteCategory, VoteOption } from '../../votes'
import { VoteListResponse } from '@/types/balanse/vote'

export interface VoteResponse {
  voteId: number
  title: string
  category: VoteCategory
  totalParticipants: number
  createdBy: string
  createdAt: string
  options: VoteOption[]
}
export async function fetchVotes({
  category = 'ALL',
  sort = 'latest',
  page = 0,
  size = 20,
}: {
  category?: string
  sort?: 'latest' | 'popular'
  page?: number
  size?: number
}): Promise<VoteListResponse> {
  const params: Record<string, string | number> = {
    page,
    size,
  }

  if (category && category.trim() !== '') {
    params.category = category
  }

  if (sort && sort.trim() !== '') {
    params.sort = sort
  }

  const res = await publicApi.get<VoteListResponse>('/votes', {
    params,
  })

  return res.data
}
