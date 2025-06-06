import { OrderStatus, PaymentMethod } from "./order"

export interface CreateReturn {
    productId: string,
    variantId?: string,
    reason: string,
    description: string,
}

export interface CreateReturnResponse {
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