import { NextResponse } from 'next/server'
import { castVote } from '@/lib/event/service'
import { eventErrorResponse, readJson } from '@/lib/event/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** POST /api/event/rooms/{code}/vote — body { pid, questionIndex, label } */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const { code } = await params
    const body = await readJson<{
      pid?: unknown
      questionIndex?: unknown
      label?: unknown
    }>(req)
    await castVote(
      code,
      typeof body.pid === 'string' ? body.pid : '',
      typeof body.questionIndex === 'number' ? body.questionIndex : -1,
      typeof body.label === 'string' ? body.label : '',
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    return eventErrorResponse(e)
  }
}
