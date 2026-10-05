import { cache } from 'react'

export interface PollOption {
  optionId: number
  content: string
  imageUrl: string | null
  voteCount: number
  label: string
}

export interface PollDetail {
  voteId: number
  title: string
  content: string | null
  category: string
  creatorNickname: string
  creatorTitle: string | null
  createdAt: string
  totalVoteCount: number
  options: PollOption[]
  hasVoted: boolean
  votedOptionLabel: string | null
}

export type PollDetailResult =
  | { status: 'ok'; data: PollDetail }
  | { status: 'not-found' }
  | { status: 'error' }

const REVALIDATE_SECONDS = 60
const TIMEOUT_MS = 3000

/**
 * SSR·metadata 용 상세 조회 (비로그인). `GET /votes/{id}` 는 토큰 없이도 200.
 * 같은 요청 안의 generateMetadata 와 page 가 공유하도록 cache 로 감쌈.
 */
export const fetchPollDetailForServer = cache(
  async (id: string): Promise<PollDetailResult> => {
    if (!/^\d+$/.test(id)) return { status: 'not-found' }

    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL ?? '').replace(/\/+$/, '')
    if (!baseUrl) {
      console.error('[poll SSR] NEXT_PUBLIC_BASE_URL 미설정 — 서버 조회 생략')
      return { status: 'error' }
    }

    try {
      const res = await fetch(`${baseUrl}/votes/${id}`, {
        next: { revalidate: REVALIDATE_SECONDS },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      })
      if (res.status === 404) return { status: 'not-found' }
      if (!res.ok) {
        console.error(`[poll SSR] GET /votes/${id} ${res.status}`)
        return { status: 'error' }
      }
      return { status: 'ok', data: (await res.json()) as PollDetail }
    } catch (error) {
      console.error(`[poll SSR] GET /votes/${id} 실패`, error)
      return { status: 'error' }
    }
  },
)
