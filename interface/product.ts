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
    id: string,
    slug: string,
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

export interface Product {
    products: Array<ProductDataResponse>
}

export interface ProductInfoDataResponse {
    id: string,
    name: string,
    slug: string,
    mainImage: string,
    subImages: Array<string>,
    price: number,
    originalPrice: number,
    quantity: number,
    description: string,
    category: Array<Category>,
    attributes: Array<string>,
    rating: number,
    variants: Array<Variants>,
}

export interface ProductDetailDataResponse {
    product: ProductInfoDataResponse,
    skuList: {
        skuList: Array<SkuList>,
    }
}

export interface FetchProductsParams {
    search?: string,
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
}