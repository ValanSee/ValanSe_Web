import { Icon } from '@iconify/react'
import { Chip } from '@/components/ui/chip'
import { getCategoryMeta } from '@/constants/category'

interface Props {
  category: string
}

export default function CategoryChip({ category }: Props) {
  const meta = getCategoryMeta(category)
  return (
    <Chip
      size="s"
      status="secondary"
      className="hover:bg-brand-violet-50"
      icon={meta && <Icon icon={meta.icon} width={14} aria-hidden />}
    >
      {meta?.label ?? category}
    </Chip>
  )
}
