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
  /**
   * 비로그인 투표 시도 → 로그인 후 자동 투표 전환.
   * after_login 측정기준 등록일(since) 이후만 센다. 조회 실패 시 null
   */
  loginConversion: { attempts: number; afterLoginVotes: number; since: string } | null
}

/** Play 설치 통계 하루치. Daily Device/User 열은 비어 있어 이벤트 열을 쓴다 */
export interface InstallsDay {
  date: string
  /** Install events — 설치 행동 수 (재설치 포함) */
  installs: number
  /** Uninstall events */
  uninstalls: number
  /** Active Device Installs — 그날 설치돼 있는 기기 수 */
  activeDevices: number
}

export type InstallsDashboard =
  | {
      status: 'ok'
      days: number
      generatedAt: string
      daily: InstallsDay[]
      latest: InstallsDay | null
      /** 리포트가 있는 첫 달부터의 Install events 합 */
      cumulativeInstalls: number
      /** 리포트 첫 날짜 (누적 기준) */
      since: string | null
    }
  | {
      status: 'unavailable'
      reason: 'not_configured' | 'forbidden' | 'error'
      message: string
    }
