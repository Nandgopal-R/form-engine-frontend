import { Button } from "@/components/ui/button"
import {
  Type,
  CheckSquare,
  CircleDot,
  ChevronDown,
  Calendar,
  Hash,
  AlignLeft,
  Mail,
  Phone,
  Lock,
  Link,
  Clock,
  CalendarClock,
  ToggleLeft,
  ListChecks,
  ListTodo,
  Upload,
  Image,
  Sliders,
  Star,
  DollarSign,
  Percent,
  Globe,
  Map,
  MapPin,
  CreditCard
} from "lucide-react"

const FIELDS = [
  { id: "text", label: "Text", icon: Type },
  { id: "textarea", label: "Long Text", icon: AlignLeft },
  { id: "number", label: "Number", icon: Hash },
  { id: "checkbox", label: "Checkbox", icon: CheckSquare },
  { id: "radio", label: "Radio", icon: CircleDot },
  { id: "dropdown", label: "Dropdown", icon: ChevronDown },
  { id: "email", label: "Email", icon: Mail },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "password", label: "Password", icon: Lock },
  { id: "url", label: "URL", icon: Link },
  { id: "time", label: "Time", icon: Clock },
  { id: "datetime", label: "Date & Time", icon: CalendarClock },
  { id: "switch", label: "Switch", icon: ToggleLeft },
  { id: "multi-select", label: "Multi Select", icon: ListChecks },
  { id: "checkbox-group", label: "Checkbox Group", icon: ListTodo },
  { id: "file", label: "File Upload", icon: Upload },
  { id: "image", label: "Image Upload", icon: Image },
  { id: "slider", label: "Range Slider", icon: Sliders },
  { id: "rating", label: "Star Rating", icon: Star },
  { id: "currency", label: "Currency", icon: DollarSign },
  { id: "percent", label: "Percentage", icon: Percent },
  { id: "country", label: "Country", icon: Globe },
  { id: "city", label: "State / City", icon: Map },
  { id: "zip", label: "Zip Code", icon: Hash },
  { id: "address", label: "Address", icon: MapPin },
  { id: "payment", label: "Payment", icon: CreditCard },
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
