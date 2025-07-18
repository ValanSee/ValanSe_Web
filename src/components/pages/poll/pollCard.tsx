'use client'
import { useState } from 'react'

interface PollCardProps {
  createdBy: string
  title: string
  options: {
    optionId: number
    content: string
    vote_count: number
  }[]
  totalParticipants: number
}

function PollCard({
  createdBy,
  title,
  options = [],
  totalParticipants,
}: PollCardProps) {
  const [voted, setVoted] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

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

  return (
    <div className="mx-auto p-4 space-y-4 rounded-xl shadow">
      <div className="text-sm font-medium text-gray-700">{createdBy}</div>
      <div className="text-base font-semibold">{title}</div>
      <div className="space-y-2">
        {options.map((option, idx) => {
          const isSelected = selectedId === option.optionId
          // percentage 계산 (총 투표수 0이면 0)
          const percentage =
            totalParticipants > 0
              ? Math.round((option.vote_count / totalParticipants) * 100)
              : 0
          return (
            <div
              className={`relative border rounded-md px-4 py-3 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => handleClickPercentage(option.optionId)}
              key={option.optionId ?? idx}
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
        총 {totalParticipants}명 투표
      </div>
    </div>
  )
}
export default PollCard
