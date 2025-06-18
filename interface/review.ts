export interface CreateReview {
    orderId: string,
    productId: string,
    variantId: string | null,
    star: number,
    content: string,
    images: string[],
}

export interface CreateReviewResponse {
    review: {
        id: string,
        content: string,
        star: number,
        images: string[],
    }
    averageStar: number,
}

export interface GetReviewResponse {
    total: number,
    totalPages: number,
    page: number,
    size: number,
    hasMore: boolean,
    items: Item[],
}

export interface Item {
    id: string,
    content: string,
    star: number,
    images: string[],
    user: User,
    reply: {
        content: string,
        user: User,
    } | null,
    createdAt: string,
}

export interface User {
    id: string,
    name: string,
    avatar: string,
}

export interface ReportReviewResponse {
    id: string,
    reports: {
        count: number,
        detail: ReportDetail[],
    }
}

export interface ReportDetail {
    user: {
        id: string,
    },
    reason: string,
    createdAt: string,
}

export interface OrderInfo {
  productId: string;
  variantId: string;
  productName: string;
  variantSlug: string;
  image: string;
}

export interface Review {
  id: string;
  content: string;
  star: number;
  images: string[];
  createdAt: string;
  reply: {
    content: string,
    user: User,
    createdAt: string,
  } | null;
}

export interface ReviewDetailResponse {
  order: OrderInfo;
  review: Review;
}