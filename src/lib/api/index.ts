import ky, { HTTPError } from "ky"
import { useAuthStore } from "../../stores/authStore"

export class ApiError extends Error {
  public readonly code: number

  constructor(message: string, code: number) {
    super(message)
    this.name = "ApiError"
    this.code = code
  }
}

async function parseApiError(error: unknown): Promise<ApiError> {
  // Handle ky HTTPError
  if (error instanceof HTTPError) {
    const status = error.response.status

    try {
      const data = await error.response.json()
      // Check if response has error field
      if (typeof data === "object" && data !== null && "error" in data) {
        return new ApiError(String(data.error), status)
      }
      // Fallback to stringifying the response
      return new ApiError(JSON.stringify(data), status)
    } catch {
      // If JSON parsing fails, use status text
      return new ApiError(error.response.statusText || `HTTP ${status} error`, status)
    }
  }

  // Handle network errors (server not responding)
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return new ApiError("Network error: Server is not responding", 0)
  }

  // Handle any other errors
  if (error instanceof Error) {
    return new ApiError(error.message, 500)
  }

  // Fallback for unknown errors
  return new ApiError("Unknown error occurred", 500)
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

async function apiRequest<T>(request: Promise<T>): Promise<T> {
  try {
    return await request
  } catch (error) {
    throw await parseApiError(error)
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
