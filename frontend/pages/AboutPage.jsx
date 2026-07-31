import Ic from "../icons";
import Footer from "../components/Footer";

// ─── ABOUT PAGE ──────────────────────────────────────────────────────────────
export default function AboutPage({ t, setPage }) {
  const team = [
    { name: "Arjun Mehta", role: "Founder & CEO", bio: "Former Google DeepMind researcher. 10+ years in NLP and computational linguistics." },
    { name: "Sofia Chen", role: "CTO", bio: "Built distributed systems at scale for Meta AI. Leads our real-time verification pipeline." },
    { name: "James Okoro", role: "Head of AI Research", bio: "PhD in Misinformation Detection from MIT. Published 40+ papers in top-tier journals." },
    { name: "Elena Vasquez", role: "VP of Engineering", bio: "Ex-Stripe infrastructure lead. Architected our sub-2s response time pipeline." },
  ];

  const stats = [
    { value: "140M+", label: "Claims Verified" },
    { value: "190+", label: "Languages Supported" },
    { value: "98.7%", label: "Accuracy Rate" },
    { value: "2.1s", label: "Avg Response Time" },
  ];

  return (
    <div style={{ paddingTop: 84, minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <section style={{ padding: "80px 60px 40px", maxWidth: 900, margin: "0 auto" }}>
        <button onClick={() => setPage("landing")} data-mag style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.muted, fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: ".08em", cursor: "pointer", transition: "all .25s", marginBottom: 24 }} onMouseEnter={e => { e.currentTarget.style.color = t.accent; e.currentTarget.style.borderColor = t.accent + "50"; }} onMouseLeave={e => { e.currentTarget.style.color = t.muted; e.currentTarget.style.borderColor = t.border; }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="19 12 5 12" /><polyline points="12 19 5 12 12 5" /></svg>BACK</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 6, height: 32, borderRadius: 3, background: t.accent }} />
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: ".3em", color: t.accent }}>ABOUT US</span>
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 64, letterSpacing: ".03em", color: t.text, lineHeight: .95, marginBottom: 16 }}>
          Fighting Misinformation<br /><span style={{ color: t.accent }}>With AI</span>
        </h1>
        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, color: t.muted, lineHeight: 1.8, maxWidth: 640, marginBottom: 32 }}>
          TruthLens was founded in 2024 with a singular mission: make fact-checking instant, accessible, and universal. We combine cutting-edge AI with the world's largest verified claim database to fight misinformation at scale.
        </p>
        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: t.muted, lineHeight: 1.8, maxWidth: 640 }}>
          Our platform processes text, images, voice recordings, and AI-generated content through a multi-stage verification pipeline. We cross-reference against 140M+ verified claims from trusted sources including WHO, Reuters, AP, Snopes, and PolitiFact.
        </p>
      </section>

      {/* Stats */}
      <section style={{ padding: "20px 60px 40px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: "24px 20px", borderRadius: 12, textAlign: "center",
              background: t.card, border: `1px solid ${t.border}`,
            }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: t.accent, letterSpacing: ".03em" }}>{s.value}</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: t.faint, letterSpacing: ".15em", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: "20px 60px 60px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: ".06em", color: t.text, marginBottom: 20 }}>OUR TEAM</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {team.map((m, i) => (
            <div key={i} style={{
              padding: "24px 28px", borderRadius: 12,
              background: t.card, border: `1px solid ${t.border}`,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: t.accent + "18", border: `1px solid ${t.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: t.accent }}>{m.name[0]}</span>
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, color: t.text, fontWeight: 600, marginBottom: 2 }}>{m.name}</h3>
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: t.accent, letterSpacing: ".08em", marginBottom: 8 }}>{m.role}</p>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, color: t.muted, lineHeight: 1.6 }}>{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer t={t} setPage={setPage} />
    </div>
  );
}
