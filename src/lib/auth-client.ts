import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000', // the base url of your auth server
  fetchOptions: {
    credentials: 'include', // Include cookies in cross-origin requests
  },
})
