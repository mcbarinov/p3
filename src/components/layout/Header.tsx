import { Link } from "react-router"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/stores/authStore"
import { ChevronDown, User } from "lucide-react"
import { authService } from "@/services/authService"

export default function Header() {
  const { username } = useAuthStore()

  return (
    <header className="border-b py-5">
      <nav className="flex items-center h-14 gap-8">
        <h1>P3</h1>
        <Link to="/data1">Data1</Link>
        <Link to="/data2">Data2</Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {username}
            <ChevronDown className="w-3 h-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Change Password</DropdownMenuItem>
            <DropdownMenuItem onClick={authService.logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  )
}
