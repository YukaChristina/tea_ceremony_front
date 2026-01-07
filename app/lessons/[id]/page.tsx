"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type LessonItem = {
  item_id: number;
  role_entry_id: number | null;
  section: "chashitsu" | "teishu" | "kyaku";
  item_type: string;
  title: string | null;
  mei: string | null;
  maker: string | null;
  note: string | null;
  created_at: string;
};

type RoleEntry = {
  role_entry_id: number;
  role: "teishu" | "kyaku";
  temae_name: string | null;
  note: string | null;
  created_at: string;
  items: LessonItem[];
};

type LessonDetailResponse = {
  lesson: {
    id: number;
    practiced_on: string;
    practice_name: string | null;
  };
  tabs: {
    chashitsu: { items: LessonItem[] };
    teishu: { entries: RoleEntry[] };
    kyaku: { entries: RoleEntry[] };
  };
};

type TabKey = "chashitsu" | "teishu" | "kyaku";

export default function LessonDetailPage() {
  const params = useParams<{ id: string }>();
  const lessonId = Number(params.id);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [data, setData] = useState<LessonDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>("chashitsu");

  useEffect(() => {
    if (!lessonId || Number.isNaN(lessonId)) return;

    const fetchLesson = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/lessons/${lessonId}`);
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const json = (await res.json()) as LessonDetailResponse;
        setData(json);

        // デフォルトタブ：データがあるところに寄せる（気が利く最小）
        if (json.tabs.chashitsu.items.length > 0) setTab("chashitsu");
        else if (json.tabs.teishu.entries.length > 0) setTab("teishu");
        else setTab("kyaku");
      } catch (e) {
        console.error(e);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId, API_BASE]);

  const header = useMemo(() => {
    if (!data) return null;
    return {
      title: data.lesson.practice_name || "(無題)",
      sub: `${data.lesson.practiced_on} / lesson_id=${data.lesson.id}`,
    };
  }, [data]);

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (!data) return <div style={{ padding: 16 }}>Not found / API error</div>;

  return (
    <div style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
      {/* ヘッダー */}
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ fontSize: 20, margin: 0 }}>{header?.title}</h1>
        <div style={{ fontSize: 12, opacity: 0.7 }}>{header?.sub}</div>
      </div>

      {/* タブ */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <TabButton active={tab === "chashitsu"} onClick={() => setTab("chashitsu")}>
          茶室
        </TabButton>
        <TabButton active={tab === "teishu"} onClick={() => setTab("teishu")}>
          亭主
        </TabButton>
        <TabButton active={tab === "kyaku"} onClick={() => setTab("kyaku")}>
          客
        </TabButton>
      </div>

      {/* 中身 */}
      {tab === "chashitsu" && (
        <SectionTitle title="茶室（role_entryなし）" count={data.tabs.chashitsu.items.length} />
      )}
      {tab === "chashitsu" && <ItemList items={data.tabs.chashitsu.items} />}

      {tab === "teishu" && (
        <EntriesList title="亭主の点前" entries={data.tabs.teishu.entries} />
      )}

      {tab === "kyaku" && (
        <EntriesList title="客の点前" entries={data.tabs.kyaku.entries} />
      )}
    </div>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid rgba(0,0,0,0.15)",
        background: active ? "rgba(0,0,0,0.08)" : "white",
        fontWeight: active ? 700 : 500,
      }}
    >
      {children}
    </button>
  );
}

function SectionTitle({ title, count }: { title: string; count: number }) {
  return (
    <div style={{ marginBottom: 8, fontWeight: 700 }}>
      {title} <span style={{ opacity: 0.6 }}>({count})</span>
    </div>
  );
}

function EntriesList({ title, entries }: { title: string; entries: RoleEntry[] }) {
  return (
    <div>
      <SectionTitle title={title} count={entries.length} />
      {entries.length === 0 && <div style={{ opacity: 0.7 }}>まだ点前がありません</div>}
      {entries.map((e) => (
        <div
          key={e.role_entry_id}
          style={{
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>
            {e.temae_name || "(点前名なし)"}{" "}
            <span style={{ opacity: 0.6, fontWeight: 500 }}>
              (role_entry_id={e.role_entry_id})
            </span>
          </div>
          {e.note && <div style={{ marginBottom: 8, opacity: 0.8 }}>{e.note}</div>}
          <ItemList items={e.items} />
        </div>
      ))}
    </div>
  );
}

function ItemList({ items }: { items: LessonItem[] }) {
  if (items.length === 0) return <div style={{ opacity: 0.7 }}>道具がまだありません</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((it) => (
        <div
          key={it.item_id}
          style={{
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 12,
            padding: 12,
          }}
        >
          <div style={{ fontWeight: 700 }}>
            {it.title || it.item_type}{" "}
            <span style={{ opacity: 0.6, fontWeight: 500 }}>
              (item_id={it.item_id})
            </span>
          </div>

          <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.4 }}>
            {it.mei && (
              <div>
                銘：<b>{it.mei}</b>
              </div>
            )}
            {it.maker && (
              <div>
                作者：<b>{it.maker}</b>
              </div>
            )}
            {it.note && <div style={{ opacity: 0.85 }}>メモ：{it.note}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
