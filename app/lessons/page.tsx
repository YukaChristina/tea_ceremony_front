"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type LessonListItem = {
  id: number;
  practiced_on: string;
  practice_name: string;
};

export default function LessonsPage() {
  const [lessons, setLessons] = useState<LessonListItem[]>([]);
  const [query, setQuery] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [matchIds, setMatchIds] = useState<Set<number> | null>(null);
  const [searching, setSearching] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (!baseUrl) return;
    fetch(`${baseUrl}/lessons`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setLessons(data))
      .finally(() => setLoading(false));
  }, []);

  // キーワード検索：バックエンドの /search を使って全入力内容を対象にする
  useEffect(() => {
    if (!baseUrl) return;
    const q = query.trim();
    if (!q) { setMatchIds(null); return; }
    setSearching(true);
    fetch(`${baseUrl}/search?query=${encodeURIComponent(q)}&limit=200`)
      .then((r) => r.json())
      .then((data) => {
        const ids = new Set<number>(Array.isArray(data) ? data.map((item: any) => item.lesson_id) : []);
        setMatchIds(ids);
      })
      .finally(() => setSearching(false));
  }, [query]);

  // ソート済みリストから年・月の選択肢を生成
  const sorted = lessons.slice().sort((a, b) => b.practiced_on.localeCompare(a.practiced_on));
  const years = Array.from(new Set(sorted.map((l) => l.practiced_on.slice(0, 4)))).sort((a, b) => b.localeCompare(a));
  const months = ["01","02","03","04","05","06","07","08","09","10","11","12"];

  // 年・月・キーワードで絞り込み
  const filtered = sorted.filter((l) => {
    if (filterYear && l.practiced_on.slice(0, 4) !== filterYear) return false;
    if (filterMonth && l.practiced_on.slice(5, 7) !== filterMonth) return false;
    if (matchIds !== null && !matchIds.has(l.id)) return false;
    return true;
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
      <div style={{ position: "relative", marginBottom: 20 }}>
        <input
          type="text"
          placeholder="キーワードで検索（道具名・銘・メモなど）..."
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
            boxSizing: "border-box",
          }}
        />
        {searching && <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--muted)" }}>検索中...</span>}
      </div>

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
                <div style={{ border: "1px solid var(--border)", borderRadius: 6, padding: 16, background: "var(--card)" }}>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>{l.practiced_on}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3, color: "var(--foreground)" }}>{l.practice_name}</div>
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
