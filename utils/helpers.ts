import { OrderStatus } from "@/interface/order";

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

export function formatTimestamp(isoDate: string): string {
    const inputDate = new Date(isoDate);
    const now = new Date();

    const isSameDay =
        inputDate.getDate() === now.getDate() &&
        inputDate.getMonth() === now.getMonth() &&
        inputDate.getFullYear() === now.getFullYear();

    if (isSameDay) {
        const hours = inputDate.getHours().toString().padStart(2, '0');
        const minutes = inputDate.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    } else {
        const day = inputDate.getDate().toString().padStart(2, '0');
        const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
        return `${day}/${month}`;
    }
}

export const formatReason = (reason: string) => {
    if (!reason) return "N/A";
    return reason
        .toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export const getOrderStatusLabel = (status: OrderStatus): string => {
    switch (status) {
        case OrderStatus.PENDING:
            return 'Chờ xác nhận';
        case OrderStatus.AWAITING_PAYMENT:
            return 'Chờ thanh toán';
        case OrderStatus.PROCESSING:
            return 'Đang xử lý';
        case OrderStatus.READY_TO_SHIP:
            return 'Sẵn sàng giao';
        case OrderStatus.IN_TRANSIT:
            return 'Đang giao';
        case OrderStatus.DELIVERED:
            return 'Đã giao';
        case OrderStatus.CANCELLED:
            return 'Đã hủy';
        case OrderStatus.NOT_DELIVERED:
            return 'Không giao được';
        case OrderStatus.RETURN:
            return 'Hoàn trả';
        default:
            return 'Không xác định';
    }
};