// src/SupabaseLoginTest.tsx
import { useState } from "react";
import { supabase } from "./lib/supabaseClient";

export function SupabaseLoginTest() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setResult({ step: "login", data, error });
  };

  const callMeApi = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (!accessToken) {
      setResult({ step: "me", error: "no access token" });
      return;
    }

    // 절대 URL X  반드시 상대 경로만 사용해야 proxy가 동작함
    const res = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const json = await res.json();
    setResult({ step: "me", data: json });
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, marginTop: 16 }}>
      <h3>Supabase 로그인 / /api/auth/me 테스트</h3>

      <div>
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button onClick={handleLogin}>Supabase 로그인</button>
      <button onClick={callMeApi} style={{ marginLeft: 8 }}>
        /api/auth/me 호출
      </button>

      <pre style={{ marginTop: 16, fontSize: 12 }}>
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}
