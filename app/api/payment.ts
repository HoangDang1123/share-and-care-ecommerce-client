import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';
import { PaymentData } from '@/interface/payment';

const PAYMENT_URL = '/payment';

export const VNPAYPayment = async (data: PaymentData): Promise<string> => {
    try {
        const response = await api.post(`${PAYMENT_URL}/vnpay/create_payment_url`, data);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}

export const MomoPayment = async (data: { orderId: string }): Promise<string> => {
    try {
        const response = await api.post(`${PAYMENT_URL}/momo/create_payment_url`, data);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}