'use client'

import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Chip } from '@/components/ui/chip'

/**
 * 검색 페이지. Figma 노드 6397:27071 참조.
 *
 * 구조:
 *  - Header: 뒤로가기 + 검색 입력바 (X 클리어)
 *  - 최근 검색어 chip 목록
 *  - 검색 결과 목록 (mock UI, API는 후속)
 */
export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [recent, setRecent] = useState<string[]>([
    '살까 말까',
    '연애 고민',
    '아이폰',
  ])

  const removeRecent = (keyword: string) =>
    setRecent((prev) => prev.filter((r) => r !== keyword))

  const showResults = query.trim().length > 0

  const filtered = useMemo(
    () => recent.filter((r) => r.includes(query.trim())),
    [recent, query],
  )

  return (
    <div className="flex min-h-screen flex-col bg-card">
      {/* 검색 헤더 */}
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로가기"
          className="flex h-10 w-10 items-center justify-center text-foreground"
        >
          <Icon icon="icon-park-outline:left" width={24} aria-hidden />
        </button>
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-brand-gray-75 bg-card px-4 py-2">
          <Icon
            icon="tabler:search"
            className="text-brand-gray-100"
            width={20}
            aria-hidden
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력해주세요"
            className="typo-label-02 flex-1 bg-transparent text-foreground outline-none placeholder:text-brand-gray-100"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="검색어 지우기"
              className="text-brand-gray-100"
            >
              <Icon icon="iconoir:cancel" width={20} aria-hidden />
            </button>
          )}
        </div>
      </div>

      {/* 최근 검색어 (검색어 없을 때) */}
      {!showResults && (
        <section className="flex flex-col gap-3 px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="typo-title-03 text-foreground">최근 검색어</h2>
            {recent.length > 0 && (
              <button
                type="button"
                onClick={() => setRecent([])}
                className="typo-label-03 text-brand-gray-100"
              >
                전체 삭제
              </button>
            )}
          </div>
          {recent.length === 0 ? (
            <p className="typo-body-c-01 py-6 text-center text-brand-gray-100">
              최근 검색어가 없어요
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {recent.map((keyword) => (
                <Chip
                  key={keyword}
                  status="ghost"
                  size="m"
                  trailing={
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeRecent(keyword)
                      }}
                      aria-label={`${keyword} 삭제`}
                      className="text-brand-gray-100"
                    >
                      <Icon icon="iconoir:cancel" width={14} aria-hidden />
                    </button>
                  }
                >
                  {keyword}
                </Chip>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 검색 결과 (검색어 있을 때) */}
      {showResults && (
        <section className="flex flex-col gap-3 px-4 py-4">
          <h2 className="typo-title-03 text-foreground">
            &quot;{query}&quot; 검색 결과
          </h2>
          {filtered.length === 0 ? (
            <p className="typo-body-c-01 py-6 text-center text-brand-gray-100">
              검색 결과가 없어요
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {filtered.map((keyword) => (
                <li
                  key={keyword}
                  className="typo-label-02 rounded-xl bg-brand-gray-50 px-4 py-3 text-foreground"
                >
                  {keyword}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}
