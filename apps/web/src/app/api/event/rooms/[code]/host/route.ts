import { NextResponse } from 'next/server'
import { applyHostAction, getHostState } from '@/lib/event/service'
import { eventErrorResponse, NO_STORE, readJson } from '@/lib/event/http'
import type { EventHostAction } from '@/lib/event/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ACTIONS: EventHostAction[] = ['start', 'next', 'prev', 'reveal', 'hide', 'end']

/** POST /api/event/rooms/{code}/host — 헤더 x-host-key, body { action } → 갱신된 사회자 상태 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await params
    const hostKey = req.headers.get('x-host-key') ?? ''
    const body = await readJson<{ action?: unknown }>(req)
    const action = ACTIONS.find((a) => a === body.action)
    if (!action) {
      return NextResponse.json({ error: '알 수 없는 동작입니다' }, { status: 400 })
    }
    await applyHostAction(code, hostKey, action)
    return NextResponse.json(await getHostState(code, hostKey), {
      headers: NO_STORE,
    })
  } catch (e) {
    return eventErrorResponse(e)
  }
}
