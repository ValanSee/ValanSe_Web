import { VoteCategory } from '../_shared/vote'

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

export type MineVotesResponse = {
  voteId: number
  title: string
  content: string | null
  category: string
  totalVoteCount: number
  createdAt: string
  options: {
    content: string
    imageUrl: string | null
  }[]
}[]
