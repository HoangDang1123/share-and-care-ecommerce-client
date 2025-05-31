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
    paymentUrl: string,
}

export interface OrderDetailResponse {
    order: OrderResponse,
    paymentUrl: string | null,
}

export interface OrderResponse {
    id: string,
    totalPrice: number,
    status: OrderStatus,
    paymentMethod: PaymentMethod,
    paymentStatus: PaymentStatus,
    deliveryMethod: DeliveryMethod,
    shippingAddress: ShippingAddress,
    items: OrderDetailItem[],
    deliveredAt: string | null,
    createdAt: string,
}

export interface OrderDetailItem {
    productId: string;
    variantId: string;
    productName: string;
    variantSlug: string;
    image: string;
    price: number;
    quantity: number;
    productDiscount: number;
    couponDiscount: number;
    returnDays: number;
    canReturn: boolean;
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
    id: string;
    totalPrice: number;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    deliveryMethod: string;
    items: OrderItem[];
    createdAt: string;
}

export interface OrderItem {
    productName: string;
    image: string;
    quantity: number;
}

export enum OrderStatus {
    PENDING = 'PENDING', // Đơn hàng mới tạo (COD hoặc chưa thanh toán)
    AWAITING_PAYMENT = 'AWAITING_PAYMENT', // Chờ thanh toán (VNPay/MoMo)
    PROCESSING = 'PROCESSING', // Đang xử lý
    AWAITING_SHIPMENT = 'AWAITING_SHIPMENT', // Chờ vận chuyển
    SHIPPED = 'SHIPPED', // Đã vận chuyển
    DELIVERED = 'DELIVERED', // Đã giao
    CANCELLED = 'CANCELLED', // Đã hủy
    RETURN_REQUESTED = 'RETURN_REQUESTED', // Yêu cầu trả hàng
    RETURNED = 'RETURNED', // Đã trả hàng
    PENDING_REFUND = 'PENDING_REFUND', // Chờ hoàn tiền
    REFUNDED = 'REFUNDED', // Đã hoàn tiền
}

export enum PaymentMethod {
    COD = 'COD',
    VNPAY = 'VNPAY',
    MOMO = 'MOMO',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    PENDING_REFUND = 'PENDING_REFUND',
    REFUNDED = 'REFUNDED',
}