import { TabsLine } from './editor-sidebar-tabs'
import type { Template } from '@/api/templates'

interface FieldSidebarProps {
  onFieldClick?: (fieldId: string) => void
  onTemplateClick?: (template: Template) => void
  onAIGenerate?: (prompt: string) => void
  isAIGenerating?: boolean
}

export function FieldSidebar({
  onFieldClick,
  onTemplateClick,
  onAIGenerate,
  isAIGenerating,
}: FieldSidebarProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <TabsLine
        onFieldClick={onFieldClick}
        onTemplateClick={onTemplateClick}
        onAIGenerate={onAIGenerate}
        isAIGenerating={isAIGenerating}
      />
    </div>
  )
}
