import { api } from './api'
import type { MauResponse } from '@/types/analytics'

export async function fetchMau(yearMonth: string): Promise<MauResponse> {
  const res = await api.get<MauResponse>('/admin/analytics/mau', {
    params: { yearMonth },
  })
  return res.data
}
