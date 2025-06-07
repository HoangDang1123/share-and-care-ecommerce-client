export const formatPrice = (value: number | { min: number, max: number }): string => {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
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

export const convertDateTime = (time: string) => {
    const isoTime = time;
    const localTime = new Date(isoTime).toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour12: false,
    });
    return localTime;
}

export const formatReason = (reason: string) => {
    if (!reason) return "N/A";
    return reason
        .toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}