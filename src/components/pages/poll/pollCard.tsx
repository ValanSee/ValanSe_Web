'use client'
import { useState } from 'react'
import { voteOption, VoteResponse } from '@/api/votes'

interface PollCardProps {
  voteId: number | string
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
  voteId,
  createdBy,
  title,
  options = [],
  totalParticipants,
}: PollCardProps) {
  const [voted, setVoted] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [localOptions, setLocalOptions] = useState(options)
  const [localTotalParticipants, setLocalTotalParticipants] =
    useState(totalParticipants)
  const [isVoting, setIsVoting] = useState(false)

  const handleClickPercentage = async (id: number) => {
    if (isVoting) return // 중복 클릭 방지

    try {
      setIsVoting(true)

      if (selectedId === id) {
        setSelectedId(null)
        setVoted(false)
      } else {
        // 다른 옵션 클릭 - 재투표
        setSelectedId(id)
        setVoted(true)
      }

      const response: VoteResponse = await voteOption(voteId, id)

      // API 응답으로 최종 상태 업데이트
      setVoted(response.voted)
      setSelectedId(response.voted ? response.voteOptionId : null)
      setLocalTotalParticipants(response.totalVoteCount)

      // 옵션별 투표 수 업데이트
      setLocalOptions((prevOptions) =>
        prevOptions.map((option) => {
          if (option.optionId === response.voteOptionId) {
            // 새로 선택된 옵션: API 응답으로 업데이트
            return { ...option, vote_count: response.voteOptionCount }
          } else if (selectedId === option.optionId && response.voted) {
            // 이전에 선택되었던 옵션 (재투표 시): 투표 수 1 감소
            return { ...option, vote_count: Math.max(0, option.vote_count - 1) }
          }
          return option
        }),
      )
    } catch (error) {
      console.error('투표 실패:', error)
      alert('투표에 실패했습니다.')

      // 에러 발생 시 원래 상태로 되돌리기
      setSelectedId(null)
      setVoted(false)
    } finally {
      setIsVoting(false)
    }
  }

  const getOptionColor = (index: number) => {
    const colors = [
      '#6C8BA7', // A - 푸른색 계열 (통계 차트와 동일)
      '#F28C4A', // B - 붉은색 계열 (통계 차트와 동일)
      '#10B981', // C - 초록색 계열
      '#8B5CF6', // D - 보라색 계열
    ]
    return colors[index] || '#6C8BA7'
  }

  const getOptionLightColor = (index: number) => {
    const lightColors = [
      '#E3F2FD', // A - 연한 푸른색
      '#FFF3E0', // B - 연한 붉은색
      '#E8F5E8', // C - 연한 초록색
      '#F3E5F5', // D - 연한 보라색
    ]
    return lightColors[index] || '#E3F2FD'
  }

  return (
    <div className="mx-auto p-4 space-y-4 rounded-xl shadow bg-white mb-6">
      <div className="text-sm font-medium text-gray-700">{createdBy}</div>
      <div className="text-base font-semibold">{title}</div>
      <div className="space-y-2">
        {localOptions.map((option, idx) => {
          const isSelected = selectedId === option.optionId
          const percentage =
            localTotalParticipants > 0
              ? Math.round((option.vote_count / localTotalParticipants) * 100)
              : 0
          const optionColor = getOptionColor(idx)
          const optionLightColor = getOptionLightColor(idx)

          return (
            <div
              className={`relative border rounded-md px-4 py-3 cursor-pointer transition-all ${
                isSelected ? `ring-2` : ''
              } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{
                borderColor: isSelected ? optionColor : undefined,
                backgroundColor: isSelected
                  ? optionColor // 선택된 옵션은 진한 색상
                  : voted
                    ? optionLightColor // 투표된 옵션은 연한 색상
                    : undefined,
                color: isSelected ? '#fff' : undefined, // 선택된 옵션은 글씨 흰색
              }}
              onClick={() => handleClickPercentage(option.optionId)}
              key={option.optionId ?? idx}
            >
              <div className="flex justify-between relative z-10 font-medium">
                <span>
                  <strong>{String.fromCharCode(65 + idx)}</strong>{' '}
                  {option.content}
                </span>
                {voted && <span>{percentage}%</span>}
              </div>
              {/* 선택된 옵션이 아니고, 투표가 완료된 경우에만 퍼센트 바 표시 */}
              {voted && !isSelected && (
                <div
                  className="absolute left-0 top-0 h-full rounded-md -z-10 transition-all duration-500 ease-in-out"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: optionLightColor,
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
      <div className="text-sm text-gray-400 text-right">
        총 {localTotalParticipants}명 투표
      </div>
    </div>
  )
}
export default PollCard
