import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/email-verified')({
  component: EmailVerified,
})

function EmailVerified() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-zinc-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Email Verified!</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400 mt-2">
            Your email address has been successfully verified. You can now access your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          <Link to="/signin" className="w-full">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              Sign In to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
