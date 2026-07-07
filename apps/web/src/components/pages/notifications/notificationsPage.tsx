'use client'

import { Icon } from '@iconify/react'
import BottomNavBar from '@/components/_shared/nav/bottomNavBar'
import Header from '@/components/_shared/header'

/**
 * 알림 페이지. 바텀탭 5탭 중 하나. 백엔드 API 확정 전까지 empty state.
 */
export default function NotificationsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background pb-24">
      <Header title="알림" />
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16">
        <Icon
          icon="lets-icons:bell-fill"
          className="text-brand-gray-75"
          width={64}
          aria-hidden
        />
        <p className="typo-title-02 text-brand-gray-200">
          아직 알림이 없어요
        </p>
        <p className="typo-body-b-01 text-brand-gray-100">
          새로운 알림이 오면 여기에서 확인할 수 있어요
        </p>
      </div>
      <BottomNavBar />
    </div>
  )
}
