export interface FormResponse {
  id: string
  formId: string
  respondentId?: string
  answers: Record<string, unknown>
  submittedAt: string
  updatedAt: string
}

export interface FormResponseForOwner {
  id: string
  formId: string
  formTitle: string
  answers: Record<string, unknown>
  rawAnswers?: Record<string, unknown> // Raw answers with field IDs for form loading
}

export interface UserResponse {
  id: string
  formId: string
  formTitle: string
  formDescription?: string
  answers: Record<string, unknown>
  isSubmitted: boolean
  submittedAt: string
  updatedAt: string
}

export interface SubmitResponseInput {
  answers: Record<string, unknown>
  isSubmitted?: boolean
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

const API_URL = 'http://localhost:8000'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('API Error Response:', errorData)
    console.error('Response Status:', response.status)
    console.error('Response Text:', response.statusText)
    throw new Error(
      errorData.message ||
        errorData.error ||
        `Request failed: ${response.statusText}`,
    )
  }
  const result: ApiResponse<T> = await response.json()
  return result.data
}

export const responsesApi = {
  // POST /responses/submit/:formId - Submit a new response (or save as draft)
  submit: async (
    formId: string,
    data: SubmitResponseInput,
  ): Promise<FormResponse> => {
    const response = await fetch(`${API_URL}/responses/submit/${formId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    })
    return handleResponse<FormResponse>(response)
  },

  // POST /responses/draft/:formId - Save as draft
  saveDraft: async (
    formId: string,
    data: SubmitResponseInput,
  ): Promise<FormResponse> => {
    const response = await fetch(`${API_URL}/responses/draft/${formId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    })
    return handleResponse<FormResponse>(response)
  },

  // PUT /responses/resume/:responseId - Update a draft response
  resume: async (
    responseId: string,
    data: SubmitResponseInput,
  ): Promise<{ count: number }> => {
    const response = await fetch(`${API_URL}/responses/resume/${responseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    })
    return handleResponse<{ count: number }>(response)
  },

  // GET /responses/:formId - Get all responses for a form (form owner only)
  getForForm: async (formId: string): Promise<Array<FormResponseForOwner>> => {
    const response = await fetch(`${API_URL}/responses/${formId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    return handleResponse<Array<FormResponseForOwner>>(response)
  },

  // GET /responses/user/:formId - Get user's submitted response for a form
  getUserResponse: async (
    formId: string,
  ): Promise<Array<FormResponseForOwner>> => {
    const response = await fetch(`${API_URL}/responses/user/${formId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    return handleResponse<Array<FormResponseForOwner>>(response)
  },

  // GET /responses/my - Get all responses submitted by the current user
  getMyResponses: async (): Promise<Array<UserResponse>> => {
    const response = await fetch(`${API_URL}/responses/my`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    return handleResponse<Array<UserResponse>>(response)
  },
}
