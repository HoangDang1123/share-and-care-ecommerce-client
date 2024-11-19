export interface Category {
    id: string,
    name: string,
}

export interface Product {
    id: string,
    image: Array<string>,
    name: string,
    category: string,
    origin: string,
    description: string,
    color: Array<Color>,
    size: Array<string>,
    price: number,
    rating: number,
    sold: number,
    stock: number,
    discount: string,
}

export interface Color {
    name: string,
    code: string,
}

export interface CartItem {
    productId: string,
    image: Array<string>,
    name: string,
    color: Color,
    size: string,
    quantity: number,
    price: number,
}

export interface Cart {
    customerId: string,
    item: Array<CartItem>,
}

export interface OrderFB {
    id: string,
    customerName: string,
    productId: string,
    productName: string,
    color: Color,
    size: string,
    quantity: number,
}

export interface Order {
    id: string,
    customerId: string,
    item: Array<CartItem>,
    productPrice: number,
    phone: string,
    address: string,
    shipping: number,
    discount: number,
    totalPrice: number,
}

export interface Feedback {
    id: string,
    orderId: string,
    rating: number,
    feedback: string,
    date: string,
}

export interface Discount {
    id: string,
    name: string,
    startDate: Date,
    endDate: Date,
    value: string,
}