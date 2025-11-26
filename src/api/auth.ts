import { supabase } from "@/lib/supabaseClient";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  MessageResponse,
} from "@/types/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const authApi = {
  // Supabase 로그인
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!authData.session || !authData.user) {
      throw new Error("로그인에 실패했습니다.");
    }

    // Supabase 토큰 저장
    localStorage.setItem("access_token", authData.session.access_token);
    localStorage.setItem("refresh_token", authData.session.refresh_token);

    // User 객체 반환
    return {
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
      user: {
        id: authData.user.id,
        email: authData.user.email!,
        name: authData.user.user_metadata?.name || authData.user.email!.split('@')[0],
        email_verified: authData.user.email_confirmed_at !== null,
      },
    };
  },

  // Supabase 회원가입 + 백엔드 프로필 생성
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    // 1. Supabase Auth 회원가입
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    const session = authData.session;
    const user = authData.user;

    if (!session || !user) {
      return {
        message: "이메일 인증 후 다시 로그인 해주세요.",
        user: {
          id: user?.id || "",
          email: data.email,
          name: data.name,
          email_verified: false,
        },
      };
    }

    // 2. 백엔드에 프로필 생성
    try {
      const response = await fetch(`${API_BASE_URL}/api/me/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          display_name: data.name,
        }),
      });

      if (!response.ok) {
        console.error("Failed to create backend profile");
      }
    } catch (error) {
      console.error("Backend profile creation error:", error);
    }

    return {
      message: "회원가입이 완료되었습니다!",
      user: {
        id: user.id,
        email: user.email!,
        name: data.name,
        email_verified: user.email_confirmed_at !== null,
      },
    };
  },

  // Supabase 로그아웃
  logout: async (): Promise<MessageResponse> => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    return {
      message: "로그아웃되었습니다.",
    };
  },

  // Supabase 세션 가져오기
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    return data.session;
  },

  // Supabase 현재 사용자 가져오기
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw new Error(error.message);
    }

    return data.user;
  },
};
