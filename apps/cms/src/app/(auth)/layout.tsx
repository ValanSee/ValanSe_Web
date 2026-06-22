'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, LogOut } from 'lucide-react'
import { clearToken } from '@/lib/auth'

const NAV = [{ href: '/admin', label: '대시보드' }]

export default function AuthedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const onLogout = () => {
    clearToken()
    router.replace('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
        <span className="text-base font-semibold text-gray-900">ValanSe CMS</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="메뉴 열기"
          className="rounded-md p-1.5 text-gray-700 hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      <div className="md:flex">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-gray-200 bg-white md:flex">
          <div className="px-5 py-5 text-lg font-semibold text-gray-900">ValanSe CMS</div>
          <nav className="flex-1 space-y-0.5 px-3">
            {NAV.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-md px-3 py-2 text-sm transition ${
                    active
                      ? 'bg-gray-100 font-medium text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="border-t border-gray-200 p-3">
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4" />
              로그아웃
            </button>
          </div>
        </aside>

        {open && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <aside className="absolute right-0 top-0 flex h-full w-72 max-w-[80%] flex-col bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <span className="text-base font-semibold text-gray-900">메뉴</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="메뉴 닫기"
                  className="rounded-md p-1.5 text-gray-700 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-0.5 px-3 py-3">
                {NAV.map((item) => {
                  const active = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-md px-3 py-2 text-sm transition ${
                        active
                          ? 'bg-gray-100 font-medium text-gray-900'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
              <div className="border-t border-gray-200 p-3">
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4" />
                  로그아웃
                </button>
              </div>
            </aside>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
