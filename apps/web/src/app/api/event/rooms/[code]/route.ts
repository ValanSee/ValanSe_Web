import { NextResponse } from 'next/server'
import { getHostState, getPublicState } from '@/lib/event/service'
import { eventErrorResponse, NO_STORE } from '@/lib/event/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/event/rooms/{code}?pid=참가자ID — 참가자·프로젝터 상태 (2초 폴링)
 * 헤더 x-host-key 가 맞으면 사회자 상태 (집계·참가자 목록 포함)
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await params
    const hostKey = req.headers.get('x-host-key')
    if (hostKey) {
      return NextResponse.json(await getHostState(code, hostKey), {
        headers: NO_STORE,
      })
    }
    const pid = new URL(req.url).searchParams.get('pid')
    return NextResponse.json(await getPublicState(code, pid), {
      headers: NO_STORE,
    })
  } catch (e) {
    return eventErrorResponse(e)
  }
}
