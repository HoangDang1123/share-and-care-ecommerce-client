import * as Product from "@/interface/product"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const PRODUCT_URL = '/products/public';

export const getAllProduct = async (): Promise<Array<Product.ProductDataResponse>> => {
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

export const getSearchProductWithSize = async (search: string, size: number): Promise<Array<Product.ProductDataResponse>> => {
    try {
        const response = await api.get(`${PRODUCT_URL}?search=${search}&size=${size}`);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}

export const getAllSearchProduct = async (search: string): Promise<Array<Product.ProductDataResponse>> => {
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