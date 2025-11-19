import { apiRequest } from "@/lib/api";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  VerifyEmailSendRequest,
  VerifyEmailConfirmRequest,
  PasswordForgotRequest,
  PasswordResetRequest,
  TokenRefreshRequest,
  TokenRefreshResponse,
  MessageResponse,
} from "@/types/auth";

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiRequest<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    localStorage.setItem("access_token", response.access_token);
    localStorage.setItem("refresh_token", response.refresh_token);

    return response;
  },

  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    return apiRequest<SignupResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  sendVerificationEmail: async (
    data: VerifyEmailSendRequest
  ): Promise<MessageResponse> => {
    return apiRequest<MessageResponse>("/api/auth/verify-email/send", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  confirmEmailVerification: async (
    data: VerifyEmailConfirmRequest
  ): Promise<MessageResponse> => {
    return apiRequest<MessageResponse>("/api/auth/verify-email/confirm", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  forgotPassword: async (
    data: PasswordForgotRequest
  ): Promise<MessageResponse> => {
    return apiRequest<MessageResponse>("/api/auth/password/forgot", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  resetPassword: async (
    data: PasswordResetRequest
  ): Promise<MessageResponse> => {
    return apiRequest<MessageResponse>("/api/auth/password/reset", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  refreshToken: async (
    data: TokenRefreshRequest
  ): Promise<TokenRefreshResponse> => {
    const response = await apiRequest<TokenRefreshResponse>(
      "/api/auth/token/refresh",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    localStorage.setItem("access_token", response.access_token);

    return response;
  },

  logout: async (): Promise<MessageResponse> => {
    const response = await apiRequest<MessageResponse>("/api/auth/logout", {
      method: "POST",
    });

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    return response;
  },
};
