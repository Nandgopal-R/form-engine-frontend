import { useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { FieldSidebar } from "@/components/field-sidebar"
import { EditorCanvas } from "@/components/editor-canvas"
import type { CanvasField } from "@/components/fields/field-preview"
import { FieldProperties } from "@/components/field-properties"
import { formsApi, type CreateFormInput } from "@/api/forms"

export const Route = createFileRoute("/_layout/editor")({
  component: EditorComponent,
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

function EditorComponent() {
  const navigate = useNavigate()
  const [fields, setFields] = useState<CanvasField[]>([])
  const [editingField, setEditingField] = useState<CanvasField | null>(null)
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")

  // useMutation for creating a form - used directly, no custom hook needed!
  const createForm = useMutation({
    mutationFn: (data: CreateFormInput) => formsApi.create(data),
    onSuccess: (data) => {
      console.log("Form created successfully!", data)
      navigate({ to: "/editor/$formId", params: { formId: data.id } })
    },
    onError: (error) => {
      console.error("Failed to create form:", error.message)
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
    setFields((prev) => prev.map((f) => (f.id === updatedField.id ? updatedField : f)))
    setEditingField(null)
  }

  const handleSaveForm = () => {
    createForm.mutate({
      title: formTitle,
      description: formDescription,
    })
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
            isSaving={createForm.isPending}
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

