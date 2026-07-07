'use client'

import { Title } from '@/types/_shared/title'
import { Chip } from '@/components/ui/chip'
import { TIER_LABEL } from './tierStyle'

interface TitleCurrentSectionProps {
  equipped: Title | null
  point: number
}

const TitleCurrentSection = ({
  equipped,
  point,
}: TitleCurrentSectionProps) => {
  return (
    <section className="flex flex-col gap-2 bg-card px-5 pb-5 pt-4">
      <div className="flex items-center justify-between">
        <span className="typo-body-c-01 text-brand-gray-100">
          현재 장착 칭호
        </span>
        <span className="typo-body-c-01 text-brand-gray-100">
          보유{' '}
          <span className="typo-label-03 text-primary">
            {point.toLocaleString()}P
          </span>
        </span>
      </div>
      {equipped ? (
        <div className="flex items-center gap-2">
          <Chip size="s" status="secondary">
            {TIER_LABEL[equipped.tier]}
          </Chip>
          <span className="typo-heading-05 text-foreground">
            {equipped.title}
          </span>
        </div>
      ) : (
        <p className="typo-body-b-01 text-brand-gray-100">
          장착된 칭호가 없어요
        </p>
      )}
    </section>
  )
}

export default TitleCurrentSection
