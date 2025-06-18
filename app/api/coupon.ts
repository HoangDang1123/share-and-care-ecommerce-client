import * as Coupon from "@/interface/coupon"

import { toast } from 'react-toastify';
import api from './index';
import get from 'lodash/get';

const COUPON_URL = '/coupon/user';

export const getCoupon = async (code: string): Promise<Coupon.CouponDetailResponse> => {
    try {
        const response = await api.get(`${COUPON_URL}/${code}`);
        return response.data.metadata;
    } catch (error) {
        const errorMessage = get(error, 'response.data.error.message', '');

        if (errorMessage) {
            toast.error(errorMessage);
        }
        throw new Error(errorMessage || 'An unknown error occurred.');
    }
}