"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LessonEditor from "../../components/LessonEditor";
import { apiFetch } from "../../../../lib/api";

type LessonData = {
  lesson: { id: number; practiced_on: string; practice_name: string };
  tabs: {
    chashitsu: { items: any[] };
    teishu: { entries: any[] };
    kyaku: { entries: any[] };
  };
};

export default function EditLessonPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<LessonData | null>(null);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch(`/lessons/${id}`).then((r) => r.json()),
      apiFetch(`/lessons/${id}/photos`).then((r) => r.json()),
    ]).then(([lessonData, photos]) => {
      setData(lessonData);
      setPhotoUrls(Array.isArray(photos) ? (photos as { url: string }[]).map((p) => p.url) : []);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (payload: {
    practiced_on: string;
    practice_name: string;
  }): Promise<{ lesson_id: number }> => {
    const res = await apiFetch(`/lessons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`PATCH /lessons/${id} failed: ${res.status} ${text}`);
    }

    return res.json();
  };

  if (loading) {
    return (
      <main style={{ padding: 24, color: "var(--muted)" }}>読み込み中...</main>
    );
  }

  if (!data) {
    return (
      <main style={{ padding: 24, color: "var(--muted)" }}>
        稽古が見つかりませんでした。
      </main>
    );
  }

  return (
    <LessonEditor
      mode="edit"
      lesson={{
        id: data.lesson.id,
        practiced_on: data.lesson.practiced_on,
        practice_name: data.lesson.practice_name,
      }}
      tabs={data.tabs}
      initialPhotoUrls={photoUrls}
      onSave={handleUpdate}
    />
  );
}
