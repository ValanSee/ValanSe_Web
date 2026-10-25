/**
 * 라우트 전환 시 페이지 진입 애니메이션.
 * template.tsx는 네비게이션마다 재마운트되므로 이동할 때마다 fade-in이 재생된다.
 * transform이 아닌 opacity만 사용 — 고정(fixed) 하단 네비게이션이 흔들리지 않도록.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in duration-300 ease-out">{children}</div>
  )
}
