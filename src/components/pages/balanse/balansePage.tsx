'use client'

import Header from './header'
import PollCard from '../poll/pollCard'
import FilterTabs from './filtertabs'
import BalanceList from './balanseList'
import { fetchVotes } from '@/api/pages/valanse/balanseListapi'
import { useEffect, useState } from 'react'
import { Vote } from '@/types/balanse/vote'

export default function BalancePage() {
  const [votes, setVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getVotes = async () => {
      try {
        setLoading(true)
        const data = await fetchVotes({})
        setVotes(data.votes)
      } catch {
        setError('불러오기 실패')
      } finally {
        setLoading(false)
      }
    }
    getVotes()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="px-4">
        <PollCard />
      </div>
      <FilterTabs />
      <div className="px-4 mt-4 space-y-4 pb-28">
        {loading && <div>로딩 중...</div>}
        {error && <div>{error}</div>}
        {votes.map((vote) => (
          <BalanceList key={vote.id} data={vote} />
        ))}
      </div>
    </div>
  )
}
