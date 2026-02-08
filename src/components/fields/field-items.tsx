import { Button } from '@/components/ui/button'
import {
  Type,
  CheckSquare,
  CircleDot,
  ChevronDown,
  Calendar,
  Hash,
  AlignLeft,
  Mail,
  Link,
  Phone,
  Clock,
  ToggleLeft,
  SlidersHorizontal,
  Star,
  Upload,
  Heading,
} from 'lucide-react'

const FIELDS = [
  { id: 'text', label: 'Short Text', icon: Type },
  { id: 'textarea', label: 'Long Text', icon: AlignLeft },
  { id: 'number', label: 'Number', icon: Hash },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'url', label: 'Website', icon: Link },
  { id: 'phone', label: 'Phone', icon: Phone },
  { id: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { id: 'radio', label: 'Radio', icon: CircleDot },
  { id: 'dropdown', label: 'Dropdown', icon: ChevronDown },
  { id: 'date', label: 'Date', icon: Calendar },
  { id: 'time', label: 'Time', icon: Clock },
  { id: 'toggle', label: 'Toggle', icon: ToggleLeft },
  { id: 'slider', label: 'Scale', icon: SlidersHorizontal },
  { id: 'rating', label: 'Rating', icon: Star },
  { id: 'file', label: 'File Upload', icon: Upload },
  { id: 'section', label: 'Section Header', icon: Heading },
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
          onClick={() => {
            console.log('Field button clicked:', field.id)
            onFieldClick?.(field.id)
          }}
        >
          <field.icon className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">{field.label}</span>
        </Button>
      ))}
    </div>
  )
}
