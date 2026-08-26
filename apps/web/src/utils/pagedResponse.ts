/**
 * 목록 API 응답 형태 과도기 대응 유틸.
 *
 * 서버가 목록 응답을 배열에서 페이지 엔벨로프로 전환하는 중이다.
 *
 * - 배열:     `[{...}, {...}]`
 * - 엔벨로프: `{ votes: [...], page, size, hasNext }`
 *
 * 서버 `dev`에는 엔벨로프가 적용됐지만 `main`에는 아직 배열이라,
 * 동일한 프론트 코드가 두 환경 모두에서 동작해야 한다.
 * 서버 전환이 모든 환경에 끝나면 이 유틸을 제거하고 엔벨로프 타입만 남긴다.
 */

/** 페이지 엔벨로프 공통 메타 (서버 PaginationValidator 기준) */
export type PageMeta = {
  page: number
  size: number
  hasNext: boolean
}

/** 서버가 허용하는 최대 page size. 초과 시 400을 반환한다. */
export const MAX_PAGE_SIZE = 50

/**
 * 배열 또는 페이지 엔벨로프를 항상 배열로 정규화한다.
 *
 * @param data 응답 본문 (배열 또는 엔벨로프)
 * @param key  엔벨로프 안에서 목록이 담긴 키 (예: `votes`, `comments`)
 */
export function unwrapList<T>(data: unknown, key: string): T[] {
  if (Array.isArray(data)) return data as T[]

  if (data !== null && typeof data === 'object') {
    const items = (data as Record<string, unknown>)[key]
    if (Array.isArray(items)) return items as T[]
  }

  // 예상 밖의 형태는 빈 목록으로 처리한다.
  // 배열을 가정한 컴포넌트에서 `.map is not a function`으로 터지는 것보다,
  // 빈 상태 문구를 보여주는 편이 낫다.
  return []
}
