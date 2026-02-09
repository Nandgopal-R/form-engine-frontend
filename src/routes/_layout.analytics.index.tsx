import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Loader2, AlertCircle, FileText, Users, ClipboardList } from 'lucide-react'
import { formsApi } from '@/api/forms'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/_layout/analytics/')({
  component: AnalyticsOverviewPage,
})

function AnalyticsOverviewPage() {
  // Fetch all forms
  const {
    data: forms,
    isLoading: isFormsLoading,
    error: formsError,
  } = useQuery({
    queryKey: ['forms'],
    queryFn: () => formsApi.getAll(),
  })

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

  // Error state
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

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Analytics Overview
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your forms and responses at a glance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Forms
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalForms}</div>
              <p className="text-xs text-muted-foreground">
                {publishedForms} published
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Published Forms
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedForms}</div>
              <p className="text-xs text-muted-foreground">
                Active and collecting responses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Draft Forms
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalForms - publishedForms}</div>
              <p className="text-xs text-muted-foreground">
                Not yet published
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Forms List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Forms</CardTitle>
            <CardDescription>
              Your most recently created forms
            </CardDescription>
          </CardHeader>
          <CardContent>
            {forms.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No forms created yet. Create your first form to get started!
              </div>
            ) : (
              <div className="space-y-3">
                {forms.slice(0, 5).map((form) => (
                  <div
                    key={form.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium">{form.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(form.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          form.isPublished
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {form.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
