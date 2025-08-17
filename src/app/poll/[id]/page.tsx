'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
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
import Header from '@/components/_shared/header'
import BottomNavBar from '@/components/_shared/bottomNavBar'

interface PollOption {
  optionId: number
  content: string
  voteCount: number
  label: string
}

interface PollDetail {
  voteId: number
  title: string
  category: string
  creatorNickname: string
  createdAt: string
  totalVoteCount: number
  options: PollOption[]
  hasVoted: boolean
  votedOptionLabel: string
}

export default function PollDetailPage() {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const [data, setData] = useState<PollDetail | null>(null)
  const [bestComment, setBestComment] = useState<BestComment | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [isFromHot, setIsFromHot] = useState(false)
  const router = useRouter()

  // URL 파라미터에서 출처 확인
  const source = searchParams.get('source')

  useEffect(() => {
    if (id === 'hot') {
      setIsFromHot(true)
      const loadBestVote = async () => {
        try {
          const response = await fetchBestVote()
          if (!response) return // [지상] 예외 처리 때문에 잠시 추가
          router.replace(`/poll/${response.voteId}?source=hot`)
        } catch (error) {
          console.error('Failed to fetch best vote:', error)
          router.replace('/main')
        }
      }
      loadBestVote()
    }
  }, [id, router])

  useEffect(() => {
    if (id === 'hot') return

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
    if (id === 'hot') return

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
      <div>
        <Header title="오늘의 핫이슈" showBackButton={false} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">
              가장 인기 있는 투표를 불러오는 중...
            </p>
          </div>
        </div>
      </div>
    )
  }

  const getHeaderTitle = () => {
    if (source === 'hot' || isFromHot) return '오늘의 핫이슈'
    if (source === 'balance') return '밸런스게임'
    if (source === 'create') return '밸런스게임'
    return '밸런스게임' // 기본값
  }

  const shouldShowBackButton = () => {
    if (source === 'hot' || isFromHot) return false
    return true
  }

  const handleBackClick = () => {
    if (source === 'create') {
      router.push('/main')
    } else {
      router.back()
    }
  }

  if (loading)
    return (
      <div>
        <Header
          title={getHeaderTitle()}
          showBackButton={shouldShowBackButton()}
          bgGray={true}
          onBackClick={handleBackClick}
        />
        <div className="p-4">로딩 중...</div>
      </div>
    )
  if (error)
    return (
      <div>
        <Header
          title={getHeaderTitle()}
          showBackButton={shouldShowBackButton()}
          bgGray={true}
          onBackClick={handleBackClick}
        />
        <div className="p-4 text-red-500">{error}</div>
      </div>
    )
  if (!data) return null

  return (
    <div>
      <Header
        title={getHeaderTitle()}
        showBackButton={shouldShowBackButton()}
        bgGray={true}
        onBackClick={handleBackClick}
      />
      <div className="max-w-xl mx-auto p-4 pb-24">
        {data && (
          <PollCard
            voteId={data.voteId}
            createdBy={data.creatorNickname}
            title={data.title}
            options={data.options.map((opt) => ({
              optionId: opt.optionId,
              content: opt.content,
              vote_count: opt.voteCount,
            }))}
            totalParticipants={data.totalVoteCount}
            hasVoted={data.hasVoted}
            votedOptionLabel={data.votedOptionLabel}
          />
        )}
        {bestComment && !open && (
          <PreviewCommentCard
            content={bestComment.content}
            commentsNumber={bestComment.totalCommentCount}
            open={open}
            setOpen={setOpen}
          />
        )}
        {open && (
          <CommentDetail
            comments={comments}
            voteId={data.voteId}
            onClose={() => setOpen(false)}
          />
        )}
        {data && (
          <VoteChart
            voteId={data.voteId}
            showStats={showStats}
            setShowStatsAction={setShowStats}
          />
        )}
      </div>
      {(source === 'hot' || isFromHot) && <BottomNavBar />}
    </div>
  )
}
