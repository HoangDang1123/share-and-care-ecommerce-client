export interface Token {
    user: {
        id: string,
        avatar: string,
        email: string,
        name: string,
        phone: string,
    }
    tokens: {
        accessToken: string,
        refreshToken: string,
    }
}