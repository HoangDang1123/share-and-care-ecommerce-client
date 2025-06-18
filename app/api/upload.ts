import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const UPLOAD_URL = '/uploads';

export const uploadReviewImage = async (
    data: File,
    userId: string,
    accessToken: string
): Promise<string> => {
    try {
        const formData = new FormData();
        if (data) {
            formData.append("review", data);
        }

        const response = await api.post(`${UPLOAD_URL}/reviews`, formData, {
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

export const uploadChatImage = async (
    data: File,
    userId: string,
    accessToken: string
): Promise<string> => {
    try {
        const formData = new FormData();
        if (data) {
            formData.append("chat", data);
        }

        const response = await api.post(`${UPLOAD_URL}/chat`, formData, {
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