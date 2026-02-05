import { TabsLine } from "./editor-sidebar-tabs"

export function FieldSidebar() {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="shrink-0">
        <TabsLine />
      </div>

      <div className="flex-1 overflow-y-auto ">
        <div className="border">
        </div>
      </div>
    </div>
  )
}
