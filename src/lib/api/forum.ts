import type { Forum, Post, Comment } from "@/types"
import { apiClient } from "."

export type CreatePostRequest = {
  title: string
  content: string
  forumId: number
}

export type CreateCommentRequest = {
  content: string
  postId: number
}

export const forumApi = {
  getForums: (): Promise<Forum[]> => apiClient.get<Forum[]>("forums"),

  getForum: (forumId: number): Promise<Forum> => apiClient.get<Forum>(`forums/${forumId}`),

  getForumPosts: (forumId: number): Promise<Post[]> => apiClient.get<Post[]>(`forums/${forumId}/posts`),

  getPost: (postId: number): Promise<Post> => apiClient.get<Post>(`posts/${postId}`),

  getPostComments: (postId: number): Promise<Comment[]> => apiClient.get<Comment[]>(`posts/${postId}/comments`),

  createPost: (request: CreatePostRequest): Promise<Post> => apiClient.post<Post>("posts", request),

  createComment: (request: CreateCommentRequest): Promise<Comment> =>
    apiClient.post<Comment>(`posts/${request.postId}/comments`, request),
}
