import ky from "ky"
import { useAuthStore } from "../../stores/authStore"

export interface ApiError {
  error: string
  code: number
}

export const api = ky.create({
  prefixUrl: "/api",
  hooks: {
    beforeRequest: [
      (request) => {
        const sessionId = useAuthStore.getState().sessionId
        if (sessionId) {
          request.headers.set("X-Session-ID", sessionId)
        }
      },
    ],
  },
})
