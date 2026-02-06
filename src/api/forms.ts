export interface Form {
    id: string;
    title: string;
    isPublished: boolean;
    createdAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

const API_URL = "http://localhost:8000";

export const formsApi = {
    getAll: async (): Promise<Form[]> => {
        const response = await fetch(`${API_URL}/forms`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Important for passing the session cookie
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch forms: ${response.statusText}`);
        }

        const result: ApiResponse<Form[]> = await response.json();
        return result.data;
    },
};
