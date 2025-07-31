import ky, { HTTPError } from "ky"
import { err, ok, Result } from "neverthrow"
import { useAuthStore } from "../../stores/authStore"

export interface ApiError {
  error: string
  code: number
}

async function parseApiError(error: unknown): Promise<ApiError> {
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

const httpClient = ky.create({
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

async function apiRequest<T>(request: Promise<T>): Promise<Result<T, ApiError>> {
  try {
    const res = await request
    return ok(res)
  } catch (error) {
    return err(await parseApiError(error))
  }
}

export const apiClient = {
  get: <T>(url: string) => apiRequest(httpClient.get(url).json<T>()),

  post: <T>(url: string, data?: unknown) => apiRequest(httpClient.post(url, { json: data }).json<T>()),

  put: <T>(url: string, data?: unknown) => apiRequest(httpClient.put(url, { json: data }).json<T>()),

  patch: <T>(url: string, data?: unknown) => apiRequest(httpClient.patch(url, { json: data }).json<T>()),

  delete: <T>(url: string) => apiRequest(httpClient.delete(url).json<T>()),
}

// Unified API export (similar to hooks)
import { authApi } from "./auth"
import { forumApi } from "./forum"

export const api = {
  auth: authApi,
  forum: forumApi,
}
