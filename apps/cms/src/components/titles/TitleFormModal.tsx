'use client'

import { useEffect, useState, type FormEvent } from 'react'
import axios from 'axios'
import { X } from 'lucide-react'
import { createTitle, updateTitle } from '@/lib/titles'
import {
  TITLE_ACQUISITION_TYPES,
  TITLE_TIERS,
  type AdminTitleListItem,
  type TitleAcquisitionType,
  type TitleFormPayload,
  type TitleTier,
} from '@/types/title'

type Props = {
  open: boolean
  initial: AdminTitleListItem | null
  onClose: () => void
  onSaved: () => void
}

const EMPTY: TitleFormPayload = {
  code: '',
  title: '',
  description: '',
  price: 0,
  tier: 'BASIC',
  acquisitionType: 'DEFAULT',
  requirementText: '',
  active: true,
  displayOrder: 0,
}

export function TitleFormModal({ open, initial, onClose, onSaved }: Props) {
  const [form, setForm] = useState<TitleFormPayload>(EMPTY)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setError(null)
    setForm(
      initial
        ? {
            code: initial.code,
            title: initial.titleName,
            description: initial.description,
            price: initial.price,
            tier: initial.tier,
            acquisitionType: initial.acquisitionType,
            requirementText: initial.requirementText,
            active: true,
            displayOrder: initial.displayOrder,
          }
        : EMPTY,
    )
  }, [open, initial])

  if (!open) return null

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      if (initial) await updateTitle(initial.titleId, form)
      else await createTitle(form)
      onSaved()
      onClose()
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? ((err.response?.data as { error?: string; message?: string } | undefined)
            ?.error ??
          (err.response?.data as { error?: string; message?: string } | undefined)
            ?.message ??
          err.message)
        : err instanceof Error
          ? err.message
          : '저장에 실패했습니다.'
      setError(msg)
    } finally {
      setBusy(false)
    }
  }

  const update = <K extends keyof TitleFormPayload>(k: K, v: TitleFormPayload[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-xl"
      >
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {initial ? '칭호 수정' : '새 칭호'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="코드" required>
            <input
              type="text"
              required
              value={form.code}
              onChange={(e) => update('code', e.target.value)}
              className={inputCls}
              placeholder="CHOICE_MASTER"
            />
          </Field>
          <Field label="이름" required>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              className={inputCls}
              placeholder="선택의 달인"
            />
          </Field>
          <Field label="등급" required>
            <select
              value={form.tier}
              onChange={(e) => update('tier', e.target.value as TitleTier)}
              className={inputCls}
            >
              {TITLE_TIERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="획득 방식" required>
            <select
              value={form.acquisitionType}
              onChange={(e) =>
                update('acquisitionType', e.target.value as TitleAcquisitionType)
              }
              className={inputCls}
            >
              {TITLE_ACQUISITION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="가격(P)">
            <input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => update('price', Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="표시 순서">
            <input
              type="number"
              value={form.displayOrder}
              onChange={(e) => update('displayOrder', Number(e.target.value))}
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="설명">
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            className={inputCls}
          />
        </Field>

        <Field label="획득 조건 문구">
          <input
            type="text"
            value={form.requirementText}
            onChange={(e) => update('requirementText', e.target.value)}
            className={inputCls}
            placeholder="300P 필요"
          />
        </Field>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => update('active', e.target.checked)}
          />
          활성화
        </label>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {busy ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </div>
  )
}

const inputCls =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900'

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-1">
      <span className="block text-xs font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  )
}
