import * as Product from "@/interface/product"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const PRODUCT_URL = '/products/public';

export const getAllProduct = async (): Promise<Product.Product> => {
    try {
        const response = await api.get(`${PRODUCT_URL}`);
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
        const response = await api.get(`${PRODUCT_URL}?search=${search}&size=6`);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}

export const getAllSearchProduct = async (search: string): Promise<Product.Product> => {
    try {
        const response = await api.get(`${PRODUCT_URL}?search=${search}`);
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
        const response = await api.get(`${PRODUCT_URL}?size=10&category=${categoryId}`);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}

export const getCategoryFilterProduct = async (categoryId: string): Promise<Product.Product> => {
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

export const getPriceFilterProduct = async (minPrice: number, maxPrice: number): Promise<Product.Product> => {
    try {
        const response = await api.get(`${PRODUCT_URL}?minPrice=${minPrice}&maxPrice=${maxPrice}`);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}

export const getProductDetail = async (id: string): Promise<Product.ProductDetailDataResponse> => {
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