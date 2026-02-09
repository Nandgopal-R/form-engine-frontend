import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, Calendar, CheckCircle, ClipboardList, ExternalLink, FileEdit, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { responsesApi } from '@/api/responses'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/_layout/my-responses')({
  component: () => <MyResponsesPage />,
})

function MyResponsesPage() {
  const {
    data: responses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['my-responses'],
    queryFn: () => responsesApi.getMyResponses(),
  })

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">
            Loading your responses...
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 mb-5">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="text-xl font-bold mb-2">Error Loading Responses</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : 'Failed to load your responses'}
          </p>
        </div>
      </div>
    )
  }

  // Empty state
  if (!responses || responses.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-5">
            <ClipboardList className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">No Responses Yet</h2>
          <p className="text-muted-foreground">
            You haven't submitted any form responses yet. When you fill out a form, your responses will appear here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Responses</h1>
          <p className="text-muted-foreground mt-2">
            View all forms you've filled out and your submitted responses
          </p>
        </div>

        <div className="space-y-4">
          {responses.map((response) => (
            <Card key={response.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">
                      {response.formTitle || 'Untitled Form'}
                    </CardTitle>
                    {response.isSubmitted ? (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Submitted
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                        <FileEdit className="h-3 w-3 mr-1" />
                        Draft
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDistanceToNow(new Date(response.updatedAt), { addSuffix: true })}
                  </Badge>
                </div>
                {response.formDescription && (
                  <CardDescription className="mt-2">
                    {response.formDescription}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Your Answers:</h4>
                  <div className="grid gap-2 bg-muted/50 rounded-lg p-4">
                    {Object.entries(response.answers).map(([fieldName, value]) => (
                      <div key={fieldName} className="grid grid-cols-3 gap-2 text-sm">
                        <div className="font-medium text-foreground">{fieldName}:</div>
                        <div className="col-span-2 text-muted-foreground">
                          {Array.isArray(value)
                            ? value.join(', ')
                            : value === null || value === undefined
                              ? '-'
                              : String(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/form/$formId" params={{ formId: response.formId }}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {response.isSubmitted ? 'View Form' : 'Continue Editing'}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
