import { AuthGuard } from '@/components/_shared/authGuard'

/**
 * 로그인 후 주로 쓰는 화면. 일부 경로는 AuthGuard에서 토큰·세션 검사.
 */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AuthGuard>{children}</AuthGuard>
}
