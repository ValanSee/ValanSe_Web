'use client'

import { IconButton } from '@/components/ui/iconButton'
import { toast } from '@/components/ui/toaster'

interface ShareButtonProps {
  /** 공유할 절대 URL (쿼리 없는 canonical 주소) */
  url: string
  title: string
  /** 공유 시트에 함께 들어갈 문구 */
  text?: string
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

/**
 * 공유 버튼. 휴대폰 기본 공유 시트(Web Share API)가 있으면 열고, 없으면(PC · Android WebView) 링크를 복사한다.
 */
export default function ShareButton({
  url,
  title,
  text,
  label = '공유하기',
  className,
}: ShareButtonProps) {
  const handleShare = async () => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text, url })
        return
      } catch (error) {
        // 사용자가 공유 시트를 닫은 경우는 조용히 종료
        if (error instanceof DOMException && error.name === 'AbortError') return
        // 그 밖의 실패는 링크 복사로 대체
      }
    }

    if (await copyLink(url)) toast('링크를 복사했어요')
    else toast.error('링크를 복사하지 못했어요')
  }

  return (
    <IconButton
      icon="tabler:share"
      label={label}
      onClick={handleShare}
      className={className}
    />
  )
}
