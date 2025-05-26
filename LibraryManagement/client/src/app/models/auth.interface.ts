export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponse {
    token: string;
    email: string;
    role: 'User' | 'Admin';
} 