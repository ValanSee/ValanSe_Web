'use client'
import { useState } from 'react'
import PollData from '@/types/poll/pollCardOption'

const mockPollData: PollData = {
  pollId: 'abc-123',
  user: {
    name: 'lunarecho33',
  },
  question: '회사에서 점심 먹을 때 뭐가 더 좋음?',
  options: [
    {
      id: '1',
      label: 'A',
      text: '점심 회사 돈으로, 메뉴 못 정함',
      votes: 76000,
      percentage: 76,
    },
    {
      id: '2',
      label: 'B',
      text: '점심 내 돈으로, 메뉴 마음대로',
      votes: 24000,
      percentage: 24,
    },
  ],
  totalVotes: 948203,
}

function PollCard() {
  const [voted, setVoted] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const handleClickPercentage = (id: string) => {
    // 선택한 걸 다시 누르면 원상복구
    if (voted && selectedId === id) {
      setSelectedId(null)
      setVoted(false)
      return
    }

    // 이미 투표했고, 다른 걸 누르면 selectedId만 바꿈
    if (voted) {
      setSelectedId(id)
      return
    }

    // 최초 투표
    setSelectedId(id)
    setVoted(true)
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 rounded-xl shadow">
      <div className="text-sm font-medium text-gray-700">
        {mockPollData.user.name}
      </div>
      <div className="text-base font-semibold">{mockPollData.question}</div>
      <div className="space-y-2">
        {mockPollData.options.map((option) => {
          const isSelected = selectedId === option.id
          return (
            <div
              className={`relative border rounded-md px-4 py-3 cursor-pointer transition-all 
  ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => handleClickPercentage(option.id)}
              key={option.id}
            >
              <div className="flex justify-between relative z-10 font-medium">
                <span>
                  <strong>{option.label}</strong> {option.text}
                </span>
                {voted && <span>{option.percentage}%</span>}
              </div>

              {voted && (
                <div
                  className="absolute left-0 top-0 h-full bg-blue-100 rounded-md -z-10 transition-all duration-500 ease-in-out"
                  style={{ width: `${option.percentage}%` }}
                />
              )}
            </div>
          )
        })}
      </div>
      <div className="text-sm text-gray-400 text-right">
        총 {mockPollData.totalVotes}명 투표
      </div>
    </div>
  )
}
export default PollCard
