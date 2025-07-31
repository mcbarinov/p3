import { Result } from "neverthrow"
import type { Forum, Post, Comment } from "@/types"
import { type ApiError, apiClient } from "."

export const forumApi = {
  getForums: (): Promise<Result<Forum[], ApiError>> => apiClient.get<Forum[]>("forums"),

  getForum: (forumId: number): Promise<Result<Forum, ApiError>> => apiClient.get<Forum>(`forums/${forumId}`),

  getForumPosts: (forumId: number): Promise<Result<Post[], ApiError>> => apiClient.get<Post[]>(`forums/${forumId}/posts`),

  getPost: (postId: number): Promise<Result<Post, ApiError>> => apiClient.get<Post>(`posts/${postId}`),

  getPostComments: (postId: number): Promise<Result<Comment[], ApiError>> => apiClient.get<Comment[]>(`posts/${postId}/comments`),
}
