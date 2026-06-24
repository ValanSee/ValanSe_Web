import { api } from './api'
import type {
  AdminTitleDetail,
  AdminTitleListItem,
  DeleteTitleResponse,
  TitleFormPayload,
} from '@/types/title'

export async function fetchAdminTitles(): Promise<AdminTitleListItem[]> {
  const res = await api.get<AdminTitleListItem[]>('/member/titles/admin')
  return res.data
}

export async function createTitle(payload: TitleFormPayload): Promise<AdminTitleDetail> {
  const res = await api.post<AdminTitleDetail>('/member/titles', payload)
  return res.data
}

export async function updateTitle(
  titleId: number,
  payload: TitleFormPayload,
): Promise<AdminTitleDetail> {
  const res = await api.patch<AdminTitleDetail>(`/member/titles/${titleId}`, payload)
  return res.data
}

export async function deleteTitle(titleId: number): Promise<DeleteTitleResponse> {
  const res = await api.delete<DeleteTitleResponse>(`/member/titles/${titleId}`)
  return res.data
}
