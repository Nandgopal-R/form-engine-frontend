import { TabsLine } from './editor-sidebar-tabs'

interface FieldSidebarProps {
  onFieldClick?: (fieldId: string) => void
}

export function FieldSidebar({ onFieldClick }: FieldSidebarProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <TabsLine onFieldClick={onFieldClick} />
    </div>
  )
}
