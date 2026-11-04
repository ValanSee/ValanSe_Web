'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Smartphone, Monitor, UserPlus, CalendarDays } from 'lucide-react'
import type { GaDashboard, Platform } from '@/types/dashboard'
import {
  AXIS_TICK,
  EVENT_LABEL,
  GRID_STROKE,
  PLATFORM_LABEL,
  SERIES,
  fmt,
  formatDuration,
  shortDate,
} from './chartTheme'
import { ChartTooltip, Legend, Notice, Panel, StatCard } from './parts'

const PLATFORMS: Platform[] = ['app', 'web']

export default function GaSection({
  data,
  loading,
  error,
}: {
  data: GaDashboard | null
  loading: boolean
  error: string | null
}) {
  const hasOther = !!data && (data.totals.other.activeUsers > 0 || data.active.other.mau > 0)
  const shownPlatforms: Platform[] = hasOther ? [...PLATFORMS, 'other'] : PLATFORMS
  const legend = shownPlatforms.map((p) => ({ label: PLATFORM_LABEL[p], color: SERIES[p] }))
  const newUsers = data
    ? data.totals.app.newUsers + data.totals.web.newUsers + data.totals.other.newUsers
    : 0

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-gray-900">사용 현황 (GA4)</h2>
        {data && (
          <p className="text-xs text-gray-500">
            {data.startDate} ~ {data.endDate} · 오늘은 집계 중이라 제외
          </p>
        )}
      </div>

      {error && <Notice tone="error">{error}</Notice>}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="앱 DAU"
          value={data?.active.app.dau}
          sub={data ? `WAU ${fmt(data.active.app.wau)}` : undefined}
          loading={loading}
          icon={<Smartphone className="h-4 w-4" style={{ color: SERIES.app }} />}
        />
        <StatCard
          label="앱 MAU (28일)"
          value={data?.active.app.mau}
          sub={
            data && data.active.app.mau + data.active.web.mau > 0
              ? `전체의 ${Math.round(
                  (data.active.app.mau / (data.active.app.mau + data.active.web.mau)) * 100,
                )}%`
              : undefined
          }
          loading={loading}
          icon={<Smartphone className="h-4 w-4" style={{ color: SERIES.app }} />}
        />
        <StatCard
          label="웹 MAU (28일)"
          value={data?.active.web.mau}
          sub={data ? `DAU ${fmt(data.active.web.dau)}` : undefined}
          loading={loading}
          icon={<Monitor className="h-4 w-4" style={{ color: SERIES.web }} />}
        />
        <StatCard
          label="신규 사용자"
          value={newUsers}
          sub={data ? `최근 ${data.days}일` : undefined}
          loading={loading}
          icon={<UserPlus className="h-4 w-4 text-gray-700" />}
        />
      </section>

      <Panel
        title="일별 활성 사용자"
        description="앱(WebView)과 웹을 GA platform 값으로 나눔"
        right={<Legend items={legend} />}
      >
        <div className="h-64">
          {data && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.daily} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={shortDate}
                  tick={AXIS_TICK}
                  tickLine={false}
                  axisLine={{ stroke: GRID_STROKE }}
                  minTickGap={24}
                />
                <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ stroke: '#9ca3af', strokeDasharray: '3 3' }}
                />
                {shownPlatforms.map((p) => (
                  <Line
                    key={p}
                    type="monotone"
                    dataKey={p}
                    name={PLATFORM_LABEL[p]}
                    stroke={SERIES[p]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 2, stroke: '#fff' }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel
          title="주요 행동"
          description={data ? `최근 ${data.days}일 이벤트 수` : undefined}
          right={<Legend items={legend} />}
        >
          <div className="h-72">
            {data && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={data.events.map((e) => ({ ...e, label: EVENT_LABEL[e.name] ?? e.name }))}
                  margin={{ top: 0, right: 8, left: 8, bottom: 0 }}
                  barGap={2}
                  barCategoryGap="24%"
                >
                  <CartesianGrid stroke={GRID_STROKE} horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={76}
                    tick={AXIS_TICK}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f3f4f6' }} />
                  {shownPlatforms.map((p) => (
                    <Bar
                      key={p}
                      dataKey={p}
                      name={PLATFORM_LABEL[p]}
                      fill={SERIES[p]}
                      radius={[0, 4, 4, 0]}
                      maxBarSize={14}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel title="참여도" description={data ? `최근 ${data.days}일` : undefined}>
          <EngagementTable data={data} platforms={shownPlatforms} />
        </Panel>
      </div>

      <Panel
        title="유입 경로"
        description="세션 기준 상위 10개 (source / medium)"
        right={<CalendarDays className="h-4 w-4 text-gray-400" />}
      >
        <SourcesTable data={data} />
      </Panel>
    </div>
  )
}

function EngagementTable({
  data,
  platforms,
}: {
  data: GaDashboard | null
  platforms: Platform[]
}) {
  if (!data) return <p className="text-xs text-gray-400">불러오는 중...</p>
  const rows: { label: string; value: (p: Platform) => string }[] = [
    { label: '활성 사용자', value: (p) => fmt(data.totals[p].activeUsers) },
    { label: '세션', value: (p) => fmt(data.totals[p].sessions) },
    {
      label: '사용자당 세션',
      value: (p) => {
        const t = data.totals[p]
        return t.activeUsers ? (t.sessions / t.activeUsers).toFixed(2) : '-'
      },
    },
    {
      label: '사용자당 참여 시간',
      value: (p) => {
        const t = data.totals[p]
        return t.activeUsers ? formatDuration(t.engagementSeconds / t.activeUsers) : '-'
      },
    },
    {
      label: '참여 세션 비율',
      value: (p) => {
        const t = data.totals[p]
        return t.sessions ? `${Math.round((t.engagedSessions / t.sessions) * 100)}%` : '-'
      },
    },
    { label: '페이지뷰', value: (p) => fmt(data.totals[p].pageViews) },
  ]
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-xs text-gray-500">
          <th className="py-2 text-left font-medium">지표</th>
          {platforms.map((p) => (
            <th key={p} className="py-2 text-right font-medium">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: SERIES[p] }}
                />
                {PLATFORM_LABEL[p]}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label} className="border-b border-gray-100 last:border-0">
            <td className="py-2 text-gray-600">{r.label}</td>
            {platforms.map((p) => (
              <td key={p} className="py-2 text-right font-medium text-gray-900">
                {r.value(p)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function SourcesTable({ data }: { data: GaDashboard | null }) {
  if (!data) return <p className="text-xs text-gray-400">불러오는 중...</p>
  if (!data.sources.length) return <p className="text-xs text-gray-400">데이터가 없습니다.</p>
  const max = Math.max(...data.sources.map((s) => s.sessions), 1)
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-xs text-gray-500">
          <th className="py-2 text-left font-medium">source / medium</th>
          <th className="w-1/3 py-2" aria-hidden />
          <th className="py-2 text-right font-medium">세션</th>
          <th className="py-2 text-right font-medium">사용자</th>
        </tr>
      </thead>
      <tbody>
        {data.sources.map((s) => (
          <tr key={s.sourceMedium} className="border-b border-gray-100 last:border-0">
            <td className="max-w-[12rem] truncate py-2 text-gray-700" title={s.sourceMedium}>
              {s.sourceMedium}
            </td>
            <td className="py-2 pr-3">
              <div
                className="h-2 rounded-r"
                style={{ width: `${(s.sessions / max) * 100}%`, backgroundColor: SERIES.app }}
              />
            </td>
            <td className="py-2 text-right font-medium text-gray-900">{fmt(s.sessions)}</td>
            <td className="py-2 text-right text-gray-600">{fmt(s.activeUsers)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
