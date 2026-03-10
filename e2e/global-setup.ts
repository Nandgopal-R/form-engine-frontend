import { chromium } from '@playwright/test'
import { TEST_USER } from './helpers'
import type { FullConfig } from '@playwright/test'

/**
 * Global setup: ensures the E2E test user exists.
 * Tries to sign in first; if that fails, signs up.
 */
async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000'
  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    // Try signing in first
    await page.goto(`${baseURL}/signin`)
    await page.getByPlaceholder('name@example.com').fill(TEST_USER.email)
    await page.getByPlaceholder('••••••••').fill(TEST_USER.password)
    await page.getByRole('button', { name: 'Sign In', exact: true }).click()

    try {
      await page.waitForURL('**/dashboard', { timeout: 5000 })
      console.log('E2E test user already exists — signed in successfully.')
    } catch {
      // Sign in failed — user doesn't exist, create one
      console.log('E2E test user not found — creating via sign up...')
      await page.goto(`${baseURL}/signup`)
      await page.getByPlaceholder('Monkey D Luffy').fill(TEST_USER.name)
      await page
        .getByPlaceholder('example@gmail.com')
        .fill(TEST_USER.email)
      await page.getByPlaceholder('••••••••').first().fill(TEST_USER.password)
      await page.getByPlaceholder('••••••••').last().fill(TEST_USER.password)
      await page.getByRole('button', { name: /Create Account/i }).click()
      await page.waitForURL('**/dashboard', { timeout: 15000 })
      console.log('E2E test user created successfully.')
    }
  } finally {
    await browser.close()
  }
}

export default globalSetup
