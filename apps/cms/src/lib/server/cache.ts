import 'server-only'

const store = new Map<string, { expires: number; value: unknown }>()

/** GA 쿼터 · GCS 다운로드를 아끼려는 인스턴스 메모리 캐시 (서버리스라 인스턴스마다 따로) */
export async function cached<T>(
  key: string,
  ttlMs: number,
  load: () => Promise<T>,
  shouldCache: (value: T) => boolean = () => true,
): Promise<T> {
  const hit = store.get(key)
  if (hit && hit.expires > Date.now()) return hit.value as T
  const value = await load()
  if (shouldCache(value)) store.set(key, { expires: Date.now() + ttlMs, value })
  return value
}
