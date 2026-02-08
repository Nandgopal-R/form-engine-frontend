import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, Eye, Edit, BarChart, Calendar, ArrowRight, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"

interface FormCardProps {
  id: string
  name: string
  lastUpdated: Date
  isPublished: boolean
  responseCount: number
  onEdit?: () => void
  onView?: () => void
  onAnalytics?: () => void
  onDelete?: () => void
}

export function FormCard({
  name,
  lastUpdated,
  isPublished,
  responseCount,
  onEdit,
  onView,
  onAnalytics,
  onDelete,
}: FormCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 p-0 gap-0 border-border/60">
      {/* Cover / Header Section */}
      <div className="relative h-32 w-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="absolute top-0 right-0 p-4">
          <Badge
            variant={isPublished ? "default" : "secondary"}
            className={`shadow-sm backdrop-blur-md transition-all ${isPublished
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-white/80 text-secondary-foreground hover:bg-white/90 dark:bg-black/50'
              }`}
          >
            {isPublished ? "Published" : "Draft"}
          </Badge>
        </div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] pointer-events-none mask-image:linear-gradient(to_bottom,black,transparent)" />
      </div>

      <div className="p-5 pt-4">
        <div className="mb-6">
          <h3 className="font-semibold text-lg leading-tight mb-3 line-clamp-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          {/* Stats and Date */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <BarChart className="mr-2.5 h-4 w-4 shrink-0" />
              <span className="font-medium text-foreground/80">{responseCount.toLocaleString()}</span>
              <span className="ml-1">Responses</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2.5 h-4 w-4 shrink-0" />
              <span>{formatDistanceToNow(lastUpdated, { addSuffix: true })}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAnalytics}>
                <BarChart className="mr-2 h-4 w-4" /> Analytics
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onView}>
                <Eye className="mr-2 h-4 w-4" /> View Form
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={onView} size="sm" className="rounded-full px-4 h-9 shadow-sm transition-all">
            View Details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
