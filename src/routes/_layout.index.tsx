import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import { useEffect, useMemo } from 'react'
import { AlertCircle, FileX, Plus, Search } from 'lucide-react'
import { FormCard } from '@/components/form-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formsApi } from '@/api/forms'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

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
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession()
        if (!session.data) {
          navigate({ to: '/signin' })
        }
      } catch (error) {
        navigate({ to: '/signin' })
      }
    }
    checkAuth()
  }, [navigate])

  const {
    data: forms,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['forms'],
    queryFn: formsApi.getAll,
  })

  const queryClient = useQueryClient()

  const deleteFormMutation = useMutation({
    mutationFn: formsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] })
    },
  })

  const publishFormMutation = useMutation({
    mutationFn: formsApi.publish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] })
    },
    onError: (publishError) => {
      console.error('Failed to publish form:', publishError)
      alert(
        'Failed to publish form. The backend endpoint may not be available yet.',
      )
    },
  })

  const unpublishFormMutation = useMutation({
    mutationFn: formsApi.unpublish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] })
    },
    onError: (unpublishError) => {
      console.error('Failed to unpublish form:', unpublishError)
      alert(
        'Failed to unpublish form. The backend endpoint may not be available yet.',
      )
    },
  })

  const handleDelete = (id: string, name: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      )
    ) {
      deleteFormMutation.mutate(id)
    }
  }

  const handlePublish = (id: string, _name: string) => {
    publishFormMutation.mutate(id)
  }

  const handleUnpublish = (id: string, _name: string) => {
    unpublishFormMutation.mutate(id)
  }

  const { toast } = useToast()

  // Filter forms based on search query
  const filteredForms = useMemo(() => {
    if (!forms) return []
    if (!searchQuery.trim()) return forms
    
    const query = searchQuery.toLowerCase().trim()
    return forms.filter((form) => {
      const title = (form.title || form.name || '').toLowerCase()
      const description = (form.description || '').toLowerCase()
      return title.includes(query) || description.includes(query)
    })
  }, [forms, searchQuery])

  const handleShare = (id: string, name: string) => {
    const shareUrl = `${window.location.origin}/form/${id}`
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: 'Link copied!',
        description: `Share link for "${name}" has been copied to clipboard.`,
        variant: 'success',
      })
    }).catch(() => {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy link to clipboard.',
        variant: 'destructive',
      })
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Recent Forms</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage and track your active form responses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search forms..."
              className="pl-9 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => navigate({ to: '/editor' })} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Form
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <FormCardSkeleton key={`skeleton-${i}`} />
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
            {error instanceof Error
              ? error.message
              : 'Something went wrong. Please try again.'}
          </p>
        </div>
      ) : forms && forms.length > 0 ? (
        filteredForms.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredForms.map((form) => (
              <FormCard
                key={form.id}
                id={form.id}
                name={form.title || form.name || 'Untitled Form'}
                lastUpdated={new Date(form.createdAt)}
                isPublished={form.isPublished}
                responseCount={form.responseCount ?? 0}
                isPublishing={publishFormMutation.isPending}
                isUnpublishing={unpublishFormMutation.isPending}
                onEdit={() =>
                  navigate({ to: '/editor/$formId', params: { formId: form.id } })
                }
                onView={() =>
                  navigate({ to: '/form/$formId', params: { formId: form.id } })
                }
                onAnalytics={() => console.log('Analytics:', form.id)}
                onDelete={() =>
                  handleDelete(
                    form.id,
                    form.title || form.name || 'Untitled Form',
                  )
                }
                onPublish={() =>
                  handlePublish(
                    form.id,
                    form.title || form.name || 'Untitled Form',
                  )
                }
                onUnpublish={() =>
                  handleUnpublish(
                    form.id,
                    form.title || form.name || 'Untitled Form',
                  )
                }
                onShare={() =>
                  handleShare(
                    form.id,
                    form.title || form.name || 'Untitled Form',
                  )
                }
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No matching forms
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              No forms found matching "{searchQuery}". Try a different search term.
            </p>
          </div>
        )
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
