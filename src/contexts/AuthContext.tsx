import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@/api/auth";
import { User, LoginRequest, SignupRequest } from "@/types/auth";
import { ApiError } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 🚧 개발용 Mock User (백엔드 연결 전 임시)
    // TODO: 백엔드 연결되면 이 부분 삭제하고 아래 주석 해제
    const mockUser: User = {
      id: "mock-user-123",
      name: "테스트 사용자",
      email: "test@example.com",
      email_verified: true,
    };
    setUser(mockUser);
    setIsLoading(false);
    return; // 여기서 리턴해서 아래 코드 실행 안 함

    // ✅ 백엔드 연결되면 위 Mock User 부분 삭제하고 아래 주석 해제
    /*
    const token = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }

    setIsLoading(false);
    */
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response = await authApi.login(data);
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
      toast.success("로그인 성공!");
    } catch (error) {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 401:
            toast.error("이메일 또는 비밀번호가 올바르지 않습니다.");
            break;
          case 403:
            toast.error("이메일 인증이 필요합니다. 이메일을 확인해주세요.");
            break;
          case 429:
            toast.error("너무 많은 로그인 시도입니다. 잠시 후 다시 시도해주세요.");
            break;
          default:
            toast.error("로그인 중 오류가 발생했습니다.");
        }
      } else {
        toast.error("네트워크 오류가 발생했습니다.");
      }
      throw error;
    }
  };

  const signup = async (data: SignupRequest) => {
    try {
      await authApi.signup(data);
      toast.success("회원가입 성공! 이메일을 확인하여 인증을 완료해주세요.");
    } catch (error) {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 400:
            toast.error(
              "비밀번호는 8자 이상이며 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다."
            );
            break;
          case 409:
            toast.error("이미 사용 중인 이메일입니다.");
            break;
          default:
            toast.error("회원가입 중 오류가 발생했습니다.");
        }
      } else {
        toast.error("네트워크 오류가 발생했습니다.");
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      localStorage.removeItem("user");
      toast.success("로그아웃되었습니다.");
    } catch (error) {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
