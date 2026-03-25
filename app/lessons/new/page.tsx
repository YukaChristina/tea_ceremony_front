"use client";

import LessonEditor from "../components/LessonEditor";
import { apiFetch } from "../../../lib/api";

export default function NewLessonPage() {
  const handleCreate = async (payload: {
    practiced_on: string;
    practice_name: string;
  }): Promise<{ lesson_id: number }> => {
    const res = await apiFetch("/lessons", {
      method: "POST",
      body: JSON.stringify({
        practiced_on: payload.practiced_on,
        practice_name: payload.practice_name,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`POST /lessons failed: ${res.status} ${text}`);
    }

    return res.json();
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
