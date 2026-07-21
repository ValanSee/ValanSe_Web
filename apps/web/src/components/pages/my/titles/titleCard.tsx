'use client'

import { Title } from '@/types/_shared/title'
import { Chip } from '@/components/ui/chip'
import { Button } from '@/components/ui/button'
import { TIER_LABEL } from './tierStyle'

interface TitleCardProps {
  title: Title
  onAction: (title: Title) => void
}

const TitleCard = ({ title, onAction }: TitleCardProps) => {
  const buttonLabel = title.equipped
    ? '장착중'
    : title.locked
      ? title.acquisitionType === 'POINT_PURCHASE'
        ? `${title.price}P 구매`
        : '잠금'
      : '장착'

  const buttonDisabled =
    title.equipped ||
    (title.locked && title.acquisitionType !== 'POINT_PURCHASE')

  const buttonVariant =
    title.equipped || buttonDisabled
      ? 'gray'
      : title.locked
        ? 'destructive'
        : 'primary'

  return (
    <li className="flex items-start justify-between gap-3 border-b border-brand-gray-75 py-4 last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Chip size="s" status="secondary">
            {TIER_LABEL[title.tier]}
          </Chip>
          <span className="typo-title-03 truncate text-foreground">
            {title.title}
          </span>
        </div>
        <p className="typo-body-c-02 mt-1 text-brand-gray-100">
          {title.description}
        </p>
        {title.locked && title.lockReason && (
          <p className="typo-body-c-02 mt-1 text-destructive">
            {title.lockReason}
          </p>
        )}
        {!title.locked && title.requirementText && (
          <p className="typo-body-c-02 mt-1 text-brand-gray-100">
            획득 조건: {title.requirementText}
          </p>
        )}
      </div>
      <Button
        size="s"
        variant={buttonVariant}
        onClick={() => onAction(title)}
        disabled={buttonDisabled}
        className="shrink-0"
      >
        {buttonLabel}
      </Button>
    </li>
  )
}

export default TitleCard
