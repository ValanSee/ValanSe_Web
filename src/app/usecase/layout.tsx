import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Usecase (dev only)',
  robots: { index: false, follow: false, nocache: true },
}

export default function UsecaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (process.env.NEXT_PUBLIC_NODE_ENV === 'production') notFound()
  return (
    <div
      style={{
        maxWidth: 880,
        margin: '0 auto',
        padding: '24px 20px 80px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        color: '#1f2937',
        lineHeight: 1.65,
      }}
    >
      {children}
    </div>
  )
}
