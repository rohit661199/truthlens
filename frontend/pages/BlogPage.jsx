import Ic from "../icons";
import Footer from "../components/Footer";

// ─── BLOG PAGE ───────────────────────────────────────────────────────────────
export default function BlogPage({ t, setPage }) {
  const posts = [
    { date: "Feb 18, 2026", title: "How TruthLens Detects AI-Generated Images", excerpt: "Deep dive into our forensic analysis pipeline: pixel-level artifact detection, GAN fingerprint scanning, and metadata cross-referencing that achieves 98.7% accuracy.", tag: "ENGINEERING", tagColor: "#b57bff" },
    { date: "Feb 12, 2026", title: "Combating Misinformation in Election Cycles", excerpt: "How real-time fact-checking technology is being deployed during the 2026 election season to counter viral claims across 190+ languages.", tag: "RESEARCH", tagColor: "#4ade80" },
    { date: "Feb 5, 2026", title: "Voice Deepfake Detection: What's Next?", excerpt: "Our new voice analysis module uses speaker embeddings and spectral analysis to detect AI-cloned voices with 96% accuracy.", tag: "AI / ML", tagColor: "#818cf8" },
    { date: "Jan 28, 2026", title: "Open-Sourcing Our Fact-Check Dataset", excerpt: "We're releasing 2M+ annotated claims to help researchers build better misinformation detection models. Available under CC-BY-SA license.", tag: "OPEN SOURCE", tagColor: "#fbbf24" },
    { date: "Jan 20, 2026", title: "The Architecture Behind 2.1s Average Response Time", excerpt: "From distributed caching to parallel evidence retrieval — how we optimized our pipeline to verify claims in under 3 seconds.", tag: "ENGINEERING", tagColor: "#b57bff" },
    { date: "Jan 14, 2026", title: "Multilingual Fact-Checking: Challenges & Solutions", excerpt: "Supporting 190+ languages isn't just about translation. Learn how cultural context, regional source databases, and language-specific NLP models work together.", tag: "RESEARCH", tagColor: "#4ade80" },
  ];

  return (
    <div style={{ paddingTop: 84, minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <section style={{ padding: "80px 60px 40px", maxWidth: 900, margin: "0 auto" }}>
        <button onClick={() => setPage("landing")} data-mag style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.muted, fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: ".08em", cursor: "pointer", transition: "all .25s", marginBottom: 24 }} onMouseEnter={e => { e.currentTarget.style.color = t.accent; e.currentTarget.style.borderColor = t.accent + "50"; }} onMouseLeave={e => { e.currentTarget.style.color = t.muted; e.currentTarget.style.borderColor = t.border; }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="19 12 5 12" /><polyline points="12 19 5 12 12 5" /></svg>BACK</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 6, height: 32, borderRadius: 3, background: t.accent }} />
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: ".3em", color: t.accent }}>BLOG</span>
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 64, letterSpacing: ".03em", color: t.text, lineHeight: .95, marginBottom: 16 }}>
          Latest Updates
        </h1>
        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, color: t.muted, lineHeight: 1.7, maxWidth: 600 }}>
          Engineering deep dives, research papers, and product updates from the TruthLens team.
        </p>
      </section>

      <section style={{ padding: "20px 60px 60px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {posts.map((p, i) => (
            <article key={i} style={{
              padding: "28px 28px", borderRadius: 12,
              background: t.card, border: `1px solid ${t.border}`,
              cursor: "pointer", transition: "border-color .3s",
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = t.accent + "40")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = t.border)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: t.faint, letterSpacing: ".1em" }}>{p.date}</span>
                <span style={{
                  fontFamily: "'DM Mono',monospace", fontSize: 9, fontWeight: 700,
                  padding: "2px 8px", borderRadius: 4, letterSpacing: ".08em",
                  background: p.tagColor + "15", color: p.tagColor, border: `1px solid ${p.tagColor}30`,
                }}>
                  {p.tag}
                </span>
              </div>
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, letterSpacing: ".04em", color: t.text, marginBottom: 8 }}>
                {p.title}
              </h3>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, color: t.muted, lineHeight: 1.7 }}>
                {p.excerpt}
              </p>
            </article>
          ))}
        </div>
      </section>

      <Footer t={t} setPage={setPage} />
    </div>
  );
}
