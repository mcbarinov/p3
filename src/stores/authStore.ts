import { create } from "zustand"
import { persist, devtools } from "zustand/middleware"

interface AuthState {
  sessionId: string | null
  userId: number | null
  username: string | null
  isAuthenticated: boolean

  login: (sessionId: string, userId: number, username: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        sessionId: null,
        userId: null,
        username: null,
        isAuthenticated: false,

        login: (sessionId, userId, username) =>
          set({
            sessionId,
            userId,
            username,
            isAuthenticated: true,
          }),

        logout: () =>
          set({
            sessionId: null,
            userId: null,
            username: null,
            isAuthenticated: false,
          }),
      }),
      {
        name: "auth-storage",
      }
    )
  )
)
