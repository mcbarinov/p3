import { Link, useNavigate } from "react-router"
import { useMutation } from "@tanstack/react-query"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ChevronDown, User } from "lucide-react"
import { useAuthStore } from "@/stores/authStore"
import { api } from "@/lib/api"

export default function Header() {
  const navigate = useNavigate()
  const { username, logout: storeLogout } = useAuthStore()

  const logoutMutation = useMutation({
    mutationFn: () => api.auth.logout(),
    onSuccess: () => {
      storeLogout()
      navigate("/login")
    },
  })

  return (
    <header className="border-b py-5">
      <nav className="flex items-center h-14 gap-8">
        <h1>Demo Forums</h1>
        <Link to="/forums">Forums</Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {username}
            <ChevronDown className="w-3 h-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Change Password</DropdownMenuItem>
            <DropdownMenuItem onClick={() => logoutMutation.mutate()}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  )
}
