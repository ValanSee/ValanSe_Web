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

  const base = process.env.NEXT_PUBLIC_BASE_URL
  if (!base) return false
  try {
    const res = await fetch(
      `${base}/admin/analytics/mau?yearMonth=${currentYearMonth()}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
    )
    if (!res.ok) return false
  } catch {
    return false
  }

  if (verified.size > 100) verified.clear()
  verified.set(token, now + VERIFY_TTL_MS)
  return true
}
