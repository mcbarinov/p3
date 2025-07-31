import { create } from "zustand"
import type { Forum, Post } from "@/types"

interface ForumState {
  forums: Forum[]
  posts: Post[]
  setForums: (forums: Forum[]) => void
  setPosts: (posts: Post[]) => void
}

export const useForumStore = create<ForumState>((set) => ({
  forums: [],
  posts: [],
  setForums: (forums) => set({ forums }),
  setPosts: (posts) => set({ posts }),
}))
