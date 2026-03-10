/**
 * Payments API Layer (Razorpay)
 *
 * Handles all payment-related API calls:
 * - Creating Razorpay orders
 * - Verifying payment signatures
 * - Checking payment status
 * - Getting Razorpay key for frontend checkout
 */

export interface CreateOrderResponse {
    orderId: string
    amount: number
    currency: string
    keyId: string
}

export interface VerifyPaymentResponse {
    orderId: string
    paymentId: string
    status: string
}

export interface PaymentStatus {
    status: string
    amount: number
    currency: string
}

export interface RazorpayConfig {
    keyId: string
}

interface ApiResponse<T> {
    success: boolean
    message?: string
    data: T
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function handleResponse<T>(response: Response): Promise<T> {
    const result: ApiResponse<T> = await response.json()
    if (!response.ok || !result.success) {
        throw new Error(result.message || `Request failed: ${response.statusText}`)
    }
    return result.data
}

export const paymentsApi = {
    /**
     * Create a Razorpay order for a payment field
     */
    createOrder: async (
        formId: string,
        fieldId: string,
        params: {
            amount: number
            currency?: string
            responseId?: string
        },
    ): Promise<CreateOrderResponse> => {
        const response = await fetch(
            `${API_URL}/payments/order/${formId}/${fieldId}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
                credentials: 'include',
            },
        )
        return handleResponse<CreateOrderResponse>(response)
    },

    /**
     * Verify payment after Razorpay checkout callback
     */
    verify: async (params: {
        razorpay_order_id: string
        razorpay_payment_id: string
        razorpay_signature: string
        formId: string
        fieldId: string
        responseId?: string
    }): Promise<VerifyPaymentResponse> => {
        const response = await fetch(`${API_URL}/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
            credentials: 'include',
        })
        return handleResponse<VerifyPaymentResponse>(response)
    },

    /**
     * Get payment status by Razorpay order ID
     */
    getStatus: async (orderId: string): Promise<PaymentStatus> => {
        const response = await fetch(`${API_URL}/payments/status/${orderId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        })
        return handleResponse<PaymentStatus>(response)
    },

    /**
     * Get Razorpay key ID for frontend checkout
     */
    getConfig: async (): Promise<RazorpayConfig> => {
        const response = await fetch(`${API_URL}/payments/config`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        })
        return handleResponse<RazorpayConfig>(response)
    },
}
