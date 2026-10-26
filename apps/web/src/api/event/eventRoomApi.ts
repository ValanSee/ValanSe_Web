import type {
  EventHostAction,
  EventHostState,
  EventPublicState,
} from '@/lib/event/types'

/**
 * 행사 방 API 클라이언트. 같은 Next 앱의 Route Handler(/api/event/*)를 부르므로
 * 백엔드용 axios 인스턴스가 아니라 fetch 를 그대로 쓴다.
 */

export class EventApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    cache: 'no-store',
  })
  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) {
    throw new EventApiError(res.status, data.error ?? '요청에 실패했어요')
  }
  return data
}

const base = (code: string) => `/api/event/rooms/${encodeURIComponent(code)}`

export function fetchPublicState(code: string, pid: string | null) {
  const q = pid ? `?pid=${encodeURIComponent(pid)}` : ''
  return request<EventPublicState>(`${base(code)}${q}`)
}

export function joinEventRoom(code: string, pid: string, nickname: string) {
  return request<{ ok: true }>(`${base(code)}/join`, {
    method: 'POST',
    body: JSON.stringify({ pid, nickname }),
  })
}

export function castEventVote(
  code: string,
  pid: string,
  questionIndex: number,
  label: string,
) {
  return request<{ ok: true }>(`${base(code)}/vote`, {
    method: 'POST',
    body: JSON.stringify({ pid, questionIndex, label }),
  })
}

export function fetchHostState(code: string, hostKey: string) {
  return request<EventHostState>(base(code), {
    headers: { 'x-host-key': hostKey },
  })
}

export function sendHostAction(
  code: string,
  hostKey: string,
  action: EventHostAction,
) {
  return request<EventHostState>(`${base(code)}/host`, {
    method: 'POST',
    headers: { 'x-host-key': hostKey },
    body: JSON.stringify({ action }),
  })
}
