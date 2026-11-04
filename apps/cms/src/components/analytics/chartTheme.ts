import type { Platform } from '@/types/dashboard'

/** 범주형 팔레트 고정 순서 — 앱은 항상 1번(파랑), 웹은 항상 2번(주황) */
export const SERIES = {
  app: '#2a78d6',
  web: '#eb6834',
  other: '#9ca3af',
} as const satisfies Record<Platform, string>

export const PLATFORM_LABEL: Record<Platform, string> = {
  app: '앱',
  web: '웹',
  other: '기타',
}

/** 단일 지표 차트용 */
export const SINGLE = SERIES.app
export const NEGATIVE = '#e34948'

export const GRID_STROKE = '#e5e7eb'
export const AXIS_TICK = { fill: '#6b7280', fontSize: 12 }

export const EVENT_LABEL: Record<string, string> = {
  sign_up: '회원가입',
  login: '로그인',
  onboarding_complete: '온보딩 완료',
  vote: '투표',
  comment: '댓글',
  create_vote: '게임 생성',
  share: '공유',
}

export function shortDate(date: string) {
  return date.slice(5).replace('-', '/')
}

export function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0초'
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return m > 0 ? `${m}분 ${s}초` : `${s}초`
}

export const fmt = (n: number) => n.toLocaleString()
