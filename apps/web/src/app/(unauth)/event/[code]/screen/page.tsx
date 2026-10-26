import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ScreenPage from '@/components/pages/event/screenPage'
import { normalizeCode, requireRoom } from '@/lib/event/service'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '밸런스게임 화면',
  robots: { index: false, follow: false },
}

export default async function EventScreen({
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
  return <ScreenPage code={normalizeCode(code)} />
}
