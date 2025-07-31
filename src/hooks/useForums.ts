import { useState, useCallback, useEffect } from "react"
import { api } from "@/lib/api"
import { useForumStore } from "@/stores/forumStore"
import type { ApiError } from "@/lib/api"

export function useForums() {
  const forums = useForumStore((state) => state.forums)
  const setForums = useForumStore((state) => state.setForums)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const loadForums = useCallback(async () => {
    setLoading(true)
    setError(null)

    const result = await api.forum.getForums()

    if (result.isOk()) {
      setForums(result.value)
    } else {
      setError(result.error)
    }

    setLoading(false)
  }, [setForums])

  // Auto-load forums on first use if not already loaded
  useEffect(() => {
    if (forums.length === 0 && !loading && !error) {
      loadForums()
    }
  }, [forums.length, loading, error, loadForums])

  return {
    forums,
    loading,
    error,
    refetch: loadForums,
  }
}
