type PollOption = {
  id: string
  label: string
  text: string
  votes: number
  percentage: number
}

type PollData = {
  pollId: string
  user: {
    name: string
  }
  question: string
  options: PollOption[]
  totalVotes: number
}
export default PollData
