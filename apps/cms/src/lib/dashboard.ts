import axios from 'axios'
import type { GaDashboard, InstallsDashboard } from '@/types/dashboard'

/** 같은 출처의 CMS 서버 라우트 (cms_token 쿠키로 인증) — 백엔드용 api 인스턴스를 쓰지 않는다 */
const local = axios.create()

export async function fetchGaDashboard(days: number): Promise<GaDashboard> {
  const res = await local.get<GaDashboard>('/api/dashboard/ga', { params: { days } })
  return res.data
}

export async function fetchInstalls(days: number): Promise<InstallsDashboard> {
  const res = await local.get<InstallsDashboard>('/api/dashboard/installs', {
    params: { days },
  })
  return res.data
}
