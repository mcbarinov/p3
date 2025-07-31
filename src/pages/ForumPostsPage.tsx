import { useState, useCallback, useEffect } from "react"
import { Link, useParams } from "react-router"
import { ArrowLeft } from "lucide-react"
import { useForumStore } from "@/stores/forumStore"
import { api } from "@/lib/api"
import { LoadingErrorWrapper, UserInfo, DateInfo } from "@/components/shared"
import type { ApiError } from "@/lib/api"
import type { Post } from "@/types"

// Local hook - used only in this component
function usePosts(forumId: number | undefined) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const loadPosts = useCallback(async () => {
    if (!forumId) return

    setLoading(true)
    setError(null)

    const result = await api.forum.getForumPosts(forumId)

    if (result.isOk()) {
      setPosts(result.value)
    } else {
      setError(result.error)
      setPosts([])
    }

    setLoading(false)
  }, [forumId])

  // Auto-load posts when forumId changes
  useEffect(() => {
    if (forumId) {
      loadPosts()
    }
  }, [forumId, loadPosts])

  return {
    posts,
    loading,
    error,
    refetch: loadPosts,
  }
}

export default function ForumPostsPage() {
  const { forumId } = useParams<{ forumId: string }>()
  const getForumById = useForumStore((state) => state.getForumById)
  const forum = getForumById(Number(forumId))
  const { posts, loading, error } = usePosts(Number(forumId))

  if (!forum) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">Forum not found</div>
      </div>
    )
  }

  return (
    <LoadingErrorWrapper 
      loading={loading} 
      error={error} 
      loadingMessage="Loading posts..."
      errorPrefix="Error loading posts"
    >
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
          {!posts || posts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No posts in this forum yet.</div>
          ) : (
            posts.map((post) => (
              <Link 
                key={post.id} 
                to={`/forums/${forumId}/${post.id}`}
                className="block bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-3 text-gray-900 hover:text-blue-600 transition-colors">{post.title}</h2>
                <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <UserInfo userId={post.authorId} />
                    <DateInfo date={post.createdAt} />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </LoadingErrorWrapper>
  )
}
