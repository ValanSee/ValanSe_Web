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

/*
 * 로그인 후 방문 기록 복원.
 * 카카오 로그인 페이지는 다른 도메인이라 기록에서 지울 수 없어, 로그인 후 새 기록을 쌓으면
 * 뒤로가기가 카카오 로그인으로 간다. 그래서 로그인 화면으로 push 하기 직전 기록 길이를 남겨 두고,
 * 로그인 성공 시 history.go 로 그 위치까지 되돌아가 카카오 기록을 '앞으로 가기' 쪽으로 밀어낸다.
 */
const LOGIN_ORIGIN_KEY = 'valanse_login_origin'
const POST_LOGIN_TARGET_KEY = 'valanse_post_login_target'
// 브라우저는 history.length 를 50 에서 멈추므로 그 근처에선 계산을 믿을 수 없다
const HISTORY_LENGTH_LIMIT = 50

/** 현재 페이지에서 로그인 화면으로 push 하기 직전에 호출 */
export function markLoginOrigin(): void {
  try {
    sessionStorage.setItem(LOGIN_ORIGIN_KEY, String(window.history.length))
  } catch {
    /* noop */
  }
}

function readLoginOrigin(): number | null {
  try {
    const len = Number(sessionStorage.getItem(LOGIN_ORIGIN_KEY))
    return Number.isInteger(len) && len > 0 ? len : null
  } catch {
    return null
  }
}

function clearLoginOrigin(): void {
  try {
    sessionStorage.removeItem(LOGIN_ORIGIN_KEY)
  } catch {
    /* noop */
  }
}

/**
 * 로그인 화면 진입 시: 바로 직전에 push 로 들어온 경우에만 기록을 유지하고 아니면 지운다.
 * 유지되면 true — 뒤로가기로 원래 화면에 돌아갈 수 있다.
 */
export function validateLoginOrigin(): boolean {
  const len = readLoginOrigin()
  const valid =
    len !== null &&
    window.history.length === len + 1 &&
    window.history.length < HISTORY_LENGTH_LIMIT
  if (!valid) clearLoginOrigin()
  return valid
}

/**
 * 로그인 성공 후: 로그인 화면으로 오기 전 기록 위치로 되돌아간다.
 * 되돌아갈 수 없으면 false — 호출부에서 router.replace 로 이동한다.
 */
export function returnToLoginOrigin(target: string): boolean {
  const len = readLoginOrigin()
  clearLoginOrigin()
  if (len === null) return false
  const steps = window.history.length - len
  if (steps < 1 || window.history.length >= HISTORY_LENGTH_LIMIT) return false
  try {
    sessionStorage.setItem(POST_LOGIN_TARGET_KEY, target)
  } catch {
    return false
  }
  window.history.go(-steps)
  return true
}

/** 되돌아온 페이지에서 한 번 꺼내 쓰는 최종 목적지 */
export function consumePostLoginTarget(): string | null {
  try {
    const raw = sessionStorage.getItem(POST_LOGIN_TARGET_KEY)
    if (raw) sessionStorage.removeItem(POST_LOGIN_TARGET_KEY)
    return safeRedirectPath(raw)
  } catch {
    return null
  }
}
