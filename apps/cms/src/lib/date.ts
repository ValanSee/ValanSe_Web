const KST_FORMAT = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

/**
 * 서버 일시를 한국 시간 `2026-10-19 04:00` 으로 바꾼다.
 * 서버는 UTC 를 오프셋 없이(`2026-10-18T19:00:48.433316`) 내려주므로 Z 를 붙여 UTC 로 읽는다.
 */
export function formatDateTime(value: string): string {
  const hasOffset = /(Z|[+-]\d{2}:?\d{2})$/.test(value)
  const date = new Date(hasOffset ? value : `${value}Z`)
  return Number.isNaN(date.getTime()) ? value : KST_FORMAT.format(date)
}
