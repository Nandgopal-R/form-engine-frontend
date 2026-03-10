import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, FileText, Loader2 } from 'lucide-react'
import type { FormResponseForOwner } from '@/api/responses'
import type { Form } from '@/api/forms';
import { responsesApi } from '@/api/responses'
import { formsApi } from '@/api/forms'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/_layout/analytics/responses')({
  component: ResponsesPage,
})

function ResponsesPage() {
  // Fetch all forms
  const {
    data: forms,
    isLoading: isFormsLoading,
    error: formsError,
  } = useQuery<Array<Form>>({
    queryKey: ['forms'],
    queryFn: () => formsApi.getAll(),
  })

  // Aggregate responses for all forms - must be called before any returns
  const {
    data: allResponses,
    isLoading: isAllResponsesLoading,
  } = useQuery<
    Array<{ formId: string; formTitle?: string; responses: Array<FormResponseForOwner> }>
  >({
    queryKey: ['analytics', 'all-responses', forms?.map((f) => f.id) ?? []],
    queryFn: async () => {
      if (!forms || forms.length === 0) return []
      const grouped = await Promise.all(
        forms.map(async (f) => {
          try {
            const res = await responsesApi.getForForm(f.id)
            return { formId: f.id, formTitle: f.title, responses: res }
          } catch (e) {
            // If fetching responses for a particular form fails, return empty
            console.error('Failed to fetch responses for form', f.id, e)
            return { formId: f.id, formTitle: f.title, responses: [] }
          }
        }),
      )
      return grouped
    },
    enabled: !!forms && forms.length > 0,
    retry: false,
  })

  // Loading state
  if (isFormsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">
            Loading responses...
          </p>
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

  // Empty state
  if (forms.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-5">
            <FileText className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">No Forms Yet</h2>
          <p className="text-muted-foreground">
            Create a form first to collect responses.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Form Responses</h1>
          <p className="text-muted-foreground mt-2">
            View all submitted responses for your forms
          </p>
        </div>

        {/* Loading / Error handling */}
        {isAllResponsesLoading && (
          <div className="text-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-2" />
            <div className="text-muted-foreground">Loading responses...</div>
          </div>
        )}

        {forms.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No forms found. Create a form first to collect responses.
          </div>
        )}

        {/* Show aggregated responses grouped by form */}
        {allResponses && allResponses.length > 0 ? (
          <div className="space-y-6">
            {allResponses.map((group) => (
              <Card key={group.formId}>
                <CardHeader>
                  <CardTitle>{group.formTitle || 'Untitled Form'}</CardTitle>
                  <CardDescription>
                    {group.responses.length
                      ? `${group.responses.length} response${group.responses.length === 1 ? '' : 's'}`
                      : 'No responses yet'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {group.responses.length > 0 ? (
                    <div className="space-y-4">
                      {group.responses.map((response, idx) => (
                        <div key={response.id} className="border rounded-lg p-4 space-y-2">
                          <h3 className="font-medium text-sm text-muted-foreground">Response #{idx + 1}</h3>
                          <div className="space-y-2">
                            {Object.entries(response.answers).map(([k, v]) => (
                              <div key={k} className="grid grid-cols-3 gap-2">
                                <div className="font-medium text-sm">{k}:</div>
                                <div className="col-span-2 text-sm">
                                  {Array.isArray(v) ? v.join(', ') : v === null || v === undefined ? '-' : String(v)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No responses received yet.</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          !isAllResponsesLoading && (
            <div className="text-center py-8 text-muted-foreground">No responses received yet.</div>
          )
        )}
      </div>
    </div>
  )
}

// Note: individual per-form response card component was removed in favor of the
// aggregated view above. Keep this file focused on the aggregated responses UI.
