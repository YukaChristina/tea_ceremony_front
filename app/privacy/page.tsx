export default function PrivacyPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: "48px 24px",
        background: "var(--background)",
      }}
    >
      <div style={{ maxWidth: 640, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 40, height: 1, background: "var(--accent)" }} />
          <span style={{ fontSize: 12, color: "var(--accent)", letterSpacing: "0.2em" }}>
            稽古記録
          </span>
          <div style={{ width: 40, height: 1, background: "var(--accent)" }} />
        </div>

        <h1
          style={{
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: "0.05em",
            color: "var(--foreground)",
            marginBottom: 8,
          }}
        >
          プライバシーポリシー
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 32 }}>
          最終更新日: 2026年8月4日
        </p>

        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 28,
            lineHeight: 1.9,
            fontSize: 15,
            color: "var(--foreground)",
          }}
        >
          <p style={{ marginBottom: 24 }}>
            「稽古記録」（以下「本アプリ」）は、個人開発者（以下「開発者」）が提供する、茶道の稽古内容を記録するためのアプリケーションです。本ポリシーは、本アプリ（Web版およびiOS/Androidアプリ版）が取得する情報とその取り扱いについて説明します。
          </p>

          <Section title="1. 取得する情報">
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              <li>メールアドレス（アカウント登録・ログインのため）</li>
              <li>稽古記録の内容（日付、点前の種類、道具名・銘・産地などのメモ）</li>
              <li>ユーザーが任意でアップロードする稽古の写真</li>
            </ul>
          </Section>

          <Section title="2. 情報の利用目的">
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              <li>本アプリの機能（稽古記録の保存・閲覧・編集）を提供するため</li>
              <li>ユーザー本人の認証・アカウント管理のため</li>
            </ul>
            <p style={{ marginTop: 12 }}>
              取得した情報を広告配信や第三者へのマーケティング目的で利用することはありません。
            </p>
          </Section>

          <Section title="3. 第三者サービスの利用">
            <p style={{ marginBottom: 12 }}>
              本アプリは、以下の外部サービスを利用してデータを保存・処理しています。各サービスのプライバシーポリシーも併せてご確認ください。
            </p>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              <li>Supabase（認証情報・稽古記録データの保存）</li>
              <li>Cloudinary（アップロードされた写真の保存・配信）</li>
            </ul>
          </Section>

          <Section title="4. データの保管期間・削除">
            <p>
              ユーザーのデータは、アカウントが存在する限り保持されます。アカウントおよび記録データの削除をご希望の場合は、下記の連絡先までご連絡ください。確認の上、合理的な期間内に削除対応いたします。
            </p>
          </Section>

          <Section title="5. 情報の第三者提供">
            <p>
              法令に基づく場合を除き、取得した情報を本人の同意なく第三者に提供することはありません。
            </p>
          </Section>

          <Section title="6. お子様のプライバシー">
            <p>
              本アプリは13歳未満のお子様を対象としておらず、意図的にお子様の個人情報を取得することはありません。
            </p>
          </Section>

          <Section title="7. ポリシーの変更">
            <p>
              本ポリシーの内容は、必要に応じて予告なく変更されることがあります。重要な変更がある場合は、本ページ上で更新日を改定してお知らせします。
            </p>
          </Section>

          <Section title="8. お問い合わせ" last>
            <p>
              本アプリのプライバシーに関するお問い合わせは、以下のメールアドレスまでお願いいたします。
            </p>
            <p style={{ marginTop: 8, color: "var(--accent)" }}>
              yukachristina1991@gmail.com
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
  last,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <section
      style={{
        marginBottom: last ? 0 : 24,
        paddingBottom: last ? 0 : 24,
        borderBottom: last ? "none" : "1px solid var(--border)",
      }}
    >
      <h2
        style={{
          fontSize: 16,
          fontWeight: 600,
          marginBottom: 10,
          color: "var(--foreground)",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
