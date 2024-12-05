import * as Cart from "./cart";

export interface Ward {
    Id: string,
    Level: string,
    Name: string,
}

export interface District {
    Id: string,
    Name: string,
    Wards: Array<Ward>,
}

export interface City {
    Id: string,
    Name: string,
    Districts: Array<District>,
}

export interface OrderData {
    shippingAddress: ShippingAddressData,
    items: Array<Cart.CartData>,
    couponCode: string,
    paymentMethod: string,
    deliveryId: string,
}

export interface ShippingAddressData {
    fullname: string,
    phone: string,
    street: string,
    ward: string,
    district: string,
    city: string,
}