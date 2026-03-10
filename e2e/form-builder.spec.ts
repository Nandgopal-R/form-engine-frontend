import { test, expect } from '@playwright/test'
import { signIn } from './helpers'

test.describe('Form Builder - Create Form', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page)
    await page.getByRole('button', { name: /Create Form/i }).click()
    await page.waitForURL('**/editor')
  })

  test('displays form creation page', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Create New Form/i })
    ).toBeVisible()
    await expect(page.locator('#form-title')).toBeVisible()
    await expect(page.locator('#form-description')).toBeVisible()
  })

  test('create button is disabled when title is empty', async ({ page }) => {
    const createBtn = page.getByRole('button', {
      name: /Create Form & Add Fields/i,
    })
    await expect(createBtn).toBeDisabled()
  })

  test('can create a new form and navigate to editor', async ({ page }) => {
    const formTitle = `E2E Test Form ${Date.now()}`
    await page.locator('#form-title').fill(formTitle)
    await page
      .locator('#form-description')
      .fill('Created by E2E test')

    const createBtn = page.getByRole('button', {
      name: /Create Form & Add Fields/i,
    })
    await expect(createBtn).toBeEnabled()
    await createBtn.click()

    // Should navigate to the form builder with a formId
    await page.waitForURL('**/editor/**', { timeout: 10000 })
    await expect(page).toHaveURL(/\/editor\//)
  })
})

test.describe('Form Builder - Edit Form', () => {
  let formId: string

  test.beforeEach(async ({ page }) => {
    await signIn(page)

    // Create a form first
    await page.getByRole('button', { name: /Create Form/i }).click()
    await page.waitForURL('**/editor')

    await page.locator('#form-title').fill(`Builder Test ${Date.now()}`)
    await page.locator('#form-description').fill('E2E builder test form')
    await page
      .getByRole('button', { name: /Create Form & Add Fields/i })
      .click()

    await page.waitForURL('**/editor/**', { timeout: 10000 })
    const url = page.url()
    formId = url.split('/editor/')[1]
  })

  test('shows field type sidebar', async ({ page }) => {
    await expect(page.getByText('Short Text')).toBeVisible()
    await expect(page.getByText('Long Text')).toBeVisible()
    await expect(page.getByText('Number')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Email', exact: true })).toBeVisible()
    await expect(page.getByText('Checkbox')).toBeVisible()
    await expect(page.getByText('Radio')).toBeVisible()
    await expect(page.getByText('Dropdown')).toBeVisible()
  })

  test('can add a short text field', async ({ page }) => {
    await page.getByText('Short Text').click()
    // A new field should appear on the canvas with label "Text Input"
    await expect(page.getByText('Text Input')).toBeVisible({
      timeout: 5000,
    })
  })

  test('can add multiple field types', async ({ page }) => {
    await page.getByText('Short Text').click()
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: 'Email', exact: true }).click()
    await page.waitForTimeout(500)
    await page.getByText('Number').click()
    await page.waitForTimeout(500)

    // Canvas should show added fields with their labels
    await expect(page.getByText('Text Input')).toBeVisible({
      timeout: 5000,
    })
    await expect(page.getByText('Number Input')).toBeVisible({ timeout: 5000 })
  })

  test('has edit and preview tabs', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /Edit/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /Preview/i })).toBeVisible()
  })

  test('can switch to preview mode', async ({ page }) => {
    // Add a field first
    await page.getByText('Short Text').click()
    await page.waitForTimeout(500)

    // Switch to preview
    await page.getByRole('tab', { name: /Preview/i }).click()

    // Submit button should be visible in preview
    await expect(
      page.getByRole('button', { name: /Submit/i })
    ).toBeVisible({ timeout: 5000 })
  })

  test('can save form', async ({ page }) => {
    await page.getByText('Short Text').click()
    await page.waitForTimeout(500)

    const saveBtn = page.getByRole('button', { name: /Save Form/i })
    await expect(saveBtn).toBeVisible()
    await saveBtn.click()

    // Should show success toast
    await expect(
      page.getByText('Form saved successfully!', { exact: true })
    ).toBeVisible({
      timeout: 5000,
    })
  })
})
