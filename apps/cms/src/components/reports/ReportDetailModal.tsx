'use client'

import { useCallback, useEffect, useState } from 'react'
import { ExternalLink, Trash2, X } from 'lucide-react'
import { errorMessageOf } from '@/lib/api'
import { categoryLabel } from '@/lib/category'
import { deleteComment } from '@/lib/comments'
import { fetchReportDetail } from '@/lib/reports'
import { deleteVote } from '@/lib/votes'
import {
  REPORT_REASON_LABEL,
  type ReportDetail,
  type ReportType,
} from '@/types/report'

type Props = {
  open: boolean
  type: ReportType
  targetId: number | null
  onClose: () => void
  /** 삭제 성공 시 목록을 다시 불러오기 위한 콜백 */
  onDeleted: () => void
}

const WEB_ORIGIN = process.env.NEXT_PUBLIC_WEB_ORIGIN

export function ReportDetailModal({
  open,
  type,
  targetId,
  onClose,
  onDeleted,
}: Props) {
  const [detail, setDetail] = useState<ReportDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (targetId == null) return
    setLoading(true)
    setError(null)
    try {
      setDetail(await fetchReportDetail(type, targetId))
    } catch (err) {
      setDetail(null)
      setError(errorMessageOf(err, '신고 상세를 불러오지 못했습니다.'))
    } finally {
      setLoading(false)
    }
  }, [type, targetId])

  useEffect(() => {
    if (!open) return
    load()
  }, [open, load])

  if (!open) return null

  const onDelete = async () => {
    if (busy || targetId == null) return
    const label = type === 'VOTE' ? '투표' : '댓글'
    if (!window.confirm(`이 ${label}을 삭제하시겠습니까?`)) return
    setBusy(true)
    setError(null)
    try {
      if (type === 'VOTE') await deleteVote(targetId)
      else await deleteComment(targetId)
      onDeleted()
      onClose()
    } catch (err) {
      setError(errorMessageOf(err, '삭제에 실패했습니다.'))
    } finally {
      setBusy(false)
    }
  }

  // 댓글 신고도 응답에 voteId 가 있어 웹 상세로 이동할 수 있다
  const webVoteId = detail?.vote?.voteId ?? detail?.comment?.voteId ?? null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-xl bg-white shadow-xl"
      >
        <header className="flex items-start justify-between border-b border-gray-200 px-6 py-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900">
              {type === 'VOTE' ? '신고된 투표' : '신고된 댓글'}
            </h2>
            {detail && (
              <p className="mt-0.5 text-sm text-gray-600">
                신고 {detail.reportCount}건
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          {loading && <p className="text-sm text-gray-500">불러오는 중...</p>}

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          {detail?.vote && (
            <section className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs text-gray-500">
                {categoryLabel(detail.vote.category)} · 참여{' '}
                {detail.vote.totalVoteCount}
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {detail.vote.title}
              </p>
              {detail.vote.content && (
                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                  {detail.vote.content}
                </p>
              )}
            </section>
          )}

          {detail?.comment && (
            <section className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs text-gray-500">
                {detail.comment.nickname} · 좋아요 {detail.comment.likeCount} ·
                대댓글 {detail.comment.replyCount}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900">
                {detail.comment.content}
              </p>
            </section>
          )}

          {detail && (
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">신고 내역</h3>
              {detail.reports.length === 0 ? (
                <p className="text-sm text-gray-500">신고 내역이 없습니다.</p>
              ) : (
                <ul className="space-y-2">
                  {detail.reports.map((r) => (
                    <li
                      key={r.reportId}
                      className="rounded-lg border border-gray-200 p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium text-gray-900">
                          {r.reporterNickname}
                        </span>
                        <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                          {REPORT_REASON_LABEL[r.reason] ?? r.reasonDescription}
                        </span>
                      </div>
                      {r.content && (
                        <p className="mt-1.5 whitespace-pre-wrap text-sm text-gray-700">
                          {r.content}
                        </p>
                      )}
                      <p className="mt-1.5 text-xs text-gray-500">
                        {r.reportedAt}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>

        <footer className="flex items-center justify-between gap-2 border-t border-gray-200 px-6 py-4">
          {WEB_ORIGIN && webVoteId != null ? (
            <a
              href={`${WEB_ORIGIN}/poll/${webVoteId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <ExternalLink className="h-4 w-4" />
              웹에서 보기
            </a>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              닫기
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={busy || loading || !detail}
              className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {busy ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
