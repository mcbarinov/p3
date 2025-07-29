import { api } from "."

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  sessionId: string
  userId: number
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return await api.post("auth/login", { json: data }).json<LoginResponse>()
  },
}
