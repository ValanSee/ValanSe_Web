import { VoteCategory } from '../_shared/vote'

export type CreateVoteData = {
  title: string
  options: string[]
  category: VoteCategory
  content?: string
}

export type MineVotesResponse = {
  voteId: number
  title: string
  content: string | null
  category: string
  totalVoteCount: number
  createdAt: string
  options: string[]
}[]
