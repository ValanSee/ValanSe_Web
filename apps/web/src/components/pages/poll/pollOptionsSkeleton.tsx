/**
 * 로그인 사용자의 투표 상태(hasVoted) 동기화 전 선택지 자리에 보여주는 스켈레톤.
 * 노출 여부는 globals.css 의 `[data-poll-options-skeleton]` 규칙이 결정 (SSR 첫 페인트부터 적용되도록 CSS 로 제어).
 */
export function PollOptionsSkeleton({ hasImages }: { hasImages: boolean }) {
  return (
    <div data-poll-options-skeleton aria-hidden>
      <div className="flex animate-pulse flex-col gap-4">
        {hasImages ? (
          <div className="flex gap-3">
            {[0, 1].map((i) => (
              <div key={i} className="flex w-[152px] flex-col gap-2">
                <div className="h-[152px] rounded-xl bg-brand-gray-50" />
                <div className="h-12 rounded-xl bg-brand-gray-50" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="h-14 rounded-xl bg-brand-gray-50" />
            <div className="h-14 rounded-xl bg-brand-gray-50" />
          </div>
        )}
        <div className="h-5 w-20 rounded bg-brand-gray-50" />
      </div>
    </div>
  )
}
