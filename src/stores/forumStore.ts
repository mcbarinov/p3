import { create } from "zustand"
import type { Forum } from "@/types"

interface ForumState {
  forums: Forum[]
  setForums: (forums: Forum[]) => void
}

export const useForumStore = create<ForumState>((set) => ({
  forums: [],
  setForums: (forums) => set({ forums }),
}))
