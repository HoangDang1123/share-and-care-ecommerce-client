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

export enum ReturnStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  APPROVED = 'APPROVED',
  FAILED = 'FAILED',
  REJECTED = 'REJECTED',
  NOT_RETURNED = 'NOT_RETURNED',
}

export enum RefundReason {
  DEFECTIVE = 'DEFECTIVE', // Sản phẩm lỗi
  WRONG_ITEM = 'WRONG_ITEM', // Giao sai sản phẩm
  NOT_AS_DESCRIBED = 'NOT_AS_DESCRIBED', // Không đúng mô tả
  CHANGE_MIND = 'CHANGE_MIND', // Thay đổi ý định
  NOT_SUITABLE_SIZE = 'NOT_SUITABLE_SIZE', // Kích thước không phù hợp
  NOT_SUITABLE_STYLE = 'NOT_SUITABLE_STYLE', // Kiểu dáng không phù hợp
  BOM_HANG = 'BOM_HANG', // Khách từ chối nhận hàng
  OTHER = 'OTHER', // Lý do khác
};