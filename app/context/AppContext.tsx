'use client';

import { CartResponse } from '@/interface/cart';
import { CreateOrder } from '@/interface/order';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SocketProvider } from './SocketContext';

interface MenuContextType {
    isMenu: boolean,
    setIsMenu: (value: boolean) => void,
}

interface AuthContextType {
    isLogin: boolean,
    setIsLogin: (value: boolean) => void,
    checkAccessToken: () => boolean,
}

interface CartContextType {
    cart: CartResponse | null,
    setCart: React.Dispatch<React.SetStateAction<CartResponse | null>>,
}

interface OrderContextType {
    order: CreateOrder | null,
    setOrder: React.Dispatch<React.SetStateAction<CreateOrder | null>>,
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const CartContext = createContext<CartContextType | undefined>(undefined);
const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isMenu, setIsMenu] = useState<boolean>(false);
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [cart, setCart] = useState<CartResponse | null>(null);
    const [order, setOrder] = useState<CreateOrder | null>(null);

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
            localStorage.removeItem('avatarUrl');
            localStorage.removeItem('email');
            localStorage.removeItem('name');
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
        if (typeof window !== "undefined") {
            if (order) {
                localStorage.setItem('order', JSON.stringify(order));
            } else {
                localStorage.removeItem('order');
            }
        }
    }, [order]);

    return (
        <SocketProvider>
            <MenuContext.Provider value={{ isMenu, setIsMenu }}>
                <AuthContext.Provider value={{ isLogin, setIsLogin, checkAccessToken }}>
                    <CartContext.Provider value={{ cart, setCart }}>
                        <OrderContext.Provider value={{ order, setOrder }}>
                            {children}
                        </OrderContext.Provider>
                    </CartContext.Provider>
                </AuthContext.Provider>
            </MenuContext.Provider>
        </SocketProvider>
    );
};

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error("useMenu must be used within an MenuProvider");
    }
    return context;
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