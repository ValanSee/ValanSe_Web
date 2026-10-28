'use client'
import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
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
import Link from 'next/link'
import Header from '@/components/_shared/header'
import Loading from '@/components/_shared/loading'
import MoreMenu from '@/components/_shared/moreMenu'
import ShareButton, { shareLink } from '@/components/_shared/shareButton'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { SITE_URL } from '@/constants/seo'
import { useAppSelector } from '@/hooks/utils/useAppSelector'
import { useReportAction } from '@/hooks/utils/useReportAction'
import { buildCurrentReturnPath } from '@/utils/authRedirect'
import { getAccessToken } from '@/utils/tokenUtils'
import type {
  PollCommentsInitial,
  PollDetail,
} from '@/api/pages/poll/pollDetailServer'
import { cn } from '@/lib/utils'
import { DESKTOP_PAGE_COLUMN, DESKTOP_PAGE_WIDE } from '@/constants/layout'
import { getCategoryMeta } from '@/constants/category'

interface PollDetailPageProps {
  /** 서버에서 비로그인으로 조회한 상세. 실패 시 null → 기존처럼 클라이언트에서 조회 */
  initialData: PollDetail | null
  /** 서버에서 조회한 베스트 댓글 · 댓글 첫 페이지. 실패한 항목은 null → 클라이언트 조회 결과로 채움 */
  initialComments?: PollCommentsInitial
  /** PC 사이드바 (서버 컴포넌트를 Suspense 로 감싼 슬롯). 없으면 미노출 */
  sidebar?: React.ReactNode
  /** 모바일 하단 같은 카테고리 목록 (서버 컴포넌트를 Suspense 로 감싼 슬롯). PC 는 사이드바가 대신함 */
  related?: React.ReactNode
}

export default function PollDetailPage({
  initialData,
  initialComments,
  sidebar,
  related,
}: PollDetailPageProps) {
  return (
    <Suspense fallback={<Loading />}>
      <PollDetailContent
        initialData={initialData}
        initialComments={initialComments}
        sidebar={sidebar}
        related={related}
      />
    </Suspense>
  )
}

