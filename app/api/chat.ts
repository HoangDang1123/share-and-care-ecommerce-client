import * as Chat from "@/interface/chat"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const CHAT_URL = '/chats';

export const postMessageByAnonymous = async (message: Chat.PostMessageByAnonymous): Promise<Chat.PostMessageResponse> => {
    try {
        const response = await api.post(`${CHAT_URL}`, message);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }

        throw new Error(errorMessage || 'An unknown error occurred.');
    }
};

export const postMessageByUser = async (
    message: Chat.PostMessageByUser,
    clientId: string, 
    accessToken: string
): Promise<Chat.PostMessageResponse> => {
    try {
        const response = await api.post(`${CHAT_URL}/conversations`, null, {
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

export const getAllConversation = async (clientId: string, accessToken: string): Promise<Chat.AllConversationResponse> => {
    try {
        const response = await api.get(`${CHAT_URL}/conversations/me`, {
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

export const getConversation = async (
    conversationId: string, 
    clientId: string, 
    accessToken: string
): Promise<Chat.MessageDetailResponse> => {
    try {
        const response = await api.get(`${CHAT_URL}/conversations/${conversationId}`, {
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