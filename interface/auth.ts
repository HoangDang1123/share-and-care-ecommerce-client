export interface SignUp {
    email: string;
    username: string;
    password: string;
}

export interface SignUpResponse {
    user: SignUp,
}

export interface Resend {
    email: string;
    username: string;
}

export interface ResendResponse {
    id: string,
    email: string,
}
export interface Login {
    email: string;
    password: string;
    deviceToken: string,
    deviceName: string,
}

export interface LoginResponse {
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

export interface ForgotPassword {
    email: string,
}

export interface ResetPassword {
    resetToken: string | undefined,
    newPassword: string,
}