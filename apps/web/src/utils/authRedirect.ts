const STORAGE_KEY = 'valanse_post_auth_redirect'
const PENDING_VOTE_KEY = 'valanse_pending_vote'
const PENDING_VOTE_CLAIM_KEY = 'valanse_pending_vote_claim'
const PENDING_COMMENT_LIKE_KEY = 'valanse_pending_comment_like'

export type PendingVotePayload = { voteId: number; optionId: number }
/** parentId 가 있으면 대댓글 좋아요 */
export type PendingCommentLikePayload = {
  voteId: number
  commentId: number
  parentId: number | null
}

/** 쿼리·카카오 state 등에서 온 값이 같은 오리진 내부 경로인지 검사 (오픈 리다이렉트 방지) */
export function safeRedirectPath(
  raw: string | null | undefined,
): string | null {
  if (raw == null || raw === '') return null
  const decoded = raw.trim()
  if (!decoded.startsWith('/') || decoded.startsWith('//')) return null
  if (decoded.includes('://')) return null
  return decoded
}

export function buildCurrentReturnPath(
  pathname: string,
  searchParams: URLSearchParams,
): string {
  const q = searchParams.toString()
  return q ? `${pathname}?${q}` : pathname
}

/** 로그인(엔트리)으로 보낼 때, 로그인 후 돌아올 경로를 쿼리로 붙임 */
export function entryHrefWithRedirect(returnPath: string): string {
  const withSlash = returnPath.startsWith('/') ? returnPath : `/${returnPath}`
  const safe = safeRedirectPath(withSlash)
  if (!safe) return '/entry'
  return `/entry?redirect=${encodeURIComponent(safe)}`
}

/**
 * axios 인터셉터 등 React 밖에서: 현재 URL 기준으로 엔트리 + redirect.
 * (오픈 리다이렉트 방지는 entryHrefWithRedirect 내부 safeRedirectPath가 담당)
 */
export function entryHrefFromCurrentLocation(): string {
  if (typeof window === 'undefined') return '/entry'
  const path = `${window.location.pathname}${window.location.search}`
  return entryHrefWithRedirect(path)
}

/** 신규 가입(온보딩) 후 원래 가려던 경로 복원용 */
export function rememberPostAuthRedirect(path: string): void {
  const safe = safeRedirectPath(path)
  if (!safe) return
  try {
    sessionStorage.setItem(STORAGE_KEY, safe)
  } catch {
    /* private 모드 등 */
  }
}

export function consumePostAuthRedirect(): string | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) sessionStorage.removeItem(STORAGE_KEY)
    return safeRedirectPath(raw)
  } catch {
    return null
  }
}

/** 로그인 직전에 누른 보기 — 로그인 후 같은 투표 페이지에서 자동 제출 */
export function setPendingVote(
  voteId: number | string,
  optionId: number,
): void {
  try {
    sessionStorage.setItem(
      PENDING_VOTE_KEY,
      JSON.stringify({ voteId: Number(voteId), optionId }),
    )
  } catch {
    /* noop */
  }
}

export function peekPendingVote(): PendingVotePayload | null {
  try {
    const raw = sessionStorage.getItem(PENDING_VOTE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PendingVotePayload
    if (!Number.isFinite(parsed.voteId) || !Number.isFinite(parsed.optionId)) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function clearPendingVote(): void {
  try {
    sessionStorage.removeItem(PENDING_VOTE_KEY)
  } catch {
    /* noop */
  }
}

/** Strict/중복 effect로 이중 투표 요청 방지 */
export function tryClaimPendingVoteSubmit(voteId: number | string): boolean {
  try {
    if (sessionStorage.getItem(PENDING_VOTE_CLAIM_KEY)) return false
    sessionStorage.setItem(PENDING_VOTE_CLAIM_KEY, String(voteId))
    return true
  } catch {
    return false
  }
}

export function releasePendingVoteClaim(): void {
  try {
    sessionStorage.removeItem(PENDING_VOTE_CLAIM_KEY)
  } catch {
    /* noop */
  }
}

/** 로그인 직전에 누른 댓글 좋아요 — 로그인 후 같은 투표 페이지에서 자동 반영 */
export function setPendingCommentLike(
  voteId: number | string,
  commentId: number,
  parentId: number | null,
): void {
  try {
    sessionStorage.setItem(
      PENDING_COMMENT_LIKE_KEY,
      JSON.stringify({ voteId: Number(voteId), commentId, parentId }),
    )
  } catch {
    /* noop */
  }
}

/** 해당 투표의 대기 좋아요를 꺼내면서 지운다 (Strict/중복 effect 이중 요청 방지) */
export function consumePendingCommentLike(
  voteId: number | string,
): PendingCommentLikePayload | null {
  try {
    const raw = sessionStorage.getItem(PENDING_COMMENT_LIKE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PendingCommentLikePayload
    if (parsed.voteId !== Number(voteId)) return null
    sessionStorage.removeItem(PENDING_COMMENT_LIKE_KEY)
    if (!Number.isFinite(parsed.commentId)) return null
    return parsed
  } catch {
    return null
  }
}
