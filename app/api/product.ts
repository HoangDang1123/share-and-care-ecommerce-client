import * as Product from "@/interface/product"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const CATEGORY_URL = '/categories/all';

export const getAllCategories = async (): Promise<Array<Product.CategoryDataResponse>> => {
    try {
        const response = await api.get(`${CATEGORY_URL}`);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}