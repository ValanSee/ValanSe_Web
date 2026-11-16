'use client'

import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Users, UserCheck, UserX, Activity } from 'lucide-react'
import { fetchMau } from '@/lib/analytics'
import type { MauResponse } from '@/types/analytics'
import { Notice, StatCard } from './parts'

const START_YEAR = 2026
const START_MONTH = 6

function getNow() {
  const d = new Date()
  return { year: d.getFullYear(), month: d.getMonth() + 1 }
}

function availableYears(): number[] {
  const now = getNow()
  const ys: number[] = []
  for (let y = START_YEAR; y <= now.year; y++) ys.push(y)
  return ys
}

function availableMonths(year: number): number[] {
  const now = getNow()
  const min = year === START_YEAR ? START_MONTH : 1
  const max = year === now.year ? now.month : 12
  const ms: number[] = []
  for (let m = min; m <= max; m++) ms.push(m)
  return ms
}

function toYearMonth(year: number, month: number) {
  return `${year}-${String(month).padStart(2, '0')}`
}

const SELECT_CLS =
  'rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900'

/** 서버 집계 월별 MAU (로그인 · 비로그인 · 탈퇴) */
export default function MauSection() {
  const now = getNow()
  const [year, setYear] = useState(now.year)
  const [month, setMonth] = useState(now.month)
  const [data, setData] = useState<MauResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const yearMonth = toYearMonth(year, month)
  const isStartMonth = year === START_YEAR && month === START_MONTH

  const load = useCallback(async (ym: string) => {
    setLoading(true)
    setError(null)
    try {
      setData(await fetchMau(ym))
    } catch (err) {
      setData(null)
      const body = axios.isAxiosError(err)
        ? (err.response?.data as { error?: string; message?: string } | undefined)
        : undefined
      setError(
        body?.error ??
          body?.message ??
          (err instanceof Error ? err.message : 'MAU 데이터를 불러오지 못했습니다.'),
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load(yearMonth)
  }, [yearMonth, load])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">월별 MAU (서버 집계)</h2>
          <p className="text-xs text-gray-500">로그인 · 비로그인 · 탈퇴 사용자 기준</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={year}
            onChange={(e) => {
              const y = Number(e.target.value)
              setYear(y)
              const months = availableMonths(y)
              if (!months.includes(month)) setMonth(months[months.length - 1])
            }}
            className={SELECT_CLS}
          >
            {availableYears().map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className={SELECT_CLS}
          >
            {availableMonths(year).map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
        </div>
      </div>

      {isStartMonth && (
        <Notice tone="warn">
          2026년 6월 중에 집계를 시작했기 때문에 해당 월의 데이터는 정확하지 않을 수 있습니다.
        </Notice>
      )}
      {error && <Notice tone="error">{error}</Notice>}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="총 MAU"
          value={data?.totalMau}
          loading={loading}
          icon={<Activity className="h-4 w-4 text-gray-700" />}
          accent="bg-gray-50 border-gray-200"
        />
        <StatCard
          label="로그인 사용자"
          value={data?.loginMau}
          loading={loading}
          icon={<UserCheck className="h-4 w-4 text-blue-600" />}
          accent="bg-blue-50 border-blue-200"
        />
        <StatCard
          label="비로그인 사용자"
          value={data?.anonymousMau}
          loading={loading}
          icon={<Users className="h-4 w-4 text-emerald-600" />}
          accent="bg-emerald-50 border-emerald-200"
        />
        <StatCard
          label="탈퇴한 사용자"
          value={data?.withdrawnMau}
          loading={loading}
          icon={<UserX className="h-4 w-4 text-rose-600" />}
          accent="bg-rose-50 border-rose-200"
        />
      </section>

      {data && <p className="text-xs text-gray-500">집계 기준: {data.yearMonth}</p>}
    </div>
  )
}
