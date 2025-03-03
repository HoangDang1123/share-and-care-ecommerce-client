export interface AddressData {
    name: string,
    phone: string,
    street: string,
    ward: string,
    district: string,
    city: string,
}

export interface AddressDataResponse {
    id: string,
    userId: string,
    name: string,
    phone: string,
    placeId: string,
    street: string,
    ward: string,
    district: string,
    city: string,
    location: {
        lat: string,
        lng: string,
    },
    type: string,
}

export interface AutoCompleteDataResponse {
    placeId: string,
    description: string,
    compound: {
        ward: string,
        district: string,
        city: string,
    }
}