import { api, publicApi } from './api'
import axios from 'axios'
import type { PinType, PinnedVote, VoteListResponse } from '@/types/vote'

export async function fetchVotes(params: {
  category?: string
  sort?: 'latest' | 'popular'
  cursor?: string
  size?: number
}): Promise<VoteListResponse> {
  const query: Record<string, string | number> = { size: params.size ?? 20 }
  if (params.category && params.category !== 'ALL') query.category = params.category
  if (params.sort) query.sort = params.sort
  if (params.cursor) query.cursor = params.cursor

  const res = await api.get<VoteListResponse>('/votes', { params: query })
  return res.data
}

export async function pinVote(voteId: number, pinType: PinType) {
  const res = await api.patch(`/votes/${voteId}/pin`, { pinType })
  return res.data
}

export async function deleteVote(voteId: number) {
  await api.delete(`/votes/${voteId}`)
}

export async function fetchHotPinned(): Promise<PinnedVote | null> {
  try {
    const res = await publicApi.get<PinnedVote>('/votes/best')
    return res.data
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) return null
    throw err
  }
}
