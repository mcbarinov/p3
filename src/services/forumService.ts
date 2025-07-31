import { toast } from "sonner"
import { forumApi } from "@/lib/api/forum"
import { useForumStore } from "@/stores/forumStore"

export const forumService = {
  loadForums: async (): Promise<void> => {
    const result = await forumApi.getForums()

    if (result.isOk()) {
      useForumStore.getState().setForums(result.value)
    } else {
      toast.error("Failed to load forums")
    }
  },
}
