import type { ReactNode } from 'react'
import type { TooltipContentProps } from 'recharts'

export function StatCard({
  label,
  value,
  sub,
  loading,
  icon,
  accent = 'bg-white border-gray-200',
}: {
  label: string
  value?: number | string
  sub?: string
  loading: boolean
  icon?: ReactNode
  accent?: string
}) {
  const shown =
    typeof value === 'number' ? value.toLocaleString() : (value ?? '0')
  return (
    <div className={`rounded-lg border p-4 ${accent}`}>
      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-2xl font-semibold text-gray-900">
        {loading ? '...' : shown}
      </p>
      {sub && !loading && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  )
}

export function Panel({
  title,
  description,
  right,
  children,
}: {
  title: string
  description?: string
  right?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="mt-0.5 text-xs text-gray-500">{description}</p>
          )}
        </div>
        {right}
      </div>
      {children}
    </section>
  )
}

export function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <ul className="flex items-center gap-3 text-xs text-gray-600">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: it.color }}
          />
          {it.label}
        </li>
      ))}
    </ul>
  )
}

/** recharts 공용 툴팁 — 값은 텍스트 색, 시리즈 색은 옆 점으로만 */
export function ChartTooltip({
  active,
  payload,
  label,
  formatLabel,
}: Partial<TooltipContentProps<number, string>> & {
  formatLabel?: (label: string) => string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs shadow-sm">
      <p className="mb-1 font-medium text-gray-900">
        {formatLabel ? formatLabel(String(label)) : String(label)}
      </p>
      {payload.map((p) => (
        <p key={String(p.dataKey)} className="flex items-center gap-1.5 text-gray-700">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span>{p.name}</span>
          <span className="ml-auto pl-3 font-medium text-gray-900">
            {Number(p.value).toLocaleString()}
          </span>
        </p>
      ))}
    </div>
  )
}

export function Notice({
  tone = 'info',
  children,
}: {
  tone?: 'info' | 'warn' | 'error'
  children: ReactNode
}) {
  const cls = {
    info: 'bg-gray-50 text-gray-700',
    warn: 'bg-amber-50 text-amber-800',
    error: 'bg-red-50 text-red-700',
  }[tone]
  return <p className={`rounded-md px-3 py-2 text-xs ${cls}`}>{children}</p>
}
