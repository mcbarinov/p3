import { http, HttpResponse } from "msw"

const USERS = [
  { userId: 1, username: "user1", password: "password1", sessionId: "session1" },
  { userId: 2, username: "user2", password: "password2", sessionId: "session2" },
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
]
