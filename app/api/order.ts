import * as Order from "@/interface/order"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const ORDER_URL = '/order';

export const getPreviewOrder = async (data: Order.CreateOrder, clientId: string, accessToken: string): Promise<Order.OrderPricingSummary> => {
    try {
        const response = await api.post(`${ORDER_URL}/review`, data, {
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

export const createOrder = async (data: Order.CreateOrder, clientId: string, accessToken: string): Promise<Order.CreateOrderResponse> => {
    try {
        const response = await api.post(`${ORDER_URL}/`, data, {
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

export const getAllOrder = async (clientId: string, accessToken: string): Promise<Order.AllOrderResponse> => {
    try {
        const response = await api.get(`${ORDER_URL}/user`, {
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

export const getAllOrderWithSize = async (clientId: string, accessToken: string, size: number): Promise<Order.AllOrderResponse> => {
    try {
        const response = await api.get(`${ORDER_URL}/user/?size=${size}`, {
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

export const getOrderDetail = async (id: string, clientId: string, accessToken: string): Promise<Order.OrderDetailResponse> => {
    try {
        const response = await api.get(`${ORDER_URL}/user/${id}`, {
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

export const cancelOrder = async (id: string, clientId: string, accessToken: string): Promise<Order.CancelOrder> => {
    try {
        const response = await api.patch(`${ORDER_URL}/user/${id}/cancel`, null, {
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