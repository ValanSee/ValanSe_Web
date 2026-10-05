export type ServerFetchResult<T> =
  | { status: 'ok'; data: T }
  | { status: 'not-found' }
  | { status: 'error' }

const DEFAULT_REVALIDATE_SECONDS = 60
const DEFAULT_TIMEOUT_MS = 3000

/**
 * SSR·metadata 용 공개 API 조회 (비로그인, Next fetch 캐시 사용).
 * 실패해도 throw 하지 않고 status 로 돌려줘 호출부가 클라이언트 조회로 대체할 수 있게 함.
 */
export async function serverGetJson<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
  {
    revalidate = DEFAULT_REVALIDATE_SECONDS,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = {},
): Promise<ServerFetchResult<T>> {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL ?? '').replace(/\/+$/, '')
  if (!baseUrl) {
    console.error('[server fetch] NEXT_PUBLIC_BASE_URL 미설정 — 서버 조회 생략')
    return { status: 'error' }
  }

  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== '') query.set(key, String(value))
  }
  const url = `${baseUrl}${path}${query.size ? `?${query}` : ''}`

  try {
    const res = await fetch(url, {
      next: { revalidate },
      signal: AbortSignal.timeout(timeoutMs),
    })
    if (res.status === 404) return { status: 'not-found' }
    if (!res.ok) {
      console.error(`[server fetch] GET ${path} ${res.status}`)
      return { status: 'error' }
    }
    return { status: 'ok', data: (await res.json()) as T }
  } catch (error) {
    console.error(`[server fetch] GET ${path} 실패`, error)
    return { status: 'error' }
  }
}
