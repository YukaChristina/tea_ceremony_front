# 茶道稽古記録アプリ — Frontend

## 技術スタック
- Next.js 15 (App Router)
- TypeScript + CSS Variables（globals.css）
- Supabase Auth (@supabase/ssr)

## ファイル構成
- `app/page.tsx` — トップページ（稽古を振り返る／アルバムボタン）
- `app/login/page.tsx` — ログイン（メール+パスワード / Google OAuth / デモ）
- `app/auth/callback/route.ts` — OAuth コールバック
- `app/lessons/page.tsx` — 稽古一覧・キーワード検索
- `app/lessons/new/page.tsx` — 稽古新規作成
- `app/lessons/[id]/page.tsx` — 稽古詳細（閲覧）
- `app/lessons/[id]/edit/page.tsx` — 稽古編集
- `app/lessons/components/LessonEditor.tsx` — 茶室/亭主/客タブ編集UI
- `app/photos/page.tsx` — アルバム（写真一覧・アップロード）
- `lib/api.ts` — apiFetch（JWT自動付与）
- `lib/supabase/client.ts` — Supabaseクライアント
- `middleware.ts` — 未ログインは /login にリダイレクト

## 環境変数（Vercel）
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_BASE_URL` — RenderのバックエンドURL
- `NEXT_PUBLIC_DEMO_EMAIL` — デモアカウントのメール
- `NEXT_PUBLIC_DEMO_PASSWORD` — デモアカウントのパスワード

## 認証
- メール+パスワード / Google OAuth（招待制）
- デモモード：ログイン画面の「デモを試す」で自動入力

## デプロイ
Vercel — GitHub連携で自動デプロイ