import { toast } from "sonner"
import { api } from "@/lib/api"
import { useForumStore } from "@/stores/forumStore"
import type { Post } from "@/types"

export const forumService = {
  loadForums: async (): Promise<void> => {
    const result = await api.forum.getForums()

    if (result.isOk()) {
      useForumStore.getState().setForums(result.value)
    } else {
      toast.error("Failed to load forums")
    }
  },

  getForumPosts: async (forumId: number): Promise<Post[]> => {
    const result = await api.forum.getForumPosts(forumId)

    if (result.isOk()) {
      return result.value
    } else {
      toast.error("Failed to load forum posts")
      return []
    }
  },
}
