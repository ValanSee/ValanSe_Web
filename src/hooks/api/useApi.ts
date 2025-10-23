import { useState, useCallback } from 'react'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  onFinally?: () => void
}

interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: Error | null
  execute: (config: AxiosRequestConfig) => Promise<T>
  reset: () => void
}

export function useApi<T = unknown>(
  options: UseApiOptions<T> = {},
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(
    async (config: AxiosRequestConfig): Promise<T> => {
      setLoading(true)
      setError(null)

      try {
        const response: AxiosResponse<T> = await axios(config)
        setData(response.data)
        options.onSuccess?.(response.data)
        return response.data
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        options.onError?.(error)
        throw error
      } finally {
        setLoading(false)
        options.onFinally?.()
      }
    },
    [options],
  )

  const reset = useCallback(() => {
    setData(null)
    setLoading(false)
    setError(null)
  }, [])

  return {
    data,
    loading,
    error,
    execute,
    reset,
  }
}
