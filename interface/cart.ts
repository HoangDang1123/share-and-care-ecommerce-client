export interface CartData {
    productId: string,
    variantId: string | null,
    quantity: number,
}

export interface AddCartDataResponse {
    id: string,
    userId: string,
    items: Array<CartData>,
}

export interface CartDataResponse {
    id: string,
    userId: string,
    items: Array<CartItem>,
}

export interface CartItem {
    productId: string,
    variantId: string,
    productName: string,
    variantSlug: string,
    quantity: number,
    price: number,
    originalPrice: number,
    itemTotalPrice: number,
    itemTotalOriginalPrice: number,
    productImage: string,
    variants: Array<Variant>
}

export interface Variant {
    name: string,
    options: Array<string>,
}

export interface CartItemDeleted {
    productId: string,
    variantId: string,
}