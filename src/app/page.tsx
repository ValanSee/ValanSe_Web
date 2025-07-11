/**
 * @description
 * 인증 여부에 따른 페이지 분기
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import { reissueTokenThunk } from '@/store/thunks/authThunks'
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
        await dispatch(fetchProfileThunk())
        router.replace('/main')
      } catch {
        try {
          // access token이 유효하지 않으면 refresh token으로 access token을 재발급
          await dispatch(reissueTokenThunk())
          await dispatch(fetchProfileThunk())
          router.replace('/main')
        } catch {
          // refresh token도 유효하지 않으면 entry 페이지로
          router.replace('/entry')
        }
      }
    }

    checkAuth()
  }, [dispatch, router])

  return <Loading />
}
