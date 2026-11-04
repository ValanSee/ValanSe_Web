'use client'

import { useCallback, useEffect, useState } from 'react'
import { Bot, MessageSquarePlus, RefreshCw } from 'lucide-react'
import { errorMessageOf } from '@/lib/api'
import { fetchAdminComments } from '@/lib/comments'
import { runCommentSeed, runContentSeed } from '@/lib/contentSeed'
import { fetchVotes } from '@/lib/votes'
import type { AdminComment, Vote } from '@/types/vote'
import { AiVoteItem } from '@/components/ai-review/AiVoteItem'
import { CommentRow } from '@/components/ai-review/CommentRow'

/** 서버에 사전 승인 API 가 없어 이미 게시된 AI 콘텐츠를 isBot 필터로 모아 사후 검수한다 */
const VOTE_PAGE_SIZE = 20
const COMMENT_PAGE_SIZE = 30

type Tab = 'votes' | 'comments'
/** all: 새 투표 생성 + AI 투표·댓글, comments: 기존 투표에 AI 투표·댓글만 */
type SeedKind = 'all' | 'comments'

const SEED_CONFIRM: Record<SeedKind, string> = {
  all: 'AI 콘텐츠 생성을 지금 실행하시겠습니까?',
  comments: '새 투표 없이 기존 투표에 AI 투표·댓글만 지금 생성하시겠습니까?',
}

export default function AiReviewPage() {
  const [tab, setTab] = useState<Tab>('votes')

  const [votes, setVotes] = useState<Vote[]>([])
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [hasNext, setHasNext] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [botComments, setBotComments] = useState<AdminComment[] | null>(null)
  const [commentPage, setCommentPage] = useState(0)
  const [commentsHasNext, setCommentsHasNext] = useState(false)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentsError, setCommentsError] = useState<string | null>(null)

  const [seedBusy, setSeedBusy] = useState<SeedKind | null>(null)
  const [seedMessage, setSeedMessage] = useState<string | null>(null)

  const loadVotes = useCallback(
    async (next: boolean) => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchVotes({
          isBot: true,
          size: VOTE_PAGE_SIZE,
          cursor: next ? cursor : undefined,
        })
        setVotes((prev) => (next ? [...prev, ...data.votes] : data.votes))
        setHasNext(data.has_next_page)
        setCursor(data.next_cursor)
      } catch (err) {
        setError(errorMessageOf(err, '목록을 불러오지 못했습니다.'))
      } finally {
        setLoading(false)
      }
    },
    [cursor],
  )

  const loadComments = useCallback(
    async (next: boolean) => {
      setCommentsLoading(true)
      setCommentsError(null)
      const page = next ? commentPage + 1 : 0
      try {
        const data = await fetchAdminComments({
          isBot: true,
          page,
          size: COMMENT_PAGE_SIZE,
        })
        // 삭제·신규 댓글로 페이지 경계가 밀리면 같은 댓글이 다시 올 수 있다
        setBotComments((prev) => {
          if (!next || !prev) return data.comments
          const seen = new Set(prev.map((c) => c.commentId))
          return [
            ...prev,
            ...data.comments.filter((c) => !seen.has(c.commentId)),
          ]
        })
        setCommentPage(page)
        setCommentsHasNext(data.hasNext)
      } catch (err) {
        setCommentsError(errorMessageOf(err, '댓글을 불러오지 못했습니다.'))
      } finally {
        setCommentsLoading(false)
      }
    },
    [commentPage],
  )

  useEffect(() => {
    loadVotes(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onTabChange = (next: Tab) => {
    setTab(next)
    // 댓글 목록은 탭을 처음 열 때만 불러온다
    if (next === 'comments' && botComments === null && !commentsLoading)
      loadComments(false)
  }

  const onRunSeed = async (kind: SeedKind) => {
    if (seedBusy) return
    if (!window.confirm(SEED_CONFIRM[kind])) return
    setSeedBusy(kind)
    setSeedMessage(null)
    try {
      const result = await (kind === 'all'
        ? runContentSeed()
        : runCommentSeed())
      setSeedMessage(
        result === 'started'
          ? '생성을 시작했습니다. 결과는 디스코드 prod-server-alert 채널에서 확인할 수 있습니다. 완료 후 새로고침하세요.'
          : '이미 생성이 실행 중입니다. 잠시 후 다시 확인하세요.',
      )
    } catch (err) {
      setSeedMessage(errorMessageOf(err, '실행에 실패했습니다.'))
    } finally {
      setSeedBusy(null)
    }
  }

  const onRefresh = () => {
    if (tab === 'votes') loadVotes(false)
    else loadComments(false)
  }

  const onVoteDeleted = (voteId: number) => {
    setVotes((prev) => prev.filter((v) => v.id !== voteId))
  }

  const onBotCommentDeleted = (commentId: number) => {
    setBotComments(
      (prev) => prev?.filter((c) => c.commentId !== commentId) ?? null,
    )
  }

  const busy = tab === 'votes' ? loading : commentsLoading

  const header = (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">AI 콘텐츠 검수</h1>
        <p className="text-sm text-gray-600">
          AI 프로필이 매주 월요일 04:00에 자동 생성한 투표·댓글입니다. 문제가
          있는 콘텐츠는 삭제하세요.
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
          onClick={() => onRunSeed('comments')}
          disabled={seedBusy !== null}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <MessageSquarePlus
            className={`h-4 w-4 ${seedBusy === 'comments' ? 'animate-pulse' : ''}`}
          />
          댓글만 생성
        </button>
        <button
          type="button"
          onClick={() => onRunSeed('all')}
          disabled={seedBusy !== null}
          className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-800 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${seedBusy === 'all' ? 'animate-spin' : ''}`}
          />
          지금 생성
        </button>
      </div>
    </header>
  )

  const seedNotice = seedMessage && (
    <p className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-800">
      {seedMessage}
    </p>
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
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <p className="text-xs text-gray-500">AI 투표 {votes.length}개 표시 중</p>
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
      {loading && (
        <p className="py-4 text-center text-xs text-gray-500">불러오는 중...</p>
      )}
      {hasNext && !loading && (
        <button
          type="button"
          onClick={() => loadVotes(true)}
          className="w-full rounded-md border border-gray-300 bg-white py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          더 보기
        </button>
      )}
    </section>
  )

  const commentSection = (
    <section className="space-y-2">
      {commentsError && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {commentsError}
        </p>
      )}
      <p className="text-xs text-gray-500">
        AI 댓글{botComments ? ` ${botComments.length}개 표시 중` : ''}
      </p>
      {botComments !== null && (
        <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white px-4">
          {botComments.length === 0 && !commentsLoading && (
            <li className="py-12 text-center text-sm text-gray-500">
              AI 댓글이 없습니다.
            </li>
          )}
          {botComments.map((c) => (
            <CommentRow
              key={c.commentId}
              comment={c}
              voteTitle={c.voteTitle}
              onDeleted={onBotCommentDeleted}
            />
          ))}
        </ul>
      )}
      {commentsLoading && (
        <p className="py-4 text-center text-xs text-gray-500">불러오는 중...</p>
      )}
      {commentsHasNext && !commentsLoading && (
        <button
          type="button"
          onClick={() => loadComments(true)}
          className="w-full rounded-md border border-gray-300 bg-white py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          더 보기
        </button>
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
