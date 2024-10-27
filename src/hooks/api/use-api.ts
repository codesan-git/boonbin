import { useState, useCallback } from 'react'

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const apiCall = useCallback(async (url: string, options?: RequestInit) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(url, options)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const result = await response.json()
      setData(result)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, apiCall }
}