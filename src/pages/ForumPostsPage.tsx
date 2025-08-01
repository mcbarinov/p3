import { Link, useParams } from "react-router"
import { ArrowLeft, Plus } from "lucide-react"
import { useForumStore } from "@/stores/forumStore"
import { api } from "@/lib/api"
import { useApi } from "@/hooks"
import { LoadingErrorWrapper, UserInfo, DateInfo } from "@/components/shared"
import { Button } from "@/components/ui/button"

export default function ForumPostsPage() {
  const { forumId } = useParams<{ forumId: string }>()
  const getForumById = useForumStore((state) => state.getForumById)
  const forum = getForumById(Number(forumId))

  const { data: posts, loading, error } = useApi(() => api.forum.getForumPosts(Number(forumId)), [forumId])

  if (!forum) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">Forum not found</div>
      </div>
    )
  }

  return (
    <LoadingErrorWrapper loading={loading} error={error} loadingMessage="Loading posts..." errorPrefix="Error loading posts">
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link to="/forums" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forums
          </Link>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{forum.title}</h1>
              <p className="text-gray-600 mb-2">{forum.description}</p>
              <div className="text-sm text-gray-500">{forum.members.length} members</div>
            </div>
            <Link to={`/forums/${forumId}/new`}>
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Create Post
              </Button>
            </Link>
          </div>
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
