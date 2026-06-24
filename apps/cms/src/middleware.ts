import { NextResponse, type NextRequest } from 'next/server'
import { TOKEN_COOKIE_KEY } from '@/lib/authConst'

export function middleware(req: NextRequest) {
  const token = req.cookies.get(TOKEN_COOKIE_KEY)?.value
  const isLogin = req.nextUrl.pathname.startsWith('/login')

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
