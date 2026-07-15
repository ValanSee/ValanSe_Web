'use client'

import { TabBar, TabItem } from '@/components/ui/tabBar'

export type TitleTabKey = 'owned' | 'locked'

interface TitleTabsProps {
  active: TitleTabKey
  onChange: (key: TitleTabKey) => void
  ownedCount: number
  lockedCount: number
}

const TitleTabs = ({
  active,
  onChange,
  ownedCount,
  lockedCount,
}: TitleTabsProps) => {
  const tabs: { key: TitleTabKey; label: string; count: number }[] = [
    { key: 'owned', label: '보유', count: ownedCount },
    { key: 'locked', label: '잠금', count: lockedCount },
  ]

  return (
    <TabBar>
      {tabs.map((tab) => (
        <TabItem
          key={tab.key}
          label={`${tab.label} ${tab.count}`}
          selected={tab.key === active}
          onClick={() => onChange(tab.key)}
        />
      ))}
    </TabBar>
  )
}

export default TitleTabs
