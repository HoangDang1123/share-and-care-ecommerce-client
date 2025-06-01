import * as Auth from "@/interface/auth"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const AUTH_URL = '/auth';

export const signUpRequest = async (data: Auth.SignUp): Promise<Auth.SignUpResponse> => {
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
};

export const resendEmailVerification = async (data: Auth.Resend): Promise<Auth.ResendResponse> => {
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
};

export const loginRequest = async (data: Auth.Login): Promise<Auth.LoginResponse> => {
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
};

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

export const forgotPassword = async (data: Auth.ForgotPassword) => {
    try {
        const response = await api.post(`${AUTH_URL}/forgot-password`, data);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');
        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
};

export const resetPassword = async (data: Auth.ResetPassword) => {
    try {
        const response = await api.post(`${AUTH_URL}/reset-password`, data);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');
        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
};

export const uploadAvatar = async (
    data: File,
    userId: string,
    accessToken: string
): Promise<{ image_url: string }> => {
    try {
        const formData = new FormData();
        if (data) {
            formData.append("avatar", data);
        }

        const response = await api.patch(`${AUTH_URL}/avatar`, formData, {
            headers: {
                "x-client-id": userId,
                Authorization: accessToken,
            },
        });

        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, "response.data.error.message", "Unknown error occurred.");
        toast.error(errorMessage);
        throw new Error(errorMessage);
    }
};