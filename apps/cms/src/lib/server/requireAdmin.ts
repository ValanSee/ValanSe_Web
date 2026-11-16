import 'server-only'
import type { NextRequest } from 'next/server'
import { TOKEN_COOKIE_KEY, isTokenExpired } from '@/lib/authConst'

const VERIFY_TTL_MS = 5 * 60 * 1000
const verified = new Map<string, number>()

function currentYearMonth() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
  })
    .format(new Date())
    .slice(0, 7)
}

/**
 * 관리자 토큰 확인. CMS 서버는 JWT 시크릿을 모르므로 백엔드 admin API 가 200 을 주는지로 판단한다.
 * 같은 토큰은 5분간 다시 묻지 않는다
 */
export async function requireAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(TOKEN_COOKIE_KEY)?.value
  if (!token || isTokenExpired(token)) return false

  const now = Date.now()
  const until = verified.get(token)
  if (until && until > now) return true

  // 프로덕션 env 는 끝에 / 가 붙어 있어 // 경로가 되면 백엔드가 403 을 준다
  const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, '')
  if (!base) {
    console.error('[requireAdmin] NEXT_PUBLIC_BASE_URL 이 없습니다')
    return false
  }
  try {
    const res = await fetch(
      `${base}/admin/analytics/mau?yearMonth=${currentYearMonth()}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
    )
    if (!res.ok) {
      console.warn('[requireAdmin] 백엔드 관리자 확인 실패', res.status, base)
      return false
    }
  } catch (err) {
    console.error('[requireAdmin] 백엔드 호출 오류', base, err)
    return false
  }

  if (verified.size > 100) verified.clear()
  verified.set(token, now + VERIFY_TTL_MS)
  return true
}
