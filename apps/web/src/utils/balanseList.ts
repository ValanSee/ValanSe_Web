/**
 * 밸런스 목록(/balanse) 서버 · 클라이언트 공용 규칙.
 * 'use client' 파일에서 export 한 값은 서버 컴포넌트에서 쓸 수 없어 별도 모듈로 둔다.
 */

// 서버 API 커서 형식 (예: `2026-10-18T19:00:41.034111_128`, `12_2026-04-09T04:58:47.689957_79`)
const CURSOR_PATTERN = /^[0-9A-Za-z:._-]{1,80}$/

export function parseBalanseCursor(raw: unknown): string | undefined {
  return typeof raw === 'string' && CURSOR_PATTERN.test(raw) ? raw : undefined
}

/** 서버에서 내려준 초기 데이터를 클라이언트가 재사용할지 판단하는 키 */
export function balanseListKey(
  category: string,
  sort: string,
  cursor?: string,
): string {
  return cursor ? `${category}|${sort}|${cursor}` : `${category}|${sort}`
}

/** 크롤러가 따라갈 다음 페이지 주소 */
export function balanseListHref({
  category,
  sort,
  cursor,
}: {
  category: string
  sort: string
  cursor?: string
}): string {
  const params = new URLSearchParams({ category, sort })
  if (cursor) params.set('cursor', cursor)
  return `/balanse?${params.toString()}`
}
