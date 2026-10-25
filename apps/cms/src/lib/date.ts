/** 서버의 ISO 일시(`2026-10-18T19:00:48.433316`)를 `2026-10-18 19:00` 으로 줄인다 */
export function formatDateTime(value: string): string {
  const m = value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/)
  return m ? `${m[1]} ${m[2]}` : value
}
