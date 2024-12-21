'use client';

import { CartDataResponse } from '@/interface/cart';
import { OrderData } from '@/interface/order';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isLogin: boolean;
    setIsLogin: (value: boolean) => void;
    checkAccessToken: () => boolean;
}

interface CartContextType {
    cart: CartDataResponse | null;
    setCart: React.Dispatch<React.SetStateAction<CartDataResponse | null>>;
}

interface OrderContextType {
    order: OrderData | null;
    setOrder: React.Dispatch<React.SetStateAction<OrderData | null>>;
    productPrice: number | null;
    setProductPrice: React.Dispatch<React.SetStateAction<number>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const CartContext = createContext<CartContextType | undefined>(undefined);
const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [cart, setCart] = useState<CartDataResponse | null>(null);
    const [order, setOrder] = useState<OrderData | null>(null);
    const [productPrice, setProductPrice] = useState<number>(0);

    const checkAccessToken = () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";
        const timestamp = typeof window !== "undefined" ? localStorage.getItem("tokenTimestamp") || "" : "";

        if (!token || !timestamp) return false;

        const currentTime = new Date().getTime();
        const oneDayInMillis = 24 * 60 * 60 * 1000;

        if (currentTime - Number(timestamp) > oneDayInMillis && typeof window !== "undefined") {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('tokenTimestamp');
            localStorage.removeItem('order');
            localStorage.removeItem('productPrice');
            localStorage.removeItem('deliveryFee');
            localStorage.removeItem('isLogin');
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
        const storedPrice = typeof window !== "undefined" ? localStorage.getItem("productPrice") || "0" : "0";
        if (storedOrder && storedPrice) {
            setOrder(JSON.parse(storedOrder));
        }
        setProductPrice(Number(storedPrice));
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (order) {
                localStorage.setItem('order', JSON.stringify(order));
                localStorage.setItem('productPrice', JSON.stringify(productPrice));
            } else {
                localStorage.removeItem('order');
                localStorage.removeItem('productPrice');
            }
        }
    }, [order, productPrice]);

    return (
        <AuthContext.Provider value={{ isLogin, setIsLogin, checkAccessToken }}>
            <CartContext.Provider value={{ cart, setCart }}>
                <OrderContext.Provider value={{ order, setOrder, productPrice, setProductPrice }}>
                    {children}
                </OrderContext.Provider>
            </CartContext.Provider>
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

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within an CartProvider");
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