import { Result } from "neverthrow"
import type { Forum, Post } from "@/types"
import { type ApiError, apiClient } from "."

export const forumApi = {
  getForums: (): Promise<Result<Forum[], ApiError>> => apiClient.get<Forum[]>("forums"),

  getForum: (forumId: number): Promise<Result<Forum, ApiError>> => apiClient.get<Forum>(`forums/${forumId}`),

  getForumPosts: (forumId: number): Promise<Result<Post[], ApiError>> => apiClient.get<Post[]>(`forums/${forumId}/posts`),
}
