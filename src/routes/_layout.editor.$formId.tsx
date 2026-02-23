/**
 * Form Editor Component
 *
 * This is the main form building interface where users can:
 * - Add, edit, and remove form fields
 * - Configure field properties and validation rules
 * - Rearrange fields by dragging and dropping
 * - Preview the form in real-time
 * - Save changes to the form structure
 *
 * The interface uses a three-panel layout:
 * - Left: Field types sidebar for adding new fields
 * - Center: Canvas showing form structure and allowing editing
 * - Right: Properties panel for configuring selected field
 *
 * This component handles the complex state management of field operations,
 * API synchronization, and real-time updates.
 */

import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AlertCircle, Loader2 } from 'lucide-react'
import type { CanvasField } from '@/components/fields/field-preview'
<<<<<<< feat/docs
import type { CreateFieldInput, UpdateFieldInput, UpdateFormInput } from '@/api/forms'
=======
import type {
  CreateFieldInput,
  UpdateFormInput,
  UpdateFieldInput,
} from '@/api/forms'
>>>>>>> main
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { FieldSidebar } from '@/components/field-sidebar'
import { EditorCanvas } from '@/components/editor-canvas'
import { FieldProperties } from '@/components/field-properties'
import { fieldsApi, formsApi } from '@/api/forms'
import { useToast } from '@/hooks/use-toast'

export const Route = createFileRoute('/_layout/editor/$formId')({
  component: EditFormComponent,
})

// Human-readable labels for different field types
// Used throughout the editor for consistent naming
const FIELD_LABELS: Record<string, string> = {
  text: 'Text Input',
  number: 'Number Input',
  checkbox: 'Checkbox',
  radio: 'Radio Group',
  dropdown: 'Dropdown',
  date: 'Date Picker',
  textarea: 'Long Text',
  email: 'Email',
  url: 'Website',
  phone: 'Phone Number',
  time: 'Time Picker',
  toggle: 'Toggle Switch',
  slider: 'Scale',
  rating: 'Rating',
  file: 'File Upload',
  section: 'Section Header',
  cgpa: 'CGPA',
}

function EditFormComponent() {
  const { formId } = Route.useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  // Fetch existing form data
  // This loads the form metadata (title, description, etc.)
  const {
    data: form,
    isLoading: isFormLoading,
    error: formError,
  } = useQuery({
    queryKey: ['form', formId],
    queryFn: () => formsApi.getById(formId),
  })

  // Fetch existing fields
  // Fields are stored separately from form metadata
  const { data: existingFields, isLoading: isFieldsLoading } = useQuery({
    queryKey: ['form-fields', formId],
    queryFn: () => fieldsApi.getById(formId),
  })

  // Local state for managing form content
  const [fields, setFields] = useState<Array<CanvasField>>([])
  const [editingField, setEditingField] = useState<CanvasField | null>(null)
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')

  // Populate form state when API data is loaded
  // This ensures UI reflects the current saved state
  useEffect(() => {
    if (form) {
      console.log('Form Title:', form.title)
      console.log('Form Description:', form.description)
      setFormTitle(form.title || form.name || '')
      setFormDescription(form.description || '')
    }
  }, [form])

  // Populate fields when data is loaded
  // Convert API field format to CanvasField format for the editor
  useEffect(() => {
    const sourceFields = existingFields || form?.fields
    if (sourceFields && sourceFields.length > 0) {
      setFields(
        sourceFields.map((f) => {
          // Normalize field type from API response
          // API may return 'fieldType' or 'type', and 'input' should be normalized to 'text'
          const rawType = f.fieldType || (f as any).type || 'text'
          let type = rawType.toLowerCase()
          if (type === 'input') type = 'text'

          return {
            id: f.id,
            type: type,
            label: f.label,
            placeholder: f.placeholder,
            required: f.validation?.required ?? (f as any).required ?? false,
            min: f.validation?.min ?? (f as any).min,
            max: f.validation?.max ?? (f as any).max,
            step: f.step,
            options: f.options,
            validation: f.validation,
          }
        }),
      )
    }
  }, [existingFields, form])

  // Mutation for updating form metadata (title, description)
  const updateForm = useMutation({
    mutationFn: (data: UpdateFormInput) => formsApi.update(formId, data),
    onSuccess: () => {
      toast({
        title: 'Form saved successfully!',
        description: 'Redirecting to dashboard...',
        variant: 'success',
      })
      // Navigate to dashboard after a short delay to show toast
      setTimeout(() => {
        navigate({ to: '/dashboard' })
      }, 1500)
    },
    onError: (error) => {
      toast({
        title: 'Failed to save form',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  // useMutation for creating fields
  const createField = useMutation({
    mutationFn: (data: CreateFieldInput) => fieldsApi.create(formId, data),
    onSuccess: (newField) => {
      console.log('Field created successfully!', newField)
      // Convert the new field to CanvasField format and add to state
      let type = newField.fieldType.toLowerCase()
      if (type === 'input') type = 'text'

      const canvasField: CanvasField = {
        id: newField.id,
        type: type,
        label: newField.label,
        placeholder: newField.placeholder,
        required: newField.validation?.required ?? false,
        min: newField.validation?.min,
        max: newField.validation?.max,
        step: newField.step,
        options: newField.options,
        validation: newField.validation,
      }
      setFields((prev) => [...prev, canvasField])
    },
    onError: (error, variables) => {
      console.error('Failed to create field:', error.message)
      console.error('Error details:', error)
      console.error('Data sent:', JSON.stringify(variables, null, 2))
    },
  })

  // useMutation for deleting fields
  const deleteField = useMutation({
    mutationFn: (fieldId: string) => fieldsApi.delete(fieldId),
    onSuccess: () => {
      console.log('Field deleted successfully!')
    },
    onError: (error) => {
      console.error('Failed to delete field:', error.message)
    },
  })

  // useMutation for updating fields
  // Mutation for updating individual field properties
  const updateFieldMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFieldInput }) =>
      fieldsApi.update(id, data),
    onSuccess: () => {
      console.log('Field updated successfully!')
      toast({
        title: 'Field saved',
        description: 'Validation rules have been updated.',
        variant: 'success',
      })
    },
    onError: (error) => {
      console.error('Failed to update field:', error.message)
      toast({
        title: 'Failed to save field',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  // Handle field selection for editing
  const handleFieldClick = (fieldId: string) => {
    console.log('Field clicked:', fieldId)

    // Map field type to API field type and value type
    // This ensures we send the correct data structure to the backend
    const fieldTypeMap: Record<
      string,
      { fieldType: string; fieldValueType: string }
    > = {
      text: { fieldType: 'text', fieldValueType: 'string' },
      number: { fieldType: 'number', fieldValueType: 'number' },
      checkbox: { fieldType: 'checkbox', fieldValueType: 'boolean' },
      radio: { fieldType: 'radio', fieldValueType: 'string' },
      dropdown: { fieldType: 'dropdown', fieldValueType: 'string' },
      date: { fieldType: 'date', fieldValueType: 'string' },
      textarea: { fieldType: 'textarea', fieldValueType: 'string' },
      email: { fieldType: 'email', fieldValueType: 'string' },
      url: { fieldType: 'url', fieldValueType: 'string' },
      phone: { fieldType: 'phone', fieldValueType: 'string' },
      time: { fieldType: 'time', fieldValueType: 'string' },
      toggle: { fieldType: 'toggle', fieldValueType: 'boolean' },
      slider: { fieldType: 'slider', fieldValueType: 'number' },
      rating: { fieldType: 'rating', fieldValueType: 'number' },
      file: { fieldType: 'file', fieldValueType: 'string' },
      section: { fieldType: 'section', fieldValueType: 'string' },
      cgpa: { fieldType: 'cgpa', fieldValueType: 'number' },
    }

<<<<<<< feat/docs
    const typeInfo = (fieldTypeMap as any)[fieldId] || { fieldType: 'text', fieldValueType: 'string' }
=======
    const typeInfo = fieldTypeMap[fieldId] || {
      fieldType: 'text',
      fieldValueType: 'string',
    }
>>>>>>> main

    const fieldData: CreateFieldInput = {
      fieldName: fieldId,
      label: FIELD_LABELS[fieldId] || fieldId,
      fieldValueType: typeInfo.fieldValueType,
      fieldType: typeInfo.fieldType,
      // prevFieldId is handled as null in backend
    }

    console.log('Creating field with data:', JSON.stringify(fieldData, null, 2))
    createField.mutate(fieldData)
  }

  const handleRemoveField = (id: string) => {
    console.log('Deleting field:', id)
    // Call the delete API first
    deleteField.mutate(id, {
      onSuccess: () => {
        // Only remove from local state after successful API deletion
        setFields((prev) => prev.filter((f) => f.id !== id))
      },
    })
  }

  const handleEditField = (field: CanvasField) => {
    setEditingField(field)
  }

  const handleSaveField = (updatedField: CanvasField) => {
    // Update local state immediately
    setFields((prev) =>
      prev.map((f) => (f.id === updatedField.id ? updatedField : f)),
    )
    setEditingField(null)

    // Send update to backend
    const updateData: UpdateFieldInput = {
      label: updatedField.label,
      placeholder: updatedField.placeholder,
      min: updatedField.min,
      max: updatedField.max,
      step: updatedField.step,
      options: updatedField.options,
      validation: {
        required: updatedField.required,
        min: updatedField.validation?.min,
        max: updatedField.validation?.max,
        minLength: updatedField.validation?.minLength,
        maxLength: updatedField.validation?.maxLength,
        pattern: updatedField.validation?.pattern,
      },
    }

    updateFieldMutation.mutate({ id: updatedField.id, data: updateData })
  }

  const handleSaveForm = () => {
    updateForm.mutate({
      title: formTitle,
      description: formDescription,
    })
  }

  // Loading state
  if (isFormLoading || isFieldsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading form...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (formError || !form) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 mb-5">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="text-xl font-bold mb-2">Form Not Found</h2>
          <p className="text-muted-foreground">
            The form you're trying to edit doesn't exist or you don't have
            permission to access it.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel defaultSize={20} minSize={15}>
          <FieldSidebar onFieldClick={handleFieldClick} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={80} minSize={50}>
          <EditorCanvas
            fields={fields}
            formTitle={formTitle}
            formDescription={formDescription}
            onTitleChange={setFormTitle}
            onDescriptionChange={setFormDescription}
            onRemoveField={handleRemoveField}
            onEditField={handleEditField}
            onSave={handleSaveForm}
            onUpdateTitle={handleSaveForm}
            isSaving={updateForm.isPending}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
      <FieldProperties
        field={editingField}
        open={!!editingField}
        onOpenChange={(open) => !open && setEditingField(null)}
        onSave={handleSaveField}
      />
    </>
  )
}
