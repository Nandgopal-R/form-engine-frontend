import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { PanelLeft } from 'lucide-react'
import type { AnalyticsReport } from '@/api/ai'
import { formsApi } from '@/api/forms'
import { aiApi } from '@/api/ai'
import { ReportsSidebar } from '@/components/reports/ReportsSidebar'
import { ReportViewer } from '@/components/reports/ReportViewer'
import { useToast } from '@/hooks/use-toast'
import { useIsMobile } from '@/hooks/use-mobile'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'


export const Route = createFileRoute('/_layout/analytics/reports')({
  component: ReportsPage,
})

function ReportsPage() {
  const { toast } = useToast()
  const isMobile = useIsMobile()
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null)
  const [report, setReport] = useState<AnalyticsReport | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Fetch all forms for the sidebar
  const { data: forms = [] } = useQuery({
    queryKey: ['forms'],
    queryFn: () => formsApi.getAll(),
  })

  // Find the selected form object
  const selectedForm = forms.find((f) => f.id === selectedFormId) || null

  const handleGenerateReport = async () => {
    if (!selectedFormId) return

    setIsGenerating(true)
    try {
      const data = await aiApi.generateSummary(selectedFormId)
      setReport(data)
      toast({
        title: 'Report Generated',
        description: 'AI has successfully analyzed your responses.',
      })
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExportPDF = () => {
    window.print()
  }

  return (
    <div className="flex h-full bg-background overflow-hidden print:block print:bg-white print:overflow-visible print:h-auto">
      {isMobile ? (
        <>
          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetContent side="left" className="w-[300px] p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Select Form</SheetTitle>
              </SheetHeader>
              <ReportsSidebar
                forms={forms}
                selectedFormId={selectedFormId}
                onSelectForm={(id) => {
                  setSelectedFormId(id)
                  setReport(null)
                  setMobileSidebarOpen(false)
                }}
              />
            </SheetContent>
          </Sheet>
          <div className="flex-1 h-full overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 px-3 py-2 border-b bg-background print:hidden">
              <Button variant="outline" size="sm" onClick={() => setMobileSidebarOpen(true)}>
                <PanelLeft className="h-4 w-4 mr-1" />
                Select Form
              </Button>
              {selectedForm && (
                <span className="text-sm text-muted-foreground truncate">{selectedForm.title}</span>
              )}
            </div>
            <div className="flex-1 min-h-0 overflow-hidden print:h-auto print:overflow-visible print:w-full">
              <ReportViewer
                form={selectedForm}
                report={report}
                isLoading={isGenerating}
                onGenerate={handleGenerateReport}
                onExport={handleExportPDF}
                responseCount={selectedForm?.responseCount || 0}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-80 shrink-0 h-full border-r print:hidden no-print">
            <ReportsSidebar
              forms={forms}
              selectedFormId={selectedFormId}
              onSelectForm={(id) => {
                setSelectedFormId(id)
                setReport(null)
              }}
            />
          </div>
          <div className="flex-1 h-full overflow-hidden print:h-auto print:overflow-visible print:w-full">
            <ReportViewer
              form={selectedForm}
              report={report}
              isLoading={isGenerating}
              onGenerate={handleGenerateReport}
              onExport={handleExportPDF}
              responseCount={selectedForm?.responseCount || 0}
            />
          </div>
        </>
      )}
    </div>
  )
}
