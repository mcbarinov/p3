import { authApi } from "@/lib/api/auth"
import { useAuthStore } from "@/stores/authStore"
import { toast } from "sonner"

async function login(username: string, password: string): Promise<void> {
  const res = await authApi.login({ username, password })
  if (res.isErr()) {
    toast.error("Login failed: " + res.error.error)
    return
  }
  const login = useAuthStore.getState().login
  login(res.value.sessionId, res.value.userId, username)
  toast.success("Login successful")
  window.location.href = "/"
}

async function logout(): Promise<void> {
  await authApi.logout()
  const { logout: storeLogout } = useAuthStore.getState()
  storeLogout()
  window.location.href = "/login"
}

export const authService = {
  login,
  logout,
}
