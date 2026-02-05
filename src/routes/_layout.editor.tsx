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
  textarea: "Long Text",
  number: "Number Input",
  checkbox: "Checkbox",
  radio: "Radio Group",
  dropdown: "Dropdown",
  email: "Email Address",
  phone: "Phone Number",
  password: "Password Field",
  url: "Website / URL",
  time: "Time Picker",
  datetime: "Date & Time Picker",
  switch: "Toggle Switch",
  "multi-select": "Multi-Select Dropdown",
  "checkbox-group": "Checkbox Group",
  file: "File Upload",
  image: "Image Upload",
  slider: "Volume / Range",
  rating: "Star Rating",
  currency: "Currency Amount",
  percent: "Percentage",
  country: "Country Selector",
  city: "State / City Selector",
  address: "Full Address",
  zip: "Zip / PIN Code",
  payment: "Payment Gateway",
  date: "Date Picker",
}

function EditorComponent() {
  const [fields, setFields] = useState<CanvasField[]>([])
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)

  const handleFieldClick = (fieldId: string) => {
    const newField: CanvasField = {
      id: `${fieldId}-${Date.now()}`,
      type: fieldId,
      label: FIELD_LABELS[fieldId] || fieldId,
    }

    if (["checkbox", "radio", "dropdown", "multi-select", "checkbox-group"].includes(fieldId)) {
      newField.options = ["Option 1", "Option 2", "Option 3"]
    }
    setFields((prev) => [...prev, newField])
    setSelectedFieldId(newField.id)
  }

  const handleRemoveField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id))
    if (selectedFieldId === id) {
      setSelectedFieldId(null)
    }
  }

  const handleFieldSelect = (id: string) => {
    setSelectedFieldId(id)
  }

  const handleFieldUpdate = (updatedField: CanvasField) => {
    setFields((prev) => prev.map((f) => (f.id === updatedField.id ? updatedField : f)))
  }

  const selectedField = fields.find((f) => f.id === selectedFieldId)

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full">
      <ResizablePanel defaultSize={20} minSize={15}>
        <FieldSidebar
          onFieldClick={handleFieldClick}
          selectedField={selectedField}
          onFieldUpdate={handleFieldUpdate}
          onCloseProperties={() => setSelectedFieldId(null)}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={80} minSize={50}>
        <EditorCanvas
          fields={fields}
          onRemoveField={handleRemoveField}
          selectedFieldId={selectedFieldId || undefined}
          onSelectField={handleFieldSelect}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
