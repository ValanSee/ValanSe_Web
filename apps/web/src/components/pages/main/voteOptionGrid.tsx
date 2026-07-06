import React from 'react'

const optionLabel = ['A', 'B', 'C', 'D']

interface VoteOption {
  optionId: number
  content: string
  vote_count: number
}

interface VoteOptionGridProps {
  options: VoteOption[]
}

export default function VoteOptionGrid({ options }: VoteOptionGridProps) {
  if (!options || options.length === 0) return null

  // TODO(design): 옵션 A/B 강조색 (#5F81A3 blue, #F27F34 orange)은
  // 브랜드 팔레트에 대응 색이 없음. Figma 확정 후 브랜드 토큰으로 치환.
  const getBorderColor = (index: number) => {
    const colors = ['#5F81A3', '#F27F34']

    if (options.length === 2 || options.length === 3) {
      return colors[index % 2]
    } else if (options.length === 4) {
      if (index === 0 || index === 3) {
        return colors[0]
      } else {
        return colors[1]
      }
    }

    return colors[index % colors.length]
  }

  const getTextColor = (index: number) => getBorderColor(index)

  const getGridColsClass = (length: number) => {
    switch (length) {
      case 2:
        return 'grid-cols-2'
      case 3:
        return 'grid-cols-3'
      case 4:
        return 'grid-cols-2'
      default:
        return 'grid-cols-1'
    }
  }

  return (
    <div
      className={`grid ${getGridColsClass(options.length)} min-h-[164px] w-full gap-2 pt-4`}
    >
      {options.map((option, index) => {
        const borderColor = getBorderColor(index)
        const textColor = getTextColor(index)
        return (
          <div
            key={option.optionId}
            className="flex h-full w-full flex-col items-center gap-5 rounded-lg border bg-card p-4 py-6"
            style={{ borderColor }}
          >
            <div className="typo-heading-02" style={{ color: textColor }}>
              {optionLabel[index] ?? '?'}
            </div>
            <div className="typo-body-c-02 text-center text-foreground leading-tight">
              {option.content}
            </div>
          </div>
        )
      })}
    </div>
  )
}
