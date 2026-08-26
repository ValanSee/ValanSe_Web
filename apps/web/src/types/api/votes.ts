import { VoteCategory } from '../_shared/vote'
import type { PageMeta } from '@/utils/pagedResponse'

export type CreateVoteOption = {
  content: string
  imageFile?: File | null
}

export type CreateVoteData = {
  title: string
  options: CreateVoteOption[]
  category: VoteCategory
  content?: string
}

export type MineVoteOption = {
  content: string
  imageUrl?: string | null
}

/** 내가 만든/투표한 밸런스 게임 목록의 개별 항목 */
export type MineVoteItem = {
  voteId: number
  title: string
  content: string | null
  category: string
  totalVoteCount: number
  createdAt: string
  options: MineVoteOption[]
}

/** `/votes/mine/*` 페이지 엔벨로프 응답 */
export type PagedMineVotesResponse = PageMeta & {
  votes: MineVoteItem[]
}
