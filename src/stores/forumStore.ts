import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Forum } from "@/types"

interface ForumState {
  forums: Forum[]
  setForums: (forums: Forum[]) => void
}

export const useForumStore = create<ForumState>()(
  persist(
    (set) => ({
      forums: [],
      setForums: (forums) => set({ forums }),
    }),
    {
      name: "forum-store",
    }
  )
)
