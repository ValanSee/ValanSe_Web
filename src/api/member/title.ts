import { authApi } from '../instance/authApi'
import {
  EquipTitleResponse,
  PurchaseTitleResponse,
  TitlesResponse,
} from '@/types/_shared/title'

export const fetchTitles = async (): Promise<TitlesResponse> => {
  try {
    const response = await authApi.get<TitlesResponse>('/member/titles')
    return response.data
  } catch (error) {
    throw error
  }
}

export const equipTitle = async (
  titleId: number,
): Promise<EquipTitleResponse> => {
  try {
    const response = await authApi.post<EquipTitleResponse>(
      `/member/titles/${titleId}/equip`,
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const purchaseTitle = async (
  titleId: number,
): Promise<PurchaseTitleResponse> => {
  try {
    const response = await authApi.post<PurchaseTitleResponse>(
      `/member/titles/${titleId}/purchase`,
    )
    return response.data
  } catch (error) {
    throw error
  }
}
