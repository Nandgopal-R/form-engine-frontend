import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/analytics')({
  component: AnalyticsLayout,
})

function AnalyticsLayout() {
  return <Outlet />
}

