"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TabKey = "chashitsu" | "teishu" | "kyaku";
type Mode = "read" | "new" | "edit";

type LessonItem = {
  item_id: number;
  role_entry_id: number | null;
  section: string;
  item_type: string;
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
  items?: LessonItem[];
};

type RoleForm = {
  teaType: "薄茶" | "濃茶";
  hasShelf: "なし" | "あり";
  shelfName: string;
  practiceName: string;
  chawanGosho: string;
  chawanMaker: string;
  chawanMei: string;
  chawanNote: string;
  chashakuMaker: string;
  chashakuMei: string;
  chashakuNote: string;
  chakiNuri: string;
  chakiKatachi: string;
  chakiKatachiKoicha: string;
  chakiKamamoto: string;
  shifukuKirejie: string;
  shifukuShitate: string;
  memo: string;
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
  initialPhotoUrls?: string[];
  onChangeDraft?: (draft: any) => void;
  onSave?: (payload: { practiced_on: string; practice_name: string }) => Promise<{ lesson_id: number }>;
};

function todayString() {
  return new Date().toISOString().split("T")[0];
}

function defaultSeason(): "風炉" | "炉" {
  const month = new Date().getMonth() + 1;
  return month === 12 || month <= 4 ? "炉" : "風炉";
}

function initFromTabs(tabs: Props["tabs"]) {
  const chItems = tabs.chashitsu.items;
  const okashi = chItems.find((i) => i.item_type === "okashi");
  const kakejiku = chItems.find((i) => i.item_type === "kakejiku");
  const hana = chItems.find((i) => i.item_type === "hana");
  const extras = chItems.filter((i) => !["okashi", "kakejiku", "hana"].includes(i.item_type));
  return {
    okashiGosho: okashi?.title ?? "",
    okashiMei: okashi?.mei ?? "",
    kakejiku: kakejiku?.note ?? "",
    hana: hana?.note ?? "",
    extraItems: extras.map((i) => ({ name: i.item_type, text: i.note ?? "" })),
  };
}

function parsePracticeName(name: string) {
  const parts = name.split("/");
  if (parts.length >= 3) {
    const tea = parts[0] === "濃茶" ? "濃茶" as const : "薄茶" as const;
    const shelfRaw = parts[1];
    const practice = parts.slice(2).join("/");
    const hasShelf = shelfRaw === "なし" ? "なし" as const : "あり" as const;
    const shelfName = shelfRaw === "なし" ? "" : shelfRaw;
    return { teaType: tea, hasShelf, shelfName, practiceName: practice };
  }
  return { teaType: "薄茶" as const, hasShelf: "なし" as const, shelfName: "", practiceName: name };
}

function initRoleForm(entry: RoleEntry | undefined, nameStr: string): RoleForm {
  const items: LessonItem[] = entry?.items ?? [];
  const chawan = items.find((i) => i.item_type === "chawan");
  const chashaku = items.find((i) => i.item_type === "chashaku");
  const chaki = items.find((i) => i.item_type === "chaki");
  const shifuku = items.find((i) => i.item_type === "shifuku");
  // temae_name に "薄茶/なし/貴人点て" 形式が保存されていればそちらを優先
  const source = entry?.temae_name && entry.temae_name.includes("/") ? entry.temae_name : nameStr;
  const parsed = parsePracticeName(source);
  return {
    teaType: parsed.teaType,
    hasShelf: parsed.hasShelf,
    shelfName: parsed.shelfName,
    practiceName: parsed.practiceName,
    chawanGosho: chawan?.title ?? "",
    chawanMaker: chawan?.maker ?? "",
    chawanMei: chawan?.mei ?? "",
    chawanNote: chawan?.note ?? "",
    chashakuMaker: chashaku?.maker ?? "",
    chashakuMei: chashaku?.mei ?? "",
    chashakuNote: chashaku?.note ?? "",
    chakiNuri: chaki?.note ?? "",
    chakiKatachi: chaki?.title ?? "",
    chakiKatachiKoicha: chaki?.title ?? "",
    chakiKamamoto: chaki?.maker ?? "",
    shifukuKirejie: shifuku?.title ?? "",
    shifukuShitate: shifuku?.maker ?? "夕湖",
    memo: entry?.note ?? "",
  };
}

