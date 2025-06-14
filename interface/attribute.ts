export interface Values {
    value: string,
    descriptionUrl: string,
}

export interface Attribute {
    type: string,
    name: string,
    values: Values[],
}

export interface AllAttributeResponse {
    attributes: {
        id: string,
        type: string,
        name: string,
        values: {
            id: string,
            value: string,
            description_url: string,
        }[]
    }[]
}

export interface AttributeParams {
  id: string;
  values: string[];
}