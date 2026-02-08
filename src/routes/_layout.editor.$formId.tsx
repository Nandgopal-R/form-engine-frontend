import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AlertCircle, Loader2 } from 'lucide-react'
import type { CanvasField } from '@/components/fields/field-preview'
import type { CreateFieldInput, UpdateFormInput } from '@/api/forms'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { FieldSidebar } from '@/components/field-sidebar'
import { EditorCanvas } from '@/components/editor-canvas'
import { FieldProperties } from '@/components/field-properties'
import { fieldsApi, formsApi } from '@/api/forms'

export const Route = createFileRoute('/_layout/editor/$formId')({
  component: EditFormComponent,
})

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
}

function EditFormComponent() {
  const { formId } = Route.useParams()

  // Fetch existing form data
  const {
    data: form,
    isLoading: isFormLoading,
    error: formError,
  } = useQuery({
    queryKey: ['form', formId],
    queryFn: () => formsApi.getById(formId),
  })

  // Fetch existing fields
  const { data: existingFields, isLoading: isFieldsLoading } = useQuery({
    queryKey: ['form-fields', formId],
    queryFn: () => fieldsApi.getById(formId),
  })

  const [fields, setFields] = useState<Array<CanvasField>>([])
  const [editingField, setEditingField] = useState<CanvasField | null>(null)
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')

  // Populate state when form data is loaded
  useEffect(() => {
    if (form) {
      console.log('Form Title:', form.title)
      console.log('Form Description:', form.description)
      setFormTitle(form.title || form.name || '')
      setFormDescription(form.description || '')
    }
  }, [form])

  // populate fields when data is loaded
  useEffect(() => {
    const sourceFields = existingFields || form?.fields
    if (sourceFields && sourceFields.length > 0) {
      setFields(
        sourceFields.map((f) => {
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
          }
        }),
      )
    }
  }, [existingFields, form])

  // useMutation for updating the form
  const updateForm = useMutation({
    mutationFn: (data: UpdateFormInput) => formsApi.update(formId, data),
    onSuccess: (data) => {
      console.log('Form updated successfully!', data)
    },
    onError: (error) => {
      console.error('Failed to update form:', error.message)
    },
  })

  // useMutation for creating fields
  const createField = useMutation({
    mutationFn: (data: CreateFieldInput) => fieldsApi.create(formId, data),
    onSuccess: (newField) => {
      console.log('Field created successfully!', newField)
      // Convert the new field to CanvasField format and add to state
      const canvasField: CanvasField = {
        id: newField.id,
        type: newField.fieldType.toLowerCase(),
        label: newField.label,
        placeholder: newField.placeholder,
        required: newField.validation?.required ?? false,
        min: newField.validation?.min,
        max: newField.validation?.max,
        step: newField.step,
        options: newField.options,
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

  const handleFieldClick = (fieldId: string) => {
    console.log('Field clicked:', fieldId)

    const fieldData: CreateFieldInput = {
      fieldName: 'email',
      label: 'What is your email?',
      fieldValueType: 'string',
      fieldType: 'Input',
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
    setFields((prev) =>
      prev.map((f) => (f.id === updatedField.id ? updatedField : f)),
    )
    setEditingField(null)
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
