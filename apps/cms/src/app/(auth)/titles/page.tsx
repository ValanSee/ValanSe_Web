'use client'

import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { deleteTitle, fetchAdminTitles } from '@/lib/titles'
import type { AdminTitleListItem } from '@/types/title'
import { TitleFormModal } from '@/components/titles/TitleFormModal'

export default function TitlesPage() {
  const [items, setItems] = useState<AdminTitleListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<AdminTitleListItem | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAdminTitles()
      const sorted = [...data].sort((a, b) => a.displayOrder - b.displayOrder)
      setItems(sorted)
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? ((err.response?.data as { error?: string; message?: string } | undefined)
            ?.error ??
          (err.response?.data as { error?: string; message?: string } | undefined)
            ?.message ??
          err.message)
        : err instanceof Error
          ? err.message
          : '목록을 불러오지 못했습니다.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const onCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const onEdit = (item: AdminTitleListItem) => {
    setEditing(item)
    setModalOpen(true)
  }

  const onDelete = async (item: AdminTitleListItem) => {
    if (
      !window.confirm(
        `'${item.titleName}' 칭호를 삭제하시겠습니까?\n장착 중인 회원은 기본 칭호로 변경됩니다.`,
      )
    )
      return
    try {
      const res = await deleteTitle(item.titleId)
      alert(
        `삭제됨: ${res.deletedTitle}\n대체 칭호: ${res.fallbackTitle}\n재할당 회원: ${res.reassignedCount}명`,
      )
      load()
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? ((err.response?.data as { error?: string; message?: string } | undefined)
            ?.error ??
          (err.response?.data as { error?: string; message?: string } | undefined)
            ?.message ??
          err.message)
        : err instanceof Error
          ? err.message
          : '삭제에 실패했습니다.'
      alert(msg)
    }
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">칭호 관리</h1>
          <p className="text-sm text-gray-600">칭호 마스터 데이터를 관리합니다.</p>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" />새 칭호
        </button>
      </header>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs text-gray-600">
            <tr>
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 font-medium">코드</th>
              <th className="px-3 py-2 font-medium">이름</th>
              <th className="px-3 py-2 font-medium">등급</th>
              <th className="px-3 py-2 font-medium">획득</th>
              <th className="px-3 py-2 text-right font-medium">가격</th>
              <th className="px-3 py-2 font-medium">조건</th>
              <th className="px-3 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length === 0 && !loading && (
              <tr>
                <td colSpan={8} className="px-3 py-12 text-center text-gray-500">
                  칭호가 없습니다.
                </td>
              </tr>
            )}
            {items.map((it) => (
              <tr key={it.titleId} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-500">{it.displayOrder}</td>
                <td className="px-3 py-2 font-mono text-xs text-gray-700">{it.code}</td>
                <td className="px-3 py-2 font-medium text-gray-900">{it.titleName}</td>
                <td className="px-3 py-2 text-gray-700">{it.tier}</td>
                <td className="px-3 py-2 text-gray-700">{it.acquisitionType}</td>
                <td className="px-3 py-2 text-right text-gray-700">
                  {it.price.toLocaleString()}
                </td>
                <td className="px-3 py-2 text-gray-500">{it.requirementText}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(it)}
                      aria-label="수정"
                      className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(it)}
                      aria-label="삭제"
                      className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TitleFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSaved={load}
      />
    </div>
  )
}
