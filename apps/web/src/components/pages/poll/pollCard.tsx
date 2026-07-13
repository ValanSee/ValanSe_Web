'use client'

import { useCallback, useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { voteOption, VoteResponse } from '@/api/votes'
import { getAccessToken } from '@/utils/tokenUtils'
import {
  clearPendingVote,
  peekPendingVote,
  releasePendingVoteClaim,
  tryClaimPendingVoteSubmit,
} from '@/utils/authRedirect'
import { Chip } from '@/components/ui/chip'
import VsBadge from '@/components/_shared/vsBadge'
import { useVoteAction } from '@/hooks/utils/useVoteAction'
import { cn } from '@/lib/utils'

interface PollCardProps {
  voteId: number | string
  createdBy: string
  creatorTitle?: string | null
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
  postLoginReturnPath: string
}

/**
 * 투표 카드. Figma 노드 6397:26836 참조.
 *
 * - 미투표: 옵션 A/B G50 배경, V300 텍스트. 클릭 시 V200 배경 white 텍스트
 * - 투표 후: 선택한 옵션 V200 배경 · white 텍스트 + check 아이콘.
 *   미선택 옵션은 G50 배경 + 결과 바(Y300) 오버레이 + %
 */
function PollCard({
  voteId,
  createdBy,
  creatorTitle,
  title,
  content,
  options = [],
  totalParticipants,
  hasVoted = false,
  votedOptionLabel,
  postLoginReturnPath,
}: PollCardProps) {
  const [voted, setVoted] = useState(hasVoted)
  const [selectedId, setSelectedId] = useState<number | null>(() => {
    if (hasVoted && votedOptionLabel) {
      const idx = votedOptionLabel.charCodeAt(0) - 65
      return options[idx]?.optionId ?? null
    }
    return null
  })
  const [localOptions, setLocalOptions] = useState(options)
  const [localTotalParticipants, setLocalTotalParticipants] =
    useState(totalParticipants)
  const [pendingClaimRunning, setPendingClaimRunning] = useState(false)

  const applyVoteResponse = useCallback(
    (response: VoteResponse, prevSelectedId: number | null) => {
      setVoted(response.voted)
      setSelectedId(response.voted ? response.voteOptionId : null)
      setLocalTotalParticipants(response.totalVoteCount)
      setLocalOptions((prev) =>
        prev.map((opt) => {
          if (opt.optionId === response.voteOptionId) {
            return { ...opt, vote_count: response.voteOptionCount }
          }
          if (prevSelectedId === opt.optionId && response.voted) {
            return { ...opt, vote_count: Math.max(0, opt.vote_count - 1) }
          }
          return opt
        }),
      )
    },
    [],
  )

  const { submit, isVoting, loginModal } = useVoteAction({
    voteId,
    detailHref: postLoginReturnPath,
    onVoted: (response) => {
      setSelectedId((prev) => {
        applyVoteResponse(response, prev)
        return response.voted ? response.voteOptionId : null
      })
    },
  })

  // 로그인 리디렉트 후 pending vote 자동 제출
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
        setPendingClaimRunning(true)
        const response = await voteOption(voteId, pending.optionId)
        if (cancelled) return
        clearPendingVote()
        applyVoteResponse(response, null)
      } catch {
        if (!cancelled) alert('투표에 실패했습니다.')
      } finally {
        releasePendingVoteClaim()
        if (!cancelled) setPendingClaimRunning(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [voteId, hasVoted, localOptions, applyVoteResponse])

  const disabled = isVoting || pendingClaimRunning

  return (
    <>
      <article className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-[0_0_4px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-2">
          {creatorTitle && (
            <Chip size="s" status="secondary">
              {creatorTitle}
            </Chip>
          )}
          <span className="typo-body-c-01 text-brand-gray-100">{createdBy}</span>
        </div>
        <h2 className="typo-heading-04 text-foreground">{title}</h2>
        {content && (
          <p className="typo-body-a-01 whitespace-pre-wrap text-brand-gray-200">
            {content}
          </p>
        )}

        <div className="relative flex flex-col gap-3">
          {localOptions.length === 2 && <VsBadge />}
          {localOptions.map((option, idx) => {
            const isSelected = selectedId === option.optionId
            const percentage =
              localTotalParticipants > 0
                ? Math.round(
                    (option.vote_count / localTotalParticipants) * 100,
                  )
                : 0
            return (
              <button
                key={option.optionId ?? idx}
                type="button"
                onClick={() => submit(option.optionId)}
                disabled={disabled}
                aria-pressed={isSelected}
                className={cn(
                  'relative flex min-h-14 items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-left transition-colors',
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-brand-gray-50 text-primary hover:bg-brand-violet-50',
                  disabled && 'cursor-not-allowed opacity-70',
                )}
              >
                {voted && !isSelected && (
                  <div
                    className="absolute left-0 top-0 h-full bg-brand-yellow-300/70 transition-all duration-500 ease-in-out"
                    style={{ width: `${percentage}%` }}
                    aria-hidden
                  />
                )}
                <div className="relative z-10 flex w-full items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="typo-heading-06">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="typo-label-02">{option.content}</span>
                  </div>
                  {isSelected && (
                    <Icon
                      icon="tabler:check"
                      className="text-primary-foreground"
                      width={20}
                      aria-hidden
                    />
                  )}
                  {voted && !isSelected && (
                    <span className="typo-label-02 text-foreground">
                      {percentage}%
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        <div className="typo-label-03 text-primary">
          {localTotalParticipants.toLocaleString()}명 참여 중
        </div>
      </article>
      {loginModal}
    </>
  )
}

export default PollCard
