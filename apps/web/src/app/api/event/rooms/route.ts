import { NextResponse } from 'next/server'
import { createRoom, EventError, parseQuestions } from '@/lib/event/service'
import { eventErrorResponse, readJson } from '@/lib/event/http'
import { SITE_URL } from '@/constants/seo'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/event/rooms — 행사 방 생성 (관리자 전용, 헤더 x-admin-key)
 * body: { name: string, questions: { id?, title, options: (string | { content })[] }[] }
 */
export async function POST(req: Request) {
  try {
    const adminKey = process.env.EVENT_ADMIN_KEY
    if (!adminKey) throw new EventError(503, 'EVENT_ADMIN_KEY 가 설정되지 않았습니다')
    if (req.headers.get('x-admin-key') !== adminKey) {
      throw new EventError(403, '관리자 키가 맞지 않습니다')
    }
    const body = await readJson<{ name?: unknown; questions?: unknown }>(req)
    const name = typeof body.name === 'string' ? body.name : ''
    const room = await createRoom(name, parseQuestions(body.questions))
    const base = `${SITE_URL}/event/${room.code}`
    return NextResponse.json(
      {
        code: room.code,
        hostKey: room.hostKey,
        joinUrl: base,
        hostUrl: `${base}/host?key=${room.hostKey}`,
        screenUrl: `${base}/screen`,
        expiresAt: room.expiresAt,
      },
      { status: 201 },
    )
  } catch (e) {
    return eventErrorResponse(e)
  }
}
