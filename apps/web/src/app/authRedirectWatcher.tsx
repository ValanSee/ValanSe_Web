'use client'

import { useEffect } from 'react'
//import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/hooks/utils/useAppSelector'

export default function AuthRedirectWatcher() {
  //const router = useRouter()
  const isLogined = useAppSelector((state) => state.auth.isLogined)

  useEffect(() => {
    if (!isLogined) {
      // to 지상. entry 강제 납치로 주석처리 해놓음.
      // router.push('/entry')
    }
  }, [isLogined])

  return null
}
