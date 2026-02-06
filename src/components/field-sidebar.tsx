import { TabsLine } from "./editor-sidebar-tabs"

import type { CanvasField } from "@/components/fields/field-preview"

interface FieldSidebarProps {
  onFieldClick?: (fieldId: string) => void
  selectedField?: CanvasField
}

export function FieldSidebar({
  onFieldClick,
}: FieldSidebarProps) {
  // Only render the components list
  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-4 pb-2">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Form Elements</h2>
        <p className="text-xs text-gray-500">Drag or click to add fields</p>
      </div>
      <div className="flex-1 overflow-hidden hover:overflow-y-auto custom-scrollbar">
        <TabsLine onFieldClick={onFieldClick} />
      </div>
    </div>
  )
}
