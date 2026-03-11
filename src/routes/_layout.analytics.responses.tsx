import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  AlertCircle,
  ChevronDown,
  Download,
  FileText,
  Filter,
  Loader2,
  Search,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ReceivedResponse } from '@/api/responses'
import type { Form } from '@/api/forms'
import { responsesApi } from '@/api/responses'
import { formsApi } from '@/api/forms'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/_layout/analytics/responses')({
  component: ResponsesPage,
})

// Extended interface for frontend display
type SimulatedResponse = ReceivedResponse

function ResponsesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [selectedForm, setSelectedForm] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [expandedAnswers, setExpandedAnswers] = useState<
    Record<string, boolean>
  >({})

  const toggleExpand = (responseId: string) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [responseId]: !prev[responseId],
    }))
  }

  // Fetch all forms
  const {
    data: forms,
    isLoading: isFormsLoading,
    error: formsError,
  } = useQuery<Array<Form>>({
    queryKey: ['forms'],
    queryFn: () => formsApi.getAll(),
  })

  // Aggregate responses for all forms
  const { data: allResponses = [], isLoading: isAllResponsesLoading } =
    useQuery({
      queryKey: ['received-responses'],
      queryFn: () => responsesApi.getAllReceived(),
      retry: false,
    })

  // Group responses by form for the UI
  const groupedResponses = useMemo(() => {
    return (forms || [])
      .map((f) => {
        const responsesForForm = allResponses.filter(
          (r: any) => r.formId === f.id,
        )
        return {
          formId: f.id,
          formTitle: f.title,
          responses: responsesForForm,
        }
      })
      .filter((group) => group.responses.length > 0 || searchTerm === '')
  }, [allResponses, forms, searchTerm])

  // Filtering logic
  const filteredGroups = useMemo(() => {
    return groupedResponses
      .map((group) => ({
        ...group,
        responses: group.responses.filter((r) => {
          const answersStr = JSON.stringify(r.answers).toLowerCase()
          const matchesSearch =
            searchTerm === '' ||
            answersStr.includes(searchTerm.toLowerCase()) ||
            (r.responder &&
              r.responder.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (r.email &&
              r.email.toLowerCase().includes(searchTerm.toLowerCase()))

          const matchesDate =
            filterDate === '' || (r.createdAt && r.createdAt.startsWith(filterDate))
          const matchesForm = selectedForm === 'all' || r.formId === selectedForm
          const matchesStatus =
            selectedStatus === 'all' || r.status === selectedStatus

          return matchesSearch && matchesDate && matchesForm && matchesStatus
        }),
      }))
      .filter((group) => group.responses.length > 0)
  }, [groupedResponses, searchTerm, filterDate, selectedForm, selectedStatus])

  const handleExport = (
    type: 'csv' | 'json',
    group: { formTitle?: string; responses: Array<SimulatedResponse> },
  ) => {
    const data = group.responses
    let blob: Blob
    let filename = `${group.formTitle || 'responses'}_${
      new Date().toISOString().split('T')[0]
    }`

    if (type === 'json') {
      blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })
      filename += '.json'
    } else {
      const headers = Array.from(
        new Set(data.flatMap((r: SimulatedResponse) => Object.keys(r.answers))),
      )
      const csvRows = [
        ['Responder', 'Email', 'Date', 'Status', ...headers].join(','),
        ...data.map((r: SimulatedResponse) =>
          [
            `"${r.responder || 'Anonymous'}"`,
            `"${r.email || 'N/A'}"`,
            new Date(r.createdAt).toLocaleDateString(),
            `"${r.status || 'Submitted'}"`,
            ...headers.map(
              (h) =>
                `"${String(
                  (r.answers as Record<string, any>)[h] || '',
                ).replace(/"/g, '""')}"`,
            ),
          ].join(','),
        ),
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

  const clearFilters = () => {
    setSearchTerm('')
    setFilterDate('')
    setSelectedForm('all')
    setSelectedStatus('all')
  }

  // Loading state
  if (isFormsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading responses...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (formsError || !forms) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 mb-5">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="text-xl font-bold mb-2">Error Loading Responses</h2>
          <p className="text-muted-foreground">
            {formsError ? String(formsError) : 'Failed to load form responses'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 bg-muted/5">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Form Responses</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage and analyze collected data
            </p>
          </div>
          <div className="flex items-center gap-2"></div>
        </div>

        {/* Filters */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search responder or answer..."
                  className="pl-9 h-10 border-none bg-muted/50 focus-visible:ring-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Input
                  type="date"
                  className="h-10 w-full sm:w-[160px] border-none bg-muted/50 focus-visible:ring-1"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
                <Button
                  variant={showFilters ? 'secondary' : 'ghost'}
                  size="icon"
                  className={`h-10 w-10 shrink-0 ${
                    showFilters ? 'bg-primary/10 text-primary' : 'bg-muted/50'
                  }`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg animate-in fade-in slide-in-from-top-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
                    Filter by Form
                  </label>
                  <Select value={selectedForm} onValueChange={setSelectedForm}>
                    <SelectTrigger className="h-9 border-none bg-background shadow-sm">
                      <SelectValue placeholder="All Forms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Forms</SelectItem>
                      {forms.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
                    Filter by Status
                  </label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="h-9 border-none bg-background shadow-sm">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs gap-1.5 text-muted-foreground"
                    onClick={clearFilters}
                  >
                    <X className="h-3 w-3" />
                    Clear all filters
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {isAllResponsesLoading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary/40 mx-auto mb-4" />
            <div className="text-muted-foreground animate-pulse font-medium">
              Synchronizing responses...
            </div>
          </div>
        )}

        {forms.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-muted/5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted/50 mb-4">
              <FileText className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-bold">No forms found</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-2">
              Create your first form to start collecting responses and view
              analytics.
            </p>
          </div>
        )}

        {filteredGroups.length > 0 ? (
          <div className="space-y-6">
            {filteredGroups.map((group) => (
              <Card
                key={group.formId}
                className="border-none shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <CardHeader className="bg-muted/30 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        {group.formTitle || 'Untitled Form'}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {group.responses.length} responses
                        </span>
                        <span>•</span>
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                          Live
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 text-xs gap-1.5"
                        onClick={() => handleExport('json', group)}
                      >
                        <Download className="h-3.5 w-3.5" />
                        JSON
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 text-xs gap-1.5"
                        onClick={() => handleExport('csv', group)}
                      >
                        <Download className="h-3.5 w-3.5" />
                        CSV
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y border-t overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted/20 text-muted-foreground uppercase text-[10px] font-bold tracking-widest">
                        <tr>
                          <th className="px-6 py-3 min-w-[150px]">Responder</th>
                          <th className="px-6 py-3 min-w-[200px]">
                            Answer Summary
                          </th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3 text-right">Submitted</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {group.responses.map((response) => (
                          <tr
                            key={response.id}
                            className="hover:bg-muted/10 transition-colors"
                          >
                            <td className="px-6 py-4 align-top">
                              <div className="font-bold text-foreground">
                                {response.responder &&
                                response.responder !== 'Anonymous'
                                  ? response.responder
                                  : `Guest User`}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                {response.email && response.email !== 'N/A'
                                  ? response.email
                                  : 'Public Session'}
                              </div>
                            </td>
                            <td className="px-6 py-4 align-top">
                              <div className="space-y-1.5">
                                {Object.entries(response.answers)
                                  .slice(
                                    0,
                                    expandedAnswers[response.id]
                                      ? undefined
                                      : 2,
                                  )
                                  .map(([k, v]) => (
                                    <div key={k} className="flex gap-2 text-sm">
                                      <span className="text-muted-foreground font-semibold shrink-0">
                                        {k}:
                                      </span>
                                      <span className="italic">
                                        {Array.isArray(v)
                                          ? v.join(', ')
                                          : String(v)}
                                      </span>
                                    </div>
                                  ))}

                                {Object.keys(response.answers).length > 2 && (
                                  <button
                                    onClick={() => toggleExpand(response.id)}
                                    className="text-[10px] text-primary font-bold hover:underline inline-flex items-center gap-1 mt-1 bg-transparent border-none p-0"
                                  >
                                    {expandedAnswers[response.id]
                                      ? 'Show fewer answers'
                                      : `+${
                                          Object.keys(response.answers).length -
                                          2
                                        } more answers`}
                                    <ChevronDown
                                      className={`h-3 w-3 transition-transform ${
                                        expandedAnswers[response.id]
                                          ? 'rotate-180'
                                          : ''
                                      }`}
                                    />
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 align-top">
                              <Badge
                                variant={
                                  response.status === 'Completed'
                                    ? 'outline'
                                    : 'secondary'
                                }
                                className={`text-[9px] font-bold px-1.5 py-0 ${
                                  response.status === 'Completed'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-orange-50 text-orange-700 border-orange-200'
                                }`}
                              >
                                {response.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 align-top text-right">
                              <div className="text-xs font-bold text-muted-foreground whitespace-nowrap">
                                {response.createdAt &&
                                !isNaN(Date.parse(response.createdAt))
                                  ? new Date(
                                      response.createdAt,
                                    ).toLocaleDateString()
                                  : '—'}
                              </div>
                              <div className="text-[9px] text-muted-foreground/60 mt-1">
                                {response.createdAt &&
                                !isNaN(Date.parse(response.createdAt))
                                  ? new Date(
                                      response.createdAt,
                                    ).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : '—'}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          !isAllResponsesLoading && (
            <div className="text-center py-24 border-2 border-dashed rounded-2xl bg-muted/5">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-6">
                <Search className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <h3 className="text-xl font-bold">
                No matches found for your filters
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto mt-2 text-sm">
                Try adjusting your search terms or filters to find what you're
                looking for.
              </p>
              <Button
                variant="link"
                className="mt-4 text-primary font-bold"
                onClick={clearFilters}
              >
                Clear all filters and show everything
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  )
}
