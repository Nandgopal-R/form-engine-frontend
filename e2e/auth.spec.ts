import { test, expect } from '@playwright/test'

const TEST_USER = {
  name: 'E2E Test User',
  email: `e2etest${Date.now()}@gmail.com`,
  password: 'TestPass1!',
}

test.describe('Sign Up Flow', () => {
  test('displays signup form elements', async ({ page }) => {
    await page.goto('/signup')
    await expect(
      page.getByRole('heading', { name: /Create an account/i })
    ).toBeVisible()
    await expect(page.getByPlaceholder('Monkey D Luffy')).toBeVisible()
    await expect(page.getByPlaceholder('example@gmail.com')).toBeVisible()
  })

  test('shows validation error for empty fields', async ({ page }) => {
    await page.goto('/signup')
    await page.getByRole('button', { name: /Create Account/i }).click()
    await expect(page.getByText('All fields are required')).toBeVisible()
  })

  test('shows validation for non-gmail email', async ({ page }) => {
    await page.goto('/signup')
    await page.getByPlaceholder('example@gmail.com').fill('test@yahoo.com')
    await expect(
      page.getByText('Enter a valid Gmail address')
    ).toBeVisible()
  })

  test('shows password strength indicator', async ({ page }) => {
    await page.goto('/signup')
    await page.getByPlaceholder('example@gmail.com').fill('test@gmail.com')
    await page.getByPlaceholder('••••••••').first().fill('weak')
    await expect(page.getByText('Weak')).toBeVisible()

    await page.getByPlaceholder('••••••••').first().fill('Medium1pass')
    await expect(page.getByText('Medium')).toBeVisible()

    await page.getByPlaceholder('••••••••').first().fill('Strong1!')
    await expect(page.getByText('Strong')).toBeVisible()
  })

  test('shows password mismatch error', async ({ page }) => {
    await page.goto('/signup')
    await page.getByPlaceholder('Monkey D Luffy').fill(TEST_USER.name)
    await page.getByPlaceholder('example@gmail.com').fill(TEST_USER.email)
    await page.getByPlaceholder('••••••••').first().fill(TEST_USER.password)
    await page.getByPlaceholder('••••••••').last().fill('DifferentPass1!')
    await page.getByRole('button', { name: /Create Account/i }).click()
    await expect(page.getByText('Passwords do not match')).toBeVisible()
  })

  test('successful signup redirects to dashboard', async ({ page }) => {
    await page.goto('/signup')
    await page.getByPlaceholder('Monkey D Luffy').fill(TEST_USER.name)
    await page.getByPlaceholder('example@gmail.com').fill(TEST_USER.email)
    await page.getByPlaceholder('••••••••').first().fill(TEST_USER.password)
    await page.getByPlaceholder('••••••••').last().fill(TEST_USER.password)
    await page.getByRole('button', { name: /Create Account/i }).click()
    await page.waitForURL('**/dashboard', { timeout: 15000 })
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('has link to sign in page', async ({ page }) => {
    await page.goto('/signup')
    await page.getByRole('link', { name: /Sign in/i }).click()
    await expect(page).toHaveURL(/\/signin/)
  })
})

test.describe('Sign In Flow', () => {
  test('displays signin form elements', async ({ page }) => {
    await page.goto('/signin')
    await expect(
      page.getByRole('heading', { name: /Sign in/i })
    ).toBeVisible()
    await expect(
      page.getByPlaceholder('name@example.com')
    ).toBeVisible()
    await expect(page.getByPlaceholder('••••••••')).toBeVisible()
  })

  test('shows error for empty fields', async ({ page }) => {
    await page.goto('/signin')
    await page.getByRole('button', { name: 'Sign In', exact: true }).click()
    await expect(page.getByText('All fields are required')).toBeVisible()
  })

  test('shows error for invalid email format', async ({ page }) => {
    await page.goto('/signin')
    await page.getByPlaceholder('name@example.com').fill('notvalid@x')
    await page.getByPlaceholder('••••••••').fill('password123')
    await page.getByRole('button', { name: 'Sign In', exact: true }).click()
    await expect(page.getByText('Enter a valid email')).toBeVisible()
  })

  test('shows error for wrong credentials', async ({ page }) => {
    await page.goto('/signin')
    await page.getByPlaceholder('name@example.com').fill('wrong@example.com')
    await page.getByPlaceholder('••••••••').fill('WrongPass1!')
    await page.getByRole('button', { name: 'Sign In', exact: true }).click()
    await expect(
      page.getByText(/Invalid|error|not found/i)
    ).toBeVisible({ timeout: 10000 })
  })

  test('has link to sign up page', async ({ page }) => {
    await page.goto('/signin')
    await page.getByRole('link', { name: /Sign up/i }).click()
    await expect(page).toHaveURL(/\/signup/)
  })

  test('has Google sign in button', async ({ page }) => {
    await page.goto('/signin')
    await expect(
      page.getByRole('button', { name: /Sign in with Google/i })
    ).toBeVisible()
  })
})
