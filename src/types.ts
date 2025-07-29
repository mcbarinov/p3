export type Forum = {
  id: number
  title: string
  description: string
  members: number[]
}

export type Post = {
  id: number
  title: string
  content: string
  authorId: number
  createdAt: Date
}

export type Comment = {
  id: number
  content: string
  authorId: number
  createdAt: Date
}
