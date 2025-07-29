import { data1Api } from "@/lib/api/data1"
import { useData1Store } from "@/stores/data1Store"
import { toast } from "sonner"

async function loadAll(): Promise<void> {
  const res = await data1Api.getAll()
  if (res.isErr()) {
    toast.error("Can't get data1: " + res.error.error)
    return
  }
  const set = useData1Store.getState().set
  set(res.value)
}

export const data1Service = { loadAll }
