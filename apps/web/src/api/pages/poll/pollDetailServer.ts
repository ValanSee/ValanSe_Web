import { cache } from 'react'
import {
  serverGetJson,
  type ServerFetchResult,
} from '@/api/instance/serverFetch'
import type {
  BestComment,
  Comment,
  CommentsResponse,
} from '@/api/comment/commentApi'

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

export interface PollCommentsInitial {
  best: BestComment | null
  comments: Comment[] | null
}

/**
 * SSR 용 베스트 댓글 · 댓글 첫 페이지 (비로그인 · 공개 API).
 * 첫 HTML 에 댓글을 담아 클라이언트 조회 뒤 아래 영역이 밀리지 않게 하고, 댓글 텍스트도 색인되게 한다.
 * 실패한 항목은 null → 클라이언트 조회로 대체.
 */
export async function fetchPollCommentsForServer(
  id: string,
): Promise<PollCommentsInitial> {
  if (!/^\d+$/.test(id)) return { best: null, comments: null }
  const [best, list] = await Promise.all([
    serverGetJson<BestComment>(`/votes/${id}/comments/best`),
    serverGetJson<CommentsResponse>(`/votes/${id}/comments`),
  ])
  return {
    best: best.status === 'ok' ? best.data : null,
    comments: list.status === 'ok' ? list.data.comments : null,
  }
}
