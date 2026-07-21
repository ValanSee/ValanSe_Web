'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import { signoutThunk } from '@/store/thunks/authThunks'
import { Checkbox } from '@/components/ui/checkbox'
import Header from '@/components/_shared/header'
import { Popup } from '@/components/ui/popup'

const AccountDeletionPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isAgreed, setIsAgreed] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)

  const executeDelete = async () => {
    try {
      setIsDeleting(true)
      await dispatch(signoutThunk())
      setSuccessOpen(true)
    } catch (error) {
      console.error('계정 삭제 실패:', error)
      setErrorOpen(true)
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-card">
      <Header title="회원탈퇴" showBackButton />

      <div className="mx-auto w-full max-w-2xl flex-1 px-6 pb-10 pt-4">
        {/* 계정 삭제 단계 안내 */}
        <div className="mb-8">
          <h2 className="typo-heading-05 mb-4 text-foreground">
            계정 삭제를 요청하려면 다음 단계를 따라주세요:
          </h2>
          <div className="space-y-3">
            {[
              '아래의 데이터 삭제 정책을 확인해주세요.',
              '계정 삭제에 동의하시면 체크박스를 선택해주세요.',
              '"계정 삭제하기" 버튼을 클릭하여 삭제를 완료해주세요.',
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="typo-label-01 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {idx + 1}
                </div>
                <p className="typo-body-b-01 flex-1 text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 데이터 삭제 정책 */}
        <div className="mb-8 rounded-lg border border-brand-gray-75 bg-card p-5">
          <h2 className="typo-heading-05 mb-4 text-foreground">
            데이터 삭제 정책
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="typo-body-b-01 mb-2 text-foreground">
                삭제되는 데이터:
              </h3>
              <ul className="typo-body-b-02 ml-2 list-inside list-disc space-y-1 text-brand-gray-200">
                <li>프로필 정보 (닉네임, 성별, 나이, MBTI 등)</li>
                <li>작성한 투표 게시글</li>
                <li>작성한 댓글</li>
                <li>투표 기록</li>
                <li>계정 인증 정보</li>
              </ul>
            </div>

            <div>
              <h3 className="typo-body-b-01 mb-2 text-foreground">
                보관되는 데이터:
              </h3>
              <ul className="typo-body-b-02 ml-2 list-inside list-disc space-y-1 text-brand-gray-200">
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
              <h3 className="typo-body-b-01 mb-2 text-foreground">
                보관 기간:
              </h3>
              <p className="typo-body-b-02 ml-2 text-brand-gray-200">
                법적 의무에 따라 필요한 경우 최대 5년간 보관될 수 있으며, 이후
                자동으로 삭제됩니다.
              </p>
            </div>

            <div className="border-t border-brand-gray-50 pt-2">
              <p className="typo-body-c-03 text-brand-gray-100">
                * 계정 삭제 후 복구가 불가능합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 동의 체크박스 */}
        <div className="mb-8">
          <div className="flex items-start gap-3 rounded-lg border border-brand-gray-75 p-4 hover:bg-brand-gray-50">
            <Checkbox
              id="agree-deletion"
              checked={isAgreed}
              onCheckedChange={(checked) => {
                setIsAgreed(checked === true)
              }}
              className="h-5 w-5 border-brand-gray-75 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
            />
            <label
              htmlFor="agree-deletion"
              className="typo-body-a-01 flex-1 cursor-pointer text-foreground"
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
            className="typo-label-02 h-[60px] flex-1 rounded-lg bg-brand-gray-50 text-brand-gray-200 disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            disabled={!isAgreed || isDeleting}
            className="typo-label-02 h-[60px] flex-1 rounded-lg bg-primary text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? '삭제 중...' : '계정 삭제하기'}
          </button>
        </div>
      </div>

      <Popup
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        variant="confirm"
        title="정말로 계정을 삭제할까요?"
        description="이 작업은 되돌릴 수 없어요"
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={executeDelete}
      />

      <Popup
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false)
          router.replace('/entry')
        }}
        variant="alert"
        title="계정이 삭제되었어요"
      />

      <Popup
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        variant="error"
        title="계정 삭제 중 오류가 발생했어요"
        description="잠시 후 다시 시도해주세요"
      />
    </div>
  )
}

export default AccountDeletionPage
