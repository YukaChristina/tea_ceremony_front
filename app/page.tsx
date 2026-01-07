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
        gap: 24,
        padding: 24,
        textAlign: "center",
      }}
    >
      {/* アプリ名 */}
      <h1 style={{ fontSize: 28, fontWeight: 600 }}>
        裏千家稽古アプリ
      </h1>

      {/* アクション */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Link
          href="/lessons/new"
          style={{
            padding: "14px 20px",
            borderRadius: 12,
            border: "1px solid #333",
            textDecoration: "none",
            fontSize: 16,
          }}
        >
          稽古を記録する
        </Link>

        <Link
          href="/lessons"
          style={{
            padding: "14px 20px",
            borderRadius: 12,
            border: "1px solid #333",
            textDecoration: "none",
            fontSize: 16,
          }}
        >
          稽古を振り返る
        </Link>
      </div>
    </main>
  );
}
