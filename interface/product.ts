import { Attribute } from "./attribute";
import { Category } from "./category";
import { ProductVariant } from "./variant";

export interface SkuList {
    id: string,
    slug: string,
    tierIndex: number[],
    isDefault: boolean,
    price: number,
    quantity: number,
}

export interface ProductResponse {
    code: string,
    name: string,
    slug: string,
    mainImage: string,
    variants: ProductVariant[],
    rating: number,
    ratingCount: number,
    variantAttributes: Attribute[],
    price: number | {
        min: number,
        max: number,
    },
    discountedPrice: null | {
        min: number,
        max: number,
    },
    hasDiscount: boolean,
}

export interface Product {
    total: number,
    totalPages: number,
    page: number,
    size: number,
    hasMore: boolean,
    items: ProductResponse[]
}

export interface ProductDetailResponse {
    product: {
        id: string,
        code: string,
        name: string,
        slug: string,
        mainImage: string,
        subImages: string[],
        qrCode: string,
        description: string,
        video: string,
        quantity: number,
        returnDays: number,
        category: Category[],
        variants: ProductVariant[],
        rating: number,
        ratingCount: number,
        attributes: Attribute[],
        variantAttributes: Attribute[],
        price: number | {
            min: number,
            max: number,
        },
        discountedPrice: null | {
            min: number,
            max: number,
        },
        hasDiscount: boolean,
    },
    skuList: {
        skuList: SkuList[],
    }
}

export interface FetchProductsParams {
    search?: string,
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
}