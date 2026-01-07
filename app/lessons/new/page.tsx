"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TabKey = "chashitsu" | "teishu" | "kyaku";

export default function NewLessonPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("chashitsu");

  // いったん最小：あとでフィールド増やせます
  const [practicedOn, setPracticedOn] = useState<string>(""); // YYYY-MM-DD
  const [practiceName, setPracticeName] = useState<string>("");

  const [chashitsuNote, setChashitsuNote] = useState("");
  const [teishuNote, setTeishuNote] = useState("");
  const [kyakuNote, setKyakuNote] = useState("");

  const handleSave = async () => {
    // TODO: バックエンドにPOSTする（次ステップ）
    // いったんUI確認用
    console.log({
      practicedOn,
      practiceName,
      tabs: {
        chashitsu: { note: chashitsuNote },
        teishu: { note: teishuNote },
        kyaku: { note: kyakuNote },
      },
    });

    alert("（仮）保存しました。次にAPI連携します。");
    // 将来的には newId を受け取って router.push(`/lessons/${newId}`)
  };

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>
        稽古を記録する
      </h1>

      <section style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>稽古日</span>
          <input
            type="date"
            value={practicedOn}
            onChange={(e) => setPracticedOn(e.target.value)}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 260 }}>
          <span>稽古名</span>
          <input
            type="text"
            placeholder="例：薄茶稽古"
            value={practiceName}
            onChange={(e) => setPracticeName(e.target.value)}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
          />
        </label>
      </section>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <TabButton label="茶室" active={activeTab === "chashitsu"} onClick={() => setActiveTab("chashitsu")} />
        <TabButton label="亭主" active={activeTab === "teishu"} onClick={() => setActiveTab("teishu")} />
        <TabButton label="客" active={activeTab === "kyaku"} onClick={() => setActiveTab("kyaku")} />
      </div>

      <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16, marginBottom: 16 }}>
        {activeTab === "chashitsu" && (
          <div>
            <h2 style={{ fontSize: 16, marginBottom: 8 }}>茶室</h2>
            <textarea
              placeholder="気づき・道具・しつらえなど"
              value={chashitsuNote}
              onChange={(e) => setChashitsuNote(e.target.value)}
              rows={8}
              style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ccc" }}
            />
          </div>
        )}

        {activeTab === "teishu" && (
          <div>
            <h2 style={{ fontSize: 16, marginBottom: 8 }}>亭主</h2>
            <textarea
              placeholder="点前の反省、工夫、先生からの指摘など"
              value={teishuNote}
              onChange={(e) => setTeishuNote(e.target.value)}
              rows={8}
              style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ccc" }}
            />
          </div>
        )}

        {activeTab === "kyaku" && (
          <div>
            <h2 style={{ fontSize: 16, marginBottom: 8 }}>客</h2>
            <textarea
              placeholder="拝見、挨拶、気づきなど"
              value={kyakuNote}
              onChange={(e) => setKyakuNote(e.target.value)}
              rows={8}
              style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ccc" }}
            />
          </div>
        )}
      </section>

      <button
        onClick={handleSave}
        style={{
          padding: "12px 16px",
          borderRadius: 12,
          border: "1px solid #333",
          background: "white",
          cursor: "pointer",
        }}
      >
        保存
      </button>
    </main>
  );
}

function TabButton({
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
        padding: "10px 14px",
        borderRadius: 999,
        border: "1px solid #333",
        background: active ? "#333" : "white",
        color: active ? "white" : "#333",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
