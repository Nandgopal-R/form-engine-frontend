import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Field, FieldLabel, FieldContent } from "@/components/ui/field"
import { Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import { formsApi, type FormField } from '@/api/forms'

export const Route = createFileRoute('/form/$formId')({
  component: FormResponsePage,
})

async function submitResponse(formId: string, responses: Record<string, unknown>): Promise<{ success: boolean }> {
  console.log('Submitted responses for form', formId, responses)
  // TODO: Implement actual API call for submission
  await new Promise(resolve => setTimeout(resolve, 1000))
  return { success: true }
}

function FormResponsePage() {
  const { formId } = Route.useParams()
  const [responses, setResponses] = useState<Record<string, unknown>>({})
  const [submitted, setSubmitted] = useState(false)

  // Fetch form data
  const { data: form, isLoading, error } = useQuery({
    queryKey: ['form', formId],
    queryFn: () => formsApi.getById(formId),
  })

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => submitResponse(formId, data),
    onSuccess: () => {
      setSubmitted(true)
    },
  })

  const updateResponse = (fieldId: string, value: unknown) => {
    setResponses(prev => ({ ...prev, [fieldId]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitMutation.mutate(responses)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="bg-card rounded-xl p-10 text-center shadow-sm border">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading form...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="bg-card rounded-xl p-10 max-w-md text-center shadow-sm border">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 mb-5">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="text-xl font-bold mb-2">Form Not Found</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "The form you're looking for doesn't exist or has been removed."}
          </p>
        </div>
      </div>
    )
  }

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="bg-card rounded-xl p-10 max-w-md text-center shadow-sm border">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/10 mb-5">
            <CheckCircle className="h-7 w-7 text-green-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Response Submitted!</h2>
          <p className="text-muted-foreground">
            Thank you for your response. Your submission has been recorded.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/20 py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto p-8 bg-card rounded-xl shadow-sm border space-y-6">
        <div className="space-y-2 mb-8">
          <h1 className="text-2xl font-bold tracking-tight">{form.title || form.name || "Untitled Form"}</h1>
          {form.description && (
            <p className="text-muted-foreground">
              {form.description}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!form.fields || form.fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              This form has no fields yet.
            </div>
          ) : (
            form.fields.map((field) => (
              <Field key={field.id} className="space-y-2">
                <FieldLabel className="flex items-center gap-1">
                  {field.label}
                  {field.validation?.required && <span className="text-destructive">*</span>}
                </FieldLabel>
                <FieldContent>
                  <FormFieldRenderer
                    field={field}
                    value={responses[field.id]}
                    onChange={(value) => updateResponse(field.id, value)}
                  />
                </FieldContent>
              </Field>
            ))
          )}

          {form.fields && form.fields.length > 0 && (
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Response
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

// Field renderer component
interface FormFieldRendererProps {
  field: FormField
  value: unknown
  onChange: (value: unknown) => void
}

function FormFieldRenderer({ field, value, onChange }: FormFieldRendererProps) {
  // Map API fields to UI properties
  // The API returns 'fieldType' but our renderer logic was based on 'type'
  const type = field.fieldType || (field as any).type || 'text';
  const placeholder = field.placeholder;
  const options = field.options;
  const min = field.min || field.validation?.min;
  const max = field.max || field.validation?.max;
  const step = field.step;
  const required = field.validation?.required || false;

  const fieldOptions = options && options.length > 0 ? options : ["Option 1", "Option 2", "Option 3"]

  switch (type) {
    case 'text':
    case 'Input': // handling potentially different casing from API
      return (
        <Input
          placeholder={placeholder || `Enter ${field.label.toLowerCase()}...`}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )
    case 'textarea':
      // Using basic textarea with styles matching Input
      return (
        <textarea
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={placeholder || "Enter long text..."}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )
    case 'number':
      return (
        <Input
          type="number"
          placeholder={placeholder || "Enter a number..."}
          value={(value as number) || ''}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
          required={required}
          min={min}
          max={max}
          step={step}
        />
      )
    case 'email':
      return (
        <Input
          type="email"
          placeholder={placeholder || "name@example.com"}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )
    case 'url':
    case 'website':
      return (
        <Input
          type="url"
          placeholder={placeholder || "https://example.com"}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )
    case 'phone':
    case 'tel':
      return (
        <Input
          type="tel"
          placeholder={placeholder || "+1 (555) 000-0000"}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )
    case 'checkbox':
      if (options && options.length > 0) {
        // Checkbox Group
        // In this simple implementation, value is array of strings
        const currentValues = Array.isArray(value) ? value : []

        const toggleValue = (val: string) => {
          // Check if already selected
          if (currentValues.includes(val)) {
            onChange(currentValues.filter((v: string) => v !== val))
          } else {
            onChange([...currentValues, val])
          }
        }

        return (
          <div className="flex flex-col gap-2">
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Checkbox
                  id={`${field.id}-${idx}`}
                  checked={currentValues.includes(opt)}
                  onCheckedChange={() => toggleValue(opt)}
                />
                <Label htmlFor={`${field.id}-${idx}`} className="text-sm font-normal cursor-pointer">{opt}</Label>
              </div>
            ))}
          </div>
        )
      }
      // Single Checkbox
      return (
        <div className="flex items-center gap-2">
          <Checkbox
            id={field.id}
            checked={(value as boolean) || false}
            onCheckedChange={(checked) => onChange(checked)}
          />
          <Label htmlFor={field.id} className="text-sm font-normal cursor-pointer">{field.label}</Label>
        </div>
      )
    case 'radio':
      return (
        <div className="flex flex-col gap-2">
          {fieldOptions.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="radio"
                id={`${field.id}-${idx}`}
                name={field.id}
                value={opt}
                checked={value === opt}
                onChange={(e) => onChange(e.target.value)}
                className="h-4 w-4 border-primary text-primary focus:ring-1 focus:ring-primary cursor-pointer"
                required={required}
              />
              <Label htmlFor={`${field.id}-${idx}`} className="text-sm font-normal cursor-pointer">
                {opt}
              </Label>
            </div>
          ))}
        </div>
      )
    case 'dropdown':
    case 'select':
      return (
        <select
          id={field.id}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          required={required}
        >
          <option value="">Select an option...</option>
          {fieldOptions.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
          ))}
        </select>
      )
    case 'date':
      return (
        <Input
          type="date"
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )
    case 'time':
      return (
        <Input
          type="time"
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )
    case 'file':
      return (
        <Input
          type="file"
          onChange={(e) => {
            // Simple file handling for now - just storing filename
            const file = e.target.files?.[0]
            if (file) onChange(file.name)
          }}
          required={required}
          className="cursor-pointer"
        />
      )
    default:
      return (
        <Input
          placeholder={placeholder || `Enter ${field.label.toLowerCase()}...`}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )
  }
}
