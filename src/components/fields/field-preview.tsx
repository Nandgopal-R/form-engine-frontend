import { Settings, Star, Trash2 } from 'lucide-react'
import type { ValidationConfig } from '@/lib/validation-engine'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { Slider } from '@/components/ui/slider'

export interface CanvasField {
  id: string
  type: string
  label: string
  placeholder?: string
  required?: boolean
  min?: number
  max?: number
  step?: number
  options?: Array<string>
  validation?: ValidationConfig
}

interface FieldPreviewProps {
  field: CanvasField
  onRemove?: (id: string) => void
  onEdit?: (field: CanvasField) => void
}

export function FieldPreview({ field, onRemove, onEdit }: FieldPreviewProps) {
  return (
    <Card className="p-4 group relative border-dashed border-2 shadow-none">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.(field)
          }}
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.(field.id)
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Field>
        <FieldLabel className="flex items-center gap-1">
          {field.label}
          {field.required && <span className="text-destructive">*</span>}
        </FieldLabel>
        <FieldContent>{renderFieldInput(field)}</FieldContent>
      </Field>
    </Card>
  )
}

export function renderFieldInput(field: CanvasField) {
  const { type, placeholder, min, max, step, options } = field

  // Default options if none provided
  const defaultOptions = ['Option 1', 'Option 2', 'Option 3']
  const fieldOptions = options && options.length > 0 ? options : defaultOptions

  switch (type) {
    case 'text':
      return <Input placeholder={placeholder || 'Enter text...'} />
    case 'textarea':
      return (
        <textarea
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={placeholder || 'Enter long text...'}
        />
      )
    case 'number':
      return (
        <Input
          type="number"
          placeholder={placeholder || 'Enter number...'}
          min={min}
          max={max}
          step={step}
        />
      )
    case 'email':
      return (
        <Input type="email" placeholder={placeholder || 'name@example.com'} />
      )
    case 'url':
      return (
        <Input type="url" placeholder={placeholder || 'https://example.com'} />
      )
    case 'phone':
      return (
        <Input type="tel" placeholder={placeholder || '+1 (555) 000-0000'} />
      )
    case 'checkbox':
      if (options && options.length > 0) {
        return (
          <div className="flex flex-col gap-2">
            {options.map((opt) => (
              <div key={`checkbox-${field.id}-${opt}`} className="flex items-center gap-2">
                <Checkbox id={`checkbox-${field.id}-${opt}`} />
                <Label
                  htmlFor={`checkbox-${field.id}-${opt}`}
                  className="text-sm font-normal"
                >
                  {opt}
                </Label>
              </div>
            ))}
          </div>
        )
      }
      return (
        <div className="flex items-center gap-2">
          <Checkbox id={`checkbox-${field.id}`} />
          <Label
            htmlFor={`checkbox-${field.id}`}
            className="text-sm font-normal"
          >
            {field.label}
          </Label>
        </div>
      )
    case 'radio':
      return (
        <div className="flex flex-col gap-2">
          {fieldOptions.map((opt) => (
            <div key={`radio-${field.id}-${opt}`} className="flex items-center gap-2">
              <input
                type="radio"
                name={`radio-${field.id}`}
                id={`radio-${field.id}-${opt}`}
                className="h-4 w-4"
              />
              <Label
                htmlFor={`radio-${field.id}-${opt}`}
                className="text-sm font-normal"
              >
                {opt}
              </Label>
            </div>
          ))}
        </div>
      )
    case 'dropdown':
      return (
        <select className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm">
          <option value="">Select an option...</option>
          {fieldOptions.map((opt) => (
            <option key={`dropdown-${field.id}-${opt}`} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )
    case 'date':
      return <Input type="date" />
    case 'time':
      return <Input type="time" />
    case 'toggle':
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`toggle-${field.id}`}
            className="h-6 w-11 rounded-full data-[state=checked]:bg-primary data-[state=unchecked]:bg-input transition-colors cursor-pointer"
          />
          <Label htmlFor={`toggle-${field.id}`}>Toggle</Label>
        </div>
      )
    case 'slider':
      return (
        <div className="w-full pt-2">
          <Slider
            defaultValue={[min || 0]}
            max={max || 100}
            step={step || 1}
            min={min || 0}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{min || 0}</span>
            <span>{max || 100}</span>
          </div>
        </div>
      )
    case 'rating':
      return (
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className="h-6 w-6 text-muted-foreground hover:text-yellow-400 cursor-pointer transition-colors"
            />
          ))}
        </div>
      )
    case 'file':
      return <Input type="file" className="cursor-pointer" />
    case 'section':
      return <div className="h-px w-full bg-border my-2" />
    case 'cgpa':
      return (
        <Input
          type="number"
          placeholder="Enter CGPA (0.00-10.00)"
          min={0}
          max={10}
          step={0.01}
        />
      )
    default:
      return <Input placeholder="Enter value..." />
  }
}
