import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface ExportReportButtonProps {
    onExport: () => void
    disabled?: boolean
}

export function ExportReportButton({ onExport, disabled }: ExportReportButtonProps) {
    return (
        <Button
            variant="outline"
            size="sm"
            className="gap-2 shrink-0 shadow-sm"
            onClick={onExport}
            disabled={disabled}
        >
            <Download className="h-4 w-4" />
            Export PDF
        </Button>
    )
}
