export const calculateDiscountPrice = (price: number, discount: string): number => {
    const priceString = price.toString();
    const originalPrice = parseFloat(priceString);
    const discountPercentage = parseFloat(discount.replace('%', '').replace('-', ''));
    const discountAmount = (discountPercentage / 100) * originalPrice;
    return originalPrice - discountAmount;
};

export const formatPrice = (value: number): string => {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'đ');
};