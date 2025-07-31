import { http, HttpResponse } from "msw"
import type { Forum } from "@/types"

const USERS = [
  { userId: 1, username: "user1", password: "password1", sessionId: "session1" },
  { userId: 2, username: "user2", password: "password2", sessionId: "session2" },
]

const FORUMS: Forum[] = [
  { id: 1, title: "General Discussion", description: "Talk about anything and everything", members: [1, 2] },
  { id: 2, title: "Tech Talk", description: "Discuss programming, technology, and tools", members: [1] },
  { id: 3, title: "Random", description: "Off-topic discussions and random thoughts", members: [2] },
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

  http.get("/api/forums", async () => {
    await sleep(500) // Simulate network delay
    return HttpResponse.json(FORUMS)
  }),
]
