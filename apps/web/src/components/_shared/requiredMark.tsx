interface RequiredMarkProps {
  className?: string
}

/** 필수 입력 필드 라벨 옆에 표시하는 빨간 별표 */
export default function RequiredMark({ className = '' }: RequiredMarkProps) {
  return (
    <span aria-hidden="true" className={`text-[#FF3B30] ${className}`}>
      *
    </span>
  )
}
