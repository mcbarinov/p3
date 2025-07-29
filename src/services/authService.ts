import { useAuthStore } from "@/stores/authStore"

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

export async function login(username: string, password: string): Promise<void> {
  console.log(`Logging in with username: ${username} and password: ${password}`)
  await sleep(1000)
  const login = useAuthStore.getState().login
  login("session123", "123", username)
}

export function logout(): Promise<void> {
  return new Promise((resolve) => {
    // Simulate an API call
    setTimeout(() => {
      resolve()
    }, 500)
  })
}
