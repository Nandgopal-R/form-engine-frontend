export interface FieldValidation {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
}

export interface FormField {
  id: string
  fieldName: string
  label: string
  fieldValueType: string
  fieldType: string
  validation?: FieldValidation
  formId: string
  prevFieldId: string | null
  createdAt: string
  placeholder?: string
  min?: number
  max?: number
  step?: number
  options?: Array<string>
}

export interface Form {
  id: string
  title: string
  name?: string
  description?: string
  ownerId?: string
  isPublished: boolean
  createdAt: string
  updatedAt?: string
  fields?: Array<FormField>
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface CreateFormInput {
  title: string
  description?: string
}

export interface UpdateFormInput {
  title?: string
  description?: string
}

export interface CreateFieldInput {
  fieldName: string
  label: string
  fieldValueType: string
  fieldType: string
  prevFieldId?: string | null
  validation?: FieldValidation
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

export const formsApi = {
  // GET /forms - Fetch all forms
  getAll: async (): Promise<Array<Form>> => {
    const response = await fetch(`${API_URL}/forms`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    return handleResponse<Array<Form>>(response)
  },

  // GET /forms/:id - Fetch a single form by ID
  getById: async (id: string): Promise<Form> => {
    const response = await fetch(`${API_URL}/forms/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    return handleResponse<Form>(response)
  },

  // POST /forms - Create a new form
  create: async (data: CreateFormInput): Promise<Form> => {
    const response = await fetch(`${API_URL}/forms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    })
    return handleResponse<Form>(response)
  },

  // PATCH /forms/:id - Update an existing form
  update: async (id: string, data: UpdateFormInput): Promise<Form> => {
    const response = await fetch(`${API_URL}/forms/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    })
    return handleResponse<Form>(response)
  },

  // DELETE /forms/:id - Delete a form
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/forms/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || `Request failed: ${response.statusText}`,
      )
    }
  },

  // POST /forms/publish/:formId - Publish a form
  publish: async (id: string): Promise<Form> => {
    const response = await fetch(`${API_URL}/forms/publish/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    return handleResponse<Form>(response)
  },

  // PATCH /forms/:id/unpublish - Unpublish a form
  unpublish: async (id: string): Promise<Form> => {
    const response = await fetch(`${API_URL}/forms/${id}/unpublish`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    return handleResponse<Form>(response)
  },
}

export const fieldsApi = {
  // GET /fields/:formId - Fetch all fields for a form
  getById: async (formId: string): Promise<Array<FormField>> => {
    const response = await fetch(`${API_URL}/fields/${formId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    return handleResponse<Array<FormField>>(response)
  },

  // POST /fields/:formId - Create a new field
  create: async (
    formId: string,
    data: CreateFieldInput,
  ): Promise<FormField> => {
    const response = await fetch(`${API_URL}/fields/${formId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    })
    return handleResponse<FormField>(response)
  },

  // DELETE /fields/:id - Delete a field
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/fields/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || `Request failed: ${response.statusText}`,
      )
    }
  },
}
