export type MyVoteHistoryOption = {
  content: string
  imageUrl?: string | null
}

export type MyVoteHistoryItem = {
  voteId: number
  title: string
  content: string | null
  category: string
  totalVoteCount: number
  createdAt: string
  options: MyVoteHistoryOption[]
}
