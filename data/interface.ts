export interface Product {
    id: string,
    image: Array<string>,
    name: string,
    category: string,
    origin: string,
    description: string,
    color: Array<Color>,
    size: Array<string>,
    price: string,
    rating: number,
    sold: number,
    stock: number,
    discount: string,
}

export interface Color {
    name: string,
    code: string,
}

export interface Order {
    id: string,
    customerName: string,
    productId: string,
    productName: string,
    color: Color,
    size: string,
    quantity: number,
}

export interface Feedback {
    id: string,
    orderId: string,
    rating: number,
    feedback: string,
    date: string,
}