'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { postPageView } from '@/api/analytics'
import { getOrCreateAnonymousId } from '@/utils/anonymousId'

const ENABLED = process.env.NODE_ENV === 'production'

export function PageViewTracker() {
  const pathname = usePathname()
  const lastSentRef = useRef<string | null>(null)

  useEffect(() => {
    if (!ENABLED) return
    if (!pathname) return
    if (lastSentRef.current === pathname) return
    lastSentRef.current = pathname

    const anonymousId = getOrCreateAnonymousId()
    if (!anonymousId) return

    postPageView({ anonymousId, pagePath: pathname }).catch(() => {})
  }, [pathname])

  return null
}
