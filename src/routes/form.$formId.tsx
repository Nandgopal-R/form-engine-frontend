import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { AlertCircle, ArrowRight, CheckCircle, Loader2, Save } from 'lucide-react'
import type { FormField } from '@/api/forms'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { fieldsApi, formsApi } from '@/api/forms'
import { responsesApi } from '@/api/responses'
import { useToast } from '@/hooks/use-toast'
import { validateForm, validateField, type ValidationError } from '@/lib/validation-engine'

export const Route = createFileRoute('/form/$formId')({
  component: FormResponsePage,
})

function FormResponsePage() {
  const { formId } = Route.useParams()
  const { toast } = useToast()
  const [responses, setResponses] = useState<Record<string, unknown>>({})
  const [submitted, setSubmitted] = useState(false)
  const [draftResponseId, setDraftResponseId] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  // Fetch form data using public endpoint (doesn't require ownership)
  const {
    data: form,
    isLoading: isFormLoading,
    error: formError,
  } = useQuery({
    queryKey: ['public-form', formId],
    queryFn: () => formsApi.getPublicById(formId),
  })

  // Fetch form fields separately
  const { data: formFields, isLoading: isFieldsLoading } = useQuery({
    queryKey: ['form-fields', formId],
    queryFn: () => fieldsApi.getById(formId),
  })

  // Check if user has an existing draft response
  const { data: existingResponses } = useQuery({
    queryKey: ['user-response', formId],
    queryFn: () => responsesApi.getUserResponse(formId),
    retry: false,
  })

  // Load existing draft if available
  useEffect(() => {
    if (existingResponses && existingResponses.length > 0) {
      const lastResponse = existingResponses[0]
      setDraftResponseId(lastResponse.id)
      // Use rawAnswers (field IDs) if available, otherwise fall back to answers
      setResponses(lastResponse.rawAnswers || lastResponse.answers)
    }
  }, [existingResponses])

  // Debug: Log the form data when received
  console.log('Form data received:', form)
  console.log('Form fields from separate API:', formFields)
  console.log('Number of fields:', formFields?.length)

  // Combine form with fields for rendering
  const formWithFields = form ? { ...form, fields: formFields || [] } : null

  // Submit mutation (final submission)
  const submitMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      if (draftResponseId) {
        // Update existing draft to submitted
        await responsesApi.resume(draftResponseId, { answers: data, isSubmitted: true })
        return { id: draftResponseId }
      } else {
        // Create new submission
        return responsesApi.submit(formId, { answers: data, isSubmitted: true })
      }
    },
    onSuccess: () => {
      setSubmitted(true)
      toast({
        title: 'Response submitted!',
        description: 'Thank you for your submission.',
        variant: 'success',
      })
    },
    onError: (error) => {
      toast({
        title: 'Failed to submit response',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  // Save as draft mutation
  const saveDraftMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      if (draftResponseId) {
        // Update existing draft
        await responsesApi.resume(draftResponseId, { answers: data, isSubmitted: false })
        return { id: draftResponseId }
      } else {
        // Create new draft
        return responsesApi.submit(formId, { answers: data, isSubmitted: false })
      }
    },
    onSuccess: (data) => {
      // If it's a new draft, save the response ID
      if (data.id && !draftResponseId) {
        setDraftResponseId(data.id)
      }
      toast({
        title: 'Draft saved!',
        description: 'Your progress has been saved.',
        variant: 'success',
      })
    },
    onError: (error) => {
      toast({
        title: 'Failed to save draft',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const updateResponse = (fieldId: string, value: unknown) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }))
    // Mark field as touched
    setTouchedFields((prev) => new Set(prev).add(fieldId))
    
    // Validate the field on change
    if (formWithFields?.fields) {
      const field = formWithFields.fields.find((f) => f.id === fieldId)
      if (field) {
        // Merge field-level min/max with validation config
        const validationConfig = {
          ...field.validation,
          min: field.validation?.min ?? field.min,
          max: field.validation?.max ?? field.max,
        }
        const fieldErrors = validateField(value, fieldId, field.label || fieldId, validationConfig)
        setValidationErrors((prev) => {
          // Remove existing errors for this field
          const filtered = prev.filter((e) => e.field !== fieldId)
          // Add new errors if any
          return [...filtered, ...fieldErrors]
        })
      }
    }
  }

  // Get error for a specific field
  const getFieldError = (fieldId: string): string | null => {
    // Only show error if field has been touched
    if (!touchedFields.has(fieldId)) return null
    const error = validationErrors.find((e) => e.field === fieldId)
    return error?.message || null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields before submission
    if (formWithFields?.fields) {
      const result = validateForm(responses, formWithFields.fields.map((f) => ({
        id: f.id,
        label: f.label || f.fieldName,
        fieldType: f.fieldType,
        validation: {
          ...f.validation,
          min: f.validation?.min ?? f.min,
          max: f.validation?.max ?? f.max,
        },
      })))
      
      if (!result.isValid) {
        setValidationErrors(result.errors)
        // Mark all fields as touched to show all errors
        setTouchedFields(new Set(formWithFields.fields.map((f) => f.id)))
        toast({
          title: 'Validation Error',
          description: `Please fix ${result.errors.length} error${result.errors.length > 1 ? 's' : ''} before submitting.`,
          variant: 'destructive',
        })
        return
      }
    }
    
    submitMutation.mutate(responses)
  }

  const handleSaveDraft = () => {
    saveDraftMutation.mutate(responses)
  }

  // Loading state
  if (isFormLoading || isFieldsLoading) {
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
  if (formError || !formWithFields) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="bg-card rounded-xl p-10 max-w-md text-center shadow-sm border">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 mb-5">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="text-xl font-bold mb-2">Form Not Found</h2>
          <p className="text-muted-foreground">
            {formError
              ? String(formError)
              : "The form you're looking for doesn't exist or has been removed."}
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
          <h1 className="text-2xl font-bold tracking-tight">
            {formWithFields.title || formWithFields.name || 'Untitled Form'}
          </h1>
          {formWithFields.description && (
            <p className="text-muted-foreground">
              {formWithFields.description}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!formWithFields.fields || formWithFields.fields.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              This form has no fields yet.
            </div>
          ) : (
            formWithFields.fields.map((field) => {
              const fieldError = getFieldError(field.id)
              return (
                <Field key={field.id} className="space-y-2">
                  <FieldLabel className="flex items-center gap-1">
                    {field.label}
                    {field.validation?.required && (
                      <span className="text-destructive">*</span>
                    )}
                  </FieldLabel>
                  <FieldContent>
                    <FormFieldRenderer
                      field={field}
                      value={responses[field.id]}
                      onChange={(value) => updateResponse(field.id, value)}
                      hasError={!!fieldError}
                    />
                  </FieldContent>
                  {fieldError && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {fieldError}
                    </p>
                  )}
                </Field>
              )
            })
          )}

          {formWithFields.fields && formWithFields.fields.length > 0 && (
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleSaveDraft}
                disabled={saveDraftMutation.isPending}
              >
                {saveDraftMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save as Draft
                  </>
                )}
              </Button>
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
  hasError?: boolean
}

