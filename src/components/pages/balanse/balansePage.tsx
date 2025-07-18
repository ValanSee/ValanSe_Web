'use client'
import Header from './header'
import MockPollCard from './mockPollCard'
import FilterTabs from './filtertabs'
import BalanceList from './balanseList'
import { fetchVotes } from '@/api/pages/valanse/balanseListApi'
import { useEffect, useState } from 'react'
import { Vote } from '@/types/balanse/vote'

const sortOptions = [
  { label: '최신순', value: 'latest' },
  { label: '인기순', value: 'popular' },
]

export default function BalancePage() {
  const [votes, setVotes] = useState<Vote[]>([])
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState('ALL')
  const [sort, setSort] = useState<'latest' | 'popular'>('latest')

  useEffect(() => {
    const getVotes = async () => {
      try {
        const data = await fetchVotes({ category, sort })
        setVotes(data.votes)
      } catch {
        setError('불러오기 실패')
      }
    }
    getVotes()
  }, [category, sort])

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="px-4">
        <MockPollCard />
      </div>
      <div className="flex items-center gap-2 px-4 mt-2">
        <FilterTabs selected={category} onChangeCategory={setCategory} />
        <select
          className="ml-auto border rounded px-2 py-1 text-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value as 'latest' | 'popular')}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="px-4 mt-4 space-y-4 pb-28">
        {error && <div>{error}</div>}
        {votes.map((vote) => (
          <BalanceList key={vote.id} data={vote} />
        ))}
      </div>
    </div>
  )
}
