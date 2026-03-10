import { FieldItems } from './fields/field-items'
import { TemplateItems } from './fields/template-items'
import type { Template } from '@/api/templates'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface TabsLineProps {
  onFieldClick?: (fieldId: string) => void
  onTemplateClick?: (template: Template) => void
}

export function TabsLine({
  onFieldClick,
  onTemplateClick,
}: TabsLineProps) {
  return (
    <Tabs defaultValue="fields" className="w-full h-full flex flex-col">
      <TabsList variant="line" className="flex justify-center w-full shrink-0">
        <TabsTrigger value="fields">Fields</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
      </TabsList>

      <TabsContent
        value="fields"
        className="mt-0 flex-1 overflow-y-auto min-h-0"
      >
        <FieldItems onFieldClick={onFieldClick} />
      </TabsContent>

      <TabsContent
        value="templates"
        className="mt-0 flex-1 overflow-y-auto min-h-0"
      >
        <TemplateItems onTemplateClick={onTemplateClick} />
      </TabsContent>
    </Tabs>
  )
}
