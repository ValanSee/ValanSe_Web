'use client'

import { useCallback, useEffect, useState } from 'react'
import { Bot, RefreshCw } from 'lucide-react'
import { errorMessageOf } from '@/lib/api'
import { fetchComments } from '@/lib/comments'
import { runContentSeed } from '@/lib/contentSeed'
import { fetchVotes } from '@/lib/votes'
import type { Vote, VoteComment } from '@/types/vote'
import { AiVoteItem } from '@/components/ai-review/AiVoteItem'
import { CommentRow } from '@/components/ai-review/CommentRow'

/**
 * 서버에 검수(승인/반려) API 나 isBot 필터가 없어서
 * 최신 투표를 페이지 단위로 훑으며 클라이언트에서 isBot 으로 거른다.
 */
const SCAN_PAGE_SIZE = 50
/** "더 찾기" 한 번에 훑는 최대 페이지 수 */
const SCAN_MAX_PAGES = 4
/** AI 댓글 탭에서 댓글을 확인할 최신 투표 수 */
const COMMENT_SCAN_VOTES = 30
const COMMENT_SCAN_CONCURRENCY = 5

type Tab = 'votes' | 'comments'
type BotComment = VoteComment & { voteTitle: string }

export default function AiReviewPage() {
  const [tab, setTab] = useState<Tab>('votes')

  const [votes, setVotes] = useState<Vote[]>([])
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [hasNext, setHasNext] = useState(false)
  const [scanned, setScanned] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [botComments, setBotComments] = useState<BotComment[] | null>(null)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentsError, setCommentsError] = useState<string | null>(null)

  const [seedBusy, setSeedBusy] = useState(false)
  const [seedMessage, setSeedMessage] = useState<string | null>(null)

  const scanVotes = useCallback(
    async (next: boolean) => {
      setLoading(true)
      setError(null)
      let c = next ? cursor : undefined
      let more = true
      let scannedCount = 0
      const found: Vote[] = []
      try {
        // 한 페이지에 AI 투표가 없을 수 있어 하나라도 찾을 때까지 몇 페이지 더 본다
        for (let i = 0; i < SCAN_MAX_PAGES && more; i++) {
          const data = await fetchVotes({ size: SCAN_PAGE_SIZE, cursor: c })
          scannedCount += data.votes.length
          found.push(...data.votes.filter((v) => v.isBot))
          more = data.has_next_page
          c = data.next_cursor
          if (found.length > 0) break
        }
        setVotes((prev) => (next ? [...prev, ...found] : found))
        setScanned((prev) => (next ? prev + scannedCount : scannedCount))
        setHasNext(more)
        setCursor(c)
      } catch (err) {
        setError(errorMessageOf(err, '목록을 불러오지 못했습니다.'))
      } finally {
        setLoading(false)
      }
    },
    [cursor],
  )

  const scanComments = useCallback(async () => {
    setCommentsLoading(true)
    setCommentsError(null)
    try {
      const { votes: recent } = await fetchVotes({ size: COMMENT_SCAN_VOTES })
      const result: BotComment[] = []
      for (let i = 0; i < recent.length; i += COMMENT_SCAN_CONCURRENCY) {
        const chunk = recent.slice(i, i + COMMENT_SCAN_CONCURRENCY)
        const pages = await Promise.all(chunk.map((v) => fetchComments(v.id)))
        pages.forEach((page, j) => {
          page.comments
            .filter((cm) => cm.isBot && !cm.deletedAt)
            .forEach((cm) => result.push({ ...cm, voteTitle: chunk[j].title }))
        })
      }
      setBotComments(result)
    } catch (err) {
      setCommentsError(errorMessageOf(err, '댓글을 불러오지 못했습니다.'))
    } finally {
      setCommentsLoading(false)
    }
  }, [])

  useEffect(() => {
    scanVotes(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onTabChange = (next: Tab) => {
    setTab(next)
    // 댓글 스캔은 요청이 많아 탭을 처음 열 때만 한다
    if (next === 'comments' && botComments === null && !commentsLoading) scanComments()
  }

  const onRunSeed = async () => {
    if (seedBusy) return
    if (!window.confirm('AI 콘텐츠 생성을 지금 실행하시겠습니까?')) return
    setSeedBusy(true)
    setSeedMessage(null)
    try {
      const result = await runContentSeed()
      setSeedMessage(
        result === 'started'
          ? '생성을 시작했습니다. 결과는 디스코드 prod-server-alert 채널에서 확인할 수 있습니다. 완료 후 새로고침하세요.'
          : '이미 생성이 실행 중입니다. 잠시 후 다시 확인하세요.',
      )
    } catch (err) {
      setSeedMessage(errorMessageOf(err, '실행에 실패했습니다.'))
    } finally {
      setSeedBusy(false)
    }
  }

  const onRefresh = () => {
    if (tab === 'votes') scanVotes(false)
    else scanComments()
  }

  const onVoteDeleted = (voteId: number) => {
    setVotes((prev) => prev.filter((v) => v.id !== voteId))
  }

  const onBotCommentDeleted = (commentId: number) => {
    setBotComments((prev) => prev?.filter((c) => c.commentId !== commentId) ?? null)
  }

  const busy = tab === 'votes' ? loading : commentsLoading

  const header = (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">AI 콘텐츠 검수</h1>
        <p className="text-sm text-gray-600">
          AI 프로필이 매주 월요일 04:00에 자동 생성한 투표·댓글입니다. 문제가 있는 콘텐츠는
          삭제하세요.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={busy}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          새로고침
        </button>
        <button
          type="button"
          onClick={onRunSeed}
          disabled={seedBusy}
          className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-800 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${seedBusy ? 'animate-spin' : ''}`} />
          지금 생성
        </button>
      </div>
    </header>
  )

  const seedNotice = seedMessage && (
    <p className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-800">{seedMessage}</p>
  )

  const tabs = (
    <div className="flex gap-1 border-b border-gray-200">
      {(
        [
          ['votes', 'AI 투표'],
          ['comments', 'AI 댓글'],
        ] as const
      ).map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => onTabChange(key)}
          className={`-mb-px border-b-2 px-3 py-2 text-sm transition ${
            tab === key
              ? 'border-gray-900 font-medium text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )

  const voteSection = (
    <section className="space-y-2">
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <p className="text-xs text-gray-500">
        최신 투표 {scanned}개 중 AI 투표 {votes.length}개
      </p>
      <ul className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
        {votes.length === 0 && !loading && (
          <li className="px-4 py-12 text-center text-sm text-gray-500">
            AI 투표가 없습니다.
          </li>
        )}
        {votes.map((v) => (
          <AiVoteItem key={v.id} vote={v} onDeleted={onVoteDeleted} />
        ))}
      </ul>
      {loading && <p className="py-4 text-center text-xs text-gray-500">불러오는 중...</p>}
      {hasNext && !loading && (
        <button
          type="button"
          onClick={() => scanVotes(true)}
          className="w-full rounded-md border border-gray-300 bg-white py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          이전 투표에서 더 찾기
        </button>
      )}
    </section>
  )

  const commentSection = (
    <section className="space-y-2">
      {commentsError && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{commentsError}</p>
      )}
      <p className="text-xs text-gray-500">
        최신 투표 {COMMENT_SCAN_VOTES}개에 달린 댓글 중 AI 댓글
        {botComments ? ` ${botComments.length}개` : ''}
      </p>
      {commentsLoading ? (
        <p className="py-4 text-center text-xs text-gray-500">불러오는 중...</p>
      ) : (
        <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white px-4">
          {botComments?.length === 0 && (
            <li className="py-12 text-center text-sm text-gray-500">AI 댓글이 없습니다.</li>
          )}
          {botComments?.map((c) => (
            <CommentRow
              key={c.commentId}
              comment={c}
              voteTitle={c.voteTitle}
              onDeleted={onBotCommentDeleted}
            />
          ))}
        </ul>
      )}
    </section>
  )

  return (
    <div className="space-y-4">
      {header}
      {seedNotice}
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <Bot className="h-3.5 w-3.5" />
        서버에 사전 승인 기능이 없어 이미 게시된 콘텐츠를 사후 검수합니다.
      </div>
      {tabs}
      {tab === 'votes' ? voteSection : commentSection}
    </div>
  )
}
