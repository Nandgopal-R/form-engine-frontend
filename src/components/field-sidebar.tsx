import { TabsLine } from "./editor-sidebar-tabs"
import { PropertiesPanel } from "@/components/properties-panel"
import type { CanvasField } from "@/components/fields/field-preview"

interface FieldSidebarProps {
  onFieldClick?: (fieldId: string) => void
  selectedField?: CanvasField
  onFieldUpdate?: (field: CanvasField) => void
  onCloseProperties?: () => void
}

export function FieldSidebar({
  onFieldClick,
  selectedField,
  onFieldUpdate,
  onCloseProperties
}: FieldSidebarProps) {
  if (selectedField && onFieldUpdate && onCloseProperties) {
    return (
      <div className="h-full w-full bg-background border-r">
        <PropertiesPanel
          field={selectedField}
          onUpdate={onFieldUpdate}
          onClose={onCloseProperties}
        />
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col">
      <TabsLine onFieldClick={onFieldClick} />
    </div>
  )
}
