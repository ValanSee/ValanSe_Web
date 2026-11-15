import type { InstallsDay } from '../types/dashboard'

/** Play Console 설치 통계 CSV 는 UTF-16LE(BOM) 이다 */
export function decodeCsv(buf: Uint8Array): string {
  if (buf[0] === 0xff && buf[1] === 0xfe) {
    return new TextDecoder('utf-16le').decode(buf.subarray(2))
  }
  return new TextDecoder('utf-8').decode(buf).replace(/^﻿/, '')
}

/**
 * overview CSV 에서 쓰는 열.
 * Daily Device · User Installs, Total User Installs 는 Google 이 0 으로만 채워 쓰지 않는다
 */
const COLUMNS = {
  date: 'Date',
  installs: 'Install events',
  uninstalls: 'Uninstall events',
  activeDevices: 'Active Device Installs',
} as const

export function parseOverview(csv: string): InstallsDay[] {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim())
  if (lines.length < 2) return []
  const header = lines[0].split(',').map((h) => h.trim())
  const col = Object.fromEntries(
    Object.entries(COLUMNS).map(([k, name]) => [k, header.indexOf(name)]),
  ) as Record<keyof typeof COLUMNS, number>

  return lines.slice(1).map((line) => {
    const cells = line.split(',')
    const n = (i: number) => (i < 0 ? 0 : Number(cells[i]) || 0)
    return {
      date: cells[col.date]?.trim() ?? '',
      installs: n(col.installs),
      uninstalls: n(col.uninstalls),
      activeDevices: n(col.activeDevices),
    }
  })
}

/** 월별 overview 를 합쳐 기간 일별 · 누적 설치를 만든다 */
export function summarize(all: InstallsDay[], startDate: string) {
  const sorted = [...all]
    .filter((d) => d.date)
    .sort((a, b) => a.date.localeCompare(b.date))
  const daily = sorted.filter((d) => d.date >= startDate)
  return {
    daily,
    latest: sorted.at(-1) ?? null,
    cumulativeInstalls: sorted.reduce((s, d) => s + d.installs, 0),
    since: sorted[0]?.date ?? null,
  }
}

export const OVERVIEW_FILE = /_(\d{6})_overview\.csv$/
