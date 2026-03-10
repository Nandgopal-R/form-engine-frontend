import { TabsLine } from './editor-sidebar-tabs'
import type { Template } from '@/api/templates'

interface FieldSidebarProps {
  onFieldClick?: (fieldId: string) => void
  onTemplateClick?: (template: Template) => void
}

export function FieldSidebar({
  onFieldClick,
  onTemplateClick,
}: FieldSidebarProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <TabsLine onFieldClick={onFieldClick} onTemplateClick={onTemplateClick} />
    </div>
  )
}
