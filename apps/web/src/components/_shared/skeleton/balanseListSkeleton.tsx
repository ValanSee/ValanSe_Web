const BLOCK = 'animate-pulse rounded-xl bg-brand-gray-50'

/** 밸런스 게임 목록 로딩 자리 (카드 3개). 탭 이동 중 · 목록 로딩 중에 사용 */
export function BalanseListSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-4" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className={`${BLOCK} h-5 w-3/4`} />
          <div className="flex gap-3">
            <div className={`${BLOCK} h-14 flex-1`} />
            <div className={`${BLOCK} h-14 flex-1`} />
          </div>
          <div className={`${BLOCK} h-4 w-24`} />
        </div>
      ))}
    </div>
  )
}