function PollDetailContent({
  initialData,
  initialComments,
  sidebar,
  related,
}: PollDetailPageProps) {
  const { id } = useParams<{ id: string }>()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const postLoginReturnPath = buildCurrentReturnPath(pathname, searchParams)
  const [data, setData] = useState<PollDetail | null>(initialData)
  const [bestComment, setBestComment] = useState<BestComment | null>(
    initialComments?.best ?? null,
  )
  const [comments, setComments] = useState<Comment[]>(
    initialComments?.comments ?? [],
  )
  const [loading, setLoading] = useState(!initialData)
  // 로그인 기준 재조회 완료 여부(성공·실패 무관). SSR 데이터만 있을 땐 false
  const [synced, setSynced] = useState(!initialData)
  // 로그인 기준 상세 조회 성공 여부. pending vote 자동 제출은 이때만 허용
  const [detailSynced, setDetailSynced] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)
  const [showStats, setShowStats] = useState(false)
  const router = useRouter()

  // 본인 게시글 여부 파악을 위한 profile 조회
  const profile = useAppSelector((state) => state.member.profile)

  const { openReport, reportUi } = useReportAction({
    returnPath: postLoginReturnPath,
  })

  // 클라이언트 이동 시엔 인라인 스크립트가 안 돌므로 페인트 전에 토큰 여부를 다시 반영
  useLayoutEffect(() => {
    document.documentElement.toggleAttribute(
      'data-has-token',
      Boolean(getAccessToken()),
    )
  }, [])

  // URL 파라미터에서 출처 확인
  const source = searchParams.get('source')

  useEffect(() => {
    if (!id) return

    const fetchAll = async () => {
      // 서버 데이터가 있으면 로딩 화면 없이 hasVoted 등 로그인 기준 값만 갱신
      if (!initialData) setLoading(true)

      // 댓글 실패가 상세 응답까지 버리지 않도록 분리
      const [detailRes, bestRes, commentsRes] = await Promise.allSettled([
        authApi.get<PollDetail>(`/votes/${id}`),
        fetchBestComment(id),
        fetchComments(id),
      ])

      if (detailRes.status === 'fulfilled') {
        setData(detailRes.value.data)
        setDetailSynced(true)
      } else if (!initialData) {
        setError('투표 정보를 불러오지 못했습니다.')
      }
      if (bestRes.status === 'fulfilled') setBestComment(bestRes.value)
      if (commentsRes.status === 'fulfilled')
        setComments(commentsRes.value.comments)

      setLoading(false)
      // 재조회 실패 시에도 SSR 데이터로 수동 조작은 가능하게
      setSynced(true)
    }

    fetchAll()
  }, [id, initialData])

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
      router.push('/')
    } else {
      router.back()
    }
  }

  if (loading) return <Loading />
  if (error)
    return (
      <div
        className={cn(
          'flex min-h-screen flex-col bg-card',
          DESKTOP_PAGE_COLUMN,
        )}
      >
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

  // 본인 게시글은 서버에서 신고를 거부하므로 메뉴에서도 제외
  const isOwnVote = !!profile && profile.nickname === data.creatorNickname
  const categoryMeta = getCategoryMeta(data.category)
  const moreMenu = isOwnVote ? undefined : (
    <MoreMenu
      label="게시글 메뉴"
      items={[
        {
          label: '신고',
          icon: 'tabler:flag',
          onSelect: () => openReport('VOTE', data.voteId),
        },
      ]}
    />
  )

  // 공유는 쿼리 없는 canonical 주소로 (공유 미리보기 · 검색 중복 URL 방지)
  const versus = data.options.map((o) => o.content).join(' vs ')
  const shareData = {
    url: `${SITE_URL}/poll/${data.voteId}`,
    title: data.title,
    text: `${data.title} — ${versus}, 너라면 뭐 골라?`,
  }
  const headerActions = (
    <div className="flex items-center gap-ds-3">
      <ShareButton {...shareData} />
      {moreMenu}
    </div>
  )

  return (
    <div
      className={cn('flex min-h-screen flex-col bg-card', DESKTOP_PAGE_WIDE)}
    >
      <Header
        className="lg:hidden"
        // 투표 제목(PollCard)이 h1
        titleAs="p"
        title="밸런스 게임"
        showBackButton
        onBackClick={handleBackClick}
        trailing={headerActions}
      />
      {/* PC: 뒤로가기 대신 브레드크럼 (JSON-LD BreadcrumbList 와 같은 경로) */}
      <div className="mb-ds-4 hidden items-center justify-between lg:flex">
        <nav
          aria-label="현재 위치"
          className="typo-label-02 text-brand-gray-100"
        >
          <ol className="flex items-center gap-ds-2">
            <li>
              <Link href="/" className="hover:text-primary">
                홈
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link
                href={
                  categoryMeta
                    ? `/balanse?category=${categoryMeta.param}`
                    : '/balanse'
                }
                className="hover:text-primary"
              >
                {categoryMeta
                  ? `${categoryMeta.label} 밸런스게임`
                  : '밸런스게임'}
              </Link>
            </li>
          </ol>
        </nav>
        {headerActions}
      </div>
      <div className="lg:flex lg:items-start lg:gap-ds-8">
        <div className="flex min-w-0 flex-col lg:flex-1 lg:gap-ds-4">
          <div className="mx-auto w-full min-w-0 max-w-xl p-4 pb-24 lg:max-w-none lg:p-0">
            {data && (
              <PollCard
                // 재조회 후 hasVoted·득표 수로 내부 state 를 다시 초기화
                key={synced ? 'synced' : 'ssr'}
                ready={synced}
                pendingVoteReady={detailSynced}
                // 투표 후 결과 차트(VoteChart) 노출을 위해 부모 데이터도 갱신
                onVoteChange={(voted) =>
                  setData((prev) =>
                    prev ? { ...prev, hasVoted: voted } : prev,
                  )
                }
                voteId={data.voteId}
                createdBy={data.creatorNickname}
                creatorTitle={data.creatorTitle}
                title={data.title}
                content={data.content}
                options={data.options.map((opt) => ({
                  optionId: opt.optionId,
                  content: opt.content,
                  imageUrl: opt.imageUrl,
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
            {/* 투표 직후가 공유 의향이 가장 높은 순간 → 결과 아래 공유 유도 */}
            {data && data.hasVoted && (
              <Button
                variant="secondary"
                fullWidth
                className="my-4"
                leadingIcon={
                  <Icon icon="tabler:share" width={20} aria-hidden />
                }
                onClick={() => shareLink(shareData)}
              >
                친구는 뭘 골랐을까? 물어보기
              </Button>
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
            {related}
          </div>
          {/* 모바일: 하단 고정 입력창 · PC: 댓글 아래 카드 */}
          <div
            className="fixed inset-x-0 bottom-0 z-30 bg-card lg:static lg:z-auto lg:overflow-hidden lg:rounded-2xl lg:shadow-[0_0_4px_rgba(0,0,0,0.06)]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="mx-auto max-w-xl lg:max-w-none">
              <CommentInput
                voteId={data.voteId}
                onCommentCreated={refetchComments}
                postLoginReturnPath={postLoginReturnPath}
              />
            </div>
          </div>
        </div>
        {sidebar}
      </div>
      {reportUi}
    </div>
  )
}
