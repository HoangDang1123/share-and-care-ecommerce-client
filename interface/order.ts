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

export interface OrderData {
    shippingAddress: ShippingAddressData,
    items: Cart[],
    couponCode: string | null,
    paymentMethod: string,
    deliveryId: string,
}

export interface ShippingAddressData {
    fullname: string,
    phone: string,
    street: string,
    ward: string,
    district: string,
    city: string,
}

export interface Item {
    productId: string,
    variantId: string | null,
    productName: string,
    variantSlug: string,
    price: number,
    image: string,
    quantity: number,
    discount: number,
}

export interface DeliveryMethod {
    id: string,
    name: string,
}

export interface OrderResponse {
    id: string,
    userId: string,
    couponId: string | null,
    items: Item[],
    shippingAddress: ShippingAddressData,
    paymentMethod: string,
    deliveryMethod: string,
    itemsPrice: number,
    itemsDiscount: number,
    shippingPrice: number,
    shippingDiscount: number,
    discountPrice: number,
    totalPrice: number,
    isPaid: boolean,
    isDelivered: boolean,
    paidAt: string | null,
    deliveredAt: string | null,
    status: string,
    createdAt: string,
    updatedAt: string,
}

export interface OrderDetailResponse {
    orders: {
        id: string,
        userId: string,
        couponId: string | null,
        items: Item[],
        shippingAddress: ShippingAddressData,
        paymentMethod: string,
        deliveryMethod: DeliveryMethod,
        itemsPrice: number,
        itemsDiscount: number,
        shippingPrice: number,
        shippingDiscount: number,
        discountPrice: number,
        totalPrice: number,
        status: string,
    }
}

export interface ShippingAddress {
    fullname: string,
    phone: string,
}

export interface Order {
    id: string,
    shippingAddress: ShippingAddress,
    paymentMethod: string,
    deliveryMethod: DeliveryMethod,
    totalPrice: number,
    status: string,
}

export interface OrderResponse {
    totalPages: number,
    totalOrders: number,
    currentPage: number,
    orders: Array<Order>,
}