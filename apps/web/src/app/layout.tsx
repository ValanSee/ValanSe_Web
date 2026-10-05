import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Providers from './providers'
import { ModalRootInitializer } from './modalRootInitializer'
import { NativeBackHandler } from '@/components/_shared/nativeBackHandler'
import { PageViewTracker } from '@/components/_shared/pageViewTracker'
import DesktopHeader from '@/components/_shared/nav/desktopHeader'
import DesktopFooter from '@/components/_shared/desktopFooter'
import { JsonLd } from '@/components/_shared/jsonLd'
import {
  BASE_OPEN_GRAPH,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
} from '@/constants/seo'

const pretendard = localFont({
  src: [
    {
      path: '../../public/fonts/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap',
  preload: true,
})

// 토큰은 localStorage 에만 있어 서버가 로그인 여부를 모름 → 첫 페인트 전에 html 에 표시 (투표 상세 스켈레톤용)
const HAS_TOKEN_SCRIPT = `try{if(localStorage.getItem('access_token'))document.documentElement.setAttribute('data-has-token','')}catch(e){}`

// 검색 결과 사이트 이름 표시용 (https://developers.google.com/search/docs/appearance/site-names)
const WEBSITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  alternateName: '발란스',
  url: `${SITE_URL}/`,
}

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
  openGraph: BASE_OPEN_GRAPH,
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
  verification: {
    other: {
      'naver-site-verification': '6bdeb6ea89ccbebd02069e32f8286a25518e16fe',
    },
  },
  category: 'entertainment',
}

export const viewport: Viewport = {
  themeColor: '#9E6BE6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // WebView edge-to-edge 환경에서 env(safe-area-inset-*) 값이 채워지도록 cover 지정
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      className={pretendard.variable}
      // 아래 인라인 스크립트가 hydration 전에 data-has-token 을 붙임
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: HAS_TOKEN_SCRIPT }} />
        <JsonLd data={WEBSITE_JSON_LD} />
      </head>
      <body
        className="bg-background font-pretendard"
        suppressHydrationWarning={true}
      >
        <Providers>
          <ModalRootInitializer />
          <NativeBackHandler />
          <PageViewTracker />
          {/* PC(lg 이상)에서만 GNB · 푸터 노출. 모바일·WebView 화면은 그대로 */}
          <div className="flex min-h-screen flex-col">
            <DesktopHeader />
            <div className="flex flex-1 flex-col">{children}</div>
            <DesktopFooter />
          </div>
        </Providers>
      </body>
    </html>
  )
}
