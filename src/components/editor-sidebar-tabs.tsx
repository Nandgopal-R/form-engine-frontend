import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function TabsLine() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList variant="line" className="flex justify-center w-full">
        <TabsTrigger value="Fields">Fields</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="generate">Generate</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
