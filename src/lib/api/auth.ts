import { api, type ApiError } from "."
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
      console.log("Login error:", error)
      return err({ error: "Login failed", code: 500 })
    }
  },
}
