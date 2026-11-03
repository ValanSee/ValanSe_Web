'use client'

import { IconButton } from '@/components/ui/iconButton'
import { toast } from '@/components/ui/toaster'
import { trackEvent, withShareUtm } from '@/lib/analytics'

interface ShareButtonProps extends ShareData {
  label?: string
  className?: string
}

/** navigator.clipboard 를 못 쓰는 환경(일부 WebView · 비보안 컨텍스트)용 복사 */
function legacyCopy(value: string): boolean {
  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  try {
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    document.body.removeChild(textarea)
  }
}

async function copyLink(url: string) {
  try {
    await navigator.clipboard.writeText(url)
    return true
  } catch {
    return legacyCopy(url)
  }
}

/** 앱 ↔ 웹 공유 메시지 형식 (ValanSe_Native App.tsx onMessage 와 동일) */
export const NATIVE_SHARE_MESSAGE_TYPE = 'share'

export interface ShareData {
  /** 공유할 절대 URL (쿼리 없는 canonical 주소) */
  url: string
  title: string
  /** 공유 시트에 함께 들어갈 문구 */
  text?: string
  /** GA share 이벤트용 — 공유한 게임 id · 버튼 위치 */
  analytics?: { voteId?: number; location: 'header' | 'post_vote' }
}

type ShareMethod = 'native' | 'web_share' | 'copy'

/** 공유 성공 시 GA share 이벤트 (GA4 추천 이벤트: method · content_type · item_id) */
function trackShare(method: ShareMethod, analytics: ShareData['analytics']) {
  trackEvent('share', {
    method,
    content_type: 'poll',
    item_id: analytics?.voteId,
    location: analytics?.location,
  })
}

/**
 * 링크 공유.
 * 1. 앱(WebView)이 네이티브 공유를 지원하면(`__NATIVE_SHARE__`) 앱에 요청 → 휴대폰 공유 시트
 *    (Android WebView 에는 Web Share API 가 없어서 앱이 대신 연다. 구버전 앱은 표시가 없어 아래로)
 * 2. 브라우저가 Web Share API 를 지원하면 공유 시트
 * 3. 그 외(PC 일부 · 구버전 앱)는 링크 복사
 * 공유 URL 에는 utm_source=share · utm_medium=공유 방식을 붙여 되돌아온 방문을 GA 에서 구분한다
 * (canonical 은 쿼리 없는 주소라 검색 색인에는 영향 없음)
 */
export async function shareLink({ url, title, text, analytics }: ShareData) {
  if (window.__NATIVE_SHARE__ && window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: NATIVE_SHARE_MESSAGE_TYPE,
        title,
        text,
        url: withShareUtm(url, 'native'),
      }),
    )
    trackShare('native', analytics)
    return
  }

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title,
        text,
        url: withShareUtm(url, 'web_share'),
      })
      trackShare('web_share', analytics)
      return
    } catch (error) {
      // 사용자가 공유 시트를 닫은 경우는 조용히 종료
      if (error instanceof DOMException && error.name === 'AbortError') return
      // 그 밖의 실패는 링크 복사로 대체
    }
  }

  if (await copyLink(withShareUtm(url, 'copy'))) {
    toast('링크를 복사했어요')
    trackShare('copy', analytics)
  } else toast.error('링크를 복사하지 못했어요')
}

/** 헤더용 아이콘 공유 버튼 */
export default function ShareButton({
  url,
  title,
  text,
  analytics,
  label = '공유하기',
  className,
}: ShareButtonProps) {
  return (
    <IconButton
      icon="tabler:share"
      label={label}
      onClick={() => shareLink({ url, title, text, analytics })}
      className={className}
    />
  )
}
