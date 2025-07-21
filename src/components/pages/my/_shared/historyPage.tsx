'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/pages/my/_shared/header'
import BalanseHistoryCard from '@/components/pages/my/_shared/balanseHistoryCard'
import FilterTabs from '@/components/pages/balanse/filtertabs'
import { fetchMineVotesCreated, fetchMineVotesVoted } from '@/api/votes'
import { MyVoteHistoryItem } from '@/types/my/history'

const sortOptions = [
  { label: '최신순', value: 'latest' },
  { label: '인기순', value: 'popular' },
]

interface HistoryPageProps {
  mode: 'created' | 'voted'
}

const HistoryPage = ({ mode }: HistoryPageProps) => {
  const [category, setCategory] = useState('ALL')
  const [sort, setSort] = useState<'latest' | 'popular'>('latest')
  const [votes, setVotes] = useState<MyVoteHistoryItem[]>([])
  const [error, setError] = useState<string | null>(null)

  const title =
    mode === 'created' ? '내가 만든 밸런스 게임' : '내가 투표한 밸런스 게임'

  useEffect(() => {
    const getVotes = async () => {
      try {
        const data = mode === 'created'
          ? await fetchMineVotesCreated(category, sort)
          : await fetchMineVotesVoted(category, sort)
        setVotes(data)
        setError(null)
      } catch {
        setError('불러오기 실패')
      }
    }
    getVotes()
  }, [category, sort, mode])

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title={title} />
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
          <BalanseHistoryCard key={vote.voteId} data={vote} />
        ))}
      </div>
    </div>
  )
}

export default HistoryPage
