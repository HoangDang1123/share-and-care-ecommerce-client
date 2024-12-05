export interface DeliveryDataResponse {
    deliveries: Array<Delivery>,
}

export interface Delivery {
    id: string,
    name: string,
    description: string,
    fee: number,
    isAvailable: boolean,
}