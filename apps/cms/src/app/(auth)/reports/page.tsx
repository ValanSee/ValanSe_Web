'use client'

import { useCallback, useEffect, useState } from 'react'
import { Flag, MessageCircle, ThumbsUp } from 'lucide-react'
import { ReportDetailModal } from '@/components/reports/ReportDetailModal'
import { errorMessageOf } from '@/lib/api'
import { categoryLabel } from '@/lib/category'
import { fetchReportedTargets } from '@/lib/reports'
import type { ReportType, ReportedTargetItem } from '@/types/report'

const TYPE_TABS: { value: ReportType; label: string }[] = [
  { value: 'VOTE', label: '투표' },
  { value: 'COMMENT', label: '댓글' },
]

const SORT_TABS: { value: 'latest' | 'popular'; label: string }[] = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '신고 많은순' },
]

const PAGE_SIZE = 20

export default function ReportsPage() {
  const [type, setType] = useState<ReportType>('VOTE')
  const [sort, setSort] = useState<'latest' | 'popular'>('latest')
  const [page, setPage] = useState(0)
  const [reports, setReports] = useState<ReportedTargetItem[]>([])
  const [hasNext, setHasNext] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detailTargetId, setDetailTargetId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchReportedTargets({
        type,
        sort,
        page,
        size: PAGE_SIZE,
      })
      setReports(data.reports)
      setHasNext(data.hasNext)
    } catch (err) {
      setReports([])
      setHasNext(false)
      setError(errorMessageOf(err, '신고 목록을 불러오지 못했습니다.'))
    } finally {
      setLoading(false)
    }
  }, [type, sort, page])

  useEffect(() => {
    load()
  }, [load])

  // 탭·정렬을 바꾸면 첫 페이지부터 다시 본다
  const changeType = (next: ReportType) => {
    setType(next)
    setPage(0)
  }
  const changeSort = (next: 'latest' | 'popular') => {
    setSort(next)
    setPage(0)
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">신고 관리</h1>
          <p className="text-sm text-gray-600">
            신고가 누적된 콘텐츠입니다. 항목을 눌러 신고 사유를 확인하세요.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          새로고침
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {TYPE_TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => changeType(t.value)}
              className={`rounded-md px-3 py-1.5 text-sm transition ${
                type === t.value
                  ? 'bg-white font-medium text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1">
          {SORT_TABS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => changeSort(s.value)}
              className={`rounded-full px-3 py-1 text-sm transition ${
                sort === s.value
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <ul className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
        {reports.length === 0 && !loading && !error && (
          <li className="px-4 py-12 text-center text-sm text-gray-500">
            접수된 신고가 없습니다.
          </li>
        )}
        {reports.map((item) => (
          <li key={`${item.targetType}-${item.targetId}`}>
            <button
              type="button"
              onClick={() => setDetailTargetId(item.targetId)}
              className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-gray-50"
            >
              <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                <Flag className="h-3 w-3" />
                {item.reportCount}
              </span>

              <div className="min-w-0 flex-1">
                {item.vote && (
                  <>
                    <p className="text-xs text-gray-500">
                      {categoryLabel(item.vote.category)} ·{' '}
                      {item.vote.createdAt}
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-gray-900">
                      {item.vote.title}
                    </p>
                    <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        {item.vote.totalVoteCount}
                      </span>
                    </div>
                  </>
                )}

                {item.comment && (
                  <>
                    <p className="text-xs text-gray-500">
                      {item.comment.nickname}
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-gray-900">
                      {item.comment.content}
                    </p>
                    <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        {item.comment.likeCount}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageCircle className="h-3.5 w-3.5" />
                        {item.comment.replyCount}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <span className="shrink-0 self-center text-sm text-gray-400">
                자세히
              </span>
            </button>
          </li>
        ))}
      </ul>

      {(page > 0 || hasNext) && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={page === 0 || loading}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            이전
          </button>
          <span className="text-sm text-gray-600">{page + 1}</span>
          <button
            type="button"
            disabled={!hasNext || loading}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            다음
          </button>
        </div>
      )}

      <ReportDetailModal
        open={detailTargetId !== null}
        type={type}
        targetId={detailTargetId}
        onClose={() => setDetailTargetId(null)}
        onDeleted={load}
      />
    </div>
  )
}
