import { type ApiError, apiClient } from "."
import { Result } from "neverthrow"

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  sessionId: string
  userId: number
}

export const authApi = {
  login: (data: LoginRequest): Promise<Result<LoginResponse, ApiError>> => apiClient.post<LoginResponse>("auth/login", data),

  logout: (): Promise<Result<{ message: string }, ApiError>> => apiClient.post<{ message: string }>("auth/logout"),
}
