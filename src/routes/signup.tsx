import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { z } from 'zod'
import { authClient } from '@/lib/auth-client'

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email: z
      .string()
      .email('Enter a valid generic email')
      .refine((email) => email.endsWith('@gmail.com'), {
        message: 'Enter a valid Gmail address',
      }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[0-9]/, 'Password must contain a number')
      .regex(/[!@#$%^&*]/, 'Password must contain a special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const Route = createFileRoute('/signup')({
  component: Signup,
})

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [strength, setStrength] = useState<string | null>(null)

  const [success, setSuccess] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const isValidGmail = email.endsWith('@gmail.com')

  const getPasswordStrength = (pwd: string) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[!@#$%^&*]/.test(pwd)) score++

    if (score === 3) return 'Strong'
    if (score === 2) return 'Medium'
    return 'Weak'
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required')
      return
    }

    if (!isValidGmail) {
      setError('Enter a valid Gmail address')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const validation = signupSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    })
    if (!validation.success) {
      setError(validation.error.errors[0].message)
      return
    }

    console.log('Attempting signup with:', { email, name })
    try {
      await authClient.signUp.email(
        {
          email,
          password,
          name,
          callbackURL: 'http://localhost:3000/email-verified', // Redirect to Frontend after verification
        },
        {
          onRequest: () => {
            console.log('Request started...')
            setLoading(true)
          },
          onSuccess: () => {
            console.log('Signup Successful!')
            setLoading(false)
            setSuccess(true)
          },
          onError: (ctx) => {
            console.error('Signup Error:', ctx)
            setLoading(false)
            setError(ctx.error.message || 'Unknown error occurred')
          },
        },
      )
    } catch (err: any) {
      console.error('Unexpected Error:', err)
      // Better error extraction for the alert
      const msg = err instanceof Error ? err.message : JSON.stringify(err)
      setError('Critical Error: ' + msg)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        <div className="w-full max-w-[420px] rounded-2xl bg-card p-8 shadow-xl border border-border text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-green-500/10 p-3 text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-mail-check"
              >
                <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                <path d="m16 19 2 2 4-4" />
              </svg>
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-bold">Check your email</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            We've sent a verification link to{' '}
            <span className="text-foreground font-medium">{email}</span>.
            <br />
            Please check your inbox to verify your account.
          </p>
          <Link
            to="/signin"
            className="block w-full rounded-[10px] bg-primary p-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 shadow-md"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-primary">
        FormEngine
      </h1>

      <div className="w-full max-w-[420px] rounded-2xl bg-card p-8 shadow-xl border border-border">
        <h2 className="mb-1.5 text-2xl font-bold text-card-foreground">
          Create an account
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Enter your information below to create your account
        </p>

        {error && (
          <p className="mb-4 text-sm text-destructive font-medium">{error}</p>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-foreground">
              Name
            </label>
            <input
              placeholder="Monkey D Luffy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-[10px] border border-input bg-background p-3 text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[10px] border border-input bg-background p-3 text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none transition-all"
            />
            {email.length > 0 && !isValidGmail && (
              <p className="mt-1 text-xs text-destructive font-medium">
                Enter a valid Gmail address
              </p>
            )}
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
                disabled={!isValidGmail}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setStrength(getPasswordStrength(e.target.value))
                }}
                className="w-full rounded-[10px] border border-input bg-background p-3 pr-11 text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none disabled:cursor-not-allowed disabled:bg-muted transition-all"
              />
              {password.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
            {password.length > 0 && strength && (
              <div className="mt-2">
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strength === 'Strong'
                      ? 'w-full bg-green-500'
                      : strength === 'Medium'
                        ? 'w-2/3 bg-yellow-400'
                        : 'w-1/3 bg-destructive'
                      }`}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Password strength: {strength}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-foreground">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                disabled={password === ''}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-[10px] border border-input bg-background p-3 pr-11 text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none disabled:cursor-not-allowed disabled:bg-muted transition-all"
              />
              {confirmPassword.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full justify-center rounded-[10px] bg-primary p-3 font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-70 shadow-md"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
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
          className="w-full rounded-[10px] border border-input bg-background p-3 font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground hover:border-ring"
          onClick={async () => {
            try {
              await authClient.signIn.social({
                provider: 'google',
                callbackURL: 'http://localhost:3000',
              })
            } catch (err: any) {
              console.error('Google Signin Error:', err)
              alert(
                'Google Signin Failed: ' + (err.message || JSON.stringify(err)),
              )
            }
          }}
        >
          Sign up with Google
        </button>

        <p className="mt-6 text-center text-[13px] text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/signin"
            className="text-primary font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
