'use client'

import { useSyncExternalStore } from 'react'
import type { ReportType } from '@/api/report'
import {
  getReportedServerSnapshot,
  getReportedSnapshot,
  subscribeReported,
} from '@/utils/reportedContent'

/**
 * 내가 신고한 대상을 구독한다.
 * 신고 직후 목록·댓글이 새로고침 없이 바로 가려지도록 외부 저장소를 구독한다.
 */
export function useReportedContent() {
  const snapshot = useSyncExternalStore(
    subscribeReported,
    getReportedSnapshot,
    getReportedServerSnapshot,
  )

  return {
    isReported: (type: ReportType, id: number) => snapshot[type].has(id),
  }
}
