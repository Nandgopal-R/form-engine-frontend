import { FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Form {
    id: string
    title: string
    responseCount?: number
}

interface ReportsSidebarProps {
    forms: Array<Form>
    selectedFormId: string | null
    onSelectForm: (id: string) => void
}

export function ReportsSidebar({ forms, selectedFormId, onSelectForm }: ReportsSidebarProps) {
    return (
        <div className="flex flex-col h-full border-r bg-muted/10 no-print print:hidden">
            <div className="p-4 border-b">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Reports
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                    Select a form to view its AI insights
                </p>
            </div>
            <div className="flex-1 overflow-auto">
                <div className="p-2 space-y-1">
                    {forms.map((form) => (
                        <button
                            key={form.id}
                            onClick={() => onSelectForm(form.id)}
                            className={cn(
                                "w-full flex items-center justify-between p-3 rounded-lg text-left transition-all group",
                                "hover:bg-accent hover:text-accent-foreground",
                                selectedFormId === form.id
                                    ? "bg-primary/10 text-primary font-medium border-l-4 border-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            <div className="flex flex-col gap-0.5 overflow-hidden">
                                <span className="truncate text-sm">{form.title}</span>
                                {form.responseCount !== undefined && (
                                    <span className="text-[10px] opacity-70">
                                        {form.responseCount} response{form.responseCount !== 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                    {forms.length === 0 && (
                        <div className="p-8 text-center space-y-2">
                            <p className="text-sm text-muted-foreground italic">No forms found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
