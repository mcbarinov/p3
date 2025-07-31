import { useState, useCallback, useEffect } from "react"
import { Link, useParams } from "react-router"
import { ArrowLeft, MessageCircle } from "lucide-react"
import { useForumStore } from "@/stores/forumStore"
import { api } from "@/lib/api"
import { LoadingErrorWrapper, UserInfo, DateInfo } from "@/components/shared"
import type { ApiError } from "@/lib/api"
import type { Post, Comment } from "@/types"

// Local hook for post details
function usePostDetail(postId: number) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const loadPost = useCallback(async () => {
    setLoading(true)
    setError(null)

    const result = await api.forum.getPost(postId)

    if (result.isOk()) {
      setPost(result.value)
    } else {
      setError(result.error)
      setPost(null)
    }

    setLoading(false)
  }, [postId])

  useEffect(() => {
    loadPost()
  }, [loadPost])

  return {
    post,
    loading,
    error,
    refetch: loadPost,
  }
}

// Local hook for comments
function useComments(postId: number) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const loadComments = useCallback(async () => {
    setLoading(true)
    setError(null)

    const result = await api.forum.getPostComments(postId)

    if (result.isOk()) {
      setComments(result.value)
    } else {
      setError(result.error)
      setComments([])
    }

    setLoading(false)
  }, [postId])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  return {
    comments,
    loading,
    error,
    refetch: loadComments,
  }
}

export default function ForumPostDetailPage() {
  const { forumId, postId } = useParams<{ forumId: string; postId: string }>()
  const getForumById = useForumStore((state) => state.getForumById)
  const numericPostId = Number(postId)
  const forum = getForumById(Number(forumId))
  const { post, loading: postLoading, error: postError } = usePostDetail(numericPostId)
  const { comments, loading: commentsLoading, error: commentsError } = useComments(numericPostId)

  // If postId is invalid, it's a routing error
  if (!postId || isNaN(numericPostId)) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">Invalid post URL</div>
      </div>
    )
  }

  return (
    <LoadingErrorWrapper 
      loading={postLoading} 
      error={postError} 
      loadingMessage="Loading post..."
      errorPrefix="Error loading post"
    >
      {!post ? (
        <div className="container mx-auto py-8">
          <div className="text-center text-red-600">Post not found</div>
        </div>
      ) : (
        <div className="container mx-auto py-8 max-w-4xl">
          <div className="mb-6">
            <Link to={`/forums/${forumId}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {forum?.title || "Forum"}
            </Link>
          </div>

          {/* Post Content */}
          <div className="bg-white rounded-lg border p-6 shadow-sm mb-8">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
              <UserInfo userId={post.authorId} />
              <DateInfo date={post.createdAt} />
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              Comments ({comments?.length || 0})
            </h2>

            <LoadingErrorWrapper 
              loading={commentsLoading} 
              error={commentsError} 
              loadingMessage="Loading comments..."
              errorPrefix="Error loading comments"
            >
              {!comments || comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <UserInfo userId={comment.authorId} className="font-medium" />
                          <DateInfo date={comment.createdAt} />
                        </div>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </LoadingErrorWrapper>
          </div>
        </div>
      )}
    </LoadingErrorWrapper>
  )
}