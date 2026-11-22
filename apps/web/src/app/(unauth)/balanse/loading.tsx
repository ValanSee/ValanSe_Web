'use client'

import { usePathname } from 'next/navigation'
import Loading from '@/components/_shared/loading'
import { tabPageSkeletonFor } from '@/components/_shared/skeleton/tabPageSkeletons'

export default function BalanseLoading() {
  const pathname = usePathname()
  return <>{tabPageSkeletonFor(pathname) ?? <Loading />}</>
}
