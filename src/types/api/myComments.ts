export type MyCommentsResponse = {
  id: number
  content: string
  memberId: number
  memberName: string
  createdAt: string
  voteOwnerId: number
  voteOwnerNickname: string
  voteTitle: string
  voteOptionLabel: string | null
  reply: boolean
}
