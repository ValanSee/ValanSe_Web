import 'server-only'

const DAY_MS = 24 * 60 * 60 * 1000

/** 오늘(KST) 기준 offset 일 전 날짜를 YYYY-MM-DD 로. GA 속성 보고 시간대가 KST 라 맞춘다 */
export function kstDate(daysAgo: number): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(
    new Date(Date.now() - daysAgo * DAY_MS),
  )
}

/** start ~ end (YYYY-MM-DD, 양끝 포함) 날짜 목록 */
export function dateList(start: string, end: string): string[] {
  const out: string[] = []
  const d = new Date(`${start}T00:00:00Z`)
  const last = new Date(`${end}T00:00:00Z`)
  while (d <= last) {
    out.push(d.toISOString().slice(0, 10))
    d.setUTCDate(d.getUTCDate() + 1)
  }
  return out
}

export const DASHBOARD_DAYS = [7, 30, 90] as const

export function parseDays(raw: string | null): number {
  const n = Number(raw)
  return (DASHBOARD_DAYS as readonly number[]).includes(n) ? n : 30
}
