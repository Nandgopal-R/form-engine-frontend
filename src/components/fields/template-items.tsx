import { LayoutTemplate } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { builtinTemplates } from '@/api/templates'
import type { Template } from '@/api/templates'

interface TemplateItemsProps {
  onTemplateClick?: (template: Template) => void
}

export function TemplateItems({ onTemplateClick }: TemplateItemsProps) {
  const templates = builtinTemplates

  return (
    <div className="flex flex-col gap-2 p-3">
      {templates.map((template) => (
        <Button
          key={template.id}
          variant="ghost"
          className="h-12 flex flex-row items-center justify-start gap-3 px-4 hover:bg-accent"
          onClick={() => {
            console.log('Template clicked:', template.title)
            onTemplateClick?.(template)
          }}
        >
          <LayoutTemplate className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium truncate">{template.title}</span>
        </Button>
      ))}
    </div>
  )
}
