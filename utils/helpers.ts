export const formatPrice = (value: number): string => {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'đ');
};

export const calculateDiscount = (price: string, discount: string): number => {
    const numericPrice = parseFloat(price.replace(/,/g, '').replace('đ', '').trim());

    if (discount.endsWith('%')) {
        const percentage = parseFloat(discount.slice(0, -1).replace(/,/g, '').trim());
        return numericPrice * (percentage / 100);
    } else if (discount.endsWith('đ')) {
        return parseFloat(discount.slice(0, -1).replace(/,/g, '').trim());
    }
    return 0;
};

export const capitalizeFirstLetter = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const splitVariantSlug = (str: string) => {
    return str.split("/");
}