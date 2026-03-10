import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  AlertCircle,
  Calendar,
  ChevronRight,
  ClipboardList,
  Clock,
  Download,
  FileEdit,
  FileText,
  Loader2,
  Search,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { formsApi } from '@/api/forms'
import { responsesApi } from '@/api/responses'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/_layout/analytics/')({
  component: AnalyticsOverviewPage,
})

function AnalyticsOverviewPage() {
  const navigate = useNavigate()
  const [dateRange, setDateRange] = useState('')
  const [selectedForm, setSelectedForm] = useState('all')
  const [responderSearch, setResponderSearch] = useState('')

  // Fetch all forms
  const {
    data: forms,
    isLoading: isFormsLoading,
    error: formsError,
  } = useQuery({
    queryKey: ['forms'],
    queryFn: () => formsApi.getAll(),
  })

  // Fetch all received responses (with per-form fallback for deployed backend)
  const {
    data: allResponses = [],
  } = useQuery({
    queryKey: ['received-responses', forms?.map(f => f.id)],
    queryFn: () => responsesApi.getAllReceived(forms?.map(f => f.id)),
    enabled: !!forms,
    retry: false,
  })

  // Filtering logic for responses
  const filteredResponses = useMemo(() => {
    return allResponses.filter(res => {
      const matchesForm = selectedForm === 'all' || res.formId === selectedForm
      const matchesResponder = responderSearch === '' ||
        res.responder.toLowerCase().includes(responderSearch.toLowerCase()) ||
        res.email.toLowerCase().includes(responderSearch.toLowerCase())
      const matchesDate = dateRange === '' || res.createdAt.startsWith(dateRange)

      return matchesForm && matchesResponder && matchesDate
    })
  }, [allResponses, selectedForm, responderSearch, dateRange])

  // Chart data calculation based on actual response dates grouped by weekday
  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const counts: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 }

    filteredResponses.forEach(r => {
      const date = new Date(r.createdAt)
      const dayName = days[date.getDay()]
      counts[dayName]++
    })

    const orderedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return orderedDays.map(label => ({
      label,
      value: counts[label]
    }))
  }, [filteredResponses])

  const handleExport = (type: 'csv' | 'json') => {
    const data = filteredResponses
    let blob: Blob
    let filename = `analytics_export_${new Date().toISOString().split('T')[0]}`

    if (type === 'json') {
      blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      filename += '.json'
    } else {
      const csvRows = [
        ['Responder', 'Email', 'Form', 'Date', 'Status'].join(','),
        ...data.map(r => [
          `"${r.responder}"`,
          `"${r.email}"`,
          `"${r.formName}"`,
          new Date(r.createdAt).toLocaleDateString(),
          `"${r.status}"`
        ].join(','))
      ]
      blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
      filename += '.csv'
    }

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Loading state
  if (isFormsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">
            Loading analytics...
          </p>
        </div>
      </div>
    )
  }

  // Error state — only block on forms error; responses can fail gracefully
  if (formsError || !forms) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 mb-5">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="text-xl font-bold mb-2">Error Loading Analytics</h2>
          <p className="text-muted-foreground">
            {formsError ? String(formsError) : 'Failed to load form analytics'}
          </p>
        </div>
      </div>
    )
  }

  const totalForms = forms.length
  const publishedForms = forms.filter((f) => f.isPublished).length
  const totalResponses = filteredResponses.filter(r => r.isSubmitted).length
  const draftSaves = filteredResponses.filter(r => !r.isSubmitted).length

  return (
    <div className="h-full overflow-y-auto p-6 bg-muted/5">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Analytics Overview
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Track your forms and responses at a glance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 gap-2" onClick={() => handleExport('json')}>
              <Download className="h-4 w-4" />
              Export JSON
            </Button>
            <Button variant="outline" size="sm" className="h-9 gap-2" onClick={() => handleExport('csv')}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-blue-500/10 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total Forms
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalForms}</div>
              <p className="text-[10px] text-muted-foreground mt-1">
                <span className="text-green-500 font-bold">+{publishedForms}</span> published
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-purple-500/10 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total Responses
              </CardTitle>
              <FileText className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gradient leading-none">{totalResponses}</div>
              <p className="text-[10px] text-muted-foreground mt-1">
                From actual submission dates
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-orange-500/10 to-transparent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Draft Saves
              </CardTitle>
              <FileEdit className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{draftSaves}</div>
              <p className="text-[10px] text-muted-foreground mt-1">
                In-progress submissions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="grid gap-6">
          {/* Chart Header & Controls */}
          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Responses per Period</CardTitle>
                  <CardDescription>Activity overview for the current week</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      type="date"
                      className="h-8 pl-8 text-xs border-none bg-muted/50 w-[140px]"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                    />
                  </div>
                  <Select value={selectedForm} onValueChange={setSelectedForm}>
                    <SelectTrigger className="h-8 text-xs border-none bg-muted/50 w-[140px]">
                      <SelectValue placeholder="All Forms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Forms</SelectItem>
                      {forms.map(f => (
                        <SelectItem key={f.id} value={f.id}>{f.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Responder..."
                      className="h-8 pl-8 text-xs border-none bg-muted/50 w-[140px]"
                      value={responderSearch}
                      onChange={(e) => setResponderSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              {/* Horizontal Weekly Summary Overlay */}
              <div className="absolute top-4 left-0 right-0 px-2 z-10 pointer-events-none">
                <div className="bg-popover/80 backdrop-blur-lg px-10 py-5 rounded-2xl border shadow-2xl flex items-center justify-between w-full pointer-events-auto">
                  <div className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-4 border-r pr-10">
                    <Clock className="h-5 w-5" />
                    Weekly Summary
                  </div>
                  <div className="flex flex-1 items-center justify-around px-8">
                    {chartData.map(d => (
                      <div key={d.label} className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest mb-1">{d.label}</span>
                        <span className="text-xl font-black text-primary drop-shadow-sm">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-[220px] flex items-end justify-between gap-3 px-4 pb-2 pt-16">
                {chartData.map((day) => (
                  <div key={day.label} className="flex-1 flex flex-col items-center gap-2 group">
                    <div
                      className="w-full bg-primary/20 hover:bg-primary/40 transition-all rounded-t-md relative"
                      style={{ height: `${Math.max((day.value / 10) * 100, 5)}%` }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Responses Table */}
          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Recent Responses Preview</CardTitle>
                <CardDescription>Latest submissions across your forms</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary font-bold gap-1"
                onClick={() => navigate({ to: '/analytics/responses' })}
              >
                View All <ChevronRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/30 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="px-6 py-3">Responder</th>
                      <th className="px-6 py-3">Form Name</th>
                      <th className="px-6 py-3">Key Answer</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredResponses.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">
                          No responses match your current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredResponses.slice(0, 5).map((res) => (
                        <tr key={res.id} className="hover:bg-muted/10 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-bold">{res.responder}</div>
                            <div className="text-[10px] text-muted-foreground">{res.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                              {res.formName}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs font-medium text-foreground truncate max-w-[300px]">
                              {Object.values(res.answers).find(val => val && String(val).trim() !== '') as string || 'No data provided'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={res.status === 'Completed' ? 'secondary' : 'outline'} className={`text-[9px] font-bold px-1.5 py-0 ${res.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                              }`}>
                              {res.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="text-[10px] font-bold text-muted-foreground">
                              {new Date(res.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

