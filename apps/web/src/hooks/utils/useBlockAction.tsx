'use client'

import { useCallback, useState } from 'react'
import axios from 'axios'
import { blockMember } from '@/api/member/block'
import { Popup } from '@/components/ui/popup'
import { getAccessToken } from '@/utils/tokenUtils'
import { useGoToLogin } from './useGoToLogin'

interface Options {
  /** 로그인 후 되돌아올 경로 */
  returnPath: string
  /** 차단 성공 직후 호출. 화면에서 해당 사용자의 콘텐츠를 바로 걷어낼 때 쓴다 */
  onBlocked?: (memberId: number) => void
}

interface BlockTarget {
  memberId: number
  nickname: string
}

interface BlockResult {
  variant: 'alert' | 'error'
  title: string
  description?: string
}

// 서버 GlobalExceptionHandler 는 { error, status } 형태로 응답한다
const errorMessageOf = (e: unknown) =>
  axios.isAxiosError(e)
    ? (e.response?.data as { error?: string } | undefined)?.error
    : undefined

/**
 * 투표·댓글 작성자 차단 공용 액션 (App Store 가이드라인 1.2 — 사용자 생성 콘텐츠 앱의 차단 기능).
 * - 미로그인이면 바로 로그인 페이지로 이동
 * - 확인 팝업 → blockMember → 결과 팝업. 차단한 사용자의 글은 서버가 목록에서 제외한다
 */
export function useBlockAction({ returnPath, onBlocked }: Options) {
  const goToLogin = useGoToLogin()
  const [target, setTarget] = useState<BlockTarget | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<BlockResult | null>(null)

  const openBlock = useCallback(
    (memberId: number, nickname: string) => {
      if (!getAccessToken()) {
        goToLogin(returnPath)
        return
      }
      setTarget({ memberId, nickname })
      setConfirmOpen(true)
    },
    [goToLogin, returnPath],
  )

  const handleConfirm = async () => {
    if (!target || submitting) return
    try {
      setSubmitting(true)
      await blockMember(target.memberId)
      onBlocked?.(target.memberId)
      setResult({
        variant: 'alert',
        title: `${target.nickname}님을 차단했어요`,
        description: '마이 > 차단한 사용자에서 해제할 수 있어요',
      })
    } catch (e) {
      console.error('차단 실패:', e)
      const message = errorMessageOf(e)
      setResult({
        variant: 'error',
        title: message ?? '차단에 실패했어요',
        description: message ? undefined : '잠시 후 다시 시도해 주세요',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const blockUi = (
    <>
      <Popup
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        variant="confirm"
        title={`${target?.nickname ?? ''}님을 차단할까요?`}
        description="차단하면 이 사용자의 밸런스 게임과 댓글이 더 이상 보이지 않아요"
        confirmLabel="차단"
        cancelLabel="취소"
        onConfirm={handleConfirm}
      />
      <Popup
        open={!!result}
        onClose={() => setResult(null)}
        variant={result?.variant ?? 'alert'}
        title={result?.title ?? ''}
        description={result?.description}
        confirmLabel="확인"
      />
    </>
  )

  return { openBlock, blockUi }
}
