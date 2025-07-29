import { authApi } from "@/lib/api/auth"
import { useAuthStore } from "@/stores/authStore"
import { toast } from "sonner"

export async function login(username: string, password: string): Promise<void> {
  console.log(`Logging in with username: ${username}`)

  const res = await authApi.login({ username, password })
  if (res.isErr()) {
    console.error("Login failed:", res.error)
    toast.error("Login failed: " + res.error.error)
    return
  }
  console.log("Login response:", res)
  const login = useAuthStore.getState().login
  login(res.sessionId, res.userId, username)
  toast.success("Login successful")
  window.location.href = "/"
}

export function logout(): Promise<void> {
  return new Promise((resolve) => {
    // Simulate an API call
    setTimeout(() => {
      resolve()
    }, 500)
  })
}
