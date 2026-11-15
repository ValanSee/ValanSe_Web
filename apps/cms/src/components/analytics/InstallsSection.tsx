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
import { Download, PackageMinus, PackagePlus, Smartphone } from 'lucide-react'
import type { InstallsDashboard } from '@/types/dashboard'
import { AXIS_TICK, GRID_STROKE, NEGATIVE, SINGLE, shortDate } from './chartTheme'
import { ChartTooltip, Legend, Notice, Panel, StatCard } from './parts'

export default function InstallsSection({
  data,
  loading,
}: {
  data: InstallsDashboard | null
  loading: boolean
}) {
  const ok = data?.status === 'ok' ? data : null
  const sumInstalls = ok?.daily.reduce((s, d) => s + d.installs, 0) ?? 0
  const sumUninstalls = ok?.daily.reduce((s, d) => s + d.uninstalls, 0) ?? 0

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-gray-900">앱 설치 (Google Play)</h2>
        {ok?.latest && (
          <p className="text-xs text-gray-500">
            마지막 집계일 {ok.latest.date} · Play 리포트는 최대 일주일 늦게 반영
          </p>
        )}
      </div>

      {data?.status === 'unavailable' && (
        <Notice tone={data.reason === 'error' ? 'error' : 'warn'}>{data.message}</Notice>
      )}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="누적 설치"
          value={ok?.cumulativeInstalls}
          sub={ok?.since ? `${ok.since} 이후 · 재설치 포함` : undefined}
          loading={loading}
          icon={<Download className="h-4 w-4 text-gray-700" />}
        />
        <StatCard
          label="현재 설치된 기기"
          value={ok?.latest?.activeDevices}
          loading={loading}
          icon={<Smartphone className="h-4 w-4" style={{ color: SINGLE }} />}
        />
        <StatCard
          label="기간 내 설치"
          value={sumInstalls}
          sub={ok ? `최근 ${ok.days}일 · 설치 이벤트` : undefined}
          loading={loading}
          icon={<PackagePlus className="h-4 w-4" style={{ color: SINGLE }} />}
        />
        <StatCard
          label="기간 내 삭제"
          value={sumUninstalls}
          sub={ok ? `최근 ${ok.days}일 · 삭제 이벤트` : undefined}
          loading={loading}
          icon={<PackageMinus className="h-4 w-4" style={{ color: NEGATIVE }} />}
        />
      </section>

      {ok && ok.daily.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel
            title="일별 설치 · 삭제"
            description="설치 · 삭제 이벤트 수 (재설치 포함)"
            right={
              <Legend
                items={[
                  { label: '설치', color: SINGLE },
                  { label: '삭제', color: NEGATIVE },
                ]}
              />
            }
          >
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ok.daily} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barGap={2}>
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
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f3f4f6' }} />
                  <Bar dataKey="installs" name="설치" fill={SINGLE} radius={[4, 4, 0, 0]} maxBarSize={12} />
                  <Bar dataKey="uninstalls" name="삭제" fill={NEGATIVE} radius={[4, 4, 0, 0]} maxBarSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="설치된 기기 수" description="Active Device Installs">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ok.daily} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
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
                  <Line
                    type="monotone"
                    dataKey="activeDevices"
                    name="설치된 기기"
                    stroke={SINGLE}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 2, stroke: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      )}

      {ok && ok.daily.length === 0 && (
        <Notice>선택한 기간의 Play 리포트가 아직 없습니다.</Notice>
      )}
    </div>
  )
}
