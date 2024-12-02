'use client'

import React, { createContext, useContext, useState, useMemo } from 'react';

interface PriceValues {
    values: Array<number>,
}

interface FilterContextType {
    price: PriceValues;
    setPrice: (value: PriceValues) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const initialValues = useMemo(() => [0, 1000000], []);
    const [price, setPrice] = useState({
      values: initialValues,
    });

    return (
        <FilterContext.Provider value={{ price, setPrice }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};