import { Link } from "react-router"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/stores/authStore"
import { ChevronDown, User } from "lucide-react"
import { services } from "@/services"

export default function Header() {
  const { username } = useAuthStore()

  return (
    <header className="border-b py-5">
      <nav className="flex items-center h-14 gap-8">
        <h1>P3</h1>
        <Link to="/forums">Forums</Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {username}
            <ChevronDown className="w-3 h-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Change Password</DropdownMenuItem>
            <DropdownMenuItem onClick={services.auth.logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  )
}
