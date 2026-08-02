'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { createReport, type ReportReason, type ReportType } from '@/api/report'
import LoginRequiredModal from '@/components/ui/modal/loginRequiredModal'
import ReportSheet from '@/components/ui/modal/reportSheet'
import { Popup } from '@/components/ui/popup'
import { getAccessToken } from '@/utils/tokenUtils'
import { entryHrefWithRedirect } from '@/utils/authRedirect'
import { markReported } from '@/utils/reportedContent'

interface Options {
  /** 로그인 후 되돌아올 경로 */
  returnPath: string
}

interface ReportTarget {
  type: ReportType
  id: number
}

interface ReportResult {
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
 * 투표·댓글 신고 공용 액션.
 * - 미로그인이면 LoginRequiredModal 노출, 확인 시 로그인 페이지로 이동
 * - 로그인 상태면 ReportSheet 노출 · createReport 호출 후 결과 팝업
 */
export function useReportAction({ returnPath }: Options) {
  const router = useRouter()
  const [target, setTarget] = useState<ReportTarget | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [result, setResult] = useState<ReportResult | null>(null)

  const openReport = useCallback((type: ReportType, targetId: number) => {
    if (!getAccessToken()) {
      setShowLoginModal(true)
      return
    }
    setTarget({ type, id: targetId })
    setSheetOpen(true)
  }, [])

  const handleSubmit = async ({
    reason,
    content,
  }: {
    reason: ReportReason
    content: string
  }) => {
    if (!target || submitting) return
    try {
      setSubmitting(true)
      await createReport(target.id, {
        reportType: target.type,
        reason,
        ...(content ? { content } : {}),
      })
      // 관리자 처리 전까지 신고자에게만 가려 보여준다
      markReported(target.type, target.id)
      setSheetOpen(false)
      setResult({
        variant: 'alert',
        title: '신고가 접수되었습니다.',
        description: '검토에는 최대 24시간이 소요됩니다.',
      })
    } catch (e) {
      console.error('신고 실패:', e)
      // 본인 콘텐츠 신고·중복 신고 등은 서버 메시지를 그대로 노출
      const message = errorMessageOf(e)
      setSheetOpen(false)
      setResult({
        variant: 'error',
        title: message ?? '신고 접수에 실패했어요',
        description: message ? undefined : '잠시 후 다시 시도해 주세요',
      })
    } finally {
      setSubmitting(false)
    }
  }

  // 닫힘 애니메이션 동안 라벨이 바뀌지 않도록 target 은 유지한다
  const reportUi = (
    <>
      <ReportSheet
        open={sheetOpen}
        onClose={() => {
          if (!submitting) setSheetOpen(false)
        }}
        targetType={target?.type ?? 'COMMENT'}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
      <LoginRequiredModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={() => {
          setShowLoginModal(false)
          router.replace(entryHrefWithRedirect(returnPath))
        }}
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

  return { openReport, reportUi }
}
