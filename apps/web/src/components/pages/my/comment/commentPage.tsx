'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import Header from '@/components/_shared/header'
import { Button } from '@/components/ui/button'
import { MyCommentsResponse } from '@/types/api/myComments'
import { deleteMyComments, fetchMyComments } from '@/api/myComments'
import { useAppSelector } from '@/hooks/utils/useAppSelector'
import { fetchMypageDataThunk } from '@/store/thunks/memberThunks'
import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import { getTimeAgo } from '@/utils/getTimeAgo'

const CommentPage = () => {
  const router = useRouter()
  const [comments, setComments] = useState<MyCommentsResponse[]>([])
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest')
  const [selected, setSelected] = useState<number[]>([])
  const memberState = useAppSelector((s) => s.member.mypageData)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!memberState) void dispatch(fetchMypageDataThunk())
  }, [memberState, dispatch])

  useEffect(() => {
    ;(async () => {
      try {
        const data = await fetchMyComments(sort)
        setComments(data)
      } catch (e) {
        console.error('댓글 조회 실패', e)
      }
    })()
  }, [sort])

  const handleDelete = async () => {
    try {
      await Promise.all(selected.map((id) => deleteMyComments(id)))
      const updated = await fetchMyComments(sort)
      setComments(updated)
      setSelected([])
    } catch (e) {
      console.error('댓글 삭제 실패', e)
    }
  }

  const toggle = (id: number, on: boolean) =>
    setSelected((prev) =>
      on ? [...prev, id] : prev.filter((v) => v !== id),
    )

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24">
      <Header
        title="내가 작성한 댓글"
        showBackButton
        onBackClick={() => router.push('/my')}
      />
      <div className="flex items-center justify-between px-4 pt-4 typo-label-03 text-brand-gray-200">
        <span>
          {selected.length > 0 ? `${selected.length}개 선택됨` : ' '}
        </span>
        <button
          type="button"
          onClick={() =>
            setSort((prev) => (prev === 'latest' ? 'oldest' : 'latest'))
          }
          className="flex items-center gap-1"
        >
          {sort === 'latest' ? '최신순' : '오래된순'}
          <Icon icon="icon-park-solid:down-one" width={14} aria-hidden />
        </button>
      </div>

      <div className="flex flex-col gap-3 px-4 pt-3">
        {comments.map((comment) => (
          <article
            key={comment.id}
            className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-[0_0_4px_rgba(0,0,0,0.06)]"
          >
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-brand-gray-75" />
              <div className="flex flex-col">
                <span className="typo-label-03 text-foreground">
                  {comment.voteOwnerNickname}
                </span>
                <span className="typo-body-c-02 text-brand-gray-100">
                  {getTimeAgo(comment.voteCreatedAt)}
                </span>
              </div>
            </div>
            <p className="typo-title-03 text-foreground">
              {comment.voteTitle}
            </p>
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1.5 h-4 w-4 accent-primary"
                onChange={(e) => toggle(comment.id, e.target.checked)}
                checked={selected.includes(comment.id)}
              />
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Image
                    src={memberState?.profile_image_url || '/profile-example.svg'}
                    alt="프로필"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="typo-label-03 text-foreground">
                    {memberState?.nickname}
                  </span>
                  <span className="typo-body-c-02 text-brand-gray-100">
                    {getTimeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="typo-body-b-01 text-foreground">
                  {comment.content}
                </p>
              </div>
            </div>
          </article>
        ))}
        {comments.length === 0 && (
          <p className="typo-body-b-01 py-8 text-center text-brand-gray-100">
            아직 작성한 댓글이 없어요
          </p>
        )}
      </div>

      {selected.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-brand-gray-75 bg-card p-4">
          <Button
            variant="destructive"
            size="l"
            fullWidth
            onClick={handleDelete}
          >
            {selected.length}개 삭제
          </Button>
        </div>
      )}
    </div>
  )
}

export default CommentPage
