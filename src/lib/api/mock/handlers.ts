import { http, HttpResponse } from "msw"
import type { Forum, Post, Comment } from "@/types"

const USERS = [
  { userId: 1, username: "user1", password: "password1", sessionId: "session1" },
  { userId: 2, username: "user2", password: "password2", sessionId: "session2" },
]

const FORUMS: Forum[] = [
  { id: 1, title: "General Discussion", description: "Talk about anything and everything", members: [1, 2] },
  { id: 2, title: "Tech Talk", description: "Discuss programming, technology, and tools", members: [1] },
  { id: 3, title: "Random", description: "Off-topic discussions and random thoughts", members: [2] },
]

const POSTS: Post[] = [
  {
    id: 1,
    forumId: 1,
    title: "Welcome to General Discussion",
    content: "This is the first post in our general discussion forum. Feel free to discuss anything here!",
    authorId: 1,
    createdAt: new Date("2024-01-15T10:00:00Z"),
  },
  {
    id: 2,
    forumId: 1,
    title: "What's your favorite hobby?",
    content: "I'm curious to know what hobbies everyone has. Share your interests!",
    authorId: 2,
    createdAt: new Date("2024-01-16T14:30:00Z"),
  },
  {
    id: 3,
    forumId: 1,
    title: "Best places to visit",
    content: "Let's share our favorite travel destinations and recommendations.",
    authorId: 1,
    createdAt: new Date("2024-01-17T09:15:00Z"),
  },
  {
    id: 4,
    forumId: 2,
    title: "React vs Vue - which is better?",
    content: "I've been debating between React and Vue for my next project. What are your thoughts?",
    authorId: 1,
    createdAt: new Date("2024-01-16T11:20:00Z"),
  },
  {
    id: 5,
    forumId: 2,
    title: "TypeScript tips and tricks",
    content: "Share your favorite TypeScript patterns and best practices here.",
    authorId: 2,
    createdAt: new Date("2024-01-18T16:45:00Z"),
  },
  {
    id: 6,
    forumId: 2,
    title: "Setting up CI/CD pipeline",
    content: "Looking for advice on setting up a good CI/CD pipeline for a React project.",
    authorId: 1,
    createdAt: new Date("2024-01-19T08:30:00Z"),
  },
  {
    id: 7,
    forumId: 3,
    title: "Random thoughts of the day",
    content: "Just sharing some random thoughts I had today. Anyone else have those moments?",
    authorId: 2,
    createdAt: new Date("2024-01-17T20:00:00Z"),
  },
  {
    id: 8,
    forumId: 3,
    title: "Funny programming memes",
    content: "Let's share our favorite programming memes and jokes!",
    authorId: 1,
    createdAt: new Date("2024-01-18T12:15:00Z"),
  },
]

const COMMENTS: Comment[] = [
  {
    id: 1,
    content: "Great discussion starter! I completely agree with your points.",
    authorId: 2,
    createdAt: new Date("2024-01-15T10:30:00Z"),
  },
  {
    id: 2,
    content: "Thanks for creating this forum. Looking forward to more discussions!",
    authorId: 1,
    createdAt: new Date("2024-01-15T11:00:00Z"),
  },
  {
    id: 3,
    content: "My favorite hobby is definitely coding! What about you?",
    authorId: 1,
    createdAt: new Date("2024-01-16T15:00:00Z"),
  },
  {
    id: 4,
    content: "I love photography and hiking. Great way to clear the mind after coding all day.",
    authorId: 2,
    createdAt: new Date("2024-01-16T16:30:00Z"),
  },
  {
    id: 5,
    content: "I think both React and Vue have their strengths. React has a larger ecosystem, but Vue is easier to learn.",
    authorId: 2,
    createdAt: new Date("2024-01-16T12:00:00Z"),
  },
  {
    id: 6,
    content: "I prefer React for larger projects. The component model and hooks are really powerful.",
    authorId: 1,
    createdAt: new Date("2024-01-16T13:30:00Z"),
  },
  {
    id: 7,
    content: "Here's a great TypeScript tip: use 'const' assertions for literal types!",
    authorId: 1,
    createdAt: new Date("2024-01-18T17:00:00Z"),
  },
  {
    id: 8,
    content: "Don't forget about discriminated unions - they're super useful for state management.",
    authorId: 2,
    createdAt: new Date("2024-01-18T18:15:00Z"),
  },
]

// Map comments to posts
const POST_COMMENTS: Record<number, number[]> = {
  1: [1, 2], // Welcome to General Discussion
  2: [3, 4], // What's your favorite hobby?
  4: [5, 6], // React vs Vue
  5: [7, 8], // TypeScript tips and tricks
}

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

  http.get("/api/forums/:forumId", async ({ params }) => {
    const forumId = Number(params.forumId)
    const forum = FORUMS.find((f) => f.id === forumId)
    await sleep(500) // Simulate network delay

    if (forum) {
      return HttpResponse.json(forum)
    } else {
      return HttpResponse.json({ error: "Forum not found" }, { status: 404 })
    }
  }),

  http.get("/api/forums/:forumId/posts", async ({ params }) => {
    const forumId = Number(params.forumId)
    const forumPosts = POSTS.filter((post) => post.forumId === forumId)
    await sleep(500) // Simulate network delay

    return HttpResponse.json(forumPosts)
  }),

  http.get("/api/posts/:postId", async ({ params }) => {
    const postId = Number(params.postId)
    const post = POSTS.find((p) => p.id === postId)
    await sleep(500) // Simulate network delay

    if (post) {
      return HttpResponse.json(post)
    } else {
      return HttpResponse.json({ error: "Post not found" }, { status: 404 })
    }
  }),

  http.get("/api/posts/:postId/comments", async ({ params }) => {
    const postId = Number(params.postId)
    const commentIds = POST_COMMENTS[postId] || []
    const comments = COMMENTS.filter((comment) => commentIds.includes(comment.id))
    await sleep(500) // Simulate network delay

    return HttpResponse.json(comments)
  }),
]
