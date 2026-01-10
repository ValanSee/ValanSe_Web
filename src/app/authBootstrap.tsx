// app/authBootstrap.tsx
'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import { fetchProfileThunk } from '@/store/thunks/memberThunks'
import { getAccessToken } from '@/utils/tokenUtils'

export default function AuthBootstrap() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // 새로고침 시 profile 가져오기
    if (getAccessToken()) {
      // access token 이 없으면 로그인 페이지로 이동하기 때문에 아무것도 할 필요없음
      // access token 이 있으면 해당 token 으로 profile 조회 시도
      dispatch(fetchProfileThunk())
    }
  }, [dispatch])

  return null
}
