const STORAGE_KEY = 'valanse_anonymous_id'

function generate(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `anon-${crypto.randomUUID()}`
  }
  // 폴백: timestamp + random
  return `anon-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function getOrCreateAnonymousId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY)
    if (existing) return existing
    const fresh = generate()
    window.localStorage.setItem(STORAGE_KEY, fresh)
    return fresh
  } catch {
    return null
  }
}
