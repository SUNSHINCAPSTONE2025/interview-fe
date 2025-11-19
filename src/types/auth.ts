export interface User {
  id: string;
  name: string;
  email: string;
  email_verified?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  user: User;
  email_verification_sent: boolean;
}

export interface ErrorResponse {
  message: string;
  detail?: string;
}

export interface VerifyEmailSendRequest {
  email: string;
}

export interface VerifyEmailConfirmRequest {
  token: string;
}

export interface PasswordForgotRequest {
  email: string;
}

export interface PasswordResetRequest {
  token: string;
  new_password: string;
}

export interface TokenRefreshRequest {
  refresh_token: string;
}

export interface TokenRefreshResponse {
  message: string;
  access_token: string;
}

export interface MessageResponse {
  message: string;
}
