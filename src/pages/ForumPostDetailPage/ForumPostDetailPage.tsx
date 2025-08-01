import { useParams } from "react-router"
import { Link } from "react-router"
import { ArrowLeft, MessageCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useForumStore } from "@/stores/forumStore"
import { api } from "@/lib/api"
import { useApi } from "@/hooks"
import { LoadingErrorWrapper, UserInfo, DateInfo } from "@/components/shared"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"

const commentFormSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Comment is required" })
    .max(1000, { message: "Comment must be less than 1000 characters" }),
})

export default function ForumPostDetailPage() {
  const { forumId, postId } = useParams<{ forumId: string; postId: string }>()
  const getForumById = useForumStore((state) => state.getForumById)
  const numericPostId = Number(postId)
  const forum = getForumById(Number(forumId))

  // Load post data
  const { data: post, loading: postLoading, error: postError } = useApi(() => api.forum.getPost(numericPostId), [numericPostId])

  // Load comments data
  const {
    data: comments,
    loading: commentsLoading,
    error: commentsError,
    execute: refetchComments,
  } = useApi(() => api.forum.getPostComments(numericPostId), [numericPostId])

  // Comment creation
  const {
    loading: createLoading,
    error: createError,
    execute: createComment,
  } = useApi((content?: string) => api.forum.createComment({ content: content!, postId: numericPostId }), [], {
    immediate: false,
  })

  // Comment form
  const form = useForm<z.infer<typeof commentFormSchema>>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: { content: "" },
  })

  const onSubmit = async (values: z.infer<typeof commentFormSchema>) => {
    const result = await createComment(values.content)

    if (result.isOk()) {
      toast.success("Comment added successfully!")
      form.reset()
      refetchComments()
    } else {
      toast.error("Failed to add comment")
    }
  }

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
          {/* Post View */}
          <div className="space-y-6 mb-8">
            <div className="mb-6">
              <Link to={`/forums/${forumId}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to {forum?.title || "Forum"}
              </Link>
            </div>

            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                <UserInfo userId={post.authorId} />
                <DateInfo date={post.createdAt} />
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              Comments ({comments?.length || 0})
            </h2>

            {/* Comment Form */}
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Add a Comment</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <textarea
                            placeholder="Write your comment here..."
                            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" disabled={createLoading}>
                      {createLoading ? "Posting..." : "Post Comment"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                      Clear
                    </Button>
                  </div>
                  {createError && <div className="text-red-600 text-sm">{createError.error}</div>}
                </form>
              </Form>
            </div>

            {/* Comments List */}
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
