import { Result } from "neverthrow"
import type { Forum } from "@/types"
import { type ApiError, apiClient } from "."

export const forumApi = {
  getForums: (): Promise<Result<Forum[], ApiError>> => apiClient.get<Forum[]>("forums"),
}
