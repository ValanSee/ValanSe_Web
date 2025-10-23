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
import Loading from '@/components/_shared/loading'

export default function Home() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      // access token이 없으면 entry 페이지로
      if (!getAccessToken()) {
        router.replace('/entry')
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
        router.replace('/entry')
      }
    }

    checkAuth()
  }, [dispatch, router])

  return <Loading />
}
