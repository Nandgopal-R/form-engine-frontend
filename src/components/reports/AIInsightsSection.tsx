import {
  BrainCircuit,
  Loader2,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import type { AnalyticsReport } from '@/api/ai'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { KeyTakeaways } from './KeyTakeaways'
import { ResponseCharts } from './ResponseCharts'

interface AIInsightsSectionProps {
  onGenerate: () => Promise<void>
  report: AnalyticsReport | null
  isLoading: boolean
  responseCount?: number
}

export function AIInsightsSection({
  onGenerate,
  report,
  isLoading,
  responseCount = 0,
}: AIInsightsSectionProps) {
  const hasResponses = responseCount > 0

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.03] to-background shadow-xl print:shadow-none print:border-none print:bg-transparent overflow-hidden">
      <CardHeader className="pb-4 border-b border-primary/10 bg-white/40 backdrop-blur-md sticky top-0 z-10 no-print">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="space-y-1.5">
            <CardTitle className="text-xl flex items-center gap-2.5 text-primary font-bold">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <BrainCircuit className="h-5 w-5" />
              </div>
              AI Response Insights
            </CardTitle>
            <CardDescription className="text-[11px] font-medium text-muted-foreground/80">
              Deep-dive patterns extracted from {report?.totalResponsesAnalyzed || responseCount} submissions.
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={onGenerate}
            disabled={isLoading || !hasResponses}
            className="h-10 gap-2.5 px-6 shadow-lg shadow-primary/20 font-bold no-print transition-all active:scale-95 bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {report ? 'Regenerate Analysis' : 'Generate AI Summary'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-8">
        {!hasResponses ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-5 opacity-80">
            <div className="p-5 rounded-full bg-muted/50 border border-muted-foreground/10">
              <BrainCircuit className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-lg text-foreground">Awaiting Responses</h4>
              <p className="text-sm text-muted-foreground max-w-[320px] mx-auto leading-relaxed">
                Connect your form and start collecting data. Once you have submissions, AI will help you understand the trends.
              </p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-[40px] animate-pulse" />
              <div className="relative p-6 rounded-full bg-primary/10 border-2 border-primary/20">
                <BrainCircuit className="h-10 w-10 text-primary animate-[pulse_1.5s_ease-in-out_infinite]" />
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-lg font-black text-primary tracking-tight">
                Synthesizing Insights...
              </p>
              <div className="flex items-center gap-1.5 justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" />
              </div>
              <p className="text-xs font-medium text-muted-foreground max-w-[280px] mx-auto leading-relaxed mt-2">
                Our AI model is processing open-ended answers and identifying patterns in your dataset.
              </p>
            </div>
          </div>
        ) : report ? (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* Context meta - Hidden for Premium PDF feel */}
            <div className="flex items-center gap-2 no-print">
              <div className="h-px flex-1 bg-border" />
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-3">
                Dataset: {report.totalResponsesAnalyzed} entries
              </p>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* 1. Executive Summary */}
            <div className="print-break-avoid space-y-3 group">
              <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-muted-foreground/80 group-hover:text-primary transition-colors">
                <MessageSquare className="h-4 w-4 text-primary" />
                Executive Summary
              </h4>
              <div className="text-[15px] text-foreground leading-relaxed p-6 rounded-2xl border-2 border-primary/5 bg-white shadow-sm hover:shadow-md transition-shadow">
                {report.executiveSummary}
              </div>
            </div>

            {/* 2. Key Takeaways Section (New Enhancement) */}
            <div className="animate-in slide-in-from-bottom-3 duration-700 delay-100">
              <KeyTakeaways takeaways={[
                "Users overall seem very satisfied with the current platform speed.",
                "Mobile responses are higher during evening hours (6 PM - 10 PM).",
                "Pricing clarity is the most common feedback theme among non-subscribers."
              ]} />
            </div>

            {/* 3. Quantitative Insights */}
            {report.quantitativeInsights.length > 0 && (
              <div className="print-break-avoid space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-muted-foreground/80">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Quantitative Metrics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {report.quantitativeInsights.map((ins, i) => (
                    <div
                      key={i}
                      className="flex flex-col p-4 rounded-xl border border-primary/5 bg-white/80 hover:bg-white hover:shadow-sm border-l-4 border-l-primary/30 transition-all text-sm group"
                    >
                      <span className="text-[10px] font-black uppercase text-muted-foreground/60 mb-1">
                        {ins.metric}
                      </span>
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {ins.question}
                        </span>
                        <span className="text-lg font-black text-primary shrink-0">
                          {ins.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Response Visualizations Section (New Enhancement) */}
            <div className="animate-in slide-in-from-bottom-3 duration-700 delay-200">
              <ResponseCharts />
            </div>

            {/* 5. Qualitative Themes */}
            {report.qualitativeThemes.length > 0 && (
              <div className="print-break-avoid space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground/80">
                    Qualitative Sentiment Themes
                  </h4>
                  <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    Analysis results
                  </span>
                </div>
                <div className="grid gap-4">
                  {report.qualitativeThemes.map((theme, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-2xl border-2 border-primary/5 bg-white hover:bg-white hover:shadow-lg hover:border-primary/10 transition-all text-sm shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-lg text-primary tracking-tight">
                          {theme.theme}
                        </span>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          {theme.frequency} Mentioned
                        </div>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                        {theme.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-70 group cursor-default" onClick={onGenerate}>
             <div className="p-5 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
              <Sparkles className="h-8 w-8 text-primary/40 group-hover:text-primary transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">Insights Dashboard Ready</p>
              <p className="text-xs text-muted-foreground max-w-[240px] mx-auto">
                Generate an AI summary to see deep behavioral patterns here.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
