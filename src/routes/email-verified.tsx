import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/email-verified')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/email-verified"!</div>
}
