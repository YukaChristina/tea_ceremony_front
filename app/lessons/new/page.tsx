"use client";

import { useRouter } from "next/navigation";
import LessonEditor from "../components/LessonEditor";

export default function NewLessonPage() {
  const router = useRouter();

  const handleCreate = async (payload: {
    practiced_on: string;
    practice_name: string;
  }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

    const res = await fetch(`${baseUrl}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        practiced_on: payload.practiced_on,
        practice_name: payload.practice_name,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`POST /lessons failed: ${res.status} ${text}`);
    }

    const data: { lesson_id: number } = await res.json();

    // ✅ 保存後も同じ画面感を保ちつつ、URLだけ編集URLに差し替え
    router.replace(`/lessons/${data.lesson_id}/edit`);
  };

  return (
    <LessonEditor
      mode="new"
      lesson={{ id: null, practiced_on: "", practice_name: "" }}
      tabs={{
        chashitsu: { items: [] },
        teishu: { entries: [] },
        kyaku: { entries: [] },
      }}
      onSave={handleCreate}
    />
  );
}
