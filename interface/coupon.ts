export interface Coupon {
    id: string,
    name: string,
    code: string,
    description: string,
    startDate: string,
    endDate: string,
    type: 'PERCENT' | 'AMOUNT',
    value: number,
    minValue: number,
    maxValue: number,
    maxUsesPerUser: number,
    targetType: 'Category' | 'Product',
    targetIds: string[],
}

export interface CouponTargetItem {
    id: string,
    code: string,
    name: string,
    mainImage: string,
}

export interface CouponTargets {
    total: number,
    totalPages: number,
    page: number,
    size: number,
    hasMore: boolean,
    items: CouponTargetItem[],
}

export interface CouponDetailResponse {
    coupon: Coupon,
    targets: CouponTargets,
}
