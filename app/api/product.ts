import * as Product from "@/interface/product"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const PRODUCT_URL = '/products/public';

export const getAllProduct = async (): Promise<Product.Product> => {
    try {
        const response = await api.get(`${PRODUCT_URL}?size=20`);
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

export const getShopProducts = async (params: Product.FetchProductsParams = {}): Promise<Product.Product> => {
    const { search, categoryId, minPrice, maxPrice, sort } = params;

    try {
        let url = `${PRODUCT_URL}?size=20`;

        if (search) {
            url += `&search=${search}`;
        } if (categoryId) {
            url += `&category=${categoryId}`;
        } if (minPrice) {
            url += `&minPrice=${minPrice}`;
        } if (maxPrice) {
            url += `&maxPrice=${maxPrice}`;
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