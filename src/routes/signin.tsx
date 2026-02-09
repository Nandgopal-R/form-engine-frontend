import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { z } from 'zod'
import { authClient } from '@/lib/auth-client'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export const Route = createFileRoute('/signin')({
  component: Login,
})

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('All fields are required')
      return
    }

    const validation = loginSchema.safeParse({ email, password })
    if (!validation.success) {
      setError(validation.error.errors[0].message)
      return
    }

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          setLoading(true)
        },
        onSuccess: () => {
          window.location.href = '/dashboard'
        },
        onError: (ctx: { error: Error }) => {
          setLoading(false)
          setError(ctx.error.message)
        },
      },
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-primary">
        FormEngine
      </h1>

      <div className="w-full max-w-[420px] rounded-2xl bg-card p-8 shadow-xl border border-border">
        <h2 className="mb-1.5 text-2xl font-bold text-card-foreground">
          Sign in
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>

        {error && (
          <p className="mb-4 text-sm text-destructive font-medium">{error}</p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[10px] border border-input bg-background p-3 text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-[10px] border border-input bg-background p-3 pr-11 text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none transition-all"
              />
              {password.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="remember" className="text-xs text-muted-foreground">
                Remember me
              </label>
            </div>
            <a href="#" className="text-xs font-medium text-primary hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full justify-center rounded-[10px] bg-primary p-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-70 shadow-md transform hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <button
          type="button"
          className="w-full rounded-[10px] border border-input bg-background p-3 font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground hover:border-ring flex items-center justify-center gap-2"
          onClick={async () => {
            try {
              await authClient.signIn.social({
                provider: 'google',
                callbackURL: 'http://localhost:3000/dashboard',
              })
            } catch (err: any) {
              console.error('Google Signin Error:', err)
              alert(
                'Google Signin Failed: ' + (err.message || JSON.stringify(err)),
              )
            }
          }}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>

        <p className="mt-6 text-center text-[13px] text-muted-foreground">
          Don’t have an account?{' '}
          <Link
            to="/signup"
            className="text-primary font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
