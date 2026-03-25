import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 32,
        padding: 24,
        textAlign: "center",
        background: "var(--background)",
      }}
    >
      {/* 装飾ライン */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 1, background: "var(--accent)" }} />
        <span style={{ fontSize: 12, color: "var(--accent)", letterSpacing: "0.2em" }}>裏千家</span>
        <div style={{ width: 40, height: 1, background: "var(--accent)" }} />
      </div>

      {/* アプリ名 */}
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 600, letterSpacing: "0.1em", color: "var(--foreground)", margin: 0 }}>
          稽古記録
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 8, letterSpacing: "0.05em" }}>
          Urasenke Practice Log
        </p>
      </div>

      {/* アクション */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: 280 }}>
        <Link
          href="/lessons/new"
          className="btn-tap"
          style={{
            padding: "16px 20px",
            borderRadius: 4,
            border: "1px solid var(--accent)",
            background: "var(--accent)",
            color: "white",
            textDecoration: "none",
            fontSize: 16,
            letterSpacing: "0.05em",
          }}
        >
          稽古を記録する
        </Link>

        <Link
          href="/lessons"
          className="btn-tap"
          style={{
            padding: "16px 20px",
            borderRadius: 4,
            border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--foreground)",
            textDecoration: "none",
            fontSize: 16,
            letterSpacing: "0.05em",
          }}
        >
          稽古を振り返る
        </Link>

        <Link
          href="/photos"
          className="btn-tap"
          style={{
            padding: "16px 20px",
            borderRadius: 4,
            border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--foreground)",
            textDecoration: "none",
            fontSize: 16,
            letterSpacing: "0.05em",
          }}
        >
          アルバム
        </Link>
      </div>

      {/* 装飾 */}
      <div style={{ fontSize: 20, color: "var(--accent)", opacity: 0.4 }}>◇</div>
    </main>
  );
}
