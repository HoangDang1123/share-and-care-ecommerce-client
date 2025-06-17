import * as Product from "@/interface/product"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const PRODUCT_URL = '/products/public';

export const getAllProduct = async (page: number, size: number): Promise<Product.Product> => {
    try {
        const response = await api.get(`${PRODUCT_URL}?page=${page}&size=${size}`);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}

export const getTopSearchProduct = async (search: string): Promise<Product.Product> => {
    try {
        const response = await api.get(`${PRODUCT_URL}?search=${search}&size=5`);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}

export const getTopCategoriesProduct = async (categoryId: string): Promise<Product.Product> => {
    try {
        const response = await api.get(`${PRODUCT_URL}?category=${categoryId}`);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}

export const getShopProducts = async (
    filters: Product.FetchProductsParams = {},
    page: number,
    size: number
): Promise<Product.Product> => {
    const { search, categoryId, attributes, minPrice, maxPrice, minRating, sort } = filters;

    try {
        let url = `${PRODUCT_URL}?page=${page}&size=${size}`;

        if (search) {
            url += `&search=${search}`;
        } if (categoryId) {
            url += `&category=${categoryId}`;
        } if (attributes && Array.isArray(attributes)) {
            const encodedAttributes = encodeURIComponent(JSON.stringify(attributes));
            console.log(encodedAttributes)
            url += `&attributes=${encodedAttributes}`;
        } if (minPrice) {
            url += `&minPrice=${minPrice}`;
        } if (maxPrice) {
            url += `&maxPrice=${maxPrice}`;
        } if (minRating) {
            url += `&minRating=${minRating}`;
        } if (sort) {
            url += `&sort=${sort}`;
        }

        const response = await api.get(url);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}

export const getProductDetail = async (id: string): Promise<Product.ProductDetailResponse> => {
    try {
        const response = await api.get(`${PRODUCT_URL}/${id}`);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}