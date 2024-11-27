export interface Category {
    id: string,
    name: string,
}

export interface Variants {
    name: string,
    images: Array<string>,
    options: Array<string>,
}

export interface SkuList {
    tierIndex: Array<number>,
    isDefault: boolean,
    price: number,
    quantity: number,
}

export interface ProductDataResponse {
    id: string,
    name: string,
    slug: string,
    mainImage: string,
    price: number,
    originalPrice: number,
    description: string,
    rating: number,
    variants: Array<Variants>,
}