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
      className={`grid ${getGridColsClass(options.length)} gap-2 w-full pt-4 min-h-[164px]`}
    >
      {options.map((option, index) => {
        const borderColor = getBorderColor(index)
        const textColor = getTextColor(index)
        return (
          <div
            key={option.optionId}
            className={`flex flex-col items-center gap-5 w-full h-full p-4 py-6 rounded-lg bg-white border`}
            style={{ borderColor }}
          >
            <div className="font-bold text-2xl" style={{ color: textColor }}>
              {optionLabel[index] ?? '?'}
            </div>
            <div className="text-sm text-center leading-tight">
              {option.content}
            </div>
          </div>
        )
      })}
    </div>
  )
}
