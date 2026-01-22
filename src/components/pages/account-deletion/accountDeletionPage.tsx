'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import { signoutThunk } from '@/store/thunks/authThunks'
import { Checkbox } from '@/components/ui/checkbox'

const AccountDeletionPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isAgreed, setIsAgreed] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!isAgreed) {
      alert('계정 삭제에 동의해주세요.')
      return
    }

    if (
      !confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')
    ) {
      return
    }

    try {
      setIsDeleting(true)
      await dispatch(signoutThunk())
      alert('계정이 성공적으로 삭제되었습니다.')
      router.push('/entry')
    } catch (error) {
      console.error('계정 삭제 실패:', error)
      alert('계정 삭제 중 오류가 발생했습니다. 다시 시도해주세요.')
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10 max-w-2xl mx-auto">
      {/* 앱 이름 및 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">ValanSe</h1>
        <p className="text-lg text-[#8E8E8E]">계정 및 데이터 삭제</p>
      </div>

      {/* 계정 삭제 단계 안내 */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">
          계정 삭제를 요청하려면 다음 단계를 따라주세요:
        </h2>
        <div className="space-y-3">
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#839DB7] text-white flex items-center justify-center text-sm font-bold mt-0.5">
              1
            </div>
            <div className="flex-1">
              <p className="text-[16px] text-[#1D1D1D] font-[500]">
                아래의 데이터 삭제 정책을 확인해주세요.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#839DB7] text-white flex items-center justify-center text-sm font-bold mt-0.5">
              2
            </div>
            <div className="flex-1">
              <p className="text-[16px] text-[#1D1D1D] font-[500]">
                계정 삭제에 동의하시면 체크박스를 선택해주세요.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#839DB7] text-white flex items-center justify-center text-sm font-bold mt-0.5">
              3
            </div>
            <div className="flex-1">
              <p className="text-[16px] text-[#1D1D1D] font-[500]">
                &quot;계정 삭제하기&quot; 버튼을 클릭하여 삭제를 완료해주세요.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 데이터 삭제 정책 */}
      <div className="mb-8 bg-white border border-[#C6C6C6] rounded-lg p-5">
        <h2 className="text-lg font-bold mb-4">데이터 삭제 정책</h2>

        <div className="space-y-4 text-[14px] text-[#1D1D1D]">
          <div>
            <h3 className="font-bold mb-2">삭제되는 데이터:</h3>
            <ul className="list-disc list-inside space-y-1 ml-2 text-[#555555]">
              <li>프로필 정보 (닉네임, 성별, 나이, MBTI 등)</li>
              <li>작성한 투표 게시글</li>
              <li>작성한 댓글</li>
              <li>투표 기록</li>
              <li>계정 인증 정보</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-2">보관되는 데이터:</h3>
            <ul className="list-disc list-inside space-y-1 ml-2 text-[#555555]">
              <li>
                법적 의무 준수를 위해 필요한 경우, 관련 법령에 따라 일정 기간
                보관될 수 있습니다.
              </li>
              <li>
                서비스 이용 중 발생한 분쟁 해결을 위해 필요한 최소한의 정보는
                보관될 수 있습니다.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-2">보관 기간:</h3>
            <p className="text-[#555555] ml-2">
              법적 의무에 따라 필요한 경우 최대 5년간 보관될 수 있으며, 이후
              자동으로 삭제됩니다.
            </p>
          </div>

          <div className="pt-2 border-t border-[#E4E4E4]">
            <p className="text-[12px] text-[#8E8E8E]">
              * 계정 삭제 후 복구가 불가능합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 동의 체크박스 */}
      <div className="mb-8">
        <div className="flex items-start gap-3 p-4 border border-[#C6C6C6] rounded-lg hover:bg-gray-50">
          <Checkbox
            id="agree-deletion"
            checked={isAgreed}
            onCheckedChange={(checked) => {
              setIsAgreed(checked === true)
            }}
            className="w-5 h-5 data-[state=checked]:bg-[#839DB7] data-[state=checked]:border-[#839DB7] border-[#C6C6C6]"
          />
          <label
            htmlFor="agree-deletion"
            className="flex-1 text-[16px] text-[#1D1D1D] font-[400] cursor-pointer"
          >
            위 내용을 확인했으며, 계정 및 모든 데이터 삭제에 동의합니다.
          </label>
        </div>
      </div>

      {/* 삭제 버튼 */}
      <div className="flex gap-2">
        <button
          onClick={() => router.back()}
          disabled={isDeleting}
          className="flex-1 h-[60px] bg-[#E4E4E4] rounded-lg text-[18px] text-[#8E8E8E] font-[400] disabled:opacity-50"
        >
          취소
        </button>
        <button
          onClick={handleDelete}
          disabled={!isAgreed || isDeleting}
          className="flex-1 h-[60px] bg-[#839DB7] rounded-lg text-[18px] text-white font-[400] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? '삭제 중...' : '계정 삭제하기'}
        </button>
      </div>
    </div>
  )
}

export default AccountDeletionPage
