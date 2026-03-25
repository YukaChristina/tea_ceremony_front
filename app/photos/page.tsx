"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Photo = {
  id: number;
  lesson_id: number;
  url: string;
  practiced_on: string;
  practice_name: string;
  created_at: string;
};

type LessonOption = {
  id: number;
  practiced_on: string;
  practice_name: string;
};

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [lessons, setLessons] = useState<LessonOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Photo | null>(null);

  // アップロードフォーム
  const [showUpload, setShowUpload] = useState(false);
  const [uploadLessonId, setUploadLessonId] = useState("");
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (!baseUrl) return;
    Promise.all([
      fetch(`${baseUrl}/photos`).then((r) => r.json()),
      fetch(`${baseUrl}/lessons`).then((r) => r.json()),
    ]).then(([photoData, lessonData]) => {
      setPhotos(Array.isArray(photoData) ? photoData : []);
      setLessons(Array.isArray(lessonData) ? lessonData : []);
    }).finally(() => setLoading(false));
  }, []);

  const handleUpload = async () => {
    if (!uploadLessonId) { setUploadError("稽古を選択してください"); return; }
    if (uploadFiles.length === 0) { setUploadError("写真を選択してください"); return; }
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) { setUploadError("Cloudinary環境変数が未設定です"); return; }

    setUploading(true);
    setUploadError(null);
    try {
      const newPhotos: Photo[] = [];
      for (const file of uploadFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData }
        );
        if (!uploadRes.ok) throw new Error(`アップロード失敗: ${uploadRes.status}`);
        const { secure_url } = await uploadRes.json();

        const saveRes = await fetch(`${baseUrl}/lessons/${uploadLessonId}/photos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: secure_url }),
        });
        if (!saveRes.ok) throw new Error(`保存失敗: ${saveRes.status}`);
        const { photo } = await saveRes.json();

        const lesson = lessons.find((l) => l.id === Number(uploadLessonId));
        newPhotos.push({
          id: photo.id,
          lesson_id: Number(uploadLessonId),
          url: secure_url,
          practiced_on: lesson?.practiced_on ?? "",
          practice_name: lesson?.practice_name ?? "",
          created_at: photo.created_at,
        });
      }
      setPhotos((prev) => [...newPhotos.reverse(), ...prev]);
      setShowUpload(false);
      setUploadFiles([]);
      setUploadLessonId("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e: any) {
      setUploadError(e?.message ?? "アップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main style={{ padding: 20, maxWidth: 720, margin: "0 auto" }}>
      <Link
        href="/"
        style={{ display: "inline-block", marginBottom: 20, padding: "6px 14px", borderRadius: 4, border: "1px solid var(--border)", background: "var(--card)", textDecoration: "none", fontSize: 13, color: "var(--muted)" }}
      >
        ← 戻る
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "0.08em", color: "var(--foreground)", margin: 0 }}>
          アルバム
        </h1>
        <button
          onClick={() => { setShowUpload(true); setUploadError(null); }}
          style={{ padding: "8px 16px", borderRadius: 4, border: "1px solid var(--accent)", background: "var(--accent)", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
        >
          ＋ 写真を追加
        </button>
      </div>

      {/* アップロードフォーム */}
      {showUpload && (
        <div style={{ border: "1px solid var(--border)", borderRadius: 6, padding: 20, background: "var(--card)", marginBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 15 }}>写真を追加</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* 稽古を選択 */}
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>稽古を選択</span>
              <select
                value={uploadLessonId}
                onChange={(e) => setUploadLessonId(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: 4, border: "1px solid var(--border)", background: "var(--card)", fontSize: 14, color: "var(--foreground)" }}
              >
                <option value="">-- 選択してください --</option>
                {lessons.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.practiced_on}　{l.practice_name}
                  </option>
                ))}
              </select>
            </label>

            {/* 写真を選択 */}
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>写真を選択</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setUploadFiles(Array.from(e.target.files ?? []))}
                style={{ fontSize: 14 }}
              />
            </label>

            {/* プレビュー */}
            {uploadFiles.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {uploadFiles.map((f, i) => (
                  <img key={i} src={URL.createObjectURL(f)} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 4, border: "1px solid var(--border)" }} />
                ))}
              </div>
            )}

            {uploadError && <div style={{ color: "#c0392b", fontSize: 13 }}>{uploadError}</div>}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleUpload}
                disabled={uploading}
                style={{ padding: "10px 20px", borderRadius: 4, border: "none", background: "var(--accent)", color: "white", fontSize: 14, fontWeight: 600, cursor: uploading ? "not-allowed" : "pointer", opacity: uploading ? 0.7 : 1 }}
              >
                {uploading ? "アップロード中..." : "保存"}
              </button>
              <button
                onClick={() => { setShowUpload(false); setUploadFiles([]); setUploadLessonId(""); }}
                style={{ padding: "10px 20px", borderRadius: 4, border: "1px solid var(--border)", background: "var(--card)", fontSize: 14, cursor: "pointer", color: "var(--muted)" }}
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ color: "var(--muted)", padding: 12 }}>読み込み中...</div>
      ) : photos.length === 0 ? (
        <div style={{ color: "var(--muted)", padding: 12 }}>
          まだ写真がありません。「写真を追加」から登録してください。
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {photos.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              style={{ padding: 0, border: "none", background: "var(--card)", cursor: "pointer", borderRadius: 4, overflow: "hidden", textAlign: "left" }}
            >
              <div style={{ aspectRatio: "1", overflow: "hidden" }}>
                <img src={p.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ padding: "6px 8px" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>{p.practiced_on}</div>
                <div style={{ fontSize: 12, color: "var(--foreground)", fontWeight: 500, lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{p.practice_name}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ライトボックス */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, zIndex: 1000 }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560, width: "100%" }}>
            <img src={selected.url} alt="" style={{ width: "100%", borderRadius: 8, display: "block" }} />
            <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginBottom: 4 }}>{selected.practiced_on}</div>
                <div style={{ color: "white", fontSize: 15, fontWeight: 600 }}>{selected.practice_name}</div>
              </div>
              <Link
                href={`/lessons/${selected.lesson_id}/edit`}
                onClick={() => setSelected(null)}
                style={{ padding: "6px 14px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 13, flexShrink: 0 }}
              >
                稽古を見る
              </Link>
            </div>
          </div>
          <button
            onClick={() => setSelected(null)}
            style={{ marginTop: 24, background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer" }}
          >
            閉じる
          </button>
        </div>
      )}
    </main>
  );
}
