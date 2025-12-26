export type MyVoteHistoryItem = {
  voteId: number
  title: string
  content: string | null
  category: string
  totalVoteCount: number
  createdAt: string
  options: string[]
}
