'use client'
import Header from './header'
import MockPollCard from './mockPollCard'
import FilterTabs from './filtertabs'
import BalanceList from './balanseList'
import { fetchVotes } from '../../../api/pages/valanse/balanseListapi'
import { useEffect, useState, Suspense } from 'react'
import { Vote } from '@/types/balanse/vote'
import { useRouter, useSearchParams } from 'next/navigation'
import BottomNavBar from '@/components/_shared/bottomNavBar'

const sortOptions = [
  { label: '최신순', value: 'latest' },
  { label: '인기순', value: 'popular' },
]

function BalancePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [votes, setVotes] = useState<Vote[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // URL에서 카테고리와 정렬 옵션 가져오기
  const category = searchParams.get('category') || 'ALL'
  const sort = (searchParams.get('sort') as 'latest' | 'popular') || 'latest'

  // URL 업데이트 함수
  const updateURL = (newCategory?: string, newSort?: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (newCategory) {
      params.set('category', newCategory)
    }
    if (newSort) {
      params.set('sort', newSort)
    }

    router.push(`?${params.toString()}`)
  }

  // 카테고리 변경
  const handleCategoryChange = (newCategory: string) => {
    updateURL(newCategory)
  }

  // 정렬 변경
  const handleSortChange = (newSort: 'latest' | 'popular') => {
    updateURL(undefined, newSort)
  }

  useEffect(() => {
    const getVotes = async () => {
      try {
        setLoading(true)
        const data = await fetchVotes({ category, sort })
        setVotes(data.votes)
      } catch {
        setError('불러오기 실패')
      } finally {
        setLoading(false)
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
        <FilterTabs
          selected={category}
          onChangeCategory={handleCategoryChange}
        />
        <select
          className="ml-auto border rounded px-2 py-1 text-sm"
          value={sort}
          onChange={(e) =>
            handleSortChange(e.target.value as 'latest' | 'popular')
          }
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="px-4 mt-4 space-y-4 pb-28">
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">투표를 불러오는 중...</p>
          </div>
        )}
        {error && <div className="text-red-500 text-center">{error}</div>}
        {!loading &&
          !error &&
          votes.map((vote) => <BalanceList key={vote.id} data={vote} />)}
      </div>
      <BottomNavBar />
    </div>
  )
}

export default function BalancePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col min-h-screen bg-white">
          <Header />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">페이지를 불러오는 중...</p>
            </div>
          </div>
        </div>
      }
    >
      <BalancePageContent />
    </Suspense>
  )
}
