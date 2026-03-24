"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type LessonListItem = {
  id: number;
  practiced_on: string;
  practice_name: string;
  teishu_temae_name: string | null;
  kyaku_temae_name: string | null;
};

export default function LessonsPage() {
  const [lessons, setLessons] = useState<LessonListItem[]>([]);
  const [query, setQuery] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) return;
    fetch(`${baseUrl}/lessons`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setLessons(data))
      .finally(() => setLoading(false));
  }, []);

  // ソート済みリストから年・月の選択肢を生成
  const sorted = lessons.slice().sort((a, b) => b.practiced_on.localeCompare(a.practiced_on));
  const years = Array.from(new Set(sorted.map((l) => l.practiced_on.slice(0, 4)))).sort((a, b) => b.localeCompare(a));
  const months = ["01","02","03","04","05","06","07","08","09","10","11","12"];

  // 年・月・フリーワードで絞り込み
  const filtered = sorted.filter((l) => {
    if (filterYear && l.practiced_on.slice(0, 4) !== filterYear) return false;
    if (filterMonth && l.practiced_on.slice(5, 7) !== filterMonth) return false;
    if (!query) return true;
    const haystack = [
      l.practiced_on,
      l.practice_name,
      l.teishu_temae_name ?? "",
      l.kyaku_temae_name ?? "",
    ].join(" ").toLowerCase();
    return query.toLowerCase().split(/\s+/).every((word) => haystack.includes(word));
  });

  return (
    <main style={{ padding: 20, maxWidth: 720, margin: "0 auto" }}>
      {/* 戻るボタン */}
      <Link
        href="/"
        style={{ display: "inline-block", marginBottom: 20, padding: "6px 14px", borderRadius: 4, border: "1px solid var(--border)", background: "var(--card)", textDecoration: "none", fontSize: 13, color: "var(--muted)" }}
      >
        ← 戻る
      </Link>

      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16, letterSpacing: "0.08em", color: "var(--foreground)" }}>
        稽古を振り返る
      </h1>

      {/* 年・月フィルター */}
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 4, border: "1px solid var(--border)", background: "var(--card)", fontSize: 14, color: "var(--foreground)", flex: 1 }}
        >
          <option value="">すべての年</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}年</option>
          ))}
        </select>
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 4, border: "1px solid var(--border)", background: "var(--card)", fontSize: 14, color: "var(--foreground)", flex: 1 }}
        >
          <option value="">すべての月</option>
          {months.map((m) => (
            <option key={m} value={m}>{parseInt(m)}月</option>
          ))}
        </select>
      </div>

      {/* フリーワード検索 */}
      <input
        type="text"
        placeholder="キーワードで検索..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: 4,
          border: "1px solid var(--border)",
          background: "var(--card)",
          fontSize: 14,
          color: "var(--foreground)",
          marginBottom: 20,
          boxSizing: "border-box",
        }}
      />

      {loading ? (
        <div style={{ color: "var(--muted)", padding: 12 }}>読み込み中...</div>
      ) : filtered.length === 0 ? (
        <div style={{ color: "var(--muted)", padding: 12 }}>
          {(query || filterYear || filterMonth) ? "該当する稽古がありません。" : <>まだ稽古がありません。<Link href="/lessons/new" style={{ color: "var(--accent)" }}>稽古を記録する</Link></>}
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {filtered.map((l) => (
            <div key={l.id} style={{ position: "relative" }}>
              <Link href={`/lessons/${l.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div
                  style={{ border: "1px solid var(--border)", borderRadius: 6, padding: 16, display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12, background: "var(--card)" }}
                >
                  <div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>{l.practiced_on}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3, color: "var(--foreground)" }}>{l.practice_name}</div>
                  </div>
                  <div style={{ display: "grid", gap: 6, alignContent: "center" }}>
                    <div style={{ fontSize: 13 }}>
                      <span style={{ color: "var(--muted)" }}>亭主：</span>
                      <span style={{ fontWeight: 700 }}>{l.teishu_temae_name ?? "—"}</span>
                    </div>
                    <div style={{ fontSize: 13 }}>
                      <span style={{ color: "var(--muted)" }}>客：</span>
                      <span style={{ fontWeight: 700 }}>{l.kyaku_temae_name ?? "—"}</span>
                    </div>
                  </div>
                </div>
              </Link>
              <Link
                href={`/lessons/${l.id}/edit`}
                style={{ position: "absolute", top: 12, right: 12, padding: "4px 12px", borderRadius: 4, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12, color: "var(--muted)", textDecoration: "none" }}
              >
                編集
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
