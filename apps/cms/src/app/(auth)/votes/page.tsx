'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchVotes, fetchHotPinned, fetchTrendingPinned } from '@/lib/votes'
import type { Vote, PinnedVote } from '@/types/vote'
import { PinMenu } from '@/components/votes/PinMenu'
import { ThumbsUp, MessageCircle, Flame, TrendingUp } from 'lucide-react'
import axios from 'axios'

const CATEGORY_LABEL: Record<string, string> = {
  FOOD: '음식',
  LOVE: '연애',
  ETC: '기타',
  ALL: '전체',
}

const PAGE_SIZE = 20

export default function VotesPage() {
  const [votes, setVotes] = useState<Vote[]>([])
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [hasNext, setHasNext] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hot, setHot] = useState<PinnedVote | null>(null)
  const [trending, setTrending] = useState<PinnedVote | null>(null)
  const [pinnedLoading, setPinnedLoading] = useState(true)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const loadPinned = useCallback(async () => {
    setPinnedLoading(true)
    try {
      const [h, t] = await Promise.all([fetchHotPinned(), fetchTrendingPinned()])
      setHot(h)
      setTrending(t)
    } catch (err) {
      console.error('failed to load pinned:', err)
    } finally {
      setPinnedLoading(false)
    }
  }, [])

  const load = useCallback(async (next: boolean) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchVotes({
        size: PAGE_SIZE,
        cursor: next ? cursor : undefined,
      })
      setVotes((prev) => (next ? [...prev, ...data.votes] : data.votes))
      setHasNext(data.has_next_page)
      setCursor(data.next_cursor)
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? ((err.response?.data as { error?: string; message?: string } | undefined)
            ?.error ??
          (err.response?.data as { error?: string; message?: string } | undefined)
            ?.message ??
          err.message)
        : err instanceof Error
          ? err.message
          : '목록을 불러오지 못했습니다.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [cursor])

  useEffect(() => {
    load(false)
    loadPinned()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasNext || loading) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) load(true)
      },
      { threshold: 0.1 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasNext, loading, load])

  const onPinChanged = () => {
    load(false)
    loadPinned()
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">투표 관리</h1>
          <p className="text-sm text-gray-600">각 투표의 ⋮ 메뉴로 고정/해제할 수 있습니다.</p>
        </div>
        <button
          type="button"
          onClick={() => load(false)}
          disabled={loading}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          새로고침
        </button>
      </header>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-700">현재 고정</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <PinnedCard
            label="핫이슈"
            tone="orange"
            icon={<Flame className="h-4 w-4 text-orange-500" />}
            vote={hot}
            loading={pinnedLoading}
            onChange={onPinChanged}
          />
          <PinnedCard
            label="인기 급상승"
            tone="blue"
            icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
            vote={trending}
            loading={pinnedLoading}
            onChange={onPinChanged}
          />
        </div>
      </section>

      <h2 className="text-sm font-semibold text-gray-700 pt-2">전체 투표</h2>
      <ul className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
        {votes.length === 0 && !loading && (
          <li className="px-4 py-12 text-center text-sm text-gray-500">투표가 없습니다.</li>
        )}
        {votes.map((v) => (
          <li key={v.id} className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                  {CATEGORY_LABEL[v.category] ?? v.category}
                </span>
                <span className="truncate text-xs text-gray-500">
                  {v.nickname} · {v.created_at}
                </span>
              </div>
              <p className="mt-1 truncate text-sm font-medium text-gray-900">{v.title}</p>
              <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  {v.total_vote_count}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {v.total_comment_count}
                </span>
              </div>
            </div>
            <PinMenu voteId={v.id} onChange={onPinChanged} />
          </li>
        ))}
      </ul>

      {hasNext && (
        <div ref={sentinelRef} className="py-4 text-center text-xs text-gray-500">
          {loading ? '불러오는 중...' : ''}
        </div>
      )}
    </div>
  )
}

function PinnedCard({
  label,
  tone,
  icon,
  vote,
  loading,
  onChange,
}: {
  label: string
  tone: 'orange' | 'blue'
  icon: React.ReactNode
  vote: PinnedVote | null
  loading: boolean
  onChange: () => void
}) {
  const ring = tone === 'orange' ? 'border-orange-200' : 'border-blue-200'
  const bg = tone === 'orange' ? 'bg-orange-50' : 'bg-blue-50'
  return (
    <div className={`flex items-start gap-3 rounded-lg border ${ring} ${bg} p-3`}>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
          {icon}
          {label}
        </div>
        {loading ? (
          <p className="mt-1 text-sm text-gray-500">불러오는 중...</p>
        ) : !vote ? (
          <p className="mt-1 text-sm text-gray-500">고정된 투표가 없습니다.</p>
        ) : (
          <>
            <p className="mt-1 truncate text-sm font-medium text-gray-900">
              {vote.title}
            </p>
            <p className="mt-0.5 truncate text-xs text-gray-500">
              {vote.createdBy} · {vote.createdAt}
            </p>
          </>
        )}
      </div>
      {vote && <PinMenu voteId={vote.voteId} onChange={onChange} />}
    </div>
  )
}
