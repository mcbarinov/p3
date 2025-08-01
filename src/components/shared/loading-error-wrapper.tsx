import type { ReactNode } from "react"

interface LoadingErrorWrapperProps {
  loading: boolean
  error: Error | null
  loadingMessage?: string
  errorPrefix?: string
  children: ReactNode
}

export function LoadingErrorWrapper({
  loading,
  error,
  loadingMessage = "Loading...",
  errorPrefix = "Error",
  children,
}: LoadingErrorWrapperProps) {
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">{loadingMessage}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">
          {errorPrefix}: {error.message}
        </div>
      </div>
    )
  }

  return <>{children}</>
}
