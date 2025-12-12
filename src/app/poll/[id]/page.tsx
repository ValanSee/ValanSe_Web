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
import { deleteVote, fetchBestVote } from '@/api/votes'
import Header from '@/components/_shared/header'
import BottomNavBar from '@/components/_shared/nav/bottomNavBar'
import Loading from '@/components/_shared/loading'
import AdminFloatingButton from '@/components/pages/poll/_admin/AdminFloatingButton'

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
          // fetchBestVote 호출 결과로 불러올 데이터가 없을 경우 404 에러 발생
          // -> 404 발생 여부를 반환값이 null 인지 여부로 판정해서 임시로 렌더링 취소하도록 조치함
          // 이후 세부 기획이 변경되면 이 부분에서 끌어올린 데이터를 기반으로 렌더링하는 로직을 구현하면 됨
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
    return <Loading />
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

  if (loading) return <Loading />
  if (error)
    return (
      <div className="flex flex-col min-h-screen bg-[#f0f0f0]">
        <Header
          title={getHeaderTitle()}
          showBackButton={shouldShowBackButton()}
          bgGray={true}
          onBackClick={handleBackClick}
        />
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <div className="text-center">
            <p className="text-xl font-bold text-red-500 mb-2">⚠️</p>
            <p className="text-lg font-semibold text-gray-700 mb-2">{error}</p>
            <p className="text-sm text-gray-500">다시 시도해주세요</p>
          </div>
        </div>
      </div>
    )
  if (!data) return null

  // mock data
  const isAdmin = true

  const handleDelete = async () => {
    const confirmed = window.confirm('게시글을 삭제하시겠습니까?')
    if (!confirmed) return

    try {
      await deleteVote(data.voteId)
      router.back()
    } catch (error) {
      console.error('게시글 삭제 실패:', error)
      alert('게시글 삭제에 실패했습니다.')
    }
  }

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
      {isAdmin && <AdminFloatingButton onDelete={handleDelete} />}
    </div>
  )
}
