/**
 * @description
 * 인증 여부에 따른 페이지 분기
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import { fetchProfileThunk } from '@/store/thunks/memberThunks'
import { getAccessToken } from '@/utils/tokenUtils'
import { entryHrefWithRedirect } from '@/utils/authRedirect'
import Loading from '@/components/_shared/loading'

export default function Home() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      // access token이 없으면 메인(탐색)으로 — 로그인은 각 기능/탭에서 유도
      if (!getAccessToken()) {
        router.replace('/main')
        return
      }

      try {
        // access token 이 유효하면 profile을 가져오고 main 페이지로
        const profile = await dispatch(fetchProfileThunk())
        if (profile) {
          router.replace('/main')
        } else {
          router.replace('/onboarding')
        }
      } catch {
        // `/`에서 토큰은 있는데 프로필 실패 시 루프 방지: 복귀 목적지는 메인
        router.replace(entryHrefWithRedirect('/main'))
      }
    }

    checkAuth()
  }, [dispatch, router])

  return <Loading />
}
