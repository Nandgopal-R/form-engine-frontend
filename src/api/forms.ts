/**
 * Forms API Layer
 *
 * This module provides the complete API interface for forms and form fields.
 * It defines the data structures and functions for:
 * - CRUD operations on forms (create, read, update, delete)
 * - CRUD operations on form fields
 * - Public form access for end users
 * - Error handling and response standardization
 *
 * The API follows a RESTful pattern with separate endpoints for forms
 * and fields to support our microservices-like architecture.
 */

// Validation rules that can be applied to form fields
export interface FieldValidation {
  required?: boolean // Field must be filled
  minLength?: number // Minimum text length
  maxLength?: number // Maximum text length
  min?: number // Minimum numeric value
  max?: number // Maximum numeric value
  pattern?: string // Regex pattern for validation
}

// Individual form field definition with all possible properties
export interface FormField {
  id: string // Unique field identifier
  fieldName: string // Internal field name (used in API)
  label: string // Display label for users
  fieldValueType: string // Data type of field value
  fieldType: string // UI field type (text, number, etc.)
  validation?: FieldValidation // Validation rules for this field
  formId: string // Parent form ID
  prevFieldId: string | null // Previous field for ordering
  createdAt: string // Creation timestamp
  placeholder?: string // Placeholder text for input fields
  min?: number // Minimum value for numeric fields
  max?: number // Maximum value for numeric fields
  step?: number // Step increment for numeric fields
  options?: Array<string> // Options for select/radio/checkbox fields
}

// Form definition containing metadata and optional fields
export interface Form {
  id: string // Unique form identifier
  title: string // Form title (display name)
  name?: string // Alternative name field (legacy)
  description?: string // Form description/purpose
  ownerId?: string // Creator/owner user ID
  isPublished: boolean // Whether form is publicly accessible
  createdAt: string // Creation timestamp
  updatedAt?: string // Last update timestamp
  fields?: Array<FormField> // Associated form fields (optional)
  responseCount?: number // Number of submissions received
}

// Standard API response wrapper for consistent error handling
export interface ApiResponse<T> {
  success: boolean // Whether request succeeded
  message: string // Human-readable status message
  data: T // Response payload
}

// Input data for creating new forms
export interface CreateFormInput {
  title: string // Required form title
  description?: string // Optional description
}

// Input data for updating existing forms
export interface UpdateFormInput {
  title?: string // Optional new title
  description?: string // Optional new description
}

// Input data for creating new form fields
export interface CreateFieldInput {
  fieldName: string // Internal field name
  label: string // Display label
  fieldValueType: string // Data type of field value
  fieldType: string // UI field type
  prevFieldId?: string | null
  validation?: FieldValidation
}

export interface UpdateFieldInput {
  fieldName?: string
  label?: string
  fieldValueType?: string
  fieldType?: string
  validation?: FieldValidation
  placeholder?: string
  min?: number
  max?: number
  step?: number
  options?: Array<string>
}

// Base URL for API endpoints
const API_URL = 'http://localhost:8000'

// Centralized error handling for all API requests
// Extracts error messages and provides consistent error format
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('API Error Response:', errorData)
    console.error('Response Status:', response.status)
    console.error('Response Text:', response.statusText)

    // Extract meaningful error message from response
    // Fallbacks ensure we always have some error to show
    throw new Error(
      errorData.message ||
        errorData.error ||
        `Request failed: ${response.statusText}`,
    )
  }

  // Extract data from standardized API response wrapper
  const result: ApiResponse<T> = await response.json()
  return result.data
}

// Forms API with all CRUD operations
export const formsApi = {
  // Fetch all forms for current user
  // Used in dashboard to list available forms
  getAll: async (): Promise<Array<Form>> => {
    const response = await fetch(`${API_URL}/forms`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    return handleResponse<Array<Form>>(response)
  },

  // Fetch single form by ID (requires ownership)
  // Used in form editor to load form for editing
  getById: async (id: string): Promise<Form> => {
    const response = await fetch(`${API_URL}/forms/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    return handleResponse<Form>(response)
  },

  // GET /forms/public/:id - Fetch a published form (any user)
  getPublicById: async (id: string): Promise<Form> => {
    const response = await fetch(`${API_URL}/forms/public/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    return handleResponse<Form>(response)
  },

  // Create new form with title and optional description
  // Returns complete form object with generated ID
  create: async (data: CreateFormInput): Promise<Form> => {
    const response = await fetch(`${API_URL}/forms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    })
    return handleResponse<Form>(response)
  },

  // PUT /forms/:id - Update an existing form
  update: async (id: string, data: UpdateFormInput): Promise<Form> => {
    const response = await fetch(`${API_URL}/forms/${id}`, {
      method: 'PUT',
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

  // POST /forms/unpublish/:formId - Unpublish a form
  unpublish: async (id: string): Promise<Form> => {
    const response = await fetch(`${API_URL}/forms/unpublish/${id}`, {
      method: 'POST',
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

  // PUT /fields/:id - Update a field
  update: async (id: string, data: UpdateFieldInput): Promise<FormField> => {
    const response = await fetch(`${API_URL}/fields/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    })
    return handleResponse<FormField>(response)
  },
}
