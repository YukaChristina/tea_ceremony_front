"use client";

type Mode = "read" | "new";

type Props = {
  mode: Mode;
  lesson?: {
    practiced_on: string;
    practice_name: string;
    tabs: {
      chashitsu: string;
      teishu: string;
      kyaku: string;
    };
  };
};

export default function LessonEditor({ mode, lesson }: Props) {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, marginBottom: 16 }}>
        {mode === "new" ? "稽古を記録する" : lesson?.practice_name}
      </h1>

      {/* Tabs（見た目は[id]と同じにする） */}
      <section>
        <Tab label="茶室">
          <Content editable={mode === "new"}>
            {lesson?.tabs.chashitsu}
          </Content>
        </Tab>

        <Tab label="亭主">
          <Content editable={mode === "new"}>
            {lesson?.tabs.teishu}
          </Content>
        </Tab>

        <Tab label="客">
          <Content editable={mode === "new"}>
            {lesson?.tabs.kyaku}
          </Content>
        </Tab>
      </section>

      {mode === "new" && (
        <button style={{ marginTop: 24 }}>
          保存
        </button>
      )}
    </main>
  );
}

/* ====== 以下は軽いUI補助 ====== */

function Tab({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 16 }}>{label}</h2>
      {children}
    </section>
  );
}

function Content({
  editable,
  children,
}: {
  editable: boolean;
  children?: string;
}) {
  if (editable) {
    return (
      <textarea
        defaultValue={children}
        rows={6}
        style={{ width: "100%", padding: 12 }}
      />
    );
  }

  return <p style={{ whiteSpace: "pre-wrap" }}>{children}</p>;
}
