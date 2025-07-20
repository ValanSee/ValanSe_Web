import { VoteCategory } from '../_shared/vote'

export type CreateVoteData = {
  title: string
  options: string[]
  category: VoteCategory
}

export type MineVotesResponse = {
  voteId: number
  title: string
  category: string
  totalVoteCount: number
  createdAt: string
}[]
