'use client'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { voteOption, VoteResponse } from '@/api/votes'
import { getAccessToken } from '@/utils/tokenUtils'
import {
  clearPendingVote,
  entryHrefWithRedirect,
  peekPendingVote,
  releasePendingVoteClaim,
  setPendingVote,
  tryClaimPendingVoteSubmit,
} from '@/utils/authRedirect'
import LoginRequiredModal from '@/components/ui/modal/loginRequiredModal'

interface PollCardProps {
  voteId: number | string
  createdBy: string
  title: string
  content?: string | null
  options: {
    optionId: number
    content: string
    vote_count: number
  }[]
  totalParticipants: number
  hasVoted?: boolean
  votedOptionLabel?: string | null
  /** 비로그인 시 로그인 후 돌아올 현재 투표 페이지 경로 */
  postLoginReturnPath: string
}

function PollCard({
  voteId,
  createdBy,
  title,
  content,
  options = [],
  totalParticipants,
  hasVoted = false,
  votedOptionLabel,
  postLoginReturnPath,
}: PollCardProps) {
  const router = useRouter()
  // 초기 상태를 API 응답으로 설정
  const [voted, setVoted] = useState(hasVoted)
  const [selectedId, setSelectedId] = useState<number | null>(() => {
    if (hasVoted && votedOptionLabel) {
      // votedOptionLabel이 "A", "B", "C" 등이므로 해당 인덱스의 optionId를 찾음
      const optionIndex = votedOptionLabel.charCodeAt(0) - 65 // 'A' = 0, 'B' = 1, ...
      return options[optionIndex]?.optionId || null
    }
    return null
  })
  const [localOptions, setLocalOptions] = useState(options)
  const [localTotalParticipants, setLocalTotalParticipants] =
    useState(totalParticipants)
  const [isVoting, setIsVoting] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [pendingOptionId, setPendingOptionId] = useState<number | null>(null)

  const applyVoteResponse = useCallback(
    (response: VoteResponse, prevSelectedId: number | null) => {
      setVoted(response.voted)
      setSelectedId(response.voted ? response.voteOptionId : null)
      setLocalTotalParticipants(response.totalVoteCount)
      setLocalOptions((prevOptions) =>
        prevOptions.map((option) => {
          if (option.optionId === response.voteOptionId) {
            return { ...option, vote_count: response.voteOptionCount }
          }
          if (prevSelectedId === option.optionId && response.voted) {
            return { ...option, vote_count: Math.max(0, option.vote_count - 1) }
          }
          return option
        }),
      )
    },
    [],
  )

  // 로그인 후 돌아왔을 때, 직전에 눌렀던 옵션으로 자동 투표
  useEffect(() => {
    const pending = peekPendingVote()
    if (!pending || Number(pending.voteId) !== Number(voteId)) return
    if (!getAccessToken()) return
    if (hasVoted) {
      clearPendingVote()
      return
    }
    if (!localOptions.some((o) => o.optionId === pending.optionId)) return
    if (!tryClaimPendingVoteSubmit(voteId)) return

    let cancelled = false
    void (async () => {
      try {
        setIsVoting(true)
        const response = await voteOption(voteId, pending.optionId)
        if (cancelled) return
        clearPendingVote()
        applyVoteResponse(response, null)
      } catch {
        if (!cancelled) {
          alert('투표에 실패했습니다.')
        }
      } finally {
        releasePendingVoteClaim()
        if (!cancelled) setIsVoting(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [voteId, hasVoted, localOptions, applyVoteResponse])

  const handleClickPercentage = async (id: number) => {
    if (isVoting) return // 중복 클릭 방지

    if (!getAccessToken()) {
      setPendingOptionId(id)
      setShowLoginModal(true)
      return
    }

    const prevSelected = selectedId

    try {
      setIsVoting(true)

      if (prevSelected === id) {
        setSelectedId(null)
        setVoted(false)
      } else {
        setSelectedId(id)
        setVoted(true)
      }

      const response: VoteResponse = await voteOption(voteId, id)
      applyVoteResponse(response, prevSelected)
    } catch (error) {
      console.error('투표 실패:', error)
      alert('투표에 실패했습니다.')
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
    <>
      <div className="mx-auto p-4 space-y-4 rounded-xl shadow bg-white mb-6">
        <div className="text-sm font-medium text-gray-700">{createdBy}</div>
        <div className="text-base font-semibold">{title}</div>
        {content && (
          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        )}
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

      <LoginRequiredModal
        open={showLoginModal}
        onClose={() => {
          setShowLoginModal(false)
          setPendingOptionId(null)
        }}
        onLogin={() => {
          if (pendingOptionId !== null) {
            setPendingVote(voteId, pendingOptionId)
          }
          setShowLoginModal(false)
          setPendingOptionId(null)
          router.replace(entryHrefWithRedirect(postLoginReturnPath))
        }}
      />
    </>
  )
}
export default PollCard
