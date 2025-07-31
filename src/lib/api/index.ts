import ky, { HTTPError } from "ky"
import { useAuthStore } from "../../stores/authStore"

export interface ApiError {
  error: string
  code: number
}

export async function parseApiError(error: unknown): Promise<ApiError> {
  // Handle ky HTTPError
  if (error instanceof HTTPError) {
    const status = error.response.status

    try {
      const data = await error.response.json()
      // Check if response has error field
      if (typeof data === "object" && data !== null && "error" in data) {
        return {
          error: String(data.error),
          code: status,
        }
      }
      // Fallback to stringifying the response
      return {
        error: JSON.stringify(data),
        code: status,
      }
    } catch {
      // If JSON parsing fails, use status text
      return {
        error: error.response.statusText || `HTTP ${status} error`,
        code: status,
      }
    }
  }

  // Handle network errors (server not responding)
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      error: "Network error: Server is not responding",
      code: 0,
    }
  }

  // Handle any other errors
  if (error instanceof Error) {
    return {
      error: error.message,
      code: 500,
    }
  }

  // Fallback for unknown errors
  return {
    error: "Unknown error occurred",
    code: 500,
  }
}

export const api = ky.create({
  prefixUrl: "/api",
  hooks: {
    beforeRequest: [
      (request) => {
        // ARCHITECTURAL EXCEPTION: We intentionally access the auth store here
        // to automatically attach session headers to all API requests.
        // This violates our principle that API layer should not access stores,
        // but provides significant developer convenience by eliminating the need
        // to manually pass sessionId to every authenticated API call.
        const sessionId = useAuthStore.getState().sessionId
        if (sessionId) {
          request.headers.set("X-Session-ID", sessionId)
        }
      },
    ],
  },
})
