'use client';

import { OrderData } from '@/interface/order';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isLogin: boolean;
    setIsLogin: (value: boolean) => void;
    checkAccessToken: () => boolean;
}

interface OrderContextType {
    order: OrderData | null;
    setOrder: React.Dispatch<React.SetStateAction<OrderData | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [order, setOrder] = useState<OrderData | null>(null);

    const checkAccessToken = () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";
        const timestamp = typeof window !== "undefined" ? localStorage.getItem("tokenTimestamp") || "" : "";

        if (!token || !timestamp) return false;

        const currentTime = new Date().getTime();
        const oneDayInMillis = 24 * 60 * 60 * 1000;

        if (currentTime - Number(timestamp) > oneDayInMillis) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('tokenTimestamp');
            localStorage.removeItem('order');
            return false;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiryTime = payload.exp * 1000;
            return Date.now() < expiryTime;
        } catch {
            return false;
        }
    };

    useEffect(() => {
        setIsLogin(checkAccessToken());

        const storedOrder = typeof window !== "undefined" ? localStorage.getItem("order") || "" : "";
        if (storedOrder) {
            setOrder(JSON.parse(storedOrder));
        }
    }, []);

    useEffect(() => {
        if (order) {
            localStorage.setItem('order', JSON.stringify(order));
        } else {
            localStorage.removeItem('order');
        }
    }, [order]);

    return (
        <AuthContext.Provider value={{ isLogin, setIsLogin, checkAccessToken }}>
            <OrderContext.Provider value={{ order, setOrder }}>
                {children}
            </OrderContext.Provider>
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error("useOrder must be used within an OrderProvider");
    }
    return context;
};