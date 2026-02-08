import { useState, useEffect } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useMutation } from "@tanstack/react-query"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { FieldSidebar } from "@/components/field-sidebar"
import { EditorCanvas } from "@/components/editor-canvas"
import type { CanvasField } from "@/components/fields/field-preview"
import { FieldProperties } from "@/components/field-properties"
import { formsApi, fieldsApi, type UpdateFormInput } from "@/api/forms"
import { Loader2, AlertCircle } from "lucide-react"

export const Route = createFileRoute("/_layout/editor/$formId")({
  component: EditFormComponent,
})

const FIELD_LABELS: Record<string, string> = {
  text: "Text Input",
  number: "Number Input",
  checkbox: "Checkbox",
  radio: "Radio Group",
  dropdown: "Dropdown",
  date: "Date Picker",
  textarea: "Long Text",
  email: "Email",
  url: "Website",
  phone: "Phone Number",
  time: "Time Picker",
  toggle: "Toggle Switch",
  slider: "Scale",
  rating: "Rating",
  file: "File Upload",
  section: "Section Header",
}

function EditFormComponent() {
  const { formId } = Route.useParams()

  // Fetch existing form data
  const {
    data: form,
    isLoading: isFormLoading,
    error: formError,
  } = useQuery({
    queryKey: ["form", formId],
    queryFn: () => formsApi.getById(formId),
  })

  // Fetch existing fields
  const {
    data: existingFields,
    isLoading: isFieldsLoading,
    error: fieldsError,
  } = useQuery({
    queryKey: ["form-fields", formId],
    queryFn: () => fieldsApi.getAll(formId),
  })

  const [fields, setFields] = useState<CanvasField[]>([])
  const [editingField, setEditingField] = useState<CanvasField | null>(null)
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")

  // Populate state when form data is loaded
  useEffect(() => {
    if (form) {
      console.log("Form Title:", form.title)
      console.log("Form Description:", form.description)
      setFormTitle(form.title || form.name || "")
      setFormDescription(form.description || "")
    }
  }, [form])

  // populate fields when data is loaded
  useEffect(() => {
    const sourceFields = existingFields || form?.fields;
    if (sourceFields && sourceFields.length > 0) {
      setFields(
        sourceFields.map((f) => {
          const rawType = f.fieldType || (f as any).type || 'text';
          let type = rawType.toLowerCase();
          if (type === 'input') type = 'text';

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
        })
      )
    }
  }, [existingFields, form])

  // useMutation for updating the form
  const updateForm = useMutation({
    mutationFn: (data: UpdateFormInput) => formsApi.update(formId, data),
    onSuccess: (data) => {
      console.log("Form updated successfully!", data)
    },
    onError: (error) => {
      console.error("Failed to update form:", error.message)
    },
  })

  const handleFieldClick = (fieldId: string) => {
    const newField: CanvasField = {
      id: `${fieldId}-${Date.now()}`,
      type: fieldId,
      label: FIELD_LABELS[fieldId] || fieldId,
    }
    setFields((prev) => [...prev, newField])
  }

  const handleRemoveField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id))
  }

  const handleEditField = (field: CanvasField) => {
    setEditingField(field)
  }

  const handleSaveField = (updatedField: CanvasField) => {
    setFields((prev) =>
      prev.map((f) => (f.id === updatedField.id ? updatedField : f))
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
