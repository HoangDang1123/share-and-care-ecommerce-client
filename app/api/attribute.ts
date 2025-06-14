import * as Attribute from "@/interface/attribute"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const ATTRIBUTE_URL = '/attributes';

export const getAllAttributes = async (): Promise<Attribute.AllAttributeResponse> => {
    try {
        const response = await api.get(`${ATTRIBUTE_URL}`);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}