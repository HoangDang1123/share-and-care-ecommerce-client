'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isLogin: boolean;
    setIsLogin: (value: boolean) => void;
    checkAccessToken: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLogin, setIsLogin] = useState<boolean>(false);

    const checkAccessToken = () => {
        const token = sessionStorage.getItem('accessToken');
        if (!token) return false;

        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiryTime = payload.exp * 1000;
        return Date.now() < expiryTime;
    };

    useEffect(() => {
        setIsLogin(checkAccessToken());
    }, []);

    return (
        <AuthContext.Provider value={{ isLogin, setIsLogin, checkAccessToken }}>
            {children}
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