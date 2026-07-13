import Link from 'next/link'
import { Icon } from '@iconify/react'

interface Props {
  title: string
  /** 우측 "더보기" 링크 대상. 지정하면 링크 노출 */
  moreHref?: string
  /** 우측 커스텀 액션 (moreHref 대신) */
  action?: React.ReactNode
}

/**
 * 페이지 섹션 헤더 · 좌측 타이틀 · 우측 "더보기" 링크 or 커스텀 액션.
 */
export default function SectionHeader({ title, moreHref, action }: Props) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="typo-heading-06 text-foreground">{title}</h2>
      {action ??
        (moreHref && (
          <Link
            href={moreHref}
            className="typo-label-02 flex items-center gap-0.5 text-brand-gray-200"
          >
            더보기
            <Icon icon="icon-park-outline:right" width={16} aria-hidden />
          </Link>
        ))}
    </div>
  )
}