export default function LessonEditor({ mode, lesson, tabs, initialPhotoUrls, onSave }: Props) {
  const router = useRouter();
  const [active, setActive] = useState<TabKey>("chashitsu");

  const init = initFromTabs(tabs);

  // ヘッダー
  const [practicedOn, setPracticedOn] = useState(lesson.practiced_on || todayString());
  const [season, setSeason] = useState<"風炉" | "炉">(defaultSeason());

  // 茶室
  const [existingPhotoUrls, setExistingPhotoUrls] = useState<string[]>(initialPhotoUrls ?? []);
  const [photos, setPhotos] = useState<File[]>([]);
  const [okashiGosho, setOkashiGosho] = useState(init.okashiGosho);
  const [okashiMei, setOkashiMei] = useState(init.okashiMei);
  const [kakejiku, setKakejiku] = useState(init.kakejiku);
  const [hana, setHana] = useState(init.hana);
  const [extraItems, setExtraItems] = useState<{ name: string; text: string }[]>(init.extraItems);
  const [selectedItemName, setSelectedItemName] = useState("お菓子");

  // 亭主・客フォーム（個別）
  const [teishuForm, setTeishuForm] = useState<RoleForm>(() =>
    initRoleForm(tabs.teishu.entries[0], lesson.practice_name ?? "")
  );
  const [kyakuForm, setKyakuForm] = useState<RoleForm>(() =>
    initRoleForm(tabs.kyaku.entries[0], lesson.practice_name ?? "")
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const editable = mode === "new" || mode === "edit";

  const title = mode === "new" ? "稽古を記録する" : lesson.practice_name;


  const handleSave = async () => {
    if (!onSave) return;
    if (!practicedOn || !teishuForm.practiceName) {
      setError("稽古日と稽古名を入力してください");
      return;
    }
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
      const tf = teishuForm;
      const kf = kyakuForm;
      const tfShelfPart = tf.hasShelf === "あり" ? (tf.shelfName || "棚あり") : "なし";
      const composedName = `${tf.teaType}/${tfShelfPart}/${tf.practiceName}`;

      // 1) レッスン作成 or 更新
      const { lesson_id } = await onSave({ practiced_on: practicedOn, practice_name: composedName });

      const postItem = async (body: object) => {
        const res = await fetch(`${baseUrl}/lessons/${lesson_id}/items`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`アイテム保存失敗: ${res.status} ${await res.text()}`);
      };
      const postEntry = (body: object) =>
        fetch(`${baseUrl}/lessons/${lesson_id}/role-entries`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
        }).then((r) => r.json());

      const has = (...vals: string[]) => vals.some((v) => v.trim() !== "");

      if (mode === "edit") {
        // 編集時は既存アイテム・エントリを全削除してから再登録
        const delItems = await fetch(`${baseUrl}/lessons/${lesson_id}/items`, { method: "DELETE" });
        if (!delItems.ok) throw new Error(`アイテム削除失敗: ${delItems.status} ${await delItems.text()}`);
        const delEntries = await fetch(`${baseUrl}/lessons/${lesson_id}/role-entries`, { method: "DELETE" });
        if (!delEntries.ok) throw new Error(`エントリ削除失敗: ${delEntries.status} ${await delEntries.text()}`);
      }

      // 2) 茶室アイテム
      if (has(okashiGosho, okashiMei))
        await postItem({ section: "chashitsu", item_type: "okashi", title: okashiGosho || null, mei: okashiMei || null });
      if (kakejiku.trim())
        await postItem({ section: "chashitsu", item_type: "kakejiku", note: kakejiku });
      if (hana.trim())
        await postItem({ section: "chashitsu", item_type: "hana", note: hana });
      for (const item of extraItems)
        if (item.text.trim())
          await postItem({ section: "chashitsu", item_type: item.name, note: item.text });

      // 3) 亭主エントリ＋道具（temae_name に「茶種/棚/稽古名」形式で保存）
      const tfComposed = `${tf.teaType}/${tfShelfPart}/${tf.practiceName}`;
      const teishuRes = await postEntry({ role: "teishu", temae_name: tfComposed, note: tf.memo || null });
      const teishuEntryId = teishuRes.role_entry.id;

      if (has(tf.chawanGosho, tf.chawanMaker, tf.chawanMei, tf.chawanNote))
        await postItem({ role_entry_id: teishuEntryId, item_type: "chawan", title: tf.chawanGosho || null, maker: tf.chawanMaker || null, mei: tf.chawanMei || null, note: tf.chawanNote || null });
      if (has(tf.chashakuMaker, tf.chashakuMei, tf.chashakuNote))
        await postItem({ role_entry_id: teishuEntryId, item_type: "chashaku", maker: tf.chashakuMaker || null, mei: tf.chashakuMei || null, note: tf.chashakuNote || null });
      if (tf.teaType === "薄茶" && has(tf.chakiNuri, tf.chakiKatachi))
        await postItem({ role_entry_id: teishuEntryId, item_type: "chaki", title: tf.chakiKatachi || null, note: tf.chakiNuri || null });
      if (tf.teaType === "濃茶") {
        if (has(tf.chakiKatachiKoicha, tf.chakiKamamoto))
          await postItem({ role_entry_id: teishuEntryId, item_type: "chaki", title: tf.chakiKatachiKoicha || null, maker: tf.chakiKamamoto || null });
        if (has(tf.shifukuKirejie, tf.shifukuShitate))
          await postItem({ role_entry_id: teishuEntryId, item_type: "shifuku", title: tf.shifukuKirejie || null, maker: tf.shifukuShitate || null });
      }

      // 4) 客エントリ＋道具（temae_name に「茶種/棚/稽古名」形式で保存）
      const kfShelfPart = kf.hasShelf === "あり" ? (kf.shelfName || "棚あり") : "なし";
      const kfComposed = `${kf.teaType}/${kfShelfPart}/${kf.practiceName}`;
      const kyakuRes = await postEntry({ role: "kyaku", temae_name: kfComposed, note: kf.memo || null });
      const kyakuEntryId = kyakuRes.role_entry.id;

      if (has(kf.chawanGosho, kf.chawanMaker, kf.chawanMei, kf.chawanNote))
        await postItem({ role_entry_id: kyakuEntryId, item_type: "chawan", title: kf.chawanGosho || null, maker: kf.chawanMaker || null, mei: kf.chawanMei || null, note: kf.chawanNote || null });
      if (has(kf.chashakuMaker, kf.chashakuMei, kf.chashakuNote))
        await postItem({ role_entry_id: kyakuEntryId, item_type: "chashaku", maker: kf.chashakuMaker || null, mei: kf.chashakuMei || null, note: kf.chashakuNote || null });
      if (kf.teaType === "薄茶" && has(kf.chakiNuri, kf.chakiKatachi))
        await postItem({ role_entry_id: kyakuEntryId, item_type: "chaki", title: kf.chakiKatachi || null, note: kf.chakiNuri || null });
      if (kf.teaType === "濃茶") {
        if (has(kf.chakiKatachiKoicha, kf.chakiKamamoto))
          await postItem({ role_entry_id: kyakuEntryId, item_type: "chaki", title: kf.chakiKatachiKoicha || null, maker: kf.chakiKamamoto || null });
        if (has(kf.shifukuKirejie, kf.shifukuShitate))
          await postItem({ role_entry_id: kyakuEntryId, item_type: "shifuku", title: kf.shifukuKirejie || null, maker: kf.shifukuShitate || null });
      }

      // 5) 写真アップロード（Cloudinary → バックエンドに URL 保存）
      if (photos.length > 0) {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
        if (!cloudName || !uploadPreset) {
          throw new Error(`Cloudinary 環境変数未設定: CLOUD_NAME="${cloudName}" UPLOAD_PRESET="${uploadPreset}"`);
        }
        for (const file of photos) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", uploadPreset);
          const uploadRes = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: "POST", body: formData }
          );
          if (!uploadRes.ok) throw new Error(`写真アップロード失敗: ${uploadRes.status}`);
          const { secure_url } = await uploadRes.json();
          const saveRes = await fetch(`${baseUrl}/lessons/${lesson_id}/photos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: secure_url }),
          });
          if (!saveRes.ok) throw new Error(`写真URL保存失敗: ${saveRes.status}`);
          setExistingPhotoUrls((prev) => [...prev, secure_url]);
        }
        setPhotos([]);
      }

      if (mode === "new") {
        // 6) リダイレクト
        router.replace(`/lessons/${lesson_id}/edit`);
      } else {
        setSaved(true);
      }
    } catch (e: any) {
      setError(e?.message ?? "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  // アクティブなロールのフォームと更新関数
  const rf = active === "teishu" ? teishuForm : kyakuForm;
  const setRf = active === "teishu" ? setTeishuForm : setKyakuForm;
  const updateRf = (field: keyof RoleForm, value: string) =>
    setRf((prev) => ({ ...prev, [field]: value } as RoleForm));

  return (
    <main style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      {/* 戻るボタン */}
      <button
        onClick={() => mode === "edit" ? router.push("/lessons") : router.push("/")}
        style={{ marginBottom: 16, padding: "6px 14px", borderRadius: 4, border: "1px solid var(--border)", background: "var(--card)", cursor: "pointer", fontSize: 13, color: "var(--muted)" }}
      >
        ← 戻る
      </button>

      {/* ヘッダー */}
      <div style={{ marginBottom: 20, borderBottom: "1px solid var(--border)", paddingBottom: 16 }}>
        <h1 style={{ fontSize: 26, fontWeight: 600, margin: 0, letterSpacing: "0.08em", color: "var(--foreground)" }}>
          {title}
        </h1>

        {mode === "read" ? (
          <div style={{ marginTop: 6, fontSize: 13, color: "var(--muted)" }}>{lesson.practiced_on}</div>
        ) : (
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 14, alignItems: "flex-end" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>稽古日</span>
              <input type="date" value={practicedOn} onChange={(e) => setPracticedOn(e.target.value)} style={inputStyle} />
            </label>

            <div>
              <span style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>季節</span>
              <div style={{ display: "flex", gap: 20 }}>
                {(["風炉", "炉"] as const).map((val) => (
                  <label key={val} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 14 }}>
                    <input type="radio" name="season" value={val} checked={season === val} onChange={() => setSeason(val)} style={{ accentColor: "var(--accent)" }} />
                    {val}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3タブ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        <SegmentTab label="茶室" active={active === "chashitsu"} onClick={() => setActive("chashitsu")} />
        <SegmentTab label="亭主" active={active === "teishu"} onClick={() => setActive("teishu")} />
        <SegmentTab label="客" active={active === "kyaku"} onClick={() => setActive("kyaku")} />
      </div>

      {/* 亭主・客タブ共通の上部入力エリア */}
      {editable && active !== "chashitsu" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>

          {/* お茶の種類 */}
          <div>
            <span style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>お茶の種類</span>
            <div style={{ display: "flex", gap: 20 }}>
              {(["薄茶", "濃茶"] as const).map((val) => (
                <label key={val} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 14 }}>
                  <input type="radio" name={`teaType-${active}`} value={val} checked={rf.teaType === val} onChange={() => setRf((prev) => ({ ...prev, teaType: val }))} style={{ accentColor: "var(--accent)" }} />
                  {val}
                </label>
              ))}
            </div>
          </div>

          {/* 棚 */}
          <div>
            <span style={{ fontSize: 12, color: "var(--muted)", display: "block", marginBottom: 6 }}>棚</span>
            <div style={{ display: "flex", gap: 20, marginBottom: rf.hasShelf === "あり" ? 10 : 0 }}>
              {(["なし", "あり"] as const).map((val) => (
                <label key={val} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 14 }}>
                  <input type="radio" name={`hasShelf-${active}`} value={val} checked={rf.hasShelf === val} onChange={() => setRf((prev) => ({ ...prev, hasShelf: val }))} style={{ accentColor: "var(--accent)" }} />
                  {val}
                </label>
              ))}
            </div>
            {rf.hasShelf === "あり" && (
              <input type="text" placeholder="棚の名前（例：志野棚）" value={rf.shelfName} onChange={(e) => updateRf("shelfName", e.target.value)} style={{ ...inputStyle, maxWidth: 280 }} />
            )}
          </div>

          {/* 稽古名 */}
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>稽古名</span>
            <input type="text" placeholder="例：貴人点て" value={rf.practiceName} onChange={(e) => updateRf("practiceName", e.target.value)} style={{ ...inputStyle, maxWidth: 360 }} />
          </label>

          {/* 茶碗 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>茶碗</span>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>御生</span>
                <input type="text" placeholder="御生" value={rf.chawanGosho} onChange={(e) => updateRf("chawanGosho", e.target.value)} style={{ ...inputStyle, minWidth: 160 }} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>作者</span>
                <input type="text" placeholder="作者" value={rf.chawanMaker} onChange={(e) => updateRf("chawanMaker", e.target.value)} style={{ ...inputStyle, minWidth: 160 }} />
              </label>
              {rf.teaType === "濃茶" && (
                <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>銘</span>
                  <input type="text" placeholder="銘" value={rf.chawanMei} onChange={(e) => updateRf("chawanMei", e.target.value)} style={{ ...inputStyle, minWidth: 160 }} />
                </label>
              )}
            </div>
            <textarea placeholder="メモ" rows={2} style={textareaStyle} value={rf.chawanNote} onChange={(e) => updateRf("chawanNote", e.target.value)} />
          </div>

          {/* 茶杓 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>茶杓</span>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>作者</span>
                <input type="text" placeholder="作者" value={rf.chashakuMaker} onChange={(e) => updateRf("chashakuMaker", e.target.value)} style={{ ...inputStyle, minWidth: 160 }} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>銘</span>
                <input type="text" placeholder="銘" value={rf.chashakuMei} onChange={(e) => updateRf("chashakuMei", e.target.value)} style={{ ...inputStyle, minWidth: 160 }} />
              </label>
            </div>
            <textarea placeholder="メモ" rows={2} style={textareaStyle} value={rf.chashakuNote} onChange={(e) => updateRf("chashakuNote", e.target.value)} />
          </div>

          {/* 茶器（薄茶） */}
          {rf.teaType === "薄茶" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>茶器</span>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>塗り</span>
                  <input type="text" placeholder="塗り" value={rf.chakiNuri} onChange={(e) => updateRf("chakiNuri", e.target.value)} style={{ ...inputStyle, minWidth: 160 }} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>形</span>
                  <input type="text" placeholder="形" value={rf.chakiKatachi} onChange={(e) => updateRf("chakiKatachi", e.target.value)} style={{ ...inputStyle, minWidth: 160 }} />
                </label>
              </div>
            </div>
          )}

          {/* 茶器・仕覆（濃茶） */}
          {rf.teaType === "濃茶" && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>茶器</span>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>形</span>
                    <input type="text" placeholder="形" value={rf.chakiKatachiKoicha} onChange={(e) => updateRf("chakiKatachiKoicha", e.target.value)} style={{ ...inputStyle, minWidth: 160 }} />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>窯元</span>
                    <input type="text" placeholder="窯元" value={rf.chakiKamamoto} onChange={(e) => updateRf("chakiKamamoto", e.target.value)} style={{ ...inputStyle, minWidth: 160 }} />
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>仕覆</span>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>切地</span>
                    <input type="text" placeholder="切地" value={rf.shifukuKirejie} onChange={(e) => updateRf("shifukuKirejie", e.target.value)} style={{ ...inputStyle, minWidth: 160 }} />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>仕立て</span>
                    <input type="text" value={rf.shifukuShitate} onChange={(e) => updateRf("shifukuShitate", e.target.value)} style={{ ...inputStyle, minWidth: 160 }} />
                  </label>
                </div>
              </div>
            </>
          )}

        </div>
      )}

      {/* タブ内容 */}
      {active === "chashitsu" && (
        <section>
          {mode === "read" ? (
            <div style={{ display: "grid", gap: 14 }}>
              {tabs.chashitsu.items.map((it) => (
                <Card key={it.item_id}>
                  <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{it.title}</div>
                  {it.mei && <Line label="銘" value={it.mei} />}
                  {it.maker && <Line label="作" value={it.maker} />}
                  {it.note && <Line label="メモ" value={it.note} />}
                </Card>
              ))}
              {tabs.chashitsu.items.length === 0 && <EmptyState />}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* お菓子 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>お菓子</span>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>御生</span>
                    <input type="text" placeholder="御生" value={okashiGosho} onChange={(e) => setOkashiGosho(e.target.value)} style={{ ...inputStyle, minWidth: 160 }} />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>銘</span>
                    <input type="text" placeholder="銘" value={okashiMei} onChange={(e) => setOkashiMei(e.target.value)} style={{ ...inputStyle, minWidth: 160 }} />
                  </label>
                </div>
              </div>

              {/* 掛け軸 */}
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>掛け軸</span>
                <textarea placeholder="掛け軸について記入" rows={3} style={textareaStyle} value={kakejiku} onChange={(e) => setKakejiku(e.target.value)} />
              </label>

              {/* 花 */}
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>花</span>
                <textarea placeholder="花について記入" rows={3} style={textareaStyle} value={hana} onChange={(e) => setHana(e.target.value)} />
              </label>

              {/* 追加した項目 */}
              {extraItems.map((item, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>{item.name}</span>
                    <button
                      onClick={() => setExtraItems((prev) => prev.filter((_, idx) => idx !== i))}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "var(--muted)" }}
                    >
                      削除
                    </button>
                  </div>
                  <textarea
                    placeholder={`${item.name}について記入`}
                    rows={3}
                    style={textareaStyle}
                    value={item.text}
                    onChange={(e) => setExtraItems((prev) => prev.map((it, idx) => idx === i ? { ...it, text: e.target.value } : it))}
                  />
                </div>
              ))}

              {/* 項目追加ボタン */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <select
                  value={selectedItemName}
                  onChange={(e) => setSelectedItemName(e.target.value)}
                  style={{ ...inputStyle, minWidth: 140 }}
                >
                  {["お菓子", "掛け軸", "花", "釜", "花入", "風炉先", "建水", "蓋置", "菓子器", "香合", "水指"].map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <button
                  onClick={() => setExtraItems((prev) => [...prev, { name: selectedItemName, text: "" }])}
                  style={{ padding: "8px 16px", borderRadius: 4, border: "1px dashed var(--accent)", background: "var(--card)", color: "var(--accent)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                >
                  ＋ 項目を追加
                </button>
              </div>

              {/* 写真アップロード */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>写真</span>
                <label style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 4, border: "1px dashed var(--border)", background: "var(--card)", cursor: "pointer", fontSize: 13, color: "var(--muted)", width: "fit-content" }}>
                  <span>＋ 写真を追加</span>
                  <input type="file" accept="image/*" multiple style={{ display: "none" }}
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      setPhotos((prev) => [...prev, ...files]);
                      e.target.value = "";
                    }}
                  />
                </label>
                {(existingPhotoUrls.length > 0 || photos.length > 0) && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}>
                    {existingPhotoUrls.map((url, i) => (
                      <div key={`existing-${i}`} style={{ position: "relative" }}>
                        <img src={url} alt="" style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border)" }} />
                        <button
                          onClick={() => setExistingPhotoUrls((prev) => prev.filter((_, idx) => idx !== i))}
                          style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,0.5)", color: "white", border: "none", borderRadius: "50%", width: 20, height: 20, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}
                        >✕</button>
                      </div>
                    ))}
                    {photos.map((file, i) => (
                      <div key={`new-${i}`} style={{ position: "relative" }}>
                        <img src={URL.createObjectURL(file)} alt={file.name} style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 6, border: "2px dashed var(--accent)" }} />
                        <button onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                          style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,0.5)", color: "white", border: "none", borderRadius: "50%", width: 20, height: 20, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </section>
      )}

      {active === "teishu" && (
        <section>
          {mode === "read" ? (
            <div style={{ display: "grid", gap: 14 }}>
              {tabs.teishu.entries.map((e) => (
                <Card key={e.id}>
                  <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{e.temae_name ?? "点前"}</div>
                  {e.note && <Line label="メモ" value={e.note} />}
                </Card>
              ))}
              {tabs.teishu.entries.length === 0 && <EmptyState />}
            </div>
          ) : (
            <Card>
              <div style={{ fontWeight: 600, marginBottom: 10, color: "var(--muted)", fontSize: 13 }}>亭主メモ</div>
              <textarea placeholder="点前の反省、先生からの指摘など" rows={6} style={textareaStyle} value={teishuForm.memo} onChange={(e) => setTeishuForm((prev) => ({ ...prev, memo: e.target.value }))} />
            </Card>
          )}
        </section>
      )}

      {active === "kyaku" && (
        <section>
          {mode === "read" ? (
            <div style={{ display: "grid", gap: 14 }}>
              {tabs.kyaku.entries.map((e) => (
                <Card key={e.id}>
                  <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{e.temae_name ?? "所感"}</div>
                  {e.note && <Line label="メモ" value={e.note} />}
                </Card>
              ))}
              {tabs.kyaku.entries.length === 0 && <EmptyState />}
            </div>
          ) : (
            <Card>
              <div style={{ fontWeight: 600, marginBottom: 10, color: "var(--muted)", fontSize: 13 }}>客メモ</div>
              <textarea placeholder="拝見、挨拶、気づきなど" rows={6} style={textareaStyle} value={kyakuForm.memo} onChange={(e) => setKyakuForm((prev) => ({ ...prev, memo: e.target.value }))} />
            </Card>
          )}
        </section>
      )}

      {/* 保存ボタン */}
      {editable && (
        <div style={{ marginTop: 24 }}>
          {error && <div style={{ color: "#c0392b", marginBottom: 10, fontSize: 14 }}>{error}</div>}
          {saved && <div style={{ color: "var(--accent)", marginBottom: 10, fontSize: 14, fontWeight: 600 }}>保存が完了しました</div>}
          <button style={buttonStyle} onClick={handleSave} disabled={saving}>
            {saving ? "保存中..." : "保存"}
          </button>
        </div>
      )}
    </main>
  );
}

function SegmentTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ padding: "14px 12px", borderRadius: 4, border: active ? "1px solid var(--accent)" : "1px solid var(--border)", background: active ? "var(--accent)" : "var(--card)", color: active ? "white" : "var(--foreground)", fontSize: 16, fontWeight: 600, cursor: "pointer", letterSpacing: "0.05em" }}>
      {label}
    </button>
  );
}


function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ border: "1px solid var(--border)", borderRadius: 6, padding: 18, background: "var(--card)" }}>{children}</div>;
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginTop: 6, fontSize: 14 }}>
      <span style={{ color: "var(--muted)" }}>{label}：</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function EmptyState() {
  return <div style={{ color: "var(--muted)", padding: 12, fontSize: 14 }}>まだ記録がありません</div>;
}

const inputStyle: React.CSSProperties = {
  padding: 10,
  borderRadius: 4,
  border: "1px solid var(--border)",
  fontSize: 14,
  background: "var(--card)",
  color: "var(--foreground)",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: 12,
  borderRadius: 4,
  border: "1px solid var(--border)",
  fontSize: 14,
  background: "var(--background)",
  color: "var(--foreground)",
  resize: "vertical",
};

const buttonStyle: React.CSSProperties = {
  padding: "12px 28px",
  borderRadius: 4,
  border: "none",
  background: "var(--accent)",
  color: "white",
  cursor: "pointer",
  fontSize: 16,
  fontWeight: 600,
  letterSpacing: "0.05em",
};
