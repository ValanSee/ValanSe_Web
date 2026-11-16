import { NextResponse, type NextRequest } from 'next/server'
import { getStorage } from '@/lib/server/google'
import { requireAdmin } from '@/lib/server/requireAdmin'
import { cached } from '@/lib/server/cache'
import { kstDate, parseDays } from '@/lib/server/kstDate'
import type { InstallsDashboard } from '@/types/dashboard'
import { OVERVIEW_FILE, decodeCsv, parseOverview, summarize } from '@/lib/playInstalls'

export const dynamic = 'force-dynamic'
// 백엔드가 국내 서버라 Vercel 서울 리전에서 실행 (기본 리전 미국에서는 관리자 확인 요청이 막힘)
export const preferredRegion = 'icn1'

// Play 리포트는 하루 한 번 갱신되므로 넉넉히 캐시
const CACHE_TTL_MS = 60 * 60 * 1000

async function load(days: number): Promise<InstallsDashboard> {
  const storage = getStorage()
  const bucket = process.env.PLAY_REPORTS_BUCKET
  const pkg = process.env.PLAY_PACKAGE_NAME
  if (!storage || !bucket || !pkg) {
    return {
      status: 'unavailable',
      reason: 'not_configured',
      message: 'Play 리포트 환경변수가 설정되지 않았습니다.',
    }
  }

  const startDate = kstDate(days)
  const prefix = `stats/installs/installs_${pkg}_`

  try {
    // 누적 설치를 위해 모든 달을 읽는다 (월 1개 · 수 KB, 결과는 1시간 캐시)
    const [files] = await storage.bucket(bucket).getFiles({ prefix })
    const targets = files.filter((f) => OVERVIEW_FILE.test(f.name))
    const parsed = await Promise.all(
      targets.map(async (f) => parseOverview(decodeCsv((await f.download())[0]))),
    )
    return {
      status: 'ok',
      days,
      generatedAt: new Date().toISOString(),
      ...summarize(parsed.flat(), startDate),
    }
  } catch (err) {
    const code = (err as { code?: number }).code
    if (code === 403) {
      return {
        status: 'unavailable',
        reason: 'forbidden',
        message:
          '서비스 계정에 Play 리포트 버킷 권한이 아직 없습니다. Play Console 권한은 반영까지 최대 24시간 걸립니다.',
      }
    }
    throw err
  }
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ message: '관리자 인증이 필요합니다.' }, { status: 401 })
  }
  const days = parseDays(req.nextUrl.searchParams.get('days'))
  try {
    // 권한 대기 · 미설정 응답은 캐시하지 않는다 (권한이 붙는 즉시 보이도록)
    const data = await cached(
      `installs:${days}`,
      CACHE_TTL_MS,
      () => load(days),
      (d) => d.status === 'ok',
    )
    return NextResponse.json(data)
  } catch (err) {
    console.error('[dashboard/installs]', err)
    const body: InstallsDashboard = {
      status: 'unavailable',
      reason: 'error',
      message: err instanceof Error ? err.message : 'Play 리포트 조회에 실패했습니다.',
    }
    return NextResponse.json(body)
  }
}
