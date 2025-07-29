import type { Data1 } from "@/types"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface Data1Store {
  store: Data1[] | null
  set: (data: Data1[] | null) => void
}

export const useData1Store = create<Data1Store>()(
  devtools(
    persist(
      (set) => ({
        store: null,
        set: (data) => set({ store: data }),
      }),
      {
        name: "data1-storage",
      }
    )
  )
)
