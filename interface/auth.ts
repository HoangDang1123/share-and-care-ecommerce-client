export interface SignUpData {
    email: string;
    username: string;
    password: string;
}

export interface SignUpDataResponse {
    user: SignUpData,
}

export interface ResendData {
    email: string;
    username: string;
}

export interface ResendDataResponse {
    id: string,
    email: string,
}
export interface LoginData {
    email: string;
    password: string;
    deviceToken: string,
    deviceName: string,
}

export interface LoginDataResponse {
    user: {
        id: string,
        email: string,
        name: string,
        avatar: string,
    },
    tokens: {
        accessToken: string,
        refreshToken: string,
    },
}

export interface ForgotPasswordData {
    email: string,
}

export interface ResetPasswordData {
    resetToken: string | undefined,
    newPassword: string,
}