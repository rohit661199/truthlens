import Footer from "../components/Footer";

// ─── PRIVACY POLICY PAGE ────────────────────────────────────────────────────
export default function PrivacyPage({ t, setPage }) {
  const sections = [
    { title: "1. Information We Collect", content: "We collect information you provide directly: account details (name, email), claims submitted for verification, uploaded images and audio recordings. We also collect usage data such as IP address, browser type, pages visited, and timestamps. All submitted content is processed in-memory and not stored beyond the verification session unless you explicitly save it to your history." },
    { title: "2. How We Use Your Information", content: "Your data is used to: provide fact-checking services, improve our AI models (using anonymized aggregates only), send service updates and security alerts, maintain system integrity and prevent abuse. We never sell personal data to third parties." },
    { title: "3. Data Retention", content: "Submitted claims and verification results are retained in your history for 90 days unless you manually delete them. Uploaded images and audio recordings are processed in real-time and deleted from our servers within 24 hours. Account data is retained until you request deletion." },
    { title: "4. Data Security", content: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Our infrastructure is hosted on SOC 2 Type II certified cloud providers. We perform regular security audits and penetration testing. Access to production data is restricted to authorized personnel only." },
    { title: "5. Third-Party Services", content: "We use the following third-party services: Google Cloud (infrastructure), Cloudflare (CDN/DDoS protection), OpenAI Whisper API (voice transcription), MongoDB Atlas (database). Each provider is bound by their respective privacy policies and our data processing agreements." },
    { title: "6. Your Rights", content: "You have the right to: access your personal data, request correction of inaccurate data, request deletion of your data, export your data in machine-readable format, opt out of non-essential data processing. Contact privacy@truthlens.ai to exercise these rights." },
    { title: "7. Cookies", content: "We use essential cookies for authentication and session management. No third-party tracking cookies are used. You can disable cookies in your browser settings, but some features may not work correctly." },
    { title: "8. Changes to This Policy", content: "We may update this policy periodically. Significant changes will be communicated via email and an in-app notification. Continued use of the service after changes constitutes acceptance." },
  ];

  return (
    <div style={{ paddingTop: 84, minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <section style={{ padding: "80px 60px 40px", maxWidth: 800, margin: "0 auto" }}>
        <button onClick={() => setPage("landing")} data-mag style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.muted, fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: ".08em", cursor: "pointer", transition: "all .25s", marginBottom: 24 }} onMouseEnter={e => { e.currentTarget.style.color = t.accent; e.currentTarget.style.borderColor = t.accent + "50"; }} onMouseLeave={e => { e.currentTarget.style.color = t.muted; e.currentTarget.style.borderColor = t.border; }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="19 12 5 12" /><polyline points="12 19 5 12 12 5" /></svg>BACK</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 6, height: 32, borderRadius: 3, background: t.accent }} />
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: ".3em", color: t.accent }}>LEGAL</span>
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 64, letterSpacing: ".03em", color: t.text, lineHeight: .95, marginBottom: 16 }}>
          Privacy Policy
        </h1>
        <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: t.faint, letterSpacing: ".1em" }}>
          Last updated: February 1, 2026
        </p>
      </section>

      <section style={{ padding: "20px 60px 60px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {sections.map((s, i) => (
            <div key={i}>
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: ".05em", color: t.text, marginBottom: 10 }}>
                {s.title}
              </h3>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: t.muted, lineHeight: 1.8 }}>
                {s.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer t={t} setPage={setPage} />
    </div>
  );
}
