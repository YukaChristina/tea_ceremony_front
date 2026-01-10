import Link from "next/link";

type LessonListItem = {
  id: number;
  practiced_on: string;          // "YYYY-MM-DD"
  practice_name: string;
  teishu_temae_name: string | null;
  kyaku_temae_name: string | null;
};

async function fetchLessons(): Promise<LessonListItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

  const res = await fetch(`${baseUrl}/lessons`, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET /lessons failed: ${res.status} ${text}`);
  }
  return res.json();
}

export default async function LessonsPage() {
  const lessons = await fetchLessons();

  return (
    <main style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>稽古を振り返る</h1>

      {lessons.length === 0 ? (
        <div style={{ opacity: 0.7, padding: 12 }}>
          まだ稽古がありません。<Link href="/lessons/new">稽古を記録する</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {lessons.map((l) => (
            <Link
              key={l.id}
              href={`/lessons/${l.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  border: "1px solid #e3e3e3",
                  borderRadius: 14,
                  padding: 14,
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1fr",
                  gap: 12,
                  background: "white",
                }}
              >
                {/* 左：日付（小）＋稽古名（主役） */}
                <div>
                  <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
                    {l.practiced_on}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.2 }}>
                    {l.practice_name}
                  </div>
                </div>

                {/* 右：亭主（上）＋客（下） */}
                <div style={{ display: "grid", gap: 6, alignContent: "center" }}>
                  <div style={{ fontSize: 13 }}>
                    <span style={{ opacity: 0.7 }}>亭主：</span>
                    <span style={{ fontWeight: 700 }}>
                      {l.teishu_temae_name ?? "—"}
                    </span>
                  </div>
                  <div style={{ fontSize: 13 }}>
                    <span style={{ opacity: 0.7 }}>客：</span>
                    <span style={{ fontWeight: 700 }}>
                      {l.kyaku_temae_name ?? "—"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
