export interface FormField {
    id: string;
    type: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    min?: number;
    max?: number;
    step?: number;
    options?: string[];
}

export interface Form {
    id: string;
    title: string;
    description?: string;
    ownerId?: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt?: string;
    fields?: FormField[];
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface CreateFormInput {
    title: string;
    description?: string;
}

export interface UpdateFormInput {
    title?: string;
    description?: string;
}

const API_URL = "http://localhost:8000";

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed: ${response.statusText}`);
    }
    const result: ApiResponse<T> = await response.json();
    return result.data;
}

export const formsApi = {
    // GET /forms - Fetch all forms
    getAll: async (): Promise<Form[]> => {
        const response = await fetch(`${API_URL}/forms`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        return handleResponse<Form[]>(response);
    },

    // GET /forms/:id - Fetch a single form by ID
    getById: async (id: string): Promise<Form> => {
        const response = await fetch(`${API_URL}/forms/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        return handleResponse<Form>(response);
    },

    // POST /forms - Create a new form
    create: async (data: CreateFormInput): Promise<Form> => {
        const response = await fetch(`${API_URL}/forms`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
        });
        return handleResponse<Form>(response);
    },

    // PATCH /forms/:id - Update an existing form
    update: async (id: string, data: UpdateFormInput): Promise<Form> => {
        const response = await fetch(`${API_URL}/forms/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
        });
        return handleResponse<Form>(response);
    },

    // DELETE /forms/:id - Delete a form
    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/forms/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Request failed: ${response.statusText}`);
        }
    },

    // PATCH /forms/:id/publish - Publish a form
    publish: async (id: string): Promise<Form> => {
        const response = await fetch(`${API_URL}/forms/${id}/publish`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        return handleResponse<Form>(response);
    },

    // PATCH /forms/:id/unpublish - Unpublish a form
    unpublish: async (id: string): Promise<Form> => {
        const response = await fetch(`${API_URL}/forms/${id}/unpublish`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        return handleResponse<Form>(response);
    },
};
