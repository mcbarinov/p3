import { http, HttpResponse } from "msw"

const USERS = [
  { userId: 1, username: "user1", password: "password1", sessionId: "session1" },
  { userId: 2, username: "user2", password: "password2", sessionId: "session2" },
]

const DATA1_LIST = [
  { id: 1, name: "Data 1", tags: ["tag1", "tag2"] },
  { id: 2, name: "Data 2", tags: ["tag2", "tag3"] },
  { id: 3, name: "Data 3", tags: ["tag1", "tag3"] },
]

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const handlers = [
  http.post("/api/auth/login", async ({ request }) => {
    const { username, password } = (await request.json()) as { username: string; password: string }
    const user = USERS.find((u) => u.username === username && u.password === password)
    await sleep(500) // Simulate network delay

    if (user) {
      return HttpResponse.json({ sessionId: user.sessionId, userId: user.userId })
    } else {
      return HttpResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
  }),

  http.post("/api/auth/logout", async () => {
    await sleep(500) // Simulate network delay
    return HttpResponse.json({ message: "Logged out successfully" })
  }),

  http.get("/api/data1", async () => {
    await sleep(500) // Simulate network delay
    return HttpResponse.json(DATA1_LIST)
  }),

  http.get("/api/data1/:id", async ({ params }) => {
    await sleep(500) // Simulate network delay
    const data = DATA1_LIST.find((d) => d.id === parseInt(params.id, 10))
    if (data) {
      return HttpResponse.json(data)
    } else {
      return HttpResponse.json({ error: "Data not found" }, { status: 404 })
    }
  }),
]
