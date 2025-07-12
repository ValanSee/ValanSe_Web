import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import { ModalRootInitializer } from './modalRootInitializer'

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
          <div className="max-w-3xl mx-auto">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
