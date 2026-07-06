/* eslint-disable react/prop-types */

import * as React from 'react'
import { cn } from '@/lib/utils'

/** VoteCard root — 컨테이너 (radius 20, bg white, shadow, padding 20/16) */
const VoteCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex w-full max-w-[360px] flex-col gap-4 rounded-[20px] bg-card px-4 py-5 shadow-[0_0_4px_rgba(0,0,0,0.25)]',
      className,
    )}
    {...props}
  />
))
VoteCard.displayName = 'VoteCard'

/** 헤더 영역 (홈: chip+시간, 밸런스: 아바타+닉네임+시간) */
const VoteCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-3', className)}
    {...props}
  />
))
VoteCardHeader.displayName = 'VoteCardHeader'

/** 원형 프로필 아바타 (36px). Image src 없으면 회색 placeholder */
export interface VoteCardAvatarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
}

const VoteCardAvatar = React.forwardRef<HTMLDivElement, VoteCardAvatarProps>(
  ({ className, src, alt = '', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'h-9 w-9 shrink-0 overflow-hidden rounded-full bg-brand-gray-75',
        className,
      )}
      {...props}
    >
      {src && (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      )}
    </div>
  ),
)
VoteCardAvatar.displayName = 'VoteCardAvatar'

/** 닉네임 (Label-02 · 14/500) */
const VoteCardAuthor = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn('typo-label-03 text-foreground', className)}
    {...props}
  />
))
VoteCardAuthor.displayName = 'VoteCardAuthor'

/** 부가 메타 텍스트 (시간·업로더 안내 · Label-03) */
const VoteCardMeta = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn('typo-body-c-03 text-brand-gray-100', className)}
    {...props}
  />
))
VoteCardMeta.displayName = 'VoteCardMeta'

/** 질문 타이틀 (Title-02 · 17/600) */
const VoteCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('typo-title-02 text-foreground', className)}
    {...props}
  />
))
VoteCardTitle.displayName = 'VoteCardTitle'

/** 옵션 그룹 (A/VS/B 세로 배치) */
const VoteCardOptions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('relative flex flex-col gap-3', className)}
    {...props}
  />
))
VoteCardOptions.displayName = 'VoteCardOptions'

/** 단일 옵션 버튼 (bg G50 · V300 텍스트 · rounded-xl · padding 10 12) */
export interface VoteCardOptionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
}

const VoteCardOption = React.forwardRef<HTMLButtonElement, VoteCardOptionProps>(
  ({ className, selected, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      aria-pressed={selected}
      className={cn(
        'flex min-h-12 items-center justify-center rounded-xl px-3 py-2.5 typo-label-03 text-center transition-colors',
        selected
          ? 'bg-primary text-primary-foreground'
          : 'bg-brand-gray-50 text-primary hover:bg-brand-violet-50',
        className,
      )}
      {...props}
    />
  ),
)
VoteCardOption.displayName = 'VoteCardOption'

/** VS 배지 (옵션 A/B 사이 중앙) */
const VoteCardVS = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    className={cn(
      'absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-card typo-title-04 text-brand-black shadow-[0_0_4px_rgba(0,0,0,0.15)]',
      className,
    )}
    {...props}
  >
    VS
  </div>
))
VoteCardVS.displayName = 'VoteCardVS'

/** 하단 통계 (참여자·댓글·좋아요) */
export interface VoteCardStatsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  participants?: number
  commentCount?: number
  likeCount?: number
}

const VoteCardStats = React.forwardRef<HTMLDivElement, VoteCardStatsProps>(
  (
    { className, participants, commentCount, likeCount, children, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-between', className)}
      {...props}
    >
      {participants !== undefined ? (
        <span className="typo-body-c-03 text-brand-gray-100">
          {participants}명 참여 중
        </span>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-3">
        {commentCount !== undefined && (
          <VoteCardStatItem icon={<CommentIcon />} value={commentCount} />
        )}
        {likeCount !== undefined && (
          <VoteCardStatItem icon={<HeartIcon />} value={likeCount} />
        )}
        {children}
      </div>
    </div>
  ),
)
VoteCardStats.displayName = 'VoteCardStats'

const VoteCardStatItem = ({
  icon,
  value,
}: {
  icon: React.ReactNode
  value: React.ReactNode
}) => (
  <span className="flex items-center gap-1 text-brand-gray-100">
    {icon}
    <span className="typo-label-03">{value}</span>
  </span>
)

const CommentIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5V10a1.5 1.5 0 0 1-1.5 1.5H7l-3 3v-3H4.5A1.5 1.5 0 0 1 3 10V2.5z" />
  </svg>
)

const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path d="M8 14s-5-3.05-5-7a3 3 0 0 1 5-2.24A3 3 0 0 1 13 7c0 3.95-5 7-5 7z" />
  </svg>
)

export {
  VoteCard,
  VoteCardHeader,
  VoteCardAvatar,
  VoteCardAuthor,
  VoteCardMeta,
  VoteCardTitle,
  VoteCardOptions,
  VoteCardOption,
  VoteCardVS,
  VoteCardStats,
}
