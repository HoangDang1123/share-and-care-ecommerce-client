import * as Delivery from "@/interface/delivery"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const DELIVERY_URL = '/delivery';

export const getAllDelivery = async (id: string, clientId: string, accessToken: string): Promise<Delivery.DeliveryResponse> => {
    try {
        const response = await api.get(`${DELIVERY_URL}?destinationId=${id}`, {
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