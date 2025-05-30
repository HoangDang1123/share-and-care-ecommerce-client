import { CartVariant } from "./variant";

export interface Cart {
    productId: string,
    variantId: string | undefined,
    quantity: number,
}

export interface AddCartResponse {
    id: string,
    userId: string,
    items: Cart[],
}

export interface CartResponse {
    id: string,
    userId: string,
    items: CartItem[],
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
    variants: CartVariant[],
}



export interface DeleteCartItem {
    productId: string,
    variantId: string | undefined,
}