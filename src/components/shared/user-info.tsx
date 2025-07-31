import { User } from "lucide-react"
import { getUserName } from "@/utils/user"

interface UserInfoProps {
  userId: number
  className?: string
}

export function UserInfo({ userId, className = "" }: UserInfoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <User className="mr-1 h-4 w-4" />
      <span>{getUserName(userId)}</span>
    </div>
  )
}