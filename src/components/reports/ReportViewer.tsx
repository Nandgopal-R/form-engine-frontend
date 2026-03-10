import { AlertCircle, FileText } from 'lucide-react'
import type { AnalyticsReport } from '@/api/ai'
import { AIInsightsSection } from './AIInsightsSection'
import { ReportHeader } from './ReportHeader'
import { ResponseStatistics } from './ResponseStatistics'

interface Form {
    id: string
    title: string
    responseCount?: number
}

interface ReportViewerProps {
    form: Form | null
    report: AnalyticsReport | null
    isLoading: boolean
    onGenerate: () => Promise<void>
    onExport: () => void
    responseCount?: number
}

export function ReportViewer({ form, report, isLoading, onGenerate, onExport, responseCount }: ReportViewerProps) {
    if (!form) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4 opacity-50">
                <div className="p-4 rounded-full bg-muted">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-bold">No Report Selected</h3>
                    <p className="text-sm text-muted-foreground max-w-[300px]">
                        Please select a form from the sidebar to view its detailed AI insights and metrics.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden animate-in fade-in duration-500">
            {/* Standard Report Styling for Print */}
            <style>
                {`
                @media print {
                    @page {
                        margin: 20mm;
                        size: auto;
                    }
                    body {
                        background: white !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    #report-content {
                        margin: 0 !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                        border: none !important;
                        width: 100% !important;
                        max-width: none !important;
                        display: block !important;
                        background: white !important;
                    }
                }
                `}
            </style>

            {/* Interactive Header */}
            <ReportHeader 
                title={form.title} 
                onExport={onExport} 
                isLoading={isLoading} 
                hasReport={!!report} 
            />

            {/* Content */}
            <div className="flex-1 overflow-auto bg-muted/5 scroll-smooth print:bg-white print:overflow-visible">
                <div id="report-content" className="p-10 max-w-4xl mx-auto space-y-10 pb-20 bg-background shadow-xl my-8 rounded-2xl border border-primary/5 print:m-0 print:p-0 print:shadow-none print:border-none print:max-w-none print:w-full">
                    {/* PDF Header Only */}
                    <div className="hidden print:block mb-8">
                        <ReportHeader title={form.title} onExport={onExport} isPdf />
                    </div>

                    <div className="space-y-12">
                        {/* 1. Response Statistics Section */}
                        <section className="animate-in slide-in-from-top-4 duration-700 delay-100">
                            <ResponseStatistics totalResponses={responseCount || report?.totalResponsesAnalyzed || 0} />
                        </section>

                        {/* 2. AI Response Insights Section */}
                        <section className="animate-in slide-in-from-top-4 duration-700 delay-200">
                            <AIInsightsSection
                                onGenerate={onGenerate}
                                isLoading={isLoading}
                                report={report}
                                responseCount={responseCount}
                            />
                        </section>

                        {!report && !isLoading && (
                            <div className="p-12 rounded-2xl border-2 border-dashed border-primary/10 flex flex-col items-center text-center space-y-4 bg-primary/[0.02] no-print">
                                <div className="p-3 rounded-full bg-primary/5">
                                    <AlertCircle className="h-6 w-6 text-primary/40" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-foreground">No insights generated yet</p>
                                    <p className="text-xs text-muted-foreground">
                                        Click "Generate AI Summary" above to perform deep analysis on your responses.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
