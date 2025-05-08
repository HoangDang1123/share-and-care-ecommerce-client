export interface Delivery {
    id: string,
    name: string,
    description: string,
    fee: number,
    isAvailable: boolean,
}

export interface DeliveryResponse {
    deliveries: Delivery[],
}