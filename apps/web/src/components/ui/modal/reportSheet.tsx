'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import {
  REPORT_CONTENT_MAX_LENGTH,
  REPORT_REASONS,
  type ReportReason,
  type ReportType,
} from '@/api/report'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { fieldVariants } from '@/components/ui/textField'
import { cn } from '@/lib/utils'

const TARGET_LABEL: Record<ReportType, string> = {
  VOTE: '이 밸런스 게임',
  COMMENT: '이 댓글',
}

export interface ReportSheetProps {
  open: boolean
  onClose: () => void
  targetType: ReportType
  submitting?: boolean
  onSubmit: (payload: { reason: ReportReason; content: string }) => void
}

/**
 * 신고 사유 선택 + 상세 내용 입력 바텀시트.
 * 사유 목록은 서버 ReportReason enum(9종)과 동일하고, 상세 내용은 선택 입력이다.
 */
export default function ReportSheet({
  open,
  onClose,
  targetType,
  submitting = false,
  onSubmit,
}: ReportSheetProps) {
  const [reason, setReason] = useState<ReportReason | null>(null)
  const [content, setContent] = useState('')

  // 닫았다 다시 열면 초기 상태로
  useEffect(() => {
    if (!open) {
      setReason(null)
      setContent('')
    }
  }, [open])

  const handleSubmit = () => {
    if (!reason || submitting) return
    onSubmit({ reason, content: content.trim() })
  }

  const reasonList = (
    <div
      role="radiogroup"
      aria-label="신고 사유"
      className="flex shrink-0 flex-col gap-2"
    >
      {REPORT_REASONS.map((item) => {
        const selected = reason === item.value
        return (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={submitting}
            onClick={() => setReason(item.value)}
            className={cn(
              'flex min-h-12 items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left transition-colors',
              selected
                ? 'border-primary bg-brand-violet-50 text-primary'
                : 'border-brand-gray-75 bg-card text-brand-gray-200 hover:bg-brand-gray-50',
              submitting && 'cursor-not-allowed opacity-70',
            )}
          >
            <span className="typo-label-02">{item.label}</span>
            {selected && (
              <Icon
                icon="tabler:check"
                className="shrink-0 text-primary"
                width={18}
                aria-hidden
              />
            )}
          </button>
        )
      })}
    </div>
  )

  const contentField = (
    <div className="flex shrink-0 flex-col gap-1">
      <label htmlFor="report-content" className="typo-label-03 text-foreground">
        상세 내용 <span className="text-brand-gray-100">(선택)</span>
      </label>
      <div className={cn(fieldVariants({ state: 'default' }), 'items-start')}>
        <textarea
          id="report-content"
          rows={3}
          value={content}
          maxLength={REPORT_CONTENT_MAX_LENGTH}
          disabled={submitting}
          onChange={(e) => setContent(e.target.value)}
          placeholder="신고 사유를 더 자세히 알려주시면 검토에 도움이 돼요"
          className="typo-label-02 flex-1 resize-none bg-transparent text-foreground outline-none placeholder:text-brand-gray-100 disabled:cursor-not-allowed"
        />
      </div>
      <span className="typo-body-c-02 self-end text-brand-gray-100">
        ({content.length}/{REPORT_CONTENT_MAX_LENGTH})
      </span>
    </div>
  )

  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent
        side="bottom"
        className="mx-auto flex max-h-[85dvh] max-w-xl flex-col gap-4 rounded-t-[20px] bg-card px-5 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-6"
      >
        <SheetHeader className="shrink-0 text-left">
          <SheetTitle>{TARGET_LABEL[targetType]}을 신고할까요?</SheetTitle>
          <SheetDescription>
            신고 사유를 선택해 주세요. 접수된 내용은 관리자가 확인합니다.
          </SheetDescription>
        </SheetHeader>

        {/* 사유 목록이 길어 화면을 넘치면 이 영역만 스크롤하고 버튼은 하단에 고정 */}
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
          {reasonList}
          {contentField}
        </div>

        <Button
          className="shrink-0"
          size="l"
          variant="primary"
          fullWidth
          disabled={!reason}
          loading={submitting}
          onClick={handleSubmit}
        >
          신고하기
        </Button>
      </SheetContent>
    </Sheet>
  )
}
