import Header from '@/components/_shared/header'
import { BalanseListSkeleton } from '@/components/_shared/skeleton/balanseListSkeleton'
import { DESKTOP_PAGE_COLUMN } from '@/constants/layout'
import { cn } from '@/lib/utils'

const BLOCK = 'animate-pulse rounded-xl bg-brand-gray-50'
const ROOT = cn('flex min-h-screen flex-col bg-card pb-24', DESKTOP_PAGE_COLUMN)

export function BalansePageSkeleton() {
  return (
    <div className={ROOT} aria-busy aria-hidden>
      <Header className="lg:hidden" titleAs="p" title="밸런스 게임" />
      <div className="h-11 border-b border-brand-gray-75 lg:hidden" />
      <BalanseListSkeleton />
    </div>
  )
}

export function CreatePageSkeleton() {
  return (
    <div className={ROOT} aria-busy aria-hidden>
      <Header showBackButton title="밸런스 게임 만들기" />
      <div className="flex flex-col gap-4 px-4 pt-4">
        <div className={`${BLOCK} h-14`} />
        <div className={`${BLOCK} h-32`} />
        <div className={`${BLOCK} h-14`} />
        <div className={`${BLOCK} h-14`} />
      </div>
    </div>
  )
}

export function MyPageSkeleton() {
  return (
    <div className={ROOT} aria-busy aria-hidden>
      <Header title="마이" />
      <div className="flex flex-col gap-6 px-4 pt-4">
        <div className="flex items-center gap-4">
          <div className="size-16 animate-pulse rounded-full bg-brand-gray-50" />
          <div className="flex flex-1 flex-col gap-2">
            <div className={`${BLOCK} h-5 w-32`} />
            <div className={`${BLOCK} h-4 w-48`} />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`${BLOCK} h-12`} />
          ))}
        </div>
      </div>
    </div>
  )
}

/** 탭 경로(정확 일치)일 때만 해당 스켈레톤, 그 외는 null */
export function tabPageSkeletonFor(pathname: string): React.ReactNode | null {
  switch (pathname) {
    case '/balanse':
      return <BalansePageSkeleton />
    case '/create':
      return <CreatePageSkeleton />
    case '/my':
      return <MyPageSkeleton />
    default:
      return null
  }
}
