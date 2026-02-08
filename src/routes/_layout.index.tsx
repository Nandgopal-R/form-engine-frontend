import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { FormCard } from '@/components/form-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Filter, FileX, Loader2, AlertCircle } from 'lucide-react'
import { formsApi } from '@/api/forms'

export const Route = createFileRoute('/_layout/')({
  component: DashboardPage,
})

function FormCardSkeleton() {
  return (
    <Card className="overflow-hidden p-0 gap-0 border-border/60 animate-pulse">
      <div className="h-32 w-full bg-muted/50" />
      <div className="p-5 pt-4">
        <div className="mb-6">
          <div className="h-5 bg-muted/50 rounded w-3/4 mb-3" />
          <div className="space-y-2">
            <div className="h-4 bg-muted/50 rounded w-1/2" />
            <div className="h-4 bg-muted/50 rounded w-2/3" />
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="h-8 w-8 bg-muted/50 rounded" />
          <div className="h-9 bg-muted/50 rounded-full w-28" />
        </div>
      </div>
    </Card>
  )
}

function DashboardPage() {
  const navigate = useNavigate()

  const { data: forms, isLoading, isError, error } = useQuery({
    queryKey: ['forms'],
    queryFn: formsApi.getAll,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Recent Forms</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage and track your active form responses
          </p>
        </div>
        <Button variant="outline" className="border-gray-300">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <FormCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Failed to load forms
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {error instanceof Error ? error.message : 'Something went wrong. Please try again.'}
          </p>
        </div>
      ) : forms && forms.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {forms.map((form) => (
            <FormCard
              key={form.id}
              id={form.id}
              name={form.title}
              lastUpdated={new Date(form.createdAt)}
              isPublished={form.isPublished}
              responseCount={0}
              onEdit={() => navigate({ to: '/editor/$formId', params: { formId: form.id } })}
              onView={() => navigate({ to: '/form/$formId', params: { formId: form.id } })}
              onAnalytics={() => console.log('Analytics:', form.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <FileX className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            No forms yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Create your first form to get started collecting responses.
          </p>
        </div>
      )}
    </div>
  )
}

