// 서버 시각은 예전엔 타임존 없는 UTC(`2026-09-06T19:01:03`)·날짜만(`2026-10-25`),
// 지금은 `+09:00` 이 붙어 내려온다. 두 형식 모두 같은 시점으로 읽는다.
const HAS_OFFSET = /(Z|[+-]\d{2}:?\d{2})$/i
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

export const parseServerDate = (value: Date | string): Date => {
  if (value instanceof Date) return value
  if (DATE_ONLY.test(value) || HAS_OFFSET.test(value)) return new Date(value)
  // 타임존 없는 값은 UTC. 소수초 6자리는 일부 브라우저가 못 읽어 3자리로 자른다.
  return new Date(`${value.replace(/(\.\d{3})\d+/, '$1')}Z`)
}

const kstDateFormat = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

// KST 기준 YYYY-MM-DD. 날짜만 온 값은 그대로 둔다.
export const formatKstDate = (value: string): string => {
  if (DATE_ONLY.test(value)) return value
  const date = parseServerDate(value)
  return Number.isNaN(date.getTime()) ? value : kstDateFormat.format(date)
}
