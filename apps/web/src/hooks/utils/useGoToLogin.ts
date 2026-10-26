'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { entryHrefWithRedirect, markLoginOrigin } from '@/utils/authRedirect'

/**
 * 페이지 안의 동작(좋아요·투표·신고·댓글)에서 로그인 화면으로 보낼 때 사용.
 * 현재 화면 기록을 남겨(push) 로그인 후 이 위치로 되돌아오게 한다.
 */
export function useGoToLogin() {
  const router = useRouter()
  return useCallback(
    (returnPath: string) => {
      markLoginOrigin()
      router.push(entryHrefWithRedirect(returnPath))
    },
    [router],
  )
}
