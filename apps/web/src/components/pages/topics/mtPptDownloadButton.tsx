'use client'

import { Icon } from '@/components/ui/icon'
import { postPageView } from '@/api/analytics'
import { getOrCreateAnonymousId } from '@/utils/anonymousId'
import {
  MT_PPT_DOWNLOAD_EVENT_PATH,
  MT_PPT_FILE,
  MT_PPT_FILE_NAME,
} from '@/constants/mtPpt'

/**
 * 샘플 PPT 다운로드 링크. 클릭을 페이지뷰 이벤트(`/topics/mt-ppt#download`)로 남겨
 * 별도 분석 도구 없이 다운로드 수를 센다. 기록 실패는 무시하고 다운로드는 그대로 진행.
 */
export default function MtPptDownloadButton() {
  const logDownload = () => {
    if (process.env.NODE_ENV !== 'production') return
    const anonymousId = getOrCreateAnonymousId()
    if (!anonymousId) return
    postPageView({ anonymousId, pagePath: MT_PPT_DOWNLOAD_EVENT_PATH }).catch(
      () => {},
    )
  }

  return (
    <a
      href={MT_PPT_FILE}
      download={MT_PPT_FILE_NAME}
      onClick={logDownload}
      className="typo-label-01 flex h-14 items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-brand-violet-400"
    >
      <Icon icon="tabler:download" width={20} aria-hidden />
      무료 샘플 PPT 내려받기 (PPTX)
    </a>
  )
}
