import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Eye, Edit3 } from "lucide-react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { FieldSidebar } from "@/components/field-sidebar"
import { EditorCanvas } from "@/components/editor-canvas"
import { PreviewCanvas } from "@/components/preview-canvas"
import { cn } from "@/lib/utils"
import type { CanvasField } from "@/components/fields/field-preview"
import { arrayMove } from "@dnd-kit/sortable"

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
  slider: "Range Slider",
  rating: "Star Rating",
  currency: "Currency Amount",
  percent: "Percentage",
  country: "Country Selector",
  state: "State Selector",
  city: "City Selector",
  address: "Full Address",
  zip: "Zip / PIN Code",
  payment: "Payment Gateway",
  date: "Date Picker",
  section: "Section Header",
  "question-text": "Question (Text)",
  "question-choice": "Question (Choices)",
}

function EditorComponent() {
  const [fields, setFields] = useState<CanvasField[]>([])
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [mode, setMode] = useState<'editor' | 'preview'>('editor')

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

  const handleFieldUpdate = (updatedField: CanvasField) => {
    setFields((prev) => prev.map((f) => (f.id === updatedField.id ? updatedField : f)))
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="h-full w-full bg-[#FDFBF7] text-gray-800 font-sans selection:bg-[#E89E45]/20 flex flex-col overflow-hidden relative">
      {/* Floating Mode Toggle */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center bg-white/90 backdrop-blur-md rounded-2xl border border-[#E5E1D8] p-1.5 shadow-xl shadow-black/5 ring-1 ring-[#D0C9BA]/20 transition-all duration-500 hover:shadow-[#E89E45]/10">
        <button
          onClick={() => setMode('editor')}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 tracking-widest",
            mode === 'editor'
              ? "bg-[#E89E45] text-white shadow-lg shadow-[#E89E45]/30 translate-y-[-1px]"
              : "text-[#9A9486] hover:text-[#4A4538] hover:bg-[#F5F2EA]"
          )}
        >
          <Edit3 className="w-4 h-4" />
          DESIGN
        </button>
        <button
          onClick={() => setMode('preview')}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 tracking-widest",
            mode === 'preview'
              ? "bg-[#4A4538] text-white shadow-lg shadow-black/20 translate-y-[-1px]"
              : "text-[#9A9486] hover:text-[#4A4538] hover:bg-[#F5F2EA]"
          )}
        >
          <Eye className="w-4 h-4" />
          PREVIEW
        </button>
      </div>

      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        {/* Sidebar Panel - Only show in Editor Mode */}
        {mode === 'editor' && (
          <ResizablePanel
            defaultSize={20}
            minSize={18}
            maxSize={30}
            className="border-r border-[#E5E1D8]/50 bg-white/40 backdrop-blur-xl z-20 transition-all duration-300"
          >
            <FieldSidebar onFieldClick={handleFieldClick} />
          </ResizablePanel>
        )}

        {mode === 'editor' && <ResizableHandle withHandle className="bg-transparent hover:bg-[#E89E45]/20 w-1 transition-colors" />}

        {/* Canvas Panel */}
        <ResizablePanel defaultSize={mode === 'editor' ? 80 : 100} minSize={50} className="bg-transparent relative z-10 h-full">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-soft-light" />

          <div className="h-full pt-20 w-full overflow-hidden">
            {mode === 'editor' ? (
              <EditorCanvas
                fields={fields}
                onRemoveField={handleRemoveField}
                onUpdateField={handleFieldUpdate}
                onDragEnd={handleDragEnd}
              />
            ) : (
              <PreviewCanvas fields={fields} />
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
