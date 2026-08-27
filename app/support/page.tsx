export default function SupportPage() {
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
          サポート
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 32 }}>
          「茶道稽古日誌」に関するお問い合わせ
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
          <Section title="お問い合わせ">
            <p>
              アプリの使い方に関するご質問、不具合のご報告、ご要望などは、以下のメールアドレスまでお気軽にご連絡ください。
            </p>
            <p style={{ marginTop: 8, color: "var(--accent)" }}>
              yukachristina1991@gmail.com
            </p>
            <p style={{ marginTop: 8, fontSize: 13, color: "var(--muted)" }}>
              通常3営業日以内にご返信いたします。
            </p>
          </Section>

          <Section title="よくあるご質問">
            <FaqItem question="ログインできません">
              メールアドレス・パスワードによるログインのほか、Appleサインイン・Googleサインインにも対応しています。パスワードを忘れた場合は、上記の連絡先までご連絡ください。
            </FaqItem>
            <FaqItem question="無料でどこまで使えますか？">
              稽古の記録は10件まで無料でご利用いただけます。11件目以降は、買い切り（追加課金なし）の商品をご購入いただくことで、無制限にご利用いただけます。
            </FaqItem>
            <FaqItem question="アカウントを削除したい">
              アプリ内の「ホーム」画面から「アカウントを削除」を選択すると、記録データを含めてアカウントを完全に削除できます。削除すると元に戻すことはできません。
            </FaqItem>
            <FaqItem question="購入した内容が反映されません" last>
              アプリの「稽古を記録する」画面にある「購入を復元」ボタンをお試しください。改善しない場合は上記の連絡先までご連絡ください。
            </FaqItem>
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

function FaqItem({
  question,
  children,
  last,
}: {
  question: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div style={{ marginBottom: last ? 0 : 16 }}>
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{question}</p>
      <p style={{ fontSize: 14, color: "var(--muted)" }}>{children}</p>
    </div>
  );
}
