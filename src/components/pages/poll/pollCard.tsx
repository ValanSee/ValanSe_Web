'use client'
import { useState, useEffect } from 'react'
import {
  fetchMostVotedVote,
  MostVotedVoteResponse,
} from '@/api/comment/mostVotedVoteApi'

function PollCard() {
  const [data, setData] = useState<MostVotedVoteResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [voted, setVoted] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true)
        const res = await fetchMostVotedVote()
        setData(res)
      } catch {
        setError('불러오기 실패')
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [])

  const handleClickPercentage = (id: number) => {
    if (voted && selectedId === id) {
      setSelectedId(null)
      setVoted(false)
      return
    }
    if (voted) {
      setSelectedId(id)
      return
    }
    setSelectedId(id)
    setVoted(true)
  }

  if (loading) return <div className="p-4">로딩 중...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!data) return null

  return (
    <div className="mx-auto p-4 space-y-4 rounded-xl shadow">
      <div className="text-sm font-medium text-gray-700">{data.createdBy}</div>
      <div className="text-base font-semibold">{data.title}</div>
      <div className="space-y-2">
        {data.options.map((option) => {
          const isSelected = selectedId === option.optionId
          // percentage 계산 (총 투표수 0이면 0)
          const percentage =
            data.totalParticipants > 0
              ? Math.round((option.vote_count / data.totalParticipants) * 100)
              : 0
          return (
            <div
              className={`relative border rounded-md px-4 py-3 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => handleClickPercentage(option.optionId)}
              key={option.optionId}
            >
              <div className="flex justify-between relative z-10 font-medium">
                <span>
                  <strong>{String.fromCharCode(65 + option.optionId)}</strong>{' '}
                  {option.content}
                </span>
                {voted && <span>{percentage}%</span>}
              </div>
              {voted && (
                <div
                  className="absolute left-0 top-0 h-full bg-blue-100 rounded-md -z-10 transition-all duration-500 ease-in-out"
                  style={{ width: `${percentage}%` }}
                />
              )}
            </div>
          )
        })}
      </div>
      <div className="text-sm text-gray-400 text-right">
        총 {data.totalParticipants}명 투표
      </div>
    </div>
  )
}
export default PollCard
