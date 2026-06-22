// app/authBootstrap.tsx
'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import { fetchProfileThunk } from '@/store/thunks/memberThunks'
import { recover } from '@/store/slices/authSlice'
import { getAccessToken } from '@/utils/tokenUtils'

export default function AuthBootstrap() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const token = getAccessToken()
    if (!token) return

    void (async () => {
      try {
        await dispatch(fetchProfileThunk())
        dispatch(recover())
      } catch {
        // 토큰 무효 등은 authApi 인터셉터·API에서 처리
      }
    })()
  }, [dispatch])

  return null
}
