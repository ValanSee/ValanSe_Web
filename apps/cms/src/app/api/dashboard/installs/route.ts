import { NextResponse, type NextRequest } from 'next/server'
import { getStorage } from '@/lib/server/google'
import { requireAdmin } from '@/lib/server/requireAdmin'
import { cached } from '@/lib/server/cache'
import { kstDate, parseDays } from '@/lib/server/kstDate'
import type { InstallsDashboard, InstallsDay } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

// Play 리포트는 하루 한 번 갱신되므로 넉넉히 캐시
const CACHE_TTL_MS = 60 * 60 * 1000

/** Play Console 설치 통계 CSV 는 UTF-16LE(BOM) 이다 */
function decodeCsv(buf: Buffer): string {
  if (buf[0] === 0xff && buf[1] === 0xfe) {
    return new TextDecoder('utf-16le').decode(buf.subarray(2))
  }
  return buf.toString('utf8').replace(/^﻿/, '')
}

const COLUMNS = {
  date: 'Date',
  deviceInstalls: 'Daily Device Installs',
  deviceUninstalls: 'Daily Device Uninstalls',
  userInstalls: 'Daily User Installs',
  userUninstalls: 'Daily User Uninstalls',
  activeDevices: 'Active Device Installs',
  totalUserInstalls: 'Total User Installs',
} as const

function parseOverview(csv: string): InstallsDay[] {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim())
  if (lines.length < 2) return []
  const header = lines[0].split(',').map((h) => h.trim())
  const idx = (name: string) => header.indexOf(name)
  const col = Object.fromEntries(
    Object.entries(COLUMNS).map(([k, name]) => [k, idx(name)]),
  ) as Record<keyof typeof COLUMNS, number>

  return lines.slice(1).map((line) => {
    const cells = line.split(',')
    const n = (i: number) => (i < 0 ? 0 : Number(cells[i]) || 0)
    return {
      date: cells[col.date]?.trim() ?? '',
      deviceInstalls: n(col.deviceInstalls),
      deviceUninstalls: n(col.deviceUninstalls),
      userInstalls: n(col.userInstalls),
      userUninstalls: n(col.userUninstalls),
      activeDevices: n(col.activeDevices),
      totalUserInstalls: n(col.totalUserInstalls),
    }
  })
}

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
  const startMonth = startDate.slice(0, 7).replace('-', '')
  const prefix = `stats/installs/installs_${pkg}_`

  try {
    const [files] = await storage.bucket(bucket).getFiles({ prefix })
    const targets = files.filter((f) => {
      const m = f.name.match(/_(\d{6})_overview\.csv$/)
      return m && m[1] >= startMonth
    })
    const parsed = await Promise.all(
      targets.map(async (f) => parseOverview(decodeCsv((await f.download())[0]))),
    )
    const daily = parsed
      .flat()
      .filter((d) => d.date >= startDate)
      .sort((a, b) => a.date.localeCompare(b.date))
    return {
      status: 'ok',
      days,
      generatedAt: new Date().toISOString(),
      daily,
      latest: daily.at(-1) ?? null,
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
