'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { setToken, extractToken } from '@/lib/auth'
import axios from 'axios'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/auth/admin/login', { username, password })
      const token = extractToken(res.data)
      if (!token) {
        setError('응답에서 토큰을 찾지 못했습니다. 응답 형식을 확인해주세요.')
        return
      }
      setToken(token)
      router.replace('/admin')
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as
          | { message?: string; error?: string }
          | undefined
        setError(data?.message ?? data?.error ?? err.message ?? '로그인에 실패했습니다.')
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('로그인에 실패했습니다.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-gray-900">CMS 관리자 로그인</h1>
          <p className="text-xs text-gray-500">ValanSe 관리자 계정으로 로그인하세요.</p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            아이디
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          />
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-gray-900 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </main>
  )
}
