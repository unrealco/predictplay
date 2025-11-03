export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
          <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "16px 0" }}>
            <a href="/" style={{ fontWeight: 700, textDecoration: "none", color: "inherit" }}>Predict Play</a>
            <nav style={{ display: "flex", gap: 12 }}>
              <a href="/markets/new">Create Market</a>
              <a href="/legal/terms">Terms</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
