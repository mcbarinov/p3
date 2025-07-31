import { useState, useCallback } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/authStore"
import type { ApiError } from "@/lib/api"

export function useAuth() {
  const navigate = useNavigate()
  const { login: storeLogin, logout: storeLogout, isAuthenticated, username, userId } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const login = useCallback(
    async (username: string, password: string) => {
      setLoading(true)
      setError(null)

      const result = await api.auth.login({ username, password })

      if (result.isOk()) {
        storeLogin(result.value.sessionId, result.value.userId, username)
        toast.success("Login successful")
        navigate("/")
      } else {
        setError(result.error)
        toast.error("Login failed: " + result.error.error)
      }

      setLoading(false)
    },
    [navigate, storeLogin]
  )

  const logout = useCallback(async () => {
    setLoading(true)

    await api.auth.logout()
    storeLogout()
    navigate("/login")

    setLoading(false)
  }, [navigate, storeLogout])

  return {
    login,
    logout,
    loading,
    error,
    isAuthenticated,
    username,
    userId,
  }
}
