import { authApi } from "@/lib/api/auth"
import { useAuthStore } from "@/stores/authStore"
import { toast } from "sonner"

export async function login(username: string, password: string): Promise<void> {
  console.log(`Logging in with username: ${username}`)
  try {
    const res = await authApi.login({ username, password })
    console.log("Login response:", res)
    const login = useAuthStore.getState().login
    login(res.sessionId, res.userId, username)
    toast.success("Login successful")
    window.location.href = "/"
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed"
    toast.error(message)
  }
}

export function logout(): Promise<void> {
  return new Promise((resolve) => {
    // Simulate an API call
    setTimeout(() => {
      resolve()
    }, 500)
  })
}
