'use client'

import { Fragment, useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
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
import HorizontalScroll from '@/components/_shared/horizontalScroll'
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
    imageUrl?: string | null
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
  const hasImages = localOptions.some((o) => o.imageUrl)

  const percentOf = (voteCount: number) =>
    localTotalParticipants > 0
      ? Math.round((voteCount / localTotalParticipants) * 100)
      : 0

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

        {hasImages ? (
          <HorizontalScroll className="-mx-5 px-5" shadow={false}>
            <div className="flex items-start gap-3">
              {localOptions.map((option, idx) => {
                const isSelected = selectedId === option.optionId
                const unvotedAfterVote = voted && !isSelected
                const label = String.fromCharCode(65 + idx)
                return (
                  <Fragment key={option.optionId ?? idx}>
                    {idx > 0 && (
                      <div className="relative flex h-[152px] w-0 shrink-0 items-center">
                        <span className="typo-title-04 absolute left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-card text-foreground shadow-[0_0_4px_rgba(0,0,0,0.12)]">
                          VS
                        </span>
                      </div>
                    )}
                    <div className="flex w-[152px] shrink-0 flex-col gap-2">
                      <div className="relative h-[152px] w-full overflow-hidden rounded-xl bg-brand-gray-50">
                        {option.imageUrl ? (
                          <Image
                            src={option.imageUrl}
                            alt={option.content}
                            fill
                            sizes="152px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-brand-gray-100">
                            <Icon icon="tabler:photo-off" width={28} aria-hidden />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => submit(option.optionId)}
                        disabled={disabled}
                        aria-pressed={isSelected}
                        className={cn(
                          'flex min-h-12 items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left transition-colors',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : unvotedAfterVote
                              ? 'bg-brand-gray-200 text-primary-foreground'
                              : 'bg-brand-gray-50 text-primary hover:bg-brand-violet-50',
                          disabled && 'cursor-not-allowed opacity-70',
                        )}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="typo-heading-06">{label}</span>
                          <span className="typo-label-02 truncate">
                            {option.content}
                          </span>
                        </span>
                        {isSelected && (
                          <Icon
                            icon="tabler:check"
                            className="shrink-0 text-primary-foreground"
                            width={18}
                            aria-hidden
                          />
                        )}
                        {unvotedAfterVote && (
                          <span className="typo-label-02 shrink-0 text-primary-foreground">
                            {percentOf(option.vote_count)}%
                          </span>
                        )}
                      </button>
                    </div>
                  </Fragment>
                )
              })}
            </div>
          </HorizontalScroll>
        ) : (
          <div className="relative flex flex-col gap-3">
            {localOptions.length === 2 && <VsBadge />}
            {localOptions.map((option, idx) => {
              const isSelected = selectedId === option.optionId
              const unvotedAfterVote = voted && !isSelected
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
                      : unvotedAfterVote
                        ? 'bg-brand-gray-200 text-primary-foreground'
                        : 'bg-brand-gray-50 text-primary hover:bg-brand-violet-50',
                    disabled && 'cursor-not-allowed opacity-70',
                  )}
                >
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
                    {unvotedAfterVote && (
                      <span className="typo-label-02 text-primary-foreground">
                        {percentOf(option.vote_count)}%
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        <div className="typo-label-03 text-primary">
          {localTotalParticipants.toLocaleString()}명 참여 중
        </div>
      </article>
      {loginModal}
    </>
  )
}

export default PollCard
