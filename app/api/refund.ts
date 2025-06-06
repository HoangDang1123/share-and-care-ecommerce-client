import * as Refund from "@/interface/refund"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const REFUND_URL = '/refund';

export const createRefundRequest = async (
    orderId: string, 
    data: Refund.CreateRefund, 
    clientId: string, 
    accessToken: string
): Promise<Refund.CreateRefundResponse> => {
    try {
        const response = await api.post(`${REFUND_URL}/${orderId}/request`, data, {
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