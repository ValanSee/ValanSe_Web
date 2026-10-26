import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ParticipantPage from '@/components/pages/event/participantPage'
import { normalizeCode, requireRoom } from '@/lib/event/service'

export const dynamic = 'force-dynamic'

/** 행사 방은 초대 전용이라 검색에 노출하지 않는다 */
export const metadata: Metadata = {
  title: '밸런스게임 참여',
  robots: { index: false, follow: false },
}

export default async function EventParticipant({
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
  return <ParticipantPage code={normalizeCode(code)} />
}
