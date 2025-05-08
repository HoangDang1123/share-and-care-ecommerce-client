export interface Values {
    value: string,
    descriptionUrl: string,
}

export interface Attribute {
    type: string,
    name: string,
    values: Values[],
}