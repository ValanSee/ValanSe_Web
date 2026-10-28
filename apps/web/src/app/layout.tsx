import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
// Pretendard 가변 폰트 dynamic subset: 유니코드 범위별로 쪼갠 woff2 92개 중 화면에 쓰인 글자 묶음만 받는다
// (예전 굵기별 전체 글리프 woff2 4개 ≈ 3MB 를 모든 페이지가 미리 받던 문제 해소)
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import './globals.css'
import Providers from './providers'
import { ModalRootInitializer } from './modalRootInitializer'
import { NativeBackHandler } from '@/components/_shared/nativeBackHandler'
import { AppUpdateChecker } from '@/components/_shared/appUpdateChecker'
import { PageViewTracker } from '@/components/_shared/pageViewTracker'
import DesktopHeader from '@/components/_shared/nav/desktopHeader'
import DesktopFooter from '@/components/_shared/desktopFooter'
import ChromeGate from '@/components/_shared/nav/chromeGate'
import { JsonLd } from '@/components/_shared/jsonLd'
import {
  BASE_OPEN_GRAPH,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
} from '@/constants/seo'
import { GA_MEASUREMENT_ID } from '@/lib/analytics'

// 토큰은 localStorage 에만 있어 서버가 로그인 여부를 모름 → 첫 페인트 전에 html 에 표시 (투표 상세 스켈레톤용)
const HAS_TOKEN_SCRIPT = `try{if(localStorage.getItem('access_token'))document.documentElement.setAttribute('data-has-token','')}catch(e){}`

// 앱(Android WebView)에서만 확대를 막는다. 웹은 접근성을 위해 확대 허용
// 앱은 __ANDROID_BRIDGE_READY__ 를 심으므로 이를 기준으로 판별. Android 의 사전 주입은 늦을 수 있어 DOMContentLoaded · load 에서도 다시 확인
const APP_NO_ZOOM_SCRIPT = `(function(){try{var c='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';var apply=function(){if(!window.__ANDROID_BRIDGE_READY__&&!window.ReactNativeWebView)return;var m=document.querySelector('meta[name="viewport"]');if(!m){m=document.createElement('meta');m.name='viewport';document.head.appendChild(m)}m.setAttribute('content',c)};apply();document.addEventListener('DOMContentLoaded',apply);window.addEventListener('load',apply)}catch(e){}})()`

// 카톡 인앱 브라우저는 링크를 시스템에 넘기지 않아 Android App Links 가 동작하지 않는다.
// Android 카톡에서 앱 처리 경로(AndroidManifest intent-filter 와 동일)로 들어오면 intent:// 로 앱을 열고,
// 앱이 없으면 browser_fallback_url 로 같은 페이지를 다시 연다. 탭당 한 번만 시도해 fallback 재진입 시 반복 안 함
const KAKAO_OPEN_APP_SCRIPT = `(function(){try{var ua=navigator.userAgent;if(location.host!=='valanse.kr'||!/Android/i.test(ua)||!/KAKAOTALK/i.test(ua))return;var p=location.pathname;if(!/^\\/(poll\\/|balanse|topics)/.test(p))return;var k='valanse:open-app-tried';if(sessionStorage.getItem(k))return;sessionStorage.setItem(k,'1');location.replace('intent://valanse.kr'+p+location.search+'#Intent;scheme=https;package=com.valanse;S.browser_fallback_url='+encodeURIComponent(location.href)+';end')}catch(e){}})()`

// GA4: 운영 도메인에서만 로드(프리뷰 · 로컬 제외). 앱 WebView 도 같은 스트림 → platform(app|web) 으로 구분
// 페이지 이동은 GA 향상된 측정(브라우저 기록 이벤트)이 page_view 로 잡는다. 이벤트 전송은 lib/analytics.ts trackEvent
const GA_INIT_SCRIPT = `(function(){if(location.host!=='valanse.kr')return;window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};var p=(window.ReactNativeWebView||window.__ANDROID_BRIDGE_READY__)?'app':'web';gtag('js',new Date());gtag('set','user_properties',{platform:p});gtag('config','${GA_MEASUREMENT_ID}',{platform:p});var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}';document.head.appendChild(s)})()`

// 검색 결과 사이트 이름 표시용 (https://developers.google.com/search/docs/appearance/site-names)
const WEBSITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  alternateName: '밸런스',
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
  // 확대 제한은 앱에서만 (APP_NO_ZOOM_SCRIPT). 웹은 저시력 사용자를 위해 확대 허용
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
      // 아래 인라인 스크립트가 hydration 전에 data-has-token 을 붙임
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: HAS_TOKEN_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: APP_NO_ZOOM_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: KAKAO_OPEN_APP_SCRIPT }} />
        <JsonLd data={WEBSITE_JSON_LD} />
      </head>
      <body
        className="bg-background font-pretendard"
        suppressHydrationWarning={true}
      >
        <Providers>
          <ModalRootInitializer />
          <NativeBackHandler />
          <AppUpdateChecker />
          <PageViewTracker />
          {/* PC(lg 이상)에서만 GNB · 푸터 노출. 래퍼도 lg 에서만 flex 라 모바일·WebView 는 기존 블록 흐름 그대로 */}
          <div className="lg:flex lg:min-h-screen lg:flex-col">
            {/* 프로젝터 화면(/event/{code}/screen)처럼 꽉 채우는 경로에선 GNB·푸터를 뺀다 */}
            <ChromeGate>
              <DesktopHeader />
            </ChromeGate>
            {/* 페이지 본문 랜드마크. 하위 페이지에서는 <main> 을 다시 쓰지 않는다 */}
            <main className="lg:flex lg:flex-1 lg:flex-col">{children}</main>
            <ChromeGate>
              <DesktopFooter />
            </ChromeGate>
          </div>
        </Providers>
        <Script id="ga4" strategy="afterInteractive">
          {GA_INIT_SCRIPT}
        </Script>
      </body>
    </html>
  )
}
