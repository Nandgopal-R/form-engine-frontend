import { createFileRoute, redirect } from '@tanstack/react-router'
import { Filter, Plus } from 'lucide-react'
import { FormCard } from '@/components/form-card'
import { Button } from '@/components/ui/button'
import { authClient } from "@/lib/auth-client";
import { useQuery } from '@tanstack/react-query';
import { formsApi } from '@/api/forms';

export const Route = createFileRoute('/_layout/')({
  beforeLoad: async () => {
    try {
      const { data: session } = await authClient.getSession();
      if (!session) {
        throw redirect({
          to: '/signin',
        })
      }
    } catch (error: any) {
      if (error?.isRedirect) {
        throw error;
      }
      throw redirect({
        to: '/signin',
      })
    }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { data: forms, isLoading, error } = useQuery({
    queryKey: ['forms'],
    queryFn: formsApi.getAll,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-red-500">
        <p>Failed to load forms.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm underline hover:text-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!forms || forms.length === 0) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">No forms created yet</h2>
          <p className="text-gray-500">Create your first form to start collecting responses.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Form
        </Button>
      </div>
    );
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
        <Button variant="outline" className="border-gray-300">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {forms.map((form) => (
          <FormCard
            key={form.id}
            id={form.id}
            name={form.title}
            lastUpdated={new Date(form.createdAt)}
            isPublished={form.isPublished}
            responseCount={0} // Placeholder until backend provides this
            onEdit={() => console.log('Edit:', form.id)}
            onView={() => console.log('View:', form.id)}
            onAnalytics={() => console.log('Analytics:', form.id)}
          />
        ))}
      </div>
    </div>
  )
}