function FormFieldRenderer({ field, value, onChange, hasError }: FormFieldRendererProps) {
  // Map API fields to UI properties
  // The API returns 'fieldType' but our renderer logic was based on 'type'
  // Normalize to lowercase for consistent matching
  const type = (field.fieldType || (field as any).type || 'text').toLowerCase()
  const placeholder = field.placeholder
  const options = field.options
  const min = field.min || field.validation?.min
  const max = field.max || field.validation?.max
  const step = field.step
  const required = field.validation?.required || false
  
  // Error styling class
  const errorClass = hasError ? 'border-destructive focus-visible:ring-destructive' : ''

  const fieldOptions =
    options && options.length > 0
      ? options
      : ['Option 1', 'Option 2', 'Option 3']

  switch (type) {
    case 'text':
    case 'input':
      return (
        <Input
          placeholder={placeholder || `Enter ${field.label.toLowerCase()}...`}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={errorClass}
        />
      )
    case 'textarea':
      // Using basic textarea with styles matching Input
      return (
        <textarea
          className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errorClass}`}
          placeholder={placeholder || 'Enter long text...'}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )
    case 'number':
      return (
        <Input
          type="number"
          placeholder={placeholder || 'Enter a number...'}
          value={(value as number) || ''}
          onChange={(e) =>
            onChange(e.target.value ? Number(e.target.value) : '')
          }
          required={required}
          min={min}
          max={max}
          step={step}
          className={errorClass}
        />
      )
    case 'email':
      return (
        <Input
          type="email"
          placeholder={placeholder || 'name@example.com'}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={errorClass}
        />
      )
    case 'url':
    case 'website':
      return (
        <Input
          type="url"
          placeholder={placeholder || 'https://example.com'}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={errorClass}
        />
      )
    case 'phone':
    case 'tel':
      return (
        <Input
          type="tel"
          placeholder={placeholder || '+1 (555) 000-0000'}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={errorClass}
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
                <Label
                  htmlFor={`${field.id}-${idx}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {opt}
                </Label>
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
          <Label
            htmlFor={field.id}
            className="text-sm font-normal cursor-pointer"
          >
            {field.label}
          </Label>
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
              <Label
                htmlFor={`${field.id}-${idx}`}
                className="text-sm font-normal cursor-pointer"
              >
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
          className={errorClass}
        />
      )
    case 'time':
      return (
        <Input
          type="time"
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={errorClass}
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
          className={`cursor-pointer ${errorClass}`}
        />
      )
    default:
      return (
        <Input
          placeholder={placeholder || `Enter ${field.label.toLowerCase()}...`}
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={errorClass}
        />
      )
  }
}
