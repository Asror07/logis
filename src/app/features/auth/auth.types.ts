// Auth State
export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: User | null;
}

// User
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  role: string;
  is_active: boolean;
  date_joined: string;
}

// Register DTO
export interface RegisterRequest {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
  password_confirm: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

// Login DTO
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

// Token verification
export interface VerifyTokenRequest {
  token: string;
}

export interface VerifyCodeRequest {
  email: string;
  code: number;
  type: "login";
}

export interface VerifyCodeResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user?: User; // Optional in case it's returned, otherwise we fetch it
}

export interface VerifyTokenResponse {
  detail?: string;
}

// Token refresh
export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshResponse {
  access: string;
  refresh?: string;
}

// API Error
export interface ApiError {
  status: number;
  data: {
    message?: string;
    detail?: string;
    errors?: Record<string, string[]>;
    [key: string]: unknown;
  };
}

// Social Authentication (Google OAuth)
export interface SocialAuthRequest {
  token: string;
  auth_type: string;
}

export interface SocialAuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

// Resend Code
export interface ResendCodeRequest {
  email: string;
}

export interface ResendCodeResponse {
  message: string;
}
