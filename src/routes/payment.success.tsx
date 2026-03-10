/**
 * Payment Success Page
 *
 * This page can be used to check payment status by Razorpay order ID.
 * With Razorpay, payment is verified inline via the modal callback,
 * but this page serves as a fallback status checker.
 */

import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, XCircle, Loader2, Home, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { paymentsApi } from '@/api/payments'

interface PaymentSuccessSearch {
    order_id?: string
}

export const Route = createFileRoute('/payment/success')({
    validateSearch: (search: Record<string, unknown>): PaymentSuccessSearch => ({
        order_id: (search.order_id as string) || undefined,
    }),
    component: PaymentSuccessPage,
})

function PaymentSuccessPage() {
    const { order_id } = Route.useSearch()

    const {
        data: payment,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['payment-status', order_id],
        queryFn: () => paymentsApi.getStatus(order_id!),
        enabled: !!order_id,
        refetchInterval: (query) => {
            if (query.state.data?.status === 'pending') return 2000
            return false
        },
    })

    if (!order_id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/20">
                <div className="bg-card rounded-xl p-10 max-w-md text-center shadow-sm border">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 mb-5">
                        <XCircle className="h-7 w-7 text-destructive" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Invalid Payment Link</h2>
                    <p className="text-muted-foreground mb-6">
                        No payment order was found. Please try again from the form.
                    </p>
                    <Button asChild variant="outline">
                        <Link to="/dashboard">
                            <Home className="h-4 w-4 mr-2" />
                            Go to Dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/20">
                <div className="bg-card rounded-xl p-10 text-center shadow-sm border">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Checking payment status...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/20">
                <div className="bg-card rounded-xl p-10 max-w-md text-center shadow-sm border">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 mb-5">
                        <XCircle className="h-7 w-7 text-destructive" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Payment Not Found</h2>
                    <p className="text-muted-foreground mb-6">
                        We couldn&apos;t find this payment. If you were charged, please contact support.
                    </p>
                    <Button asChild variant="outline">
                        <Link to="/dashboard">
                            <Home className="h-4 w-4 mr-2" />
                            Dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    const isCompleted = payment?.status === 'completed'
    const isPending = payment?.status === 'pending'

    if (isCompleted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/20">
                <div className="bg-card rounded-xl p-10 max-w-md text-center shadow-sm border">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/10 mb-5">
                        <CheckCircle className="h-7 w-7 text-green-500" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Payment Successful!</h2>
                    <p className="text-muted-foreground mb-2">
                        Your payment of{' '}
                        <span className="font-semibold text-foreground">
                            {payment.currency.toUpperCase()} {payment.amount.toFixed(2)}
                        </span>{' '}
                        has been confirmed.
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                        Your form response has been recorded.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button asChild variant="outline">
                            <Link to="/dashboard">
                                <Home className="h-4 w-4 mr-2" />
                                Dashboard
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link to="/my-responses">
                                <FileText className="h-4 w-4 mr-2" />
                                My Responses
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/20">
                <div className="bg-card rounded-xl p-10 max-w-md text-center shadow-sm border">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Processing Payment...</h2>
                    <p className="text-muted-foreground mb-6">
                        Your payment is being processed. This page will update automatically.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20">
            <div className="bg-card rounded-xl p-10 max-w-md text-center shadow-sm border">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 mb-5">
                    <XCircle className="h-7 w-7 text-destructive" />
                </div>
                <h2 className="text-xl font-bold mb-2">Payment Issue</h2>
                <p className="text-muted-foreground mb-2">
                    Payment status: <span className="font-medium text-foreground">{payment?.status || 'unknown'}</span>
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                    If you believe this is an error, please contact support.
                </p>
                <Button asChild variant="outline">
                    <Link to="/dashboard">
                        <Home className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>
        </div>
    )
}
