import { Link } from "react-router"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ChevronDown, User } from "lucide-react"
import { useAuth } from "@/hooks"

export default function Header() {
  const { username, logout } = useAuth()

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
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  )
}
