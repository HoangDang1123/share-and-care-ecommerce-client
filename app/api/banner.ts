import * as Banner from "@/interface/banner"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const BANNER_URL = '/banner/public';

export const getBanner = async (position: string): Promise<Banner.BannerResponse> => {
    try {
        const response = await api.get(`${BANNER_URL}?position=${position}`);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}

export const getCategoryBanner = async (categoryId: string): Promise<Banner.BannerResponse> => {
    try {
        const response = await api.get(`${BANNER_URL}?position=CATEGORY&categoryId=${categoryId}`);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}

export const getFooterBanner = async (): Promise<Banner.BannerResponse> => {
    try {
        const response = await api.get(`${BANNER_URL}?position=FOOTER`);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}