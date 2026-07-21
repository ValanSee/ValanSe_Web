'use client'
import { Suspense, useCallback, useEffect, useState } from 'react'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import { authApi } from '@/api/instance/authApi'
import PollCard from '@/components/pages/poll/pollCard'
import PreviewCommentCard from '@/components/pages/poll/Comment/previewCommentCard'
import CommentDetail from '@/components/pages/poll/Comment/commentDetail'
import CommentInput from '@/components/pages/poll/Comment/commentInput'
import {
  fetchBestComment,
  fetchComments,
  BestComment,
  Comment,
} from '@/api/comment/commentApi'
import VoteChart from '@/components/pages/poll/statistics/statisics'
import { deleteVote } from '@/api/votes'
import Header from '@/components/_shared/header'
import Loading from '@/components/_shared/loading'
import AdminFloatingButton from '@/components/pages/poll/_admin/AdminFloatingButton'
import DeleteConfirmModal from '@/components/ui/modal/deleteConfirmModal'
import { useAppSelector } from '@/hooks/utils/useAppSelector'
import { buildCurrentReturnPath } from '@/utils/authRedirect'

interface PollOption {
  optionId: number
  content: string
  voteCount: number
  label: string
}

interface PollDetail {
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

export default function PollDetailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PollDetailContent />
    </Suspense>
  )
}

function PollDetailContent() {
  const { id } = useParams<{ id: string }>()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const postLoginReturnPath = buildCurrentReturnPath(pathname, searchParams)
  const [data, setData] = useState<PollDetail | null>(null)
  const [bestComment, setBestComment] = useState<BestComment | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showStats, setShowStats] = useState(false)
  const router = useRouter()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  // 관리자 여부 파악을 위한 profile 조회
  const profile = useAppSelector((state) => state.member.profile)

  // URL 파라미터에서 출처 확인
  const source = searchParams.get('source')

  useEffect(() => {
    if (!id) return

    const fetchAll = async () => {
      try {
        setLoading(true)

        const [detailRes, best, allComments] = await Promise.all([
          authApi.get<PollDetail>(`/votes/${id}`),
          fetchBestComment(id),
          fetchComments(id),
        ])

        setData(detailRes.data)
        setBestComment(best)
        setComments(allComments.comments)
      } catch {
        setError('투표 정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [id])

  const refetchComments = useCallback(async () => {
    if (!id) return
    try {
      const r = await fetchComments(id)
      setComments(r.comments)
    } catch (e) {
      console.error('댓글 새로고침 실패:', e)
    }
  }, [id])

  const handleBackClick = () => {
    if (source === 'create') {
      router.push('/main')
    } else {
      router.back()
    }
  }

  if (loading) return <Loading />
  if (error)
    return (
      <div className="flex min-h-screen flex-col bg-card">
        <Header
          title="밸런스 게임"
          showBackButton
          bgGray={true}
          onBackClick={handleBackClick}
        />
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-4 text-center">
          <p className="typo-heading-04 text-destructive">⚠️</p>
          <p className="typo-title-02 text-brand-gray-200">{error}</p>
          <p className="typo-body-c-01 text-brand-gray-100">
            다시 시도해주세요
          </p>
        </div>
      </div>
    )
  if (!data) return null

  // 비로그인 시 profile 이 없음 — 관리자 UI만 숨기고 나머지는 그대로 렌더
  const isAdmin = profile?.role === 'ADMIN'

  const handleDelete = async () => {
    try {
      await deleteVote(data.voteId)
      setDeleteModalOpen(false)
      router.push('/balanse')
    } catch (error) {
      console.error('게시글 삭제 실패:', error)
      alert('게시글 삭제에 실패했습니다.')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-card">
      <Header
        title="밸런스 게임"
        showBackButton
        onBackClick={handleBackClick}
      />
      <div className="max-w-xl mx-auto p-4 pb-[calc(env(safe-area-inset-bottom)+96px)]">
        {data && (
          <PollCard
            voteId={data.voteId}
            createdBy={data.creatorNickname}
            creatorTitle={data.creatorTitle}
            title={data.title}
            content={data.content}
            options={data.options.map((opt) => ({
              optionId: opt.optionId,
              content: opt.content,
              vote_count: opt.voteCount,
            }))}
            totalParticipants={data.totalVoteCount}
            hasVoted={data.hasVoted}
            votedOptionLabel={data.votedOptionLabel ?? undefined}
            postLoginReturnPath={postLoginReturnPath}
          />
        )}
        {data && data.hasVoted && (
          <VoteChart
            voteId={data.voteId}
            showStats={showStats}
            setShowStatsAction={setShowStats}
          />
        )}
        {bestComment && bestComment.totalCommentCount > 0 && (
          <PreviewCommentCard
            content={bestComment.content}
            commentsNumber={bestComment.totalCommentCount}
          />
        )}
        <CommentDetail
          comments={comments}
          voteId={data.voteId}
          profile={profile}
          postLoginReturnPath={postLoginReturnPath}
        />
      </div>
      <div
        className="fixed inset-x-0 bottom-0 z-30 bg-card"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto max-w-xl">
          <CommentInput
            voteId={data.voteId}
            onCommentCreated={refetchComments}
            postLoginReturnPath={postLoginReturnPath}
          />
        </div>
      </div>
      {isAdmin && (
        <AdminFloatingButton onDelete={() => setDeleteModalOpen(true)} />
      )}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
