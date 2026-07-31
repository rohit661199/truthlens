import Ic from "../icons";
import Footer from "../components/Footer";

// ─── API REFERENCE PAGE ──────────────────────────────────────────────────────
export default function ApiReferencePage({ t, setPage }) {
  const endpoints = [
    { method: "POST", path: "/fact-check", desc: "Submit a text claim for AI-powered verification. Returns verdict, confidence score, explanation, and sources.", body: '{ "claim": "string" }', response: '{ "verdict": "True|False|Misleading|Unverified", "confidence": 87, "explanation": "...", "sources": [...] }' },
    { method: "POST", path: "/ocr", desc: "Upload an image for OCR text extraction followed by automatic fact-checking of the extracted content.", body: "FormData: file (image/*)", response: '{ "extracted_text": "...", "result": { "verdict": "...", "confidence": 92, ... } }' },
    { method: "POST", path: "/voice-check", desc: "Upload an audio recording. Whisper transcribes the speech, then the claim is verified. Supports 21+ languages.", body: "FormData: file (audio/*), language (optional)", response: '{ "transcribed_text": "...", "detected_language": "en", "result": {...}, "audio_response": "base64..." }' },
    { method: "POST", path: "/detect-ai-image", desc: "Upload an image for forensic AI-generation detection. Analyzes pixel patterns, metadata, and visual artifacts.", body: "FormData: file (image/*)", response: '{ "verdict": "AI-Generated|Real Photograph", "confidence_percentage": 94, "detailed_reasoning": "...", ... }' },
  ];

  return (
    <div style={{ paddingTop: 84, minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <section style={{ padding: "80px 60px 40px", maxWidth: 900, margin: "0 auto" }}>
        <button onClick={() => setPage("landing")} data-mag style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.muted, fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: ".08em", cursor: "pointer", transition: "all .25s", marginBottom: 24 }} onMouseEnter={e => { e.currentTarget.style.color = t.accent; e.currentTarget.style.borderColor = t.accent + "50"; }} onMouseLeave={e => { e.currentTarget.style.color = t.muted; e.currentTarget.style.borderColor = t.border; }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="19 12 5 12" /><polyline points="12 19 5 12 12 5" /></svg>BACK</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 6, height: 32, borderRadius: 3, background: t.accent }} />
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: ".3em", color: t.accent }}>API REFERENCE</span>
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 64, letterSpacing: ".03em", color: t.text, lineHeight: .95, marginBottom: 16 }}>
          API Endpoints
        </h1>
        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, color: t.muted, lineHeight: 1.7, maxWidth: 600 }}>
          Integrate TruthLens into your applications. All endpoints accept JSON or FormData and return structured JSON responses.
        </p>
        <div style={{ marginTop: 16, padding: "8px 16px", borderRadius: 8, background: t.input, border: `1px solid ${t.border}`, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: t.faint, letterSpacing: ".06em" }}>BASE URL</span>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: t.accent }}>https://api.truthlens.ai/v1</span>
        </div>
      </section>

      <section style={{ padding: "20px 60px 60px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {endpoints.map((ep, i) => (
            <div key={i} style={{
              padding: "24px 28px", borderRadius: 12,
              background: t.card, border: `1px solid ${t.border}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{
                  fontFamily: "'DM Mono',monospace", fontSize: 10, fontWeight: 700,
                  padding: "3px 10px", borderRadius: 4, letterSpacing: ".08em",
                  background: "#4ade8018", color: "#4ade80", border: "1px solid #4ade8030",
                }}>
                  {ep.method}
                </span>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 14, color: t.text, fontWeight: 600 }}>
                  {ep.path}
                </span>
              </div>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, color: t.muted, lineHeight: 1.7, marginBottom: 16 }}>
                {ep.desc}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: t.faint, letterSpacing: ".15em", display: "block", marginBottom: 6 }}>REQUEST BODY</span>
                  <div style={{ padding: "10px 14px", borderRadius: 8, background: t.input, border: `1px solid ${t.border}`, fontFamily: "'DM Mono',monospace", fontSize: 11, color: t.muted, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                    {ep.body}
                  </div>
                </div>
                <div>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: t.faint, letterSpacing: ".15em", display: "block", marginBottom: 6 }}>RESPONSE</span>
                  <div style={{ padding: "10px 14px", borderRadius: 8, background: t.input, border: `1px solid ${t.border}`, fontFamily: "'DM Mono',monospace", fontSize: 11, color: t.muted, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                    {ep.response}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rate limits */}
        <div style={{ marginTop: 40, padding: "24px 28px", borderRadius: 12, background: t.accent + "08", border: `1px solid ${t.accent}20` }}>
          <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: ".06em", color: t.text, marginBottom: 10 }}>RATE LIMITS</h3>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: t.muted, lineHeight: 2 }}>
            <div>Free tier: 10 requests / day</div>
            <div>Pro tier: 1,000 requests / day</div>
            <div>Enterprise: Unlimited (custom SLA)</div>
            <div>Rate limit headers: X-RateLimit-Remaining, X-RateLimit-Reset</div>
          </div>
        </div>
      </section>

      <Footer t={t} setPage={setPage} />
    </div>
  );
}
