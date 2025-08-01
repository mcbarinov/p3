import { apiClient } from "."

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  sessionId: string
  userId: number
}

export const authApi = {
  login: (data: LoginRequest): Promise<LoginResponse> => apiClient.post<LoginResponse>("auth/login", data),

  logout: (): Promise<{ message: string }> => apiClient.post<{ message: string }>("auth/logout"),
}
