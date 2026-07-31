import Ic from "../icons";
import Footer from "../components/Footer";

// ─── DOCUMENTATION PAGE ──────────────────────────────────────────────────────
export default function DocsPage({ t, setPage }) {
  const sections = [
    { title: "Getting Started", desc: "Learn the basics of TruthLens — from setting up your first fact-check to understanding AI confidence scores.", icon: <Ic.Zap s={20} /> },
    { title: "Text Verification", desc: "Submit text claims via the API or dashboard. Our NLP engine cross-references 140M+ verified claims in real-time.", icon: <Ic.Search s={20} /> },
    { title: "Image OCR Analysis", desc: "Upload images to extract embedded text via OCR. The extracted content is then run through our full verification pipeline.", icon: <Ic.Img s={20} /> },
    { title: "Voice Check", desc: "Record or upload audio. Whisper transcribes the claim, which is then verified with source-backed evidence.", icon: <Ic.Mic s={20} /> },
    { title: "AI Image Detection", desc: "Forensic-level analysis to determine if an image is AI-generated or a real photograph. Checks pixel patterns, metadata, and visual artifacts.", icon: <Ic.Eye s={20} /> },
    { title: "Confidence Scoring", desc: "Every result includes a 0–100% confidence score calculated from source reliability, claim specificity, and cross-reference density.", icon: <Ic.Shield s={20} /> },
  ];

  return (
    <div style={{ paddingTop: 84, minHeight: "100vh", position: "relative", zIndex: 1 }}>
      {/* Header */}
      <section style={{ padding: "80px 60px 40px", maxWidth: 900, margin: "0 auto" }}>
        <button onClick={() => setPage("landing")} data-mag style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.muted, fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: ".08em", cursor: "pointer", transition: "all .25s", marginBottom: 24 }} onMouseEnter={e => { e.currentTarget.style.color = t.accent; e.currentTarget.style.borderColor = t.accent + "50"; }} onMouseLeave={e => { e.currentTarget.style.color = t.muted; e.currentTarget.style.borderColor = t.border; }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="19 12 5 12" /><polyline points="12 19 5 12 12 5" /></svg>BACK</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 6, height: 32, borderRadius: 3, background: t.accent }} />
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: ".3em", color: t.accent }}>DOCUMENTATION</span>
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 64, letterSpacing: ".03em", color: t.text, lineHeight: .95, marginBottom: 16 }}>
          Learn TruthLens
        </h1>
        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, color: t.muted, lineHeight: 1.7, maxWidth: 600 }}>
          Everything you need to verify, analyze, and understand information using our AI-powered platform.
        </p>
      </section>

      {/* Doc sections */}
      <section style={{ padding: "20px 60px 60px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {sections.map((s, i) => (
            <div key={i} style={{
              padding: "24px 28px", borderRadius: 12,
              background: t.card, border: `1px solid ${t.border}`,
              display: "flex", gap: 20, alignItems: "flex-start",
              transition: "border-color .3s",
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                background: t.accent + "12", border: `1px solid ${t.accent}22`,
                display: "flex", alignItems: "center", justifyContent: "center", color: t.accent,
              }}>
                {s.icon}
              </div>
              <div>
                <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: ".06em", color: t.text, marginBottom: 6 }}>
                  {s.title}
                </h3>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, color: t.muted, lineHeight: 1.7 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick reference */}
        <div style={{ marginTop: 40, padding: "24px 28px", borderRadius: 12, background: t.accent + "08", border: `1px solid ${t.accent}20` }}>
          <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: ".06em", color: t.text, marginBottom: 10 }}>
            QUICK REFERENCE
          </h3>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: t.muted, lineHeight: 2 }}>
            <div>POST /fact-check — Verify a text claim</div>
            <div>POST /ocr — Extract & verify image text</div>
            <div>POST /voice-check — Transcribe & verify audio</div>
            <div>POST /detect-ai-image — AI vs real forensic analysis</div>
          </div>
        </div>
      </section>

      <Footer t={t} setPage={setPage} />
    </div>
  );
}
