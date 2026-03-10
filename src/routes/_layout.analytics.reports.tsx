import { createFileRoute } from '@tanstack/react-router'
import { FileText } from 'lucide-react'

export const Route = createFileRoute('/_layout/analytics/reports')({
    component: ReportsPage,
})

function ReportsPage() {
    return (
        <div className="h-full flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                    <FileText className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Reports Coming Soon</h2>
                <p className="text-muted-foreground text-sm">
                    AI-powered analytics reports will be available here. Stay tuned!
                </p>
            </div>
        </div>
    )
}

