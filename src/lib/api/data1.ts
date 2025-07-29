import type { Data1 } from "@/types"
import { type Result, err, ok } from "neverthrow"
import { api, parseApiError, type ApiError } from "."

export const data1Api = {
  getAll: async (): Promise<Result<Data1[], ApiError>> => {
    try {
      const res = await api.get("/api/data1").json<Data1[]>()
      return ok(res)
    } catch (error) {
      return err(await parseApiError(error))
    }
  },
}
