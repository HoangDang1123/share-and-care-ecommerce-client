import * as Order from "@/interface/order"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const ORDER_URL = '/order';

export const createOrder = async (data: Order.OrderData, clientId: string, accessToken: string): Promise<Order.OrderResponse> => {
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

export const getAllOrder = async (clientId: string, accessToken: string): Promise<Order.OrderResponse> => {
    try {
        const response = await api.get(`${ORDER_URL}`, {
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
        const response = await api.get(`${ORDER_URL}/${id}`, {
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