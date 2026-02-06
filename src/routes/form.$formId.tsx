import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/form/$formId')({
    component: FormResponsePage,
})

// Types for the form and fields
interface FormField {
    id: string
    type: 'text' | 'number' | 'checkbox' | 'radio' | 'dropdown' | 'date' | 'submit'
    label: string
    required?: boolean
    options?: string[] // For radio/dropdown
}

interface Form {
    id: string
    title: string
    description?: string
    fields: FormField[]
}

// Mock API functions - replace with actual API calls
async function fetchForm(formId: string): Promise<Form> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock data - replace with actual API call
    return {
        id: formId,
        title: 'Sample Form',
        description: 'Please fill out this form to submit your response.',
        fields: [
            { id: '1', type: 'text', label: 'Full Name', required: true },
            { id: '2', type: 'text', label: 'Email Address', required: true },
            { id: '3', type: 'number', label: 'Age' },
            { id: '4', type: 'checkbox', label: 'Subscribe to newsletter' },
            { id: '5', type: 'date', label: 'Preferred Contact Date' },
            { id: '6', type: 'submit', label: 'Submit Response' },
        ],
    }
}

async function submitResponse(formId: string, responses: Record<string, unknown>): Promise<{ success: boolean }> {
    // TODO: Implement actual API call
    return { success: true }
}

function FormResponsePage() {
    const { formId } = Route.useParams()
    const [responses, setResponses] = useState<Record<string, unknown>>({})
    const [submitted, setSubmitted] = useState(false)

    // Fetch form data
    const { data: form, isLoading, error } = useQuery({
        queryKey: ['form', formId],
        queryFn: () => fetchForm(formId),
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
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
                <div className="bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl p-10 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-400 mx-auto mb-4" />
                    <p className="text-zinc-500 font-medium">Loading form...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error || !form) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
                <div className="bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl p-10 max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 mb-5">
                        <AlertCircle className="h-7 w-7 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Form Not Found</h2>
                    <p className="text-zinc-500">
                        The form you're looking for doesn't exist or has been removed.
                    </p>
                </div>
            </div>
        )
    }

    // Success state
    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
                <div className="bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl p-10 max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/20 mb-5">
                        <CheckCircle className="h-7 w-7 text-green-500" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Response Submitted!</h2>
                    <p className="text-zinc-500">
                        Thank you for your response. Your submission has been recorded.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 py-10 sm:py-16 px-4 sm:px-6">
            <div className="max-w-lg mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
                        {form.title}
                    </h1>
                    {form.description && (
                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                            {form.description}
                        </p>
                    )}
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl p-6 sm:p-8">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {form.fields.map((field) => (
                                <div key={field.id}>
                                    <FormFieldRenderer
                                        field={field}
                                        value={responses[field.id]}
                                        onChange={(value) => updateResponse(field.id, value)}
                                        isSubmitting={submitMutation.isPending}
                                    />
                                </div>
                            ))}
                        </div>
                    </form>
                </div>
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
    const labelId = `field-${field.id}`

    return (
        <div className="space-y-2">
            <label
                htmlFor={labelId}
                className="block text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-400 uppercase"
            >
                {field.label}
                {field.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>

            {field.type === 'text' && (
                <Input
                    id={labelId}
                    type="text"
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                    value={(value as string) || ''}
                    onChange={(e) => onChange(e.target.value)}
                    required={field.required}
                    className="h-11 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-500 focus:ring-0 transition-colors placeholder:text-zinc-400"
                />
            )}

            {field.type === 'number' && (
                <Input
                    id={labelId}
                    type="number"
                    placeholder="Enter a number..."
                    value={(value as number) || ''}
                    onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
                    required={field.required}
                    className="h-11 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-500 focus:ring-0 transition-colors placeholder:text-zinc-400"
                />
            )}

            {field.type === 'checkbox' && (
                <div className="flex items-center gap-3 pt-1">
                    <Checkbox
                        id={labelId}
                        checked={(value as boolean) || false}
                        onCheckedChange={(checked) => onChange(checked)}
                        className="border-zinc-300 dark:border-zinc-600"
                    />
                    <label htmlFor={labelId} className="text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
                        Yes
                    </label>
                </div>
            )}

            {field.type === 'radio' && field.options && (
                <div className="flex flex-col gap-2.5 pt-1">
                    {field.options.map((option, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <input
                                type="radio"
                                id={`${labelId}-${idx}`}
                                name={labelId}
                                value={option}
                                checked={value === option}
                                onChange={(e) => onChange(e.target.value)}
                                className="h-4 w-4 border-zinc-300 dark:border-zinc-600 text-zinc-900 focus:ring-zinc-500"
                                required={field.required && !value}
                            />
                            <label htmlFor={`${labelId}-${idx}`} className="text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
                                {option}
                            </label>
                        </div>
                    ))}
                </div>
            )}

            {field.type === 'dropdown' && field.options && (
                <select
                    id={labelId}
                    value={(value as string) || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-700 dark:text-zinc-300 focus:border-zinc-400 dark:focus:border-zinc-500 focus:ring-0 focus:outline-none transition-colors cursor-pointer"
                    required={field.required}
                >
                    <option value="">Select an option...</option>
                    {field.options.map((option, idx) => (
                        <option key={idx} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            )}

            {field.type === 'date' && (
                <Input
                    id={labelId}
                    type="date"
                    value={(value as string) || ''}
                    onChange={(e) => onChange(e.target.value)}
                    required={field.required}
                    className="h-11 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-500 focus:ring-0 transition-colors"
                />
            )}
        </div>
    )
}
