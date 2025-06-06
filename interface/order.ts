import { Cart } from "./cart"

export interface Ward {
    Id: string,
    Level: string,
    Name: string,
}

export interface District {
    Id: string,
    Name: string,
    Wards: Ward[],
}

export interface City {
    Id: string,
    Name: string,
    Districts: District[],
}

export interface ShippingAddress {
    fullname: string,
    phone: string,
    street: string,
    ward: string,
    district: string,
    city: string,
}

export interface DeliveryMethod {
    id: string,
    name: string,
    price: number,
}

export interface CreateOrder {
    shippingAddress: ShippingAddress,
    items: Cart[],
    couponCode: string | null,
    paymentMethod: string,
    deliveryId: string,
}

export interface CreateOrderResponse {
    orderId: string,
    paymentUrl: string | null,
}

export interface OrderDetailResponse {
    order: OrderResponse,
    paymentUrl: string | null,
}

export interface OrderResponse {
    id: string,
    status: OrderStatus,
    paymentMethod: PaymentMethod,
    canCancel: boolean,
    pricing: Pricing,
    timestamps: Timestamps,
    deliveryMethod: DeliveryMethod,
    shippingAddress: ShippingAddress,
    items: OrderDetailItem[],
}

export interface Pricing {
  itemsPrice: number,
  productDiscount: number,
  couponDiscount: number,
  shippingPrice: number,
  shippingDiscount: number,
  totalSavings: number,
  totalPrice: number,
}

export interface Timestamps {
  createdAt: string,
  updatedAt: string,
  paidAt: string | null,
  deliveredAt: string | null,
  requestedAt: string | null,
  approvedAt: string | null,
}

export interface OrderDetailItem {
    productId: string,
    variantId: string | null,
    productName: string,
    variantSlug: string,
    image: string,
    price: number,
    quantity: number,
    productDiscount: number,
    couponDiscount: number,
    returnDays: number,
    total: number,
    canReturn: boolean,
    canReview: boolean,
}

export interface AllOrderResponse {
    total: number,
    totalPages: number,
    page: number,
    size: number,
    hasMore: boolean,
    items: AllOrderItem[],
}

export interface AllOrderItem {
    id: string,
    totalPrice: number,
    status: OrderStatus,
    canCancel: boolean,
    deliveryMethod: string,
    deliveredAt: string | null
    returnAt: string | null,
    updateAt: string | null,
    items: OrderItem[],
    createAt: string,
}

export interface OrderItem {
    productId: string,
    variantId?: string,
    productName: string,
    variantSlug: string,
    image: string,
    price: number,
    quantity: number,
    canReturn: boolean,
    canReview: boolean,
}

export enum OrderStatus {
    PENDING = 'PENDING', // Đơn hàng mới tạo (COD hoặc chưa thanh toán)
    AWAITING_PAYMENT = 'AWAITING_PAYMENT', // Chờ thanh toán (VNPay/MoMo)
    PROCESSING = 'PROCESSING', // Đang xử lý
    AWAITING_SHIPMENT = 'AWAITING_SHIPMENT', // Chờ vận chuyển
    SHIPPED = 'SHIPPED', // Đã vận chuyển
    DELIVERED = 'DELIVERED', // Đã giao
    CANCELLED = 'CANCELLED', // Đã hủy
    NOT_DELIVERED = 'NOT_DELIVERED', // Không giao được
    RETURN_REQUESTED = 'RETURN_REQUESTED', // Yêu cầu trả hàng
    RETURNED = 'RETURNED', // Đã trả hàng
}

export enum PaymentMethod {
    COD = 'COD',
    VNPAY = 'VNPAY',
    MOMO = 'MOMO',
    MANUAL = 'MANUAL',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    PENDING_REFUND = 'PENDING_REFUND',
    REFUNDED = 'REFUNDED',
}

export interface CancelOrder {
    status: string,
}