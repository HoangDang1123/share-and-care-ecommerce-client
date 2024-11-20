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

export const signUpRequest = async (data: SignUpData): Promise<SignUpDataResponse> => {
    try {
        const response = await api.post(`${AUTH_URL}/register`, data);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '') || JSON.stringify(error);
        toast.error(errorMessage);
        throw new Error(errorMessage);
    }
}

export const resendEmailVerification = async (data: ResendData): Promise<ResendDataResponse> => {
    try {
        const response = await api.post(`${AUTH_URL}/resend-email-verification`, data);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '') || JSON.stringify(error);
        toast.error(errorMessage);
        throw new Error(errorMessage);
    }
}