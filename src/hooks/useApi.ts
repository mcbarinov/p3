import { useState, useEffect } from "react"
import type { Result } from "neverthrow"
import type { ApiError } from "@/lib/api"

interface UseApiOptions<TVariables = void> {
  immediate?: boolean // Should load immediately on mount (default: true)
  variables?: TVariables // Initial variables for immediate execution
}

export function useApi<T, TVariables = void>(
  apiFn: (variables?: TVariables) => Promise<Result<T, ApiError>>,
  deps: unknown[] = [],
  options: UseApiOptions<TVariables> = {}
) {
  const { immediate = true, variables } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const execute = async (executeVariables?: TVariables): Promise<Result<T, ApiError>> => {
    setLoading(true)
    setError(null)

    try {
      // Use provided variables or fall back to options.variables
      const varsToUse = executeVariables !== undefined ? executeVariables : variables
      const result = await apiFn(varsToUse)

      if (result.isOk()) {
        setData(result.value)
      } else {
        setError(result.error)
        setData(null)
      }

      setLoading(false)
      return result
    } catch (_err) {
      const errorResult = { error: "Unexpected error occurred", code: 500 } as ApiError
      setError(errorResult)
      setData(null)
      setLoading(false)

      // Return error result for consistent typing
      return { isOk: () => false, error: errorResult } as Result<T, ApiError>
    }
  }

  const reset = () => {
    setData(null)
    setError(null)
    setLoading(false)
  }

  // Auto-load on mount and when dependencies change
  useEffect(() => {
    if (immediate) {
      execute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, immediate])

  return {
    data,
    loading,
    error,
    execute,
    reset,
  }
}
