import { OrderStatus, PaymentMethod } from "./order"

export interface CreateRefund {
    productId: string,
    variantId?: string,
    reason: string,
    description: string,
}

export interface CreateRefundResponse {
    refundLog: {
        id: string,
        orderId: string,
        paymentMethod: PaymentMethod,
        status: OrderStatus,
        reason: string,
        description: string,
        requestedAt: string,
        approvedAt: string | null,
        rejectedAt: string | null,
        completedAt: string | null,
    }
}