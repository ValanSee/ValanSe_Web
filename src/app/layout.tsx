import type { Metadata, Viewport } from 'next'
import './globals.css'
import Providers from './providers'
import { ModalRootInitializer } from './modalRootInitializer'
import { NativeBackHandler } from '@/components/_shared/nativeBackHandler'

const SITE_URL = 'https://valanse.kr'
const SITE_NAME = 'ValanSe'
const DEFAULT_TITLE = 'ValanSe(발란스) - 밸런스게임 투표 공유 서비스'
const DEFAULT_DESCRIPTION =
  '재미있는 밸런스게임을 만들고 친구와 공유하세요. 커플·친구·술자리에서 즐기는 둘 중 하나 선택, 이상형 밸런스게임 모음. 음식, 연애 등 카테고리별 인기 질문을 ValanSe에서 만나보세요.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    '밸런스',
    '밸런스게임',
    '밸런스 게임',
    '밸런스게임 사이트',
    '재미있는 밸런스게임',
    '밸런스게임 모음',
    '밸런스게임 질문',
    '커플 밸런스게임',
    '친구 밸런스게임',
    '술자리 밸런스게임',
    '이상형 밸런스게임',
    '음식 밸런스게임',
    '연애 밸런스게임',
    '둘 중 하나 선택',
    '딜레마 질문',
    '발란세',
    'ValanSe',
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ValanSe - 밸런스게임 투표 공유 서비스',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    // Google Search Console 등록 후 코드 입력
    // google: '',
    other: {
      // 네이버 서치어드바이저 등록 후 코드 입력
      // 'naver-site-verification': '',
    },
  },
  category: 'entertainment',
}

export const viewport: Viewport = {
  themeColor: '#4D7298',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="bg-background" suppressHydrationWarning={true}>
        <Providers>
          <ModalRootInitializer />
          <NativeBackHandler />
          {children}
        </Providers>
      </body>
    </html>
  )
}
