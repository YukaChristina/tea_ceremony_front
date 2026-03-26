"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("メールアドレスまたはパスワードが正しくありません");
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  const handleDemoFill = () => {
    setEmail(process.env.NEXT_PUBLIC_DEMO_EMAIL!);
    setPassword(process.env.NEXT_PUBLIC_DEMO_PASSWORD!);
  };

  const handleGoogleLogin = async () => {
    setError(null);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 24, background: "var(--background)" }}>
      <div style={{ width: "100%", maxWidth: 360 }}>

        {/* ロゴ */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 1, background: "var(--accent)" }} />
            <span style={{ fontSize: 12, color: "var(--accent)", letterSpacing: "0.2em" }}>裏千家</span>
            <div style={{ width: 40, height: 1, background: "var(--accent)" }} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: "0.1em", color: "var(--foreground)", margin: 0 }}>稽古記録</h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>Urasenke Practice Log</p>
        </div>

        {/* フォーム */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>メールアドレス</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              style={{ padding: "10px 14px", borderRadius: 4, border: "1px solid var(--border)", background: "white", fontSize: 14, color: "var(--foreground)" }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>パスワード</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
              style={{ padding: "10px 14px", borderRadius: 4, border: "1px solid var(--border)", background: "white", fontSize: 14, color: "var(--foreground)" }}
            />
          </label>

          {error && <div style={{ fontSize: 13, color: "#c0392b" }}>{error}</div>}

          <button
            onClick={handleEmailLogin}
            disabled={loading}
            style={{ padding: "12px", borderRadius: 4, border: "none", background: "var(--accent)", color: "white", fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: 4 }}
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 12, color: "var(--muted)" }}>または</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <button
            onClick={handleGoogleLogin}
            style={{ padding: "12px", borderRadius: 4, border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Googleでログイン
          </button>
        </div>

        <div style={{ marginTop: 28, borderTop: "1px solid var(--border)", paddingTop: 24 }}>
          <p style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
            アカウントなしで試したい方
          </p>
          <button
            onClick={handleDemoFill}
            style={{ width: "100%", padding: "12px", borderRadius: 4, border: "1px dashed var(--border)", background: "var(--background)", color: "var(--muted)", fontSize: 14, cursor: "pointer" }}
          >
            デモを試す
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", marginTop: 20 }}>
          ※招待制です。アカウントをお持ちでない方は管理者にお問い合わせください。
        </p>
      </div>
    </main>
  );
}
