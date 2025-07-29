import { useEffect } from "react"
import { useData1Store } from "@/stores/data1Store"
import { data1Service } from "@/services/data1Service"

export function Data1Page() {
  const data1List = useData1Store((state) => state.store)

  useEffect(() => {
    data1Service.loadAll()
  }, [])

  return (
    <div>
      <h1>Data1 Page</h1>
      {data1List === null ? (
        <p>Loading...</p>
      ) : data1List.length === 0 ? (
        <p>No data available</p>
      ) : (
        <ul>
          {data1List.map((item) => (
            <li key={item.id}>
              <strong>{item.name}</strong>
              {item.tags.length > 0 && <span> - Tags: {item.tags.join(", ")}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
