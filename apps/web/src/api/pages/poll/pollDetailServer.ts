import { cache } from 'react'
import {
  serverGetJson,
  type ServerFetchResult,
} from '@/api/instance/serverFetch'

export interface PollOption {
  optionId: number
  content: string
  imageUrl: string | null
  voteCount: number
  label: string
}

export interface PollDetail {
  voteId: number
  title: string
  content: string | null
  category: string
  creatorNickname: string
  creatorTitle: string | null
  createdAt: string
  totalVoteCount: number
  options: PollOption[]
  hasVoted: boolean
  votedOptionLabel: string | null
}

export type PollDetailResult = ServerFetchResult<PollDetail>

/**
 * SSR·metadata 용 상세 조회 (비로그인). `GET /votes/{id}` 는 토큰 없이도 200.
 * 같은 요청 안의 generateMetadata 와 page 가 공유하도록 cache 로 감쌈.
 */
export const fetchPollDetailForServer = cache(
  async (id: string): Promise<PollDetailResult> => {
    if (!/^\d+$/.test(id)) return { status: 'not-found' }
    return serverGetJson<PollDetail>(`/votes/${id}`)
  },
)
