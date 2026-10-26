'use client'

import { useCallback, useState } from 'react'
import { voteOption, type VoteResponse } from '@/api/votes'
import { getAccessToken } from '@/utils/tokenUtils'
import { setPendingVote } from '@/utils/authRedirect'
import { useGoToLogin } from './useGoToLogin'

interface Options {
  voteId: number | string
  detailHref: string
  onVoted?: (response: VoteResponse, optionId: number) => void
}

/**
 * 카드 리스트/상세에서 공용으로 사용하는 투표 액션.
 * - 미로그인이면 pending 저장 후 바로 로그인 페이지로 이동 (로그인 후 상세에서 자동 제출)
 * - 로그인 상태면 voteOption API 호출 · onVoted 콜백 실행
 */
export function useVoteAction({ voteId, detailHref, onVoted }: Options) {
  const goToLogin = useGoToLogin()
  const [isVoting, setIsVoting] = useState(false)

  const submit = useCallback(
    async (optionId: number) => {
      if (isVoting) return
      if (!getAccessToken()) {
        setPendingVote(voteId, optionId)
        goToLogin(detailHref)
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
    [voteId, detailHref, onVoted, isVoting, goToLogin],
  )

  return { submit, isVoting }
}
