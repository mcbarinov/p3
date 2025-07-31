import { Link } from "react-router"
import { Users } from "lucide-react"
import { useLoadForums } from "@/hooks"
import { useForumStore } from "@/stores/forumStore"

export default function ForumsPage() {
  const forums = useForumStore((state) => state.forums)
  const { loading, error } = useLoadForums()

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading forums...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">Error loading forums: {error.error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Forums</h1>

      <div className="grid gap-4">
        {forums.map((forum) => (
          <Link
            key={forum.id}
            to={`/forums/${forum.id}`}
            className="block rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <h2 className="mb-2 text-xl font-semibold">{forum.title}</h2>
            <p className="mb-4 text-gray-600">{forum.description}</p>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="mr-1 h-4 w-4" />
              <span>{forum.members.length} members</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
