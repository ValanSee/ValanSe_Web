/** GA user property · 이벤트 파라미터 platform. 그 외 값((not set) 등)은 other */
export type Platform = 'app' | 'web' | 'other'

export type ByPlatform<T> = Record<Platform, T>

export interface PlatformTotals {
  activeUsers: number
  newUsers: number
  sessions: number
  engagedSessions: number
  /** userEngagementDuration (초) */
  engagementSeconds: number
  pageViews: number
}

export interface GaDashboard {
  days: number
  startDate: string
  endDate: string
  generatedAt: string
  /** endDate 기준 1·7·28일 활성 사용자 */
  active: ByPlatform<{ dau: number; wau: number; mau: number }>
  totals: ByPlatform<PlatformTotals>
  /** 일별 활성 사용자 */
  daily: ({ date: string } & ByPlatform<number>)[]
  events: ({ name: string } & ByPlatform<number>)[]
  sources: { sourceMedium: string; sessions: number; activeUsers: number }[]
}

export interface InstallsDay {
  date: string
  deviceInstalls: number
  deviceUninstalls: number
  userInstalls: number
  userUninstalls: number
  activeDevices: number
  totalUserInstalls: number
}

export type InstallsDashboard =
  | {
      status: 'ok'
      days: number
      generatedAt: string
      daily: InstallsDay[]
      latest: InstallsDay | null
    }
  | {
      status: 'unavailable'
      reason: 'not_configured' | 'forbidden' | 'error'
      message: string
    }
