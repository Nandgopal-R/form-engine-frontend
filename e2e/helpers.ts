import type { Page } from '@playwright/test'

/** Shared test credentials — must match a user that exists in the DB or will be signed up. */
export const TEST_USER = {
  name: 'E2E Test User',
  email: 'e2e-playwright@gmail.com',
  password: 'TestPass1!',
}

/**
 * Sign in via the UI form. Leaves the browser on /dashboard.
 * Skips if already on /dashboard (session cookie still valid).
 */
export async function signIn(page: Page) {
  await page.goto('/signin')
  await page.getByPlaceholder('name@example.com').fill(TEST_USER.email)
  await page.getByPlaceholder('••••••••').fill(TEST_USER.password)
  await page.getByRole('button', { name: 'Sign In', exact: true }).click()
  await page.waitForURL('**/dashboard', { timeout: 15000 })
}

/**
 * Register a new account via the signup form. Leaves the browser on /dashboard.
 * Call this once in a global setup or the first test suite that needs auth.
 */
export async function signUp(page: Page) {
  await page.goto('/signup')
  await page.getByPlaceholder('Monkey D Luffy').fill(TEST_USER.name)
  await page.getByPlaceholder('example@gmail.com').fill(TEST_USER.email)
  await page.getByPlaceholder('••••••••').first().fill(TEST_USER.password)
  await page.getByPlaceholder('••••••••').last().fill(TEST_USER.password)
  await page.getByRole('button', { name: /Create Account/i }).click()
  await page.waitForURL('**/dashboard', { timeout: 15000 })
}
