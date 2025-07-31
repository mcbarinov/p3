import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { ArrowLeft, User, Calendar } from "lucide-react"
import { services } from "@/services"
import { useForumStore } from "@/stores/forumStore"
import { formatDate } from "@/utils/date"
import type { Post } from "@/types"

export default function ForumDetailPage() {
  const { forumId } = useParams<{ forumId: string }>()
  const forums = useForumStore((state) => state.forums)
  const forum = forums.find((f) => f.id === Number(forumId))
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!forumId) return

    const loadPosts = async () => {
      setLoading(true)
      const postsData = await services.forum.getForumPosts(Number(forumId))
      setPosts(postsData)
      setLoading(false)
    }

    loadPosts()
  }, [forumId])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!forum) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">Forum not found</div>
      </div>
    )
  }

  const getUserName = (userId: number) => {
    return `user${userId}`
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link to="/forums" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forums
        </Link>

        <h1 className="text-3xl font-bold mb-2">{forum.title}</h1>
        <p className="text-gray-600 mb-4">{forum.description}</p>
        <div className="text-sm text-gray-500">{forum.members.length} members</div>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No posts in this forum yet.</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
              <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <User className="mr-1 h-4 w-4" />
                    <span>{getUserName(post.authorId)}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
