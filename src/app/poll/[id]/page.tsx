'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { authApi } from '@/api/instance/authApi'
import PollCard from '@/components/pages/poll/pollCard'
import PreviewCommentCard from '@/components/pages/poll/Comment/previewCommentCard'
import CommentDetail from '@/components/pages/poll/Comment/commentDetail'
import {
  fetchBestComment,
  fetchComments,
  BestComment,
  Comment,
} from '@/api/comment/commentApi'
import VoteChart from '@/components/pages/poll/statistics/statisics'
import { fetchBestVote } from '@/api/votes'

interface PollOption {
  id: number
  content: string
  vote_count: number
}

interface PollDetail {
  voteId: number
  title: string
  category: string
  nickname: string
  created_at: string
  total_vote_count: number
  total_comment_count: number
  options: PollOption[]
}

export default function PollDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<PollDetail | null>(null)
  const [bestComment, setBestComment] = useState<BestComment | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const router = useRouter()

  // 인기 탭에서 온 경우 (id가 'hot'일 때) fetchBestVote 호출
  useEffect(() => {
    if (id === 'hot') {
      const loadBestVote = async () => {
        try {
          const response = await fetchBestVote()
          // 받은 voteId로 해당 투표 상세 페이지로 리다이렉트
          router.replace(`/poll/${response.voteId}`)
        } catch (error) {
          console.error('Failed to fetch best vote:', error)
          // 에러 발생 시 메인 페이지로 리다이렉트
          router.replace('/main')
        }
      }
      loadBestVote()
    }
  }, [id, router])

  // 일반 투표 상세 정보 로드 (id가 실제 voteId일 때)
  useEffect(() => {
    if (id === 'hot') return // 인기 탭이면 건너뛰기

    const fetchDetail = async () => {
      try {
        setLoading(true)
        const res = await authApi.get<PollDetail>(`/votes/${id}`)
        console.log('API 응답:', res.data) // 디버깅용
        setData(res.data)
      } catch {
        setError('투표 정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchDetail()
  }, [id])

  useEffect(() => {
    if (id === 'hot') return // 인기 탭이면 건너뛰기

    const fetchAll = async () => {
      try {
        setLoading(true)
        if (!id) return
        const best = await fetchBestComment(id)
        setBestComment(best)
        const all = await fetchComments(id)
        setComments(all.comments)
      } catch {
        setError('댓글 정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [id])

  // 인기 탭에서 로딩 중일 때
  if (id === 'hot') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">가장 인기 있는 투표를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (loading) return <div className="p-4">로딩 중...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!data) return null

  return (
    <div className="max-w-xl mx-auto p-4">
      {data && (
        <PollCard
          createdBy={data.nickname}
          title={data.title}
          options={data.options.map((opt) => ({
            optionId: opt.id,
            content: opt.content,
            vote_count: opt.vote_count,
          }))}
          totalParticipants={data.total_vote_count}
        />
      )}
      {bestComment && (
        <PreviewCommentCard
          content={bestComment.content}
          commentsNumber={bestComment.totalCommentCount}
          open={open}
          setOpen={setOpen}
        />
      )}
      {open && <CommentDetail comments={comments} />}
      {data && (
        <VoteChart
          voteId={data.voteId}
          showStats={showStats}
          setShowStatsAction={setShowStats}
        />
      )}
    </div>
  )
}
