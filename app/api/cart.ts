import * as Cart from "@/interface/cart"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const CART_URL = '/cart';

export const addProductToCart = async (data: Cart.Cart, clientId: string, accessToken: string): Promise<Cart.AddCartResponse> => {
    try {
        const response = await api.post(`${CART_URL}/`, data, {
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

export const getCart = async (clientId: string, accessToken: string): Promise<Cart.CartResponse> => {
    try {
        const response = await api.get(`${CART_URL}/`, {
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

export const deleteCartItem = async (data: Cart.CartItemDeleted, clientId: string, accessToken: string) => {
    try {
        const response = await api.delete(`${CART_URL}/`, {
            data,
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

export const updateCartItem = async (data: Cart.Cart, clientId: string, accessToken: string): Promise<Cart.CartResponse> => {
    try {
        const response = await api.patch(`${CART_URL}/`, data, {
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

export const clearCartItem = async (clientId: string, accessToken: string): Promise<Cart.CartResponse> => {
    try {
        const response = await api.delete(`${CART_URL}/clear`, {
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