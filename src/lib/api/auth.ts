import { api, type ApiError, parseApiError } from "."
import { err, ok, Result } from "neverthrow"

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  sessionId: string
  userId: number
}

export const authApi = {
  login: async (data: LoginRequest): Promise<Result<LoginResponse, ApiError>> => {
    try {
      const res = await api.post("auth/login", { json: data }).json<LoginResponse>()
      return ok(res)
    } catch (error) {
      return err(await parseApiError(error))
    }
  },

  logout: async (): Promise<Result<{ message: string }, ApiError>> => {
    try {
      const res = await api.post("auth/logout").json<{ message: string }>()
      return ok(res)
    } catch (error) {
      return err(await parseApiError(error))
    }
  },
}
