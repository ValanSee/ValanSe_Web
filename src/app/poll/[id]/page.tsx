'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
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

interface PollOption {
  id: number
  content: string
  vote_count: number
}

interface PollDetail {
  id: number
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

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true)
        const res = await authApi.get<PollDetail>(`/votes/${id}`)
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
          voteId={data.id}
          showStats={showStats}
          setShowStatsAction={setShowStats}
        />
      )}
    </div>
  )
}
