import { useParams, useNavigate, Link } from "react-router"
import { useMutation } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { useForumById } from "@/lib/useForums"

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(200, { message: "Title must be less than 200 characters" }),
  content: z
    .string()
    .min(1, { message: "Content is required" })
    .max(5000, { message: "Content must be less than 5000 characters" }),
})

export default function CreatePostPage() {
  const { forumId } = useParams<{ forumId: string }>()
  const forum = useForumById(Number(forumId))
  const navigate = useNavigate()

  const createPostMutation = useMutation({
    mutationFn: (data: { title: string; content: string }) => api.forum.createPost({ ...data, forumId: Number(forumId) }),
    onSuccess: (data) => {
      toast.success("Post created successfully!")
      navigate(`/forums/${forumId}/${data.id}`)
    },
    onError: (error) => {
      toast.error("Failed to create post: " + error.message)
    },
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", content: "" },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    createPostMutation.mutate(values)
  }

  if (!forum) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">Forum not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link to={`/forums/${forumId}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {forum.title}
        </Link>
        <h1 className="text-3xl font-bold">Create New Post</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>New Post in {forum.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter post title" autoFocus {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Write your post content here..."
                        className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <Button type="submit" disabled={createPostMutation.isPending}>
                  {createPostMutation.isPending ? "Creating..." : "Create Post"}
                </Button>
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Clear
                </Button>
              </div>
              {createPostMutation.error && <div className="text-red-600 text-sm">{createPostMutation.error.message}</div>}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
