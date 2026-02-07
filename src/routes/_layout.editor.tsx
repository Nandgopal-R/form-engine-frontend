import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { FieldSidebar } from "@/components/field-sidebar"
import { EditorCanvas } from "@/components/editor-canvas"
import type { CanvasField } from "@/components/fields/field-preview"

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
  const [fields, setFields] = useState<CanvasField[]>([])

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

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full">
      <ResizablePanel defaultSize={20} minSize={15}>
        <FieldSidebar onFieldClick={handleFieldClick} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={80} minSize={50}>
        <EditorCanvas fields={fields} onRemoveField={handleRemoveField} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
