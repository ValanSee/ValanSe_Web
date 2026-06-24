import { publicApi } from './instance/publicApi'
import { getAccessToken } from '@/utils/tokenUtils'

export interface PageViewPayload {
  anonymousId: string
  pagePath: string
}

export interface PageViewResponse {
  eventId: number
}

export async function postPageView(payload: PageViewPayload): Promise<PageViewResponse> {
  const token = getAccessToken()
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  const res = await publicApi.post<PageViewResponse>(
    '/analytics/events/page-view',
    payload,
    config,
  )
  return res.data
}
