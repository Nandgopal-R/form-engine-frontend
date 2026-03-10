import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ReportHeaderProps {
  title: string
  onExport: () => void
  isLoading?: boolean
  hasReport?: boolean
  isPdf?: boolean
}

export function ReportHeader({ 
  title, 
  onExport, 
  isLoading, 
  hasReport,
  isPdf = false
}: ReportHeaderProps) {
  if (isPdf) {
    return (
      <div className="space-y-1 mb-10 border-b pb-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{title}</h1>
        <p className="text-base text-muted-foreground italic font-medium">
          AI-Generated Analytics Report
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm shrink-0 no-print">
      <div className="space-y-1 overflow-hidden mr-4">
        <h1 className="text-2xl font-bold tracking-tight truncate text-foreground">
          {title}
        </h1>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          AI-Generated Analytics Report
        </p>
      </div>
      <Button
        variant="outline"
        className="gap-2 shrink-0 shadow-sm border-primary/20 hover:bg-primary/5 hover:text-primary transition-all active:scale-[0.98]"
        onClick={onExport}
        disabled={!hasReport || isLoading}
      >
        <Download className="h-4 w-4" />
        Export PDF
      </Button>
    </div>
  )
}
