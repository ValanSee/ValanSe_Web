import { VoteCategory } from '../_shared/vote'

export type CreateVoteData = {
  title: string
  options: string[]
  category: VoteCategory
}
