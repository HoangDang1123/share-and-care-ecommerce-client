'use client'

import { Order } from '@/data/interface-test';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface OrderContextType {
    order: Order;
    setOrder: React.Dispatch<React.SetStateAction<Order>>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
    const [order, setOrder] = useState<Order>(() => {
        const storedOrder = sessionStorage.getItem('order');
        return storedOrder ? JSON.parse(storedOrder) : {
            id: "",
            customerId: "",
            item: [],
            shipping: 0,
            discount: 0,
            totalPrice: 0
        }
    });

    useEffect(() => {
        const isOrderValid = order.id || order.customerId || order.item.length > 0 || order.phone || order.address || order.shipping || order.discount || order.totalPrice;

        if (isOrderValid && typeof window !== "undefined") {
            sessionStorage.setItem('order', JSON.stringify(order));

            const timeoutId = setTimeout(() => {
                sessionStorage.removeItem('order');
                setOrder({
                    id: "",
                    customerId: "",
                    item: [],
                    productPrice: 0,
                    phone: "",
                    address: "",
                    shipping: 0,
                    discount: 0,
                    totalPrice: 0
                });
            }, 600000);

            return () => clearTimeout(timeoutId);
        } else {
            sessionStorage.removeItem('order');
        }
    }, [order]);

    return (
        <OrderContext.Provider value={{ order, setOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error("useOrder must be used within an OrderProvider");
    }
    return context;
};