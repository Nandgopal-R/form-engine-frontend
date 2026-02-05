import { createFileRoute } from '@tanstack/react-router'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { FieldSidebar } from '@/components/field-sidebar'

export const Route = createFileRoute('/_layout/editor')({
  component: EditorComponent,
})

function EditorComponent() {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full">
      <ResizablePanel defaultSize={20}>
        <div className="flex h-full w-full">
          <FieldSidebar />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={80}>
        <div className="space-y-6">
          <div className="flex h-full items-center justify-center">
            <span className="font-semibold">Editor Canvas</span>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
