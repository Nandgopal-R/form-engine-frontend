import { useState } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { FieldItems } from './fields/field-items'
import { TemplateItems } from './fields/template-items'
import type { Template } from '@/api/templates'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

interface TabsLineProps {
  onFieldClick?: (fieldId: string) => void
  onTemplateClick?: (template: Template) => void
  onAIGenerate?: (prompt: string) => void
  isAIGenerating?: boolean
}

export function TabsLine({
  onFieldClick,
  onTemplateClick,
  onAIGenerate,
  isAIGenerating,
}: TabsLineProps) {
  const [prompt, setPrompt] = useState('')

  const handleGenerate = () => {
    if (prompt.trim() && onAIGenerate) {
      onAIGenerate(prompt.trim())
    }
  }

  return (
    <Tabs defaultValue="fields" className="w-full h-full flex flex-col">
      <TabsList variant="line" className="flex justify-center w-full shrink-0">
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
        className="mt-0 flex-1 overflow-y-auto min-h-0"
      >
        <TemplateItems onTemplateClick={onTemplateClick} />
      </TabsContent>

      <TabsContent
        value="generate"
        className="mt-0 flex-1 overflow-y-auto min-h-0 p-4"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Form Generator
          </div>
          <p className="text-xs text-muted-foreground">
            Describe the form you want to create and AI will generate it with appropriate fields. A new form will be created that you can then edit.
          </p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Create a job application form with fields for name, email, resume upload, work experience, and education..."
            className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            rows={5}
            disabled={isAIGenerating}
          />
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isAIGenerating}
            className="w-full gap-2"
          >
            {isAIGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Form
              </>
            )}
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}
