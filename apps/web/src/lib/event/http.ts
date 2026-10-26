import { NextResponse } from 'next/server'
import { EventError } from './service'

/** Route Handler 공통: EventError 는 그 status 로, 나머지는 500 */
export function eventErrorResponse(e: unknown) {
  if (e instanceof EventError) {
    return NextResponse.json({ error: e.message }, { status: e.status })
  }
  console.error('[event]', e)
  return NextResponse.json({ error: '잠시 후 다시 시도해 주세요' }, { status: 500 })
}

export async function readJson<T = Record<string, unknown>>(
  req: Request,
): Promise<T> {
  try {
    return (await req.json()) as T
  } catch {
    throw new EventError(400, '요청 본문이 JSON 이 아닙니다')
  }
}

/** 폴링 응답은 캐시되면 안 된다 */
export const NO_STORE = { 'Cache-Control': 'no-store' }
