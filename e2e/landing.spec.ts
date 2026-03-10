import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('displays hero section with branding', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('nav')).toContainText('FormEngine')
    await expect(
      page.getByRole('heading', { name: /Create Beautiful Forms/i })
    ).toBeVisible()
  })

  test('shows navigation links', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /Features/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Use Cases/i })).toBeVisible()
  })

  test('shows sign in and get started buttons when logged out', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(
      page.getByRole('navigation').getByRole('link', { name: 'Sign In' })
    ).toBeVisible()
    await expect(
      page.getByRole('navigation').getByRole('link', { name: /Get Started/i })
    ).toBeVisible()
  })

  test('sign in link navigates to signin page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Sign In$/i }).first().click()
    await expect(page).toHaveURL(/\/signin/)
    await expect(
      page.getByRole('heading', { name: /Sign in/i })
    ).toBeVisible()
  })

  test('get started link navigates to signup page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Get Started/i }).first().click()
    await expect(page).toHaveURL(/\/signup/)
    await expect(
      page.getByRole('heading', { name: /Create an account/i })
    ).toBeVisible()
  })

  test('displays feature cards section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Easy Form Builder')).toBeVisible()
    await expect(page.getByText('Response Analytics')).toBeVisible()
    await expect(page.getByText('Smart Validation')).toBeVisible()
  })

  test('displays statistics section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('10K+')).toBeVisible()
    await expect(page.getByText('Forms Created')).toBeVisible()
  })

  test('displays use cases section', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { name: 'Student Registration', exact: true })
    ).toBeVisible()
    await expect(page.getByText('Event Sign-ups')).toBeVisible()
    await expect(page.getByText('Feedback Collection')).toBeVisible()
  })
})
