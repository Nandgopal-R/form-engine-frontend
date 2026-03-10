/**
 * AI API Layer
 *
 * Maps to the actual backend endpoints:
 *  - POST /forms/ai-generate   → AI form generation (creates form + fields server-side)
 *  - POST /forms/:id/analytics → AI analytics report for a form
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ---- Helpers ----

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as {
      message?: string
    }
    throw new Error(
      errorData.message || `Request failed: ${response.statusText}`,
    )
  }
  const result = (await response.json()) as {
    success: boolean
    data: T
    message?: string
  }
  if (!result.success) {
    throw new Error(result.message || 'Request failed')
  }
  return result.data
}

// ---- Exported API ----

export interface AIGeneratedField {
  id: string
  fieldName: string
  label: string
  fieldType: string
  fieldValueType: string
  validation?: Record<string, unknown>
  options?: Array<string>
}

export interface AIGeneratedForm {
  id: string
  title: string
  description: string
  isPublished: boolean
  createdAt: string
  fields: Array<AIGeneratedField>
}

export interface AnalyticsInsight {
  question: string
  metric: string
  value: string | number
}

export interface AnalyticsTheme {
  theme: string
  description: string
  frequency: string
}

export interface AnalyticsReport {
  totalResponsesAnalyzed: number
  executiveSummary: string
  quantitativeInsights: Array<AnalyticsInsight>
  qualitativeThemes: Array<AnalyticsTheme>
}

export const aiApi = {
  /**
   * Generates a complete form (title + fields) from a text prompt.
   * The backend creates the form and all fields in a single transaction.
   * POST /forms/ai-generate
   * Body:    { prompt: string }
   * Returns: { id, title, description, fields, ... }
   */
  generateForm: async (prompt: string): Promise<AIGeneratedForm> => {
    const response = await fetch(`${API_URL}/forms/ai-generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
      credentials: 'include',
    })
    return handleResponse<AIGeneratedForm>(response)
  },

  /**
   * Generates an AI analytics report for a specific form's responses.
   * POST /forms/:formId/analytics
   * Body:    {}  (formId is in the URL)
   * Query:   ?format=json  (default)
   * Returns: AnalyticsReport
   */
  generateSummary: async (formId: string): Promise<AnalyticsReport> => {
    const response = await fetch(`${API_URL}/forms/${formId}/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
      credentials: 'include',
    })
    return handleResponse<AnalyticsReport>(response)
  },

  /**
   * Placeholder — no backend endpoint exists yet.
   * Returns an empty array so AISuggestionPanel renders gracefully.
   */
  suggestFields: (
    _fields: Array<string>,
  ): Promise<{ suggestions: Array<{ label: string; type: string }> }> => {
    return Promise.resolve({ suggestions: [] })
  },
}
