'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import LoginRequiredModal from '@/components/ui/modal/loginRequiredModal'
import { voteOption, type VoteResponse } from '@/api/votes'
import { getAccessToken } from '@/utils/tokenUtils'
import {
  entryHrefWithRedirect,
  setPendingVote,
} from '@/utils/authRedirect'

interface Options {
  voteId: number | string
  detailHref: string
  onVoted?: (response: VoteResponse, optionId: number) => void
}

/**
 * 카드 리스트/상세에서 공용으로 사용하는 투표 액션.
 * - 미로그인이면 LoginRequiredModal 노출, 확인 시 pending 저장 후 로그인 페이지로 이동
 * - 로그인 상태면 voteOption API 호출 · onVoted 콜백 실행
 */
export function useVoteAction({ voteId, detailHref, onVoted }: Options) {
  const router = useRouter()
  const [isVoting, setIsVoting] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [pendingOptionId, setPendingOptionId] = useState<number | null>(null)

  const submit = useCallback(
    async (optionId: number) => {
      if (isVoting) return
      if (!getAccessToken()) {
        setPendingOptionId(optionId)
        setShowLoginModal(true)
        return
      }
      try {
        setIsVoting(true)
        const response = await voteOption(voteId, optionId)
        onVoted?.(response, optionId)
      } catch (e) {
        console.error('투표 실패:', e)
        alert('투표에 실패했습니다.')
      } finally {
        setIsVoting(false)
      }
    },
    [voteId, onVoted, isVoting],
  )

  const loginModal = (
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
        router.replace(entryHrefWithRedirect(detailHref))
      }}
    />
  )

  return { submit, isVoting, loginModal }
}
