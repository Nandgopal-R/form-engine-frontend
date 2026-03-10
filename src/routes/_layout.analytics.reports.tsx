import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { formsApi } from '@/api/forms'
import { aiApi } from '@/api/ai'
import { ReportsSidebar } from '@/components/reports/ReportsSidebar'
import { ReportViewer } from '@/components/reports/ReportViewer'
import { useToast } from '@/hooks/use-toast'
import type { AnalyticsReport } from '@/api/ai'

export const Route = createFileRoute('/_layout/analytics/reports')({
  component: ReportsPage,
})

function ReportsPage() {
  const { toast } = useToast()
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null)
  const [report, setReport] = useState<AnalyticsReport | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

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
      <div className="w-80 shrink-0 h-full border-r print:hidden no-print">
        <ReportsSidebar
          forms={forms}
          selectedFormId={selectedFormId}
          onSelectForm={(id) => {
            setSelectedFormId(id)
            setReport(null) // Reset report when form changes
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
    </div>
  )
}
