import Footer from "../components/Footer";

// ─── TERMS OF SERVICE PAGE ──────────────────────────────────────────────────
export default function TermsPage({ t, setPage }) {
  const sections = [
    { title: "1. Acceptance of Terms", content: "By accessing or using TruthLens, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, you may not use the service. These terms apply to all users, including casual visitors, registered users, and API consumers." },
    { title: "2. Service Description", content: "TruthLens is an AI-powered fact-checking platform that provides claim verification, image analysis, voice content verification, and AI-generated image detection. Results are informational and should not be considered as absolute truth or legal evidence." },
    { title: "3. User Accounts", content: "You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate registration information and keep it updated. You may not share your account or allow others to access the service through your credentials. We reserve the right to suspend accounts that violate these terms." },
    { title: "4. Acceptable Use", content: "You may not: use the service to spread misinformation, attempt to manipulate or deceive the verification system, submit content that is illegal or violates third-party rights, use automated tools to scrape or overload the service, reverse-engineer our AI models, or resell verification results without authorization." },
    { title: "5. Intellectual Property", content: "TruthLens and its AI models, algorithms, and design are protected by intellectual property laws. Verification results are licensed to you for personal or organizational use. You may cite results with proper attribution. The TruthLens name, logo, and branding are trademarks." },
    { title: "6. API Usage", content: "API access is governed by your subscription tier's rate limits. Exceeding rate limits may result in temporary throttling or suspension. API keys are confidential and may not be shared publicly. We may modify the API with reasonable notice." },
    { title: "7. Limitations of Liability", content: "TruthLens provides fact-checking results on a best-effort basis. We do not guarantee 100% accuracy. We are not liable for decisions made based on our verification results. Our total liability is limited to the amount you paid for the service in the preceding 12 months." },
    { title: "8. Termination", content: "You may terminate your account at any time by contacting support. We may terminate or suspend your access for violation of these terms with or without notice. Upon termination, your right to use the service ceases immediately, though you may request an export of your data within 30 days." },
    { title: "9. Governing Law", content: "These terms are governed by the laws of the State of California, United States, without regard to conflict of law principles. Disputes shall be resolved through binding arbitration in San Francisco, CA, unless you qualify for small claims court." },
    { title: "10. Changes to Terms", content: "We may modify these terms at any time. Material changes will be communicated at least 30 days in advance. Continued use after changes take effect constitutes acceptance of the new terms." },
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
          Terms of Service
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
