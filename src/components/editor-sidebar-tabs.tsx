import { FieldItems } from './fields/field-items'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface TabsLineProps {
  onFieldClick?: (fieldId: string) => void
}

export function TabsLine({ onFieldClick }: TabsLineProps) {
  return (
    <Tabs defaultValue="fields" className="w-full h-full">
      <TabsList variant="line" className="flex justify-center w-full">
        <TabsTrigger value="fields">Fields</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="generate">Generate</TabsTrigger>
      </TabsList>

      <TabsContent
        value="fields"
        className="mt-0 flex-1 overflow-y-auto min-h-0"
      >
        <FieldItems onFieldClick={onFieldClick} />
      </TabsContent>

      <TabsContent
        value="templates"
        className="p-4 text-sm text-muted-foreground text-center"
      >
        Templates coming soon
      </TabsContent>

      <TabsContent
        value="generate"
        className="p-4 text-sm text-muted-foreground text-center"
      >
        Generate coming soon
      </TabsContent>
    </Tabs>
  )
}
