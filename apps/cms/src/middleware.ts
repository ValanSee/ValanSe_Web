import { NextResponse, type NextRequest } from 'next/server'
import {
  EXPIRED_QUERY,
  TOKEN_COOKIE_KEY,
  isTokenExpired,
} from '@/lib/authConst'

export function middleware(req: NextRequest) {
  const token = req.cookies.get(TOKEN_COOKIE_KEY)?.value
  const isLogin = req.nextUrl.pathname.startsWith('/login')

  // 만료된 토큰으로 관리 화면에 들어오면 빈 목록 대신 바로 로그인 화면으로
  if (token && isTokenExpired(token)) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.search = isLogin ? req.nextUrl.search : `?${EXPIRED_QUERY}=1`
    const res = isLogin ? NextResponse.next() : NextResponse.redirect(url)
    res.cookies.delete(TOKEN_COOKIE_KEY)
    return res
  }

  if (!token && !isLogin) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  if (token && isLogin) {
    const url = req.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
