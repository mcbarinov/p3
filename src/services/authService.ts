import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/authStore"
import { toast } from "sonner"

export const authService = {
  login: async (username: string, password: string): Promise<void> => {
    const res = await api.auth.login({ username, password })
    if (res.isErr()) {
      toast.error("Login failed: " + res.error.error)
      return
    }
    const login = useAuthStore.getState().login
    login(res.value.sessionId, res.value.userId, username)
    toast.success("Login successful")
    window.location.href = "/"
  },

  logout: async (): Promise<void> => {
    await api.auth.logout()
    const { logout: storeLogout } = useAuthStore.getState()
    storeLogout()
    window.location.href = "/login"
  },
}
