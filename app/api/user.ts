import * as User from "@/interface/user"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const USER_URL = '/users';

export const changePassword = async (password: User.Password, clientId: string, accessToken: string) => {
    try {
        const response = await api.patch(`${USER_URL}/change-password`, password, {
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
};