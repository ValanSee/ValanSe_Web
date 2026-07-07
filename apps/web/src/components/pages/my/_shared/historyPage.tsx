'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import Header from '@/components/_shared/header'
import BalanseHistoryCard from '@/components/pages/my/_shared/balanseHistoryCard'
import { TabBar, TabItem } from '@/components/ui/tabBar'
import { fetchMineVotesCreated, fetchMineVotesVoted } from '@/api/votes'
import { MyVoteHistoryItem } from '@/types/my/history'

const CATEGORIES = [
  { label: '전체', value: 'ALL' },
  { label: '연애', value: 'LOVE' },
  { label: '살까말까', value: 'BUY' },
  { label: '스포츠', value: 'SPORT' },
  { label: '기타', value: 'ETC' },
] as const

interface HistoryPageProps {
  mode: 'created' | 'voted'
}

const HistoryPage = ({ mode }: HistoryPageProps) => {
  const router = useRouter()
  const [category, setCategory] = useState('ALL')
  const [sort, setSort] = useState<'latest' | 'popular'>('latest')
  const [votes, setVotes] = useState<MyVoteHistoryItem[]>([])
  const [error, setError] = useState<string | null>(null)

  const title =
    mode === 'created' ? '내가 만든 밸런스 게임' : '내가 투표한 밸런스 게임'

  useEffect(() => {
    ;(async () => {
      try {
        const data =
          mode === 'created'
            ? await fetchMineVotesCreated(category, sort)
            : await fetchMineVotesVoted(category, sort)
        setVotes(data)
        setError(null)
      } catch {
        setError('불러오기 실패')
      }
    })()
  }, [category, sort, mode])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header title={title} showBackButton onBackClick={() => router.push('/my')} />
      <TabBar>
        {CATEGORIES.map((tab) => (
          <TabItem
            key={tab.value}
            label={tab.label}
            selected={tab.value === category}
            onClick={() => setCategory(tab.value)}
          />
        ))}
      </TabBar>
      <div className="flex items-center justify-end gap-1 px-4 pt-3">
        <button
          type="button"
          onClick={() =>
            setSort((prev) => (prev === 'latest' ? 'popular' : 'latest'))
          }
          className="typo-label-03 flex items-center gap-1 text-brand-gray-200"
        >
          {sort === 'latest' ? '최신순' : '인기순'}
          <Icon icon="icon-park-solid:down-one" width={14} aria-hidden />
        </button>
      </div>
      <div className="flex flex-col gap-3 px-4 pb-24 pt-3">
        {error && (
          <p className="typo-body-b-01 py-8 text-center text-destructive">
            {error}
          </p>
        )}
        {!error && votes.length === 0 && (
          <p className="typo-body-b-01 py-8 text-center text-brand-gray-100">
            아직 활동 내역이 없어요
          </p>
        )}
        {votes.map((vote) => (
          <BalanseHistoryCard
            key={vote.voteId}
            data={vote}
            onClick={() => router.push(`/poll/${vote.voteId}`)}
          />
        ))}
      </div>
    </div>
  )
}

export default HistoryPage
