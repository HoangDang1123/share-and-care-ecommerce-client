import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const AUTH_URL = '/auth'

interface SignUpData {
    email: string;
    username: string;
    password: string;
}

interface SignUpDataResponse {
    user: SignUpData,
}

interface ResendData {
    email: string;
    username: string;
}

interface ResendDataResponse {
    id: string,
    email: string,
}
interface LoginData {
    email: string;
    password: string;
}

interface LoginDataResponse {
    user: {
        id: string,
        email: string,
        name: string,
        avatar: string,
    },
    tokens: {
        accessToken: string,
        refreshToken: string,
    },
}

export const signUpRequest = async (data: SignUpData): Promise<SignUpDataResponse> => {
    try {
        const response = await api.post(`${AUTH_URL}/register`, data);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }

        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}

export const resendEmailVerification = async (data: ResendData): Promise<ResendDataResponse> => {
    try {
        const response = await api.post(`${AUTH_URL}/resend-email-verification`, data);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');
        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}

export const loginRequest = async (data: LoginData): Promise<LoginDataResponse> => {
    try {
        const response = await api.post(`${AUTH_URL}/login`, data);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');
        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}

export const logoutRequest = async (clientId: string, accessToken: string) => {
    try {
        const response = await api.post(`${AUTH_URL}/logout`, null, {
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