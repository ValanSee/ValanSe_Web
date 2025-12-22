'use client'
import { useState, useEffect } from 'react'
import {
  fetchTrendingVotes,
  type TrendingVoteResponse,
} from '@/api/pages/valanse/trendinVoteApi'
import Link from 'next/link'

const categoryMap: Record<string, string> = {
  ETC: '기타',
  FOOD: '음식',
  LOVE: '연애',
  ALL: '전체',
}

function MockPollCard() {
  const [data, setData] = useState<TrendingVoteResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true)
        const res = await fetchTrendingVotes()
        setData(res)
      } catch {
        setError('불러오기 실패')
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [])

  if (loading) return <div className="p-4">로딩 중...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!data) return null

  return (
    <Link href={`/poll/${data.voteId}`} passHref legacyBehavior>
      <a className="block mx-auto p-4 mt-6 space-y-4 rounded-xl bg-[#F0F0F0] cursor-pointer">
        <div className="text-sm font-medium text-gray-700">
          {data.createdBy}
        </div>
        <div className="flex justify-between items-center">
          <div className="text-base font-semibold">{data.title}</div>
        </div>

        <div className="space-y-2">
          {data.options.map((option, idx) => {
            return (
              <div
                className={`relative border rounded-md px-4 py-3 cursor-pointer transition-all ring-blue-500 bg-white`}
                key={option.optionId}
              >
                <div className="flex justify-between relative z-10 font-medium">
                  <span>
                    <strong>{String.fromCharCode(65 + idx)}</strong>{' '}
                    {option.content}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex justify-between">
          <div className="text-xs text-gray-500 mb-2">
            {categoryMap[data.category] ?? data.category}
          </div>
          <div className="text-sm text-gray-400 text-right">
            총 {data.totalParticipants}명 투표
          </div>
        </div>
      </a>
    </Link>
  )
}
export default MockPollCard
