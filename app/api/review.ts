import * as Review from "@/interface/review"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const REVIEW_URL = '/review';

export const createReview = async (
    data: Review.CreateReview,
    clientId: string,
    accessToken: string
): Promise<Review.CreateReviewResponse> => {
    try {
        const response = await api.post(`${REVIEW_URL}/`, data, {
            headers: {
                'x-client-id': clientId,
                'Authorization': accessToken
            }
        });
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}

export const getProductReview = async (
    productId: string,
    size: number,
    page?: number,
    rating?: number,
    hasImage?: boolean
): Promise<Review.GetReviewResponse> => {
    try {
        const params = new URLSearchParams({
            page: String(page),
            size: String(size),
        });

        if (rating !== undefined) {
            params.append('rating', String(rating));
        }

        if (hasImage !== undefined) {
            params.append('hasImage', String(hasImage));
        }

        const response = await api.get(`${REVIEW_URL}/product/${productId}?${params.toString()}`);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');
        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
};

export const reportReview = async (
    reason: { reason: string },
    reviewId: string,
    clientId: string,
    accessToken: string
): Promise<Review.ReportReviewResponse> => {
    try {
        const response = await api.post(`${REVIEW_URL}/${reviewId}/report`, reason, {
            headers: {
                'x-client-id': clientId,
                'Authorization': accessToken
            }
        });
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}

export const getReviewDetail = async (
    orderId: string,
    productId: string,
    clientId: string,
    accessToken: string,
    variantId?: string
): Promise<Review.ReviewDetailResponse> => {
    try {
        let response;
        if (variantId) {
            response = await api.get(`${REVIEW_URL}/user?orderId=${orderId}&productId=${productId}&variantId=${variantId}`, {
                headers: {
                    'x-client-id': clientId,
                    'Authorization': accessToken
                }
            });
        } else {
            response = await api.get(`${REVIEW_URL}/user?orderId=${orderId}&productId=${productId}`, {
                headers: {
                    'x-client-id': clientId,
                    'Authorization': accessToken
                }
            });
        }
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');
        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
};