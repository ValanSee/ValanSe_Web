import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import HostPage from '@/components/pages/event/hostPage'
import { normalizeCode, requireRoom } from '@/lib/event/service'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '밸런스게임 사회자',
  robots: { index: false, follow: false },
}

export default async function EventHost({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  try {
    await requireRoom(code)
  } catch {
    notFound()
  }
  // useSearchParams 를 쓰는 클라이언트 컴포넌트는 Suspense 경계가 필요하다
  return (
    <Suspense fallback={null}>
      <HostPage code={normalizeCode(code)} />
    </Suspense>
  )
}
