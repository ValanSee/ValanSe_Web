'use client'

import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { RefreshCw } from 'lucide-react'
import { clsx } from 'clsx'
import { fetchGaDashboard, fetchInstalls } from '@/lib/dashboard'
import type { GaDashboard, InstallsDashboard } from '@/types/dashboard'
import GaSection from '@/components/analytics/GaSection'
import InstallsSection from '@/components/analytics/InstallsSection'
import MauSection from '@/components/analytics/MauSection'

const DAY_OPTIONS = [7, 30, 90] as const

function messageOf(err: unknown, fallback: string) {
  if (axios.isAxiosError(err)) {
    const body = err.response?.data as { message?: string } | undefined
    return body?.message ?? err.message
  }
  return err instanceof Error ? err.message : fallback
}

export default function AnalyticsPage() {
  const [days, setDays] = useState<number>(30)
  const [ga, setGa] = useState<GaDashboard | null>(null)
  const [gaError, setGaError] = useState<string | null>(null)
  const [installs, setInstalls] = useState<InstallsDashboard | null>(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async (d: number) => {
    setLoading(true)
    setGaError(null)
    const [gaRes, installsRes] = await Promise.allSettled([
      fetchGaDashboard(d),
      fetchInstalls(d),
    ])
    if (gaRes.status === 'fulfilled') setGa(gaRes.value)
    else {
      setGa(null)
      setGaError(messageOf(gaRes.reason, 'GA 데이터를 불러오지 못했습니다.'))
    }
    setInstalls(
      installsRes.status === 'fulfilled'
        ? installsRes.value
        : {
            status: 'unavailable',
            reason: 'error',
            message: messageOf(installsRes.reason, '설치 데이터를 불러오지 못했습니다.'),
          },
    )
    setLoading(false)
  }, [])

  useEffect(() => {
    load(days)
  }, [days, load])

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">통계</h1>
          <p className="text-sm text-gray-600">앱 · 웹 사용 현황, 앱 설치, 월별 MAU</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-gray-300 bg-white p-0.5" role="group">
            {DAY_OPTIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                aria-pressed={days === d}
                className={clsx(
                  'rounded px-3 py-1 text-sm',
                  days === d ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100',
                )}
              >
                {d}일
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => load(days)}
            disabled={loading}
            aria-label="새로고침"
            className="rounded-md border border-gray-300 bg-white p-1.5 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw className={clsx('h-4 w-4', loading && 'animate-spin')} />
          </button>
        </div>
      </header>

      <GaSection data={ga} loading={loading && !ga} error={gaError} />
      <InstallsSection data={installs} loading={loading && !installs} />
      <MauSection />
    </div>
  )
}
