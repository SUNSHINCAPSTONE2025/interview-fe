// src/pages/SignUpPage.tsx

import { FormEvent, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // 1) Supabase Auth 이메일/비밀번호 회원가입
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name, // 메타데이터 (필수는 아님)
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      const session = data.session;
      const user = data.user;

      if (!session || !user) {
        setErrorMsg("이메일 인증 후 다시 로그인 해주세요.");
        return;
      }

      // ✅ 백엔드 기본 URL
      // 로컬에서 돌릴 때:
      const API_BASE_URL = "http://localhost:8000";
      // 배포하면 예:
      // const API_BASE_URL = "https://interview-be.onrender.com";

      // 2) 백엔드에 내 프로필 수정(초기 설정) 요청
      const backendRes = await fetch(`${API_BASE_URL}/api/me/profile`, {
        method: "PUT", // ← 라우터랑 맞추기
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`, // Supabase 토큰
        },
        body: JSON.stringify({
          display_name: name,        // ← 백엔드 UserProfileUpdate의 필드
          // status: "active",       // 굳이 안 보내도 기본값 active
          // profile_meta: { ... },  // 필요하면 여기 채워넣기
        }),
      });

      if (!backendRes.ok) {
        const errBody = await backendRes.json().catch(() => ({}));
        console.error(errBody);
        setErrorMsg("프로필 생성 중 오류가 발생했습니다.");
        return;
      }

      alert("회원가입이 완료되었습니다!");
      // 여기서 라우팅: 로그인 페이지 or 메인으로 이동
    } catch (e: any) {
      console.error(e);
      setErrorMsg("알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>회원가입</h1>
      <input
        type="text"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "가입 중..." : "회원가입"}
      </button>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
    </form>
  );
}
