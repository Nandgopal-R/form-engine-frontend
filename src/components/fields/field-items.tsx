import { Button } from "@/components/ui/button"
import {
  Type,
  CheckSquare,
  CircleDot,
  ChevronDown,
  Calendar,
  Hash
} from "lucide-react"

const FIELDS = [
  { id: "text", label: "Text", icon: Type },
  { id: "number", label: "Number", icon: Hash },
  { id: "checkbox", label: "Checkbox", icon: CheckSquare },
  { id: "radio", label: "Radio", icon: CircleDot },
  { id: "dropdown", label: "Dropdown", icon: ChevronDown },
  { id: "date", label: "Date", icon: Calendar },
]

interface FieldItemsProps {
  onFieldClick?: (fieldId: string) => void
}

export function FieldItems({ onFieldClick }: FieldItemsProps) {
  return (
    <div className="flex flex-col gap-2 p-3">
      {FIELDS.map((field) => (
        <Button
          key={field.id}
          variant="ghost"
          className="h-12 flex flex-row items-center justify-start gap-3 px-4 hover:bg-accent"
          onClick={() => onFieldClick?.(field.id)}
        >
          <field.icon className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">{field.label}</span>
        </Button>
      ))}
    </div>
  )
}
