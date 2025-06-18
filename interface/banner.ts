export interface BannerResponse {
    total: number,
    totalPages: number,
    page: number,
    size: number,
    hasMore: boolean,
    items: BannerItem[],
}

export interface BannerItem {
    id: string,
    title: string,
    subtitle: string,
    ctaText: string,
    ctaUrl: string,
    imageUrl: string,
}