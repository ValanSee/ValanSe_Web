import { NextResponse } from 'next/server'
import { joinRoom } from '@/lib/event/service'
import { eventErrorResponse, readJson } from '@/lib/event/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** POST /api/event/rooms/{code}/join — body { pid, nickname } */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await params
    const body = await readJson<{ pid?: unknown; nickname?: unknown }>(req)
    await joinRoom(
      code,
      typeof body.pid === 'string' ? body.pid : '',
      typeof body.nickname === 'string' ? body.nickname : '',
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    return eventErrorResponse(e)
  }
}
