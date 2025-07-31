import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Forum } from "@/types"

interface ForumState {
  forums: Forum[]
  setForums: (forums: Forum[]) => void
  getForumById: (forumId: number) => Forum | undefined
}

export const useForumStore = create<ForumState>()(
  persist(
    (set, get) => ({
      forums: [],
      setForums: (forums) => set({ forums }),
      getForumById: (forumId) => get().forums.find((forum) => forum.id === forumId),
    }),
    {
      name: "forum-store",
    }
  )
)
