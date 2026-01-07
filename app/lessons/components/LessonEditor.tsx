"use client";

import { useMemo, useState } from "react";

type TabKey = "chashitsu" | "teishu" | "kyaku";
type Mode = "read" | "new" | "edit";

type LessonItem = {
  item_id: number;
  role_entry_id: number | null;
  section: string; // temae etc
  item_type: string; // tool etc
  title: string;
  mei?: string | null;
  maker?: string | null;
  note?: string | null;
  created_at?: string | null;
};

type RoleEntry = {
  id: number;
  role: string;
  temae_name?: string | null;
  note?: string | null;
  created_at?: string | null;
};

type Props = {
  mode: Mode;
  lesson: {
    id?: number | null;
    practiced_on: string;
    practice_name: string;
  };
  tabs: {
    chashitsu: { items: LessonItem[] };
    teishu: { entries: RoleEntry[] };
    kyaku: { entries: RoleEntry[] };
  };
  // newモード用：保存のために親が受け取れるようにする（いまは未使用でもOK）
  onChangeDraft?: (draft: any) => void;
  onSave?: (payload: { practiced_on: string; practice_name: string }) => Promise<void>;

};



export default function LessonEditor({ mode, lesson, tabs, onSave }: Props) {
  const [active, setActive] = useState<TabKey>("chashitsu");

  // newモードの入力（最小）
  const [practiceName, setPracticeName] = useState(lesson.practice_name ?? "");
  const [practicedOn, setPracticedOn] = useState(lesson.practiced_on ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editable = mode === "new" || mode === "edit";

  const title = mode === "new" ? "稽古を記録する" : lesson.practice_name;

  const counts = useMemo(() => {
    return {
      chashitsu: tabs.chashitsu.items.length,
      teishu: tabs.teishu.entries.length,
      kyaku: tabs.kyaku.entries.length,
    };
  }, [tabs]);

  const handleSave = async () => {
  if (!onSave) return;

  if (!practicedOn || !practiceName) {
    setError("稽古日と稽古名を入力してください");
    return;
  }

  setSaving(true);
  setError(null);

  try {
    await onSave({
      practiced_on: practicedOn,
      practice_name: practiceName,
    });
  } catch (e: any) {
    setError(e?.message ?? "保存に失敗しました");
  } finally {
    setSaving(false);
  }
};

  return (
    <main style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      {/* ヘッダー */}
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>{title}</h1>

        {mode === "read" ? (
          <div style={{ marginTop: 6, opacity: 0.75 }}>
            {lesson.practiced_on} / lesson_id={lesson.id ?? "-"}
          </div>
        ) : (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 12, opacity: 0.75 }}>稽古日</span>
              <input
                type="date"
                value={practicedOn}
                onChange={(e) => setPracticedOn(e.target.value)}
                style={inputStyle}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 280 }}>
              <span style={{ fontSize: 12, opacity: 0.75 }}>稽古名</span>
              <input
                type="text"
                placeholder="例：薄茶稽古"
                value={practiceName}
                onChange={(e) => setPracticeName(e.target.value)}
                style={inputStyle}
              />
            </label>
          </div>
        )}
      </div>

      {/* 3タブ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 18 }}>
        <SegmentTab
          label="茶室"
          active={active === "chashitsu"}
          onClick={() => setActive("chashitsu")}
        />
        <SegmentTab
          label="亭主"
          active={active === "teishu"}
          onClick={() => setActive("teishu")}
        />
        <SegmentTab
          label="客"
          active={active === "kyaku"}
          onClick={() => setActive("kyaku")}
        />
      </div>

      {/* 各タブの中身 */}
      {active === "chashitsu" && (
        <section>
          <SectionTitle title="茶室" sub={`（role_entryなし） (${counts.chashitsu})`} />

          {mode === "read" ? (
            <div style={{ display: "grid", gap: 14 }}>
              {tabs.chashitsu.items.map((it) => (
                <Card key={it.item_id}>
                  <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                    {it.title} <span style={{ opacity: 0.6, fontWeight: 400 }}>(item_id={it.item_id})</span>
                  </div>
                  {it.mei && <Line label="銘" value={it.mei} />}
                  {it.maker && <Line label="作" value={it.maker} />}
                  {it.note && <Line label="メモ" value={it.note} />}
                </Card>
              ))}
              {tabs.chashitsu.items.length === 0 && <EmptyState />}
            </div>
          ) : (
            <Card>
              <div style={{ fontWeight: 700, marginBottom: 10 }}>茶室メモ</div>
              <textarea
                placeholder="掛け軸・花・茶碗など気づいたことをメモ"
                rows={8}
                style={textareaStyle}
              />
            </Card>
          )}
        </section>
      )}

      {active === "teishu" && (
        <section>
          <SectionTitle title="亭主" sub={`(${counts.teishu})`} />

          {mode === "read" ? (
            <div style={{ display: "grid", gap: 14 }}>
              {tabs.teishu.entries.map((e) => (
                <Card key={e.id}>
                  <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                    {e.temae_name ?? "点前"}{" "}
                    <span style={{ opacity: 0.6, fontWeight: 400 }}>(entry_id={e.id})</span>
                  </div>
                  {e.note && <Line label="メモ" value={e.note} />}
                </Card>
              ))}
              {tabs.teishu.entries.length === 0 && <EmptyState />}
            </div>
          ) : (
            <Card>
              <div style={{ fontWeight: 700, marginBottom: 10 }}>亭主メモ</div>
              <textarea
                placeholder="点前の反省、先生からの指摘など"
                rows={8}
                style={textareaStyle}
              />
            </Card>
          )}
        </section>
      )}

      {active === "kyaku" && (
        <section>
          <SectionTitle title="客" sub={`(${counts.kyaku})`} />

          {mode === "read" ? (
            <div style={{ display: "grid", gap: 14 }}>
              {tabs.kyaku.entries.map((e) => (
                <Card key={e.id}>
                  <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                    {e.temae_name ?? "所感"}{" "}
                    <span style={{ opacity: 0.6, fontWeight: 400 }}>(entry_id={e.id})</span>
                  </div>
                  {e.note && <Line label="メモ" value={e.note} />}
                </Card>
              ))}
              {tabs.kyaku.entries.length === 0 && <EmptyState />}
            </div>
          ) : (
            <Card>
              <div style={{ fontWeight: 700, marginBottom: 10 }}>客メモ</div>
              <textarea
                placeholder="拝見、挨拶、気づきなど"
                rows={8}
                style={textareaStyle}
              />
            </Card>
          )}
        </section>
      )}

      {/* newモードの保存ボタン（見た目だけ先） */}
      {mode === "new" && (
        <div style={{ marginTop: 22 }}>
          {editable && (
            <div style={{ marginTop: 22 }}>
            {error && <div style={{ color: "crimson", marginBottom: 10 }}>{error}</div>}
            <button style={buttonStyle} onClick={handleSave} disabled={saving}>
                {saving ? "保存中..." : "保存"}
            </button>
        </div>
)}

        </div>
      )}
    </main>
  );
}

function SegmentTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "18px 12px",
        borderRadius: 14,
        border: "1px solid #cfcfcf",
        background: active ? "#efefef" : "white",
        fontSize: 18,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <h2 style={{ fontSize: 22, fontWeight: 800, margin: "16px 0 12px" }}>
      {title} {sub && <span style={{ fontSize: 16, fontWeight: 600, opacity: 0.7 }}>{sub}</span>}
    </h2>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid #e1e1e1",
        borderRadius: 16,
        padding: 18,
        background: "white",
      }}
    >
      {children}
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginTop: 6 }}>
      <span style={{ opacity: 0.7 }}>{label}：</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ opacity: 0.6, padding: 12 }}>
      まだ記録がありません
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: 10,
  borderRadius: 12,
  border: "1px solid #ccc",
  fontSize: 14,
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: 12,
  borderRadius: 12,
  border: "1px solid #ccc",
  fontSize: 14,
};

const buttonStyle: React.CSSProperties = {
  padding: "12px 18px",
  borderRadius: 12,
  border: "1px solid #333",
  background: "white",
  cursor: "pointer",
  fontSize: 16,
  fontWeight: 700,
};
