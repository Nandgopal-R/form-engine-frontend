import { createFileRoute } from '@tanstack/react-router'
import { BarChart3 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/_layout/analytics/reports')({
    component: ReportsPage,
})

function ReportsPage() {
    return (
        <div className="h-full flex items-center justify-center p-6 bg-muted/5">
            <div className="text-center max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 mb-6 shadow-sm border border-primary/20">
                    <BarChart3 className="h-10 w-10 text-primary animate-pulse" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight mb-2">Advanced Reports</h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    Custom report generation and automated exports are currently under optimization.
                    Detailed analytics are available in the <span className="text-primary font-medium">Overview</span> and <span className="text-primary font-medium">Responses</span> sections.
                </p>
                <div className="mt-8 flex justify-center gap-3">
                    <Badge variant="secondary" className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Coming Soon</Badge>
                </div>
            </div>
        </div>
    )
}

