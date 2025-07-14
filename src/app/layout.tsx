import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import { ModalRootInitializer } from './modalRootInitializer'
import AuthRedirectWatcher from './authRedirectWatcher'

export const metadata: Metadata = {
  title: 'ValanSe',
  description: '밸런스게임 투표 공유 서비스',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="bg-background">
        <Providers>
          <AuthRedirectWatcher />
          <ModalRootInitializer />
          {children}
        </Providers>
      </body>
    </html>
  )
}
