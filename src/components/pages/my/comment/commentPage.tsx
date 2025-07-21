'use client'

import Header from '../_shared/header'
import { useState } from 'react'
import { MyCommentsResponse } from '@/types/api/myComments'
import { deleteMyComments, fetchMyComments } from '@/api/myComments'
import { useEffect } from 'react'
import Image from 'next/image'
import { useAppSelector } from '@/hooks/utils/useAppSelector'
import { fetchMypageDataThunk } from '@/store/thunks/memberThunks'
import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import { getTimeAgo } from '@/utils/getTimeAgo'

const sortOptions = [
  { value: 'latest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
]

const CommentPage = () => {
  const [comments, setComments] = useState<MyCommentsResponse[]>([])
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest')
  const [selectedComments, setSelectedComments] = useState<number[]>([])
  const memberState = useAppSelector((state) => state.member.mypageData)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const fetchData = async () => {
      if (!memberState) {
        await dispatch(fetchMypageDataThunk())
      }
    }
    fetchData()
  }, [memberState])

  useEffect(() => {
    const getComments = async () => {
      try {
        const data = await fetchMyComments(sort)
        setComments(data)
      } catch (error) {
        console.error('댓글 가져오기 실패', error)
      }
    }
    getComments()
  }, [sort])

  const handleDeleteComments = async () => {
    try {
      await Promise.all(
        selectedComments.map((commentId) => deleteMyComments(commentId)),
      )
      const updated = await fetchMyComments(sort)
      setComments(updated)
      setSelectedComments([])
    } catch (error) {
      console.error('댓글 삭제 실패', error)
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-white font-pretendard leading-none">
      <Header title="내가 작성한 댓글" />

      <div className="flex justify-between w-full px-4 pt-10">
        <div>
          {selectedComments.length > 0 ? selectedComments.length : ''} 선택
        </div>
        <select
          className="ml-auto border rounded px-2 py-1 text-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value as 'latest' | 'oldest')}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full px-4 pt-4 space-y-4 pb-28">
        {comments.map((comment) => (
          <div key={comment.id}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#C6C6C6]" />
                <div className="text-[14px] font-[500] leading-none">
                  {comment.voteOwnerNickname}
                </div>
                <div className="text-[12px] font-[400] leading-none text-[#8E8E8E]">
                  {getTimeAgo(comment.createdAt)}
                </div>
              </div>
              <div className="text-[16px] font-[700] leading-none">
                {comment.voteTitle}
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedComments((prev) => [...prev, comment.id])
                  } else {
                    setSelectedComments((prev) =>
                      prev.filter((id) => id !== comment.id),
                    )
                  }
                }}
              />
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <Image
                    src={memberState?.profile_image_url || ''}
                    alt="profile"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <div className="text-[14px] font-[500] leading-none text-[#8E8E8E]">
                    {memberState?.nickname}
                  </div>
                  <div className="text-[12px] font-[400] leading-none text-[#8E8E8E]">
                    {getTimeAgo(comment.createdAt)}
                  </div>
                </div>
                <div className="pl-8">{comment.content}</div>
              </div>
            </div>
            <div className="w-full h-[1px] bg-[#F0F0F0] mt-4" />
          </div>
        ))}
      </div>

      {selectedComments.length > 0 && (
        <div className="self-end w-full px-4">
          <button
            className="w-full border border-1 border-[#EB5E28] rounded-md h-[60px] text-[18px] font-[500] text-[#EB5E28]"
            onClick={handleDeleteComments}
          >
            삭제
          </button>
        </div>
      )}
    </div>
  )
}

export default CommentPage
