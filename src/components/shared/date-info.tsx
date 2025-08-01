import { Calendar } from "lucide-react"
import { formatDate } from "@/utils/date"

interface DateInfoProps {
  date: Date
  className?: string
}

export function DateInfo({ date, className = "" }: DateInfoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Calendar className="mr-1 h-4 w-4" />
      <span>{formatDate(date)}</span>
    </div>
  )
}
