import { api } from './api'
import type {
  ReportDetail,
  ReportListResult,
  ReportType,
  ReportedTargetItem,
} from '@/types/report'

// 서버 dev 는 { reports, page, size, hasNext }, main 은 순수 배열을 내려준다
type RawReportList =
  | ReportedTargetItem[]
  | { reports?: ReportedTargetItem[]; hasNext?: boolean }

export async function fetchReportedTargets(params: {
  type: ReportType
  sort?: 'latest' | 'popular'
  page?: number
  size?: number
}): Promise<ReportListResult> {
  const res = await api.get<RawReportList>('/report', {
    params: {
      type: params.type,
      sort: params.sort ?? 'latest',
      page: params.page ?? 0,
      size: params.size ?? 20,
    },
  })

  const raw = res.data
  // 배열 응답(main)에는 페이지 정보가 없어 첫 페이지만 노출된다
  return {
    reports: Array.isArray(raw) ? raw : (raw?.reports ?? []),
    hasNext: Array.isArray(raw) ? false : Boolean(raw?.hasNext),
  }
}

export async function fetchReportDetail(
  type: ReportType,
  targetId: number,
): Promise<ReportDetail> {
  const res = await api.get<ReportDetail>(`/report/${type}/${targetId}`)
  return res.data
}
