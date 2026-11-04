import { NextResponse, type NextRequest } from 'next/server'
import type { protos } from '@google-analytics/data'
import { getGaClient } from '@/lib/server/google'
import { requireAdmin } from '@/lib/server/requireAdmin'
import { cached } from '@/lib/server/cache'
import { dateList, kstDate, parseDays } from '@/lib/server/kstDate'
import type {
  ByPlatform,
  GaDashboard,
  Platform,
  PlatformTotals,
} from '@/types/dashboard'

export const dynamic = 'force-dynamic'

type Report = protos.google.analytics.data.v1beta.IRunReportResponse
type Row = protos.google.analytics.data.v1beta.IRow

const CACHE_TTL_MS = 10 * 60 * 1000

/** 웹 GA 설정이 모든 이벤트에 붙이는 platform 파라미터 (GA 맞춤 측정기준 · 이벤트 범위) */
const PLATFORM_DIM = 'customEvent:platform'

/** apps/web 의 trackEvent 로 보내는 이벤트 */
const TRACKED_EVENTS = [
  'sign_up',
  'login',
  'onboarding_complete',
  'vote',
  'comment',
  'create_vote',
  'share',
]

function toPlatform(v: string | null | undefined): Platform {
  return v === 'app' || v === 'web' ? v : 'other'
}

function num(row: Row, i: number): number {
  return Number(row.metricValues?.[i]?.value ?? 0)
}

function dim(row: Row, i: number): string {
  return row.dimensionValues?.[i]?.value ?? ''
}

function byPlatform<T>(make: () => T): ByPlatform<T> {
  return { app: make(), web: make(), other: make() }
}

function emptyTotals(): PlatformTotals {
  return {
    activeUsers: 0,
    newUsers: 0,
    sessions: 0,
    engagedSessions: 0,
    engagementSeconds: 0,
    pageViews: 0,
  }
}

async function load(days: number): Promise<GaDashboard> {
  const client = getGaClient()
  const propertyId = process.env.GA_PROPERTY_ID
  if (!client || !propertyId) throw new Error('GA 환경변수가 설정되지 않았습니다.')

  // 오늘은 집계 중이라 어제까지
  const endDate = kstDate(1)
  const startDate = kstDate(days)
  const dateRanges = [{ startDate, endDate }]
  const platform = { name: PLATFORM_DIM }

  const [res] = await client.batchRunReports({
    property: `properties/${propertyId}`,
    requests: [
      {
        dateRanges,
        dimensions: [{ name: 'date' }, platform],
        metrics: [{ name: 'activeUsers' }],
      },
      {
        dateRanges,
        dimensions: [platform],
        metrics: [
          { name: 'activeUsers' },
          { name: 'newUsers' },
          { name: 'sessions' },
          { name: 'engagedSessions' },
          { name: 'userEngagementDuration' },
          { name: 'screenPageViews' },
        ],
      },
      {
        dateRanges,
        dimensions: [{ name: 'eventName' }, platform],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            inListFilter: { values: TRACKED_EVENTS },
          },
        },
      },
      {
        dateRanges,
        dimensions: [{ name: 'sessionSourceMedium' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10,
      },
      {
        dateRanges: [{ startDate: endDate, endDate }],
        dimensions: [platform],
        metrics: [
          { name: 'active1DayUsers' },
          { name: 'active7DayUsers' },
          { name: 'active28DayUsers' },
        ],
      },
    ],
  })

  const reports: Report[] = res.reports ?? []
  const [dailyR, totalsR, eventsR, sourcesR, activeR] = reports

  // 일별: GA 는 0 인 날을 빼고 주므로 날짜를 다 채운다
  const dailyMap = new Map(
    dateList(startDate, endDate).map((d) => [d, byPlatform(() => 0)]),
  )
  for (const row of dailyR?.rows ?? []) {
    const raw = dim(row, 0)
    const date = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
    const slot = dailyMap.get(date)
    if (slot) slot[toPlatform(dim(row, 1))] += num(row, 0)
  }

  const totals = byPlatform(emptyTotals)
  for (const row of totalsR?.rows ?? []) {
    const t = totals[toPlatform(dim(row, 0))]
    t.activeUsers += num(row, 0)
    t.newUsers += num(row, 1)
    t.sessions += num(row, 2)
    t.engagedSessions += num(row, 3)
    t.engagementSeconds += num(row, 4)
    t.pageViews += num(row, 5)
  }

  const eventMap = new Map(TRACKED_EVENTS.map((e) => [e, byPlatform(() => 0)]))
  for (const row of eventsR?.rows ?? []) {
    const slot = eventMap.get(dim(row, 0))
    if (slot) slot[toPlatform(dim(row, 1))] += num(row, 0)
  }

  const active = byPlatform(() => ({ dau: 0, wau: 0, mau: 0 }))
  for (const row of activeR?.rows ?? []) {
    const a = active[toPlatform(dim(row, 0))]
    a.dau += num(row, 0)
    a.wau += num(row, 1)
    a.mau += num(row, 2)
  }

  return {
    days,
    startDate,
    endDate,
    generatedAt: new Date().toISOString(),
    active,
    totals,
    daily: [...dailyMap].map(([date, v]) => ({ date, ...v })),
    events: [...eventMap].map(([name, v]) => ({ name, ...v })),
    sources: (sourcesR?.rows ?? []).map((row) => ({
      sourceMedium: dim(row, 0),
      sessions: num(row, 0),
      activeUsers: num(row, 1),
    })),
  }
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ message: '관리자 인증이 필요합니다.' }, { status: 401 })
  }
  const days = parseDays(req.nextUrl.searchParams.get('days'))
  try {
    const data = await cached(`ga:${days}`, CACHE_TTL_MS, () => load(days))
    return NextResponse.json(data)
  } catch (err) {
    console.error('[dashboard/ga]', err)
    const message = err instanceof Error ? err.message : 'GA 조회에 실패했습니다.'
    return NextResponse.json({ message }, { status: 502 })
  }
}
