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

/** 통합 트렌딩 API 항목 (필요한 필드만) */
type TrendingItem = Omit<PinnedVote, 'pinType'> & {
  displayType: 'PINNED' | 'RANKED'
}
type TrendingResponse = { votes: TrendingItem[] }

/**
 * 현재 고정된(PINNED) 트렌딩 투표 1건 조회.
 * 기존 hotissue(GET /votes/best)가 통합 API(GET /votes/trending)로 흡수됨 —
 * 응답 votes 중 관리자 고정(displayType === 'PINNED') 항목을 반환한다.
 */
export async function fetchHotPinned(): Promise<PinnedVote | null> {
  try {
    const res = await publicApi.get<TrendingResponse>('/votes/trending', {
      params: { days: 7 },
    })
    const pinned = res.data.votes.find((v) => v.displayType === 'PINNED')
    if (!pinned) return null
    return {
      voteId: pinned.voteId,
      title: pinned.title,
      content: pinned.content,
      category: pinned.category,
      totalParticipants: pinned.totalParticipants,
      createdBy: pinned.createdBy,
      creatorTitle: pinned.creatorTitle,
      createdAt: pinned.createdAt,
      pinType: 'TRENDING',
    }
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) return null
    throw err
  }
}
