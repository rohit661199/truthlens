import { useState } from "react";
import axios from "axios";
import Ic from "../icons";
import { useReveal } from "../hooks/useReveal";
import RevealLine from "../components/RevealLine";
import SplitReveal from "../components/SplitReveal";
import Marquee from "../components/Marquee";
import TiltCard from "../components/TiltCard";
import Btn from "../components/Btn";
import WebGLCard from "../components/WebGLCard";
import TrustGauge from "../components/TrustGauge";
import Footer from "../components/Footer";
import { API, verdictColor, verdictBg, verdictBorder } from "../utils/factcheckHelpers";

// ─── FEATURE CELL ─────────────────────────────────────────────────────────────
function FeatureCell({ f, i, total, t, fVis }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      padding: "36px 32px", borderRight: i < total - 1 ? `1px solid ${t.line}` : "none", position: "relative", overflow: "hidden",
      background: hov ? f.c + "0d" : "transparent", cursor: "default",
      opacity: fVis ? 1 : 0, transform: fVis ? "translateY(0)" : "translateY(32px)",
      transition: `background .4s, opacity .9s ${i * .1}s cubic-bezier(0.16,1,0.3,1), transform .9s ${i * .1}s cubic-bezier(0.16,1,0.3,1)`,
    }}>
      <div style={{ width: 54, height: 54, borderRadius: 14, background: f.c + "16", border: `1px solid ${f.c}30`, display: "flex", alignItems: "center", justifyContent: "center", color: f.c, marginBottom: 22, transition: "transform .4s cubic-bezier(0.16,1,0.3,1)", transform: hov ? "scale(1.12)" : "scale(1)", boxShadow: hov ? `0 0 20px ${f.c}40` : "none" }}>
        {f.icon}
      </div>
      <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, letterSpacing: ".08em", color: t.text, marginBottom: 12 }}>{f.title}</h3>
      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: t.muted, lineHeight: 1.7 }}>{f.desc}</p>
      <div style={{ position: "absolute", bottom: 0, left: 0, width: hov ? "100%" : "0%", height: 2, background: f.c, transition: "width .45s cubic-bezier(0.16,1,0.3,1)" }} />
    </div>
  );
}

// ─── FAQ ACCORDION ITEM ────────────────────────────────────────────────────────
function FaqItem({ q, a, t }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderRadius: 14, border: `1px solid ${open ? t.accent + "50" : t.line}`,
      background: open ? t.accent + "08" : t.card, marginBottom: 14, overflow: "hidden",
      transition: "all .3s ease", backdropFilter: "blur(12px)",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "transparent", border: "none", color: t.text, cursor: "pointer", textAlign: "left",
          fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 700,
        }}
      >
        <span>{q}</span>
        <span style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .3s", color: t.accent }}>
          ▼
        </span>
      </button>
      {open && (
        <div style={{ padding: "0 24px 20px", fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: t.muted, lineHeight: 1.7 }}>
          {a}
        </div>
      )}
    </div>
  );
}

// ─── LANDING PAGE ────────────────────────────────────────────────────────────
export default function LandingPage({ setPage, t, isDark }) {
  const [ref, vis] = useReveal(.04);
  const [fRef, fVis] = useReveal(.08);
  const [wRef, wVis] = useReveal(.08);
  const [sRef, sVis] = useReveal(.08);

  // Hero Live Interactive Demo State
  const [heroClaim, setHeroClaim] = useState("");
  const [heroLoading, setHeroLoading] = useState(false);
  const [heroResult, setHeroResult] = useState(null);

  const handleHeroCheck = async (text) => {
    const claimToVerify = text || heroClaim;
    if (!claimToVerify.trim()) return;
    setHeroClaim(claimToVerify);
    setHeroLoading(true);
    setHeroResult(null);
    try {
      const { data } = await axios.post(`${API}/fact-check`, { claim: claimToVerify.trim() });
      setHeroResult(data);
    } catch {
      setHeroResult(null);
    } finally {
      setHeroLoading(false);
    }
  };

  const feats = [
    { icon: <Ic.Search s={26} />, title: "TEXT FACT CHECK", desc: "Real-time evidence retrieval via Tavily Search with Llama 3 reasoning and source citations.", c: "#b57bff" },
    { icon: <Ic.Mic s={26} />, title: "VOICE AUDIO CHECK", desc: "Real-time speech transcription, spectral audio voiceprint analysis & deepfake detection.", c: "#a78bfa" },
    { icon: <Ic.Img s={26} />, title: "IMAGE OCR INSPECT", desc: "Extract text from viral news memes & screenshots with pixel manipulation forensic checks.", c: "#818cf8" },
    { icon: <Ic.Brain s={26} />, title: "EXPLAINABLE AI", desc: "Transparent, human-readable verdicts with verifiable web citations and confidence metrics.", c: "#c084fc" },
  ];

  const steps = [
    { num: "01", title: "Input Claim", desc: "Submit text claim, voice recording, or viral news image OCR.", icon: <Ic.Search s={20} /> },
    { num: "02", title: "Live Web Search", desc: "Scrapes live authoritative news sources & official database entries.", icon: <Ic.Clock s={20} /> },
    { num: "03", title: "Llama-3 Reasoning", desc: "Synthesizes retrieved evidence with strict subject-predicate alignment.", icon: <Ic.Brain s={20} /> },
    { num: "04", title: "Explainable Verdict", desc: "Instant trust score, detailed explanation & PDF report download.", icon: <Ic.Shield s={20} /> },
  ];

  const stats = [
    { v: "100%", l: "EXPLAINABLE AI" },
    { v: "< 1.5s", l: "RESPONSE LATENCY" },
    { v: "LIVE", l: "WEB EVIDENCE" },
    { v: "MULTI-MODAL", l: "TEXT, VOICE & OCR" }
  ];

  return (
    <div style={{ paddingTop: 84, minHeight: "100vh", position: "relative", zIndex: 1 }}>

      {/* ══ HERO ══ */}
      <section ref={ref} className="hero-section-responsive" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "120px 60px 80px", position: "relative", overflow: "hidden" }}>


        {/* Full-bleed perspective grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(181,123,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(181,123,255,.04) 1px,transparent 1px)`, backgroundSize: "80px 80px", pointerEvents: "none", animation: "gridPulse 6s ease-in-out infinite" }} />

        {/* Ambient radial glow */}
        <div style={{ position: "absolute", top: "20%", left: "30%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(181,123,255,0.15) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

        {/* Animated HUD scan beam */}
        <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: `linear-gradient(to right,transparent,rgba(181,123,255,.7) 20%,rgba(220,180,255,.9) 50%,rgba(181,123,255,.7) 80%,transparent)`, boxShadow: `0 0 18px 4px rgba(181,123,255,.25)`, animation: "heroScan 7s ease-in-out infinite", pointerEvents: "none", zIndex: 3 }} />

        {/* Top status bar */}
        <RevealLine inView={vis} delay={.04}>
          <div className="hero-status-bar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 56, fontFamily: "'DM Mono',monospace", fontSize: 11, color: t.muted, letterSpacing: ".25em", borderBottom: `1px solid ${t.line}`, paddingBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ color: t.hi, display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.hi, display: "inline-block", animation: "statusBlink 2.5s ease-in-out infinite" }} />
                SYSTEM ONLINE
              </span>
              <span className="responsive-hide-mobile">│</span>
              <span>POWERED BY LLAMA-3 & TAVILY</span>
            </div>
            <span style={{ color: t.accent, fontWeight: 700 }}>TRUTHLENS VERIFICATION ENGINE</span>
          </div>
        </RevealLine>

        {/* Main Hero layout */}
        <div className="responsive-hero-layout" style={{ display: "flex", alignItems: "center", gap: 60, position: "relative", zIndex: 2 }}>
          {/* Left: Text & Interactive Live Demo */}
          <div className="responsive-hero-left" style={{ flex: "0 0 55%", position: "relative", zIndex: 2 }}>
            <RevealLine inView={vis} delay={.08}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ width: 36, height: 1.5, background: t.accent }} />
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: ".35em", color: t.accent, fontWeight: 700 }}>REAL-TIME MISINFORMATION DETECTION</span>
              </div>
            </RevealLine>

            <SplitReveal text="TRUTH" inView={vis} delay={.1}
              style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(64px,14vw,192px)", letterSpacing: ".02em", lineHeight: .88, color: t.text, overflow: "visible", marginBottom: 4, filter: vis ? "none" : "blur(8px)", transition: "filter 1s .1s" }} />

            <div style={{ height: 2, width: vis ? "100%" : "0", maxWidth: 500, background: `linear-gradient(to right,${t.accent},rgba(181,123,255,.2))`, margin: "8px 0", transition: "width 1s .32s cubic-bezier(0.16,1,0.3,1)" }} />

            <SplitReveal text="LENS" inView={vis} delay={.28}
              style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(64px,14vw,192px)", letterSpacing: ".02em", lineHeight: .88, WebkitTextStroke: `1.5px ${t.accent}`, color: "transparent", overflow: "visible", marginBottom: 36, textShadow: `0 0 60px ${t.accent}30` }} />

            <RevealLine inView={vis} delay={.46}>
              <p className="hero-subtitle-responsive" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(16px,2.2vw,22px)", color: t.muted, lineHeight: 1.65, maxWidth: 540, marginBottom: 36 }}>
                Don't just know it's fake.&nbsp;
                <span style={{ color: t.text, fontWeight: 700, fontStyle: "italic" }}>Know exactly why.</span>
                &nbsp;Explainable AI verdicts across text claims, voice audio, and images with forensic precision.
              </p>
            </RevealLine>

            {/* Quick Hero Interactive Test Widget */}
            <RevealLine inView={vis} delay={.55}>
              <div style={{
                background: "rgba(18, 18, 30, 0.7)", border: `1px solid ${t.accent}35`,
                borderRadius: 16, padding: "16px 20px", backdropFilter: "blur(16px)",
                maxWidth: 540, marginBottom: 36, boxShadow: `0 0 24px ${t.glow}`,
              }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: t.accent, letterSpacing: ".14em", marginBottom: 10, fontWeight: 700 }}>
                  ⚡ TEST THE AI FACT-CHECKER INSTANTLY:
                </div>
                <div className="hero-input-row" style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  <input
                    value={heroClaim}
                    onChange={e => setHeroClaim(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleHeroCheck()}
                    placeholder="Enter claim (e.g. Water boils at 100°C)..."
                    style={{
                      flex: 1, background: t.input, border: `1px solid ${t.border}`,
                      borderRadius: 10, padding: "10px 14px", color: t.text,
                      fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, outline: "none",
                    }}
                  />
                  <button
                    onClick={() => handleHeroCheck()}
                    disabled={!heroClaim.trim() || heroLoading}
                    style={{
                      padding: "10px 18px", borderRadius: 10,
                      background: `linear-gradient(135deg, ${t.accent}, #7c3aed)`,
                      color: "#fff", border: "none", cursor: "pointer",
                      fontFamily: "'DM Mono',monospace", fontSize: 12, fontWeight: 700,
                    }}
                  >
                    {heroLoading ? "CHECKING…" : "VERIFY"}
                  </button>
                </div>

                {/* Sample claim chips */}

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[
                    "Water boils at 100 degrees Celsius",
                    "India is capital delhi",
                    "The Great Wall of China is visible from space"
                  ].map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleHeroCheck(s)}
                      style={{
                        fontFamily: "'Space Grotesk',sans-serif", fontSize: 11,
                        padding: "4px 10px", borderRadius: 14,
                        background: t.card, border: `1px solid ${t.border}`,
                        color: t.muted, cursor: "pointer"
                      }}
                    >
                      "{s.slice(0, 30)}..."
                    </button>
                  ))}
                </div>

                {/* Hero Result Banner */}
                {heroResult && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${t.line}` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{
                        padding: "3px 12px", borderRadius: 16, fontSize: 11, fontWeight: 700,
                        fontFamily: "'DM Mono',monospace",
                        background: verdictBg(heroResult.verdict, t),
                        color: verdictColor(heroResult.verdict, t),
                        border: `1px solid ${verdictBorder(heroResult.verdict, t)}`,
                      }}>
                        VERDICT: {heroResult.verdict?.toUpperCase()}
                      </span>
                      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: t.muted }}>
                        Confidence: {heroResult.confidence}%
                      </span>
                    </div>
                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, color: t.text, lineHeight: 1.5, marginBottom: 8 }}>
                      {heroResult.explanation}
                    </p>
                    <button
                      onClick={() => setPage("factcheck")}
                      style={{
                        background: "transparent", border: "none", color: t.accent,
                        fontFamily: "'Space Grotesk',sans-serif", fontSize: 12,
                        cursor: "pointer", fontWeight: 700, textDecoration: "underline",
                      }}
                    >
                      View Full Analysis Page →
                    </button>
                  </div>
                )}
              </div>
            </RevealLine>

            <RevealLine inView={vis} delay={.68}>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 36 }}>
                <Btn t={t} sz="lg" icon={<Ic.Search s={18} />} onClick={() => setPage("factcheck")}>Analyze Text</Btn>
                <Btn t={t} v="secondary" sz="lg" icon={<Ic.Mic s={18} />} onClick={() => setPage("voicecheck")}>Voice Check</Btn>
                <Btn t={t} v="secondary" sz="lg" icon={<Ic.Img s={18} />} onClick={() => setPage("imagecheck")}>Image OCR</Btn>
              </div>
            </RevealLine>
          </div>

          {/* Right: HUD-framed WebGL Neural Visualizer */}
          <div className="responsive-hero-right" style={{ flex: "0 0 45%", paddingLeft: 20, opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(40px)", transition: "opacity 1.2s .7s, transform 1.2s .7s cubic-bezier(0.16,1,0.3,1)", position: "relative" }}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", top: -14, left: -14, right: -14, bottom: -14, borderRadius: 24, border: `1px solid rgba(181,123,255,.15)`, pointerEvents: "none", animation: "framePulse 3s ease-in-out infinite" }} />
              <div style={{ position: "absolute", top: -5, left: -5, width: 18, height: 18, borderTop: `2px solid ${t.accent}`, borderLeft: `2px solid ${t.accent}`, borderRadius: "2px 0 0 0", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: -5, right: -5, width: 18, height: 18, borderTop: `2px solid ${t.accent}`, borderRight: `2px solid ${t.accent}`, borderRadius: "0 2px 0 0", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: -5, left: -5, width: 18, height: 18, borderBottom: `2px solid ${t.accent}`, borderLeft: `2px solid ${t.accent}`, borderRadius: "0 0 0 2px", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: -5, right: -5, width: 18, height: 18, borderBottom: `2px solid ${t.accent}`, borderRight: `2px solid ${t.accent}`, borderRadius: "0 0 2px 0", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: -26, left: 0, fontFamily: "'DM Mono',monospace", fontSize: 10, color: "rgba(181,123,255,.38)", letterSpacing: ".28em" }}>LIVE EVIDENCE ANALYSIS ENGINE</div>
              <WebGLCard t={t} isDark={isDark} />
              <div style={{ display: "flex", marginTop: 8, gap: 0, border: `1px solid ${t.border}`, borderRadius: 8, overflow: "hidden", background: t.card, backdropFilter: "blur(12px)" }}>
                {[["100%", "EXPLAINABLE AI"], ["< 1.5s", "RESPONSE LATENCY"], ["LIVE", "WEB SOURCES"]].map((d, i) => (
                  <div key={d[1]} style={{ flex: 1, padding: "12px 0", textAlign: "center", borderRight: i < 2 ? `1px solid ${t.line}` : "none" }}>
                    <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, letterSpacing: ".04em", color: t.accent, lineHeight: 1 }}>{d[0]}</div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: t.faint, letterSpacing: ".2em", marginTop: 4 }}>{d[1]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom coordinate bar */}
        <RevealLine inView={vis} delay={.8}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 56, paddingTop: 20, borderTop: `1px solid ${t.line}`, fontFamily: "'DM Mono',monospace", fontSize: 11, color: t.muted, letterSpacing: ".24em" }}>
            <span>LIVE EVIDENCE RETRIEVAL</span>
            <span style={{ color: t.accent, opacity: .5 }}>◆</span>
            <span>{new Date().toISOString().slice(0, 10)}</span>
            <span style={{ color: t.accent, opacity: .5 }}>◆</span>
            <span>REAL-TIME VERIFICATION PLATFORM</span>
          </div>
        </RevealLine>
      </section>

      {/* Stats bar */}
      <div ref={sRef} className="responsive-stats-bar" style={{ borderTop: `1px solid ${t.line}`, borderBottom: `1px solid ${t.line}`, display: "flex", padding: "0 60px" }}>
        {stats.map((s, i) => (
          <div key={s.l} style={{ flex: 1, padding: "32px 0", borderRight: i < stats.length - 1 ? `1px solid ${t.line}` : "none", textAlign: "center", opacity: sVis ? 1 : 0, transform: sVis ? "translateY(0)" : "translateY(20px)", transition: `all .8s ${i * .08}s cubic-bezier(0.16,1,0.3,1)` }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 52, letterSpacing: ".04em", color: t.accent, lineHeight: 1 }}>{s.v}</div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: t.muted, letterSpacing: ".22em", marginTop: 6, fontWeight: 700 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <Marquee text="TEXT ANALYSIS • VOICE DETECTION • IMAGE VERIFICATION • EXPLAINABLE AI • FACT CHECKING •" t={t} />

      {/* ══ CAPABILITIES FEATURE GRID ══ */}
      <section ref={fRef} className="responsive-section-padding" style={{ padding: "100px 60px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 56 }}>
          <div style={{ width: 44, height: 1.5, background: t.accent }} />
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, letterSpacing: ".35em", color: t.accent, fontWeight: 700 }}>CAPABILITIES</span>
        </div>
        <div style={{ overflow: "hidden", marginBottom: 56 }}>
          <div style={{ transform: fVis ? "translateY(0)" : "translateY(110%)", transition: "transform 1.2s cubic-bezier(0.16,1,0.3,1)" }}>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(52px,7.5vw,104px)", letterSpacing: ".03em", color: t.text, lineHeight: .95 }}>
              Every type of misinformation.<br /><span style={{ color: t.accent }}>One platform.</span>
            </h2>
          </div>
        </div>
        <div className="responsive-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, border: `1px solid ${t.line}` }}>
          {feats.map((f, i) => (
            <FeatureCell key={f.title} f={f} i={i} total={feats.length} t={t} fVis={fVis} />
          ))}
        </div>
      </section>

      {/* ══ WORKFLOW PIPELINE ══ */}
      <section ref={wRef} className="responsive-section-padding" style={{ padding: "80px 60px 100px", position: "relative", zIndex: 1, borderTop: `1px solid ${t.line}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 44 }}>
          <div style={{ width: 44, height: 1.5, background: t.accent }} />
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, letterSpacing: ".35em", color: t.accent, fontWeight: 700 }}>HOW IT WORKS</span>
        </div>
        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 54, letterSpacing: ".04em", color: t.text, marginBottom: 48, lineHeight: .95 }}>
          The Forensic Verification Pipeline
        </h2>

        <div className="responsive-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {steps.map((st, idx) => (

            <TiltCard key={st.num} t={t} style={{
              padding: 30, position: "relative",
              opacity: wVis ? 1 : 0, transform: wVis ? "translateY(0)" : "translateY(28px)",
              transition: `all .8s ${idx * .1}s cubic-bezier(0.16,1,0.3,1)`,
            }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 44, color: t.accent, lineHeight: 1, marginBottom: 12 }}>
                {st.num}
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                {st.icon}
                {st.title}
              </h3>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: t.muted, lineHeight: 1.6 }}>
                {st.desc}
              </p>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ══ FAQ SECTION ══ */}
      <section style={{ padding: "80px 60px 100px", position: "relative", zIndex: 1, borderTop: `1px solid ${t.line}` }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 54, letterSpacing: ".04em", color: t.text, textAlign: "center", marginBottom: 16 }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", color: t.muted, fontSize: 16, textAlign: "center", marginBottom: 44 }}>
            Learn how TruthLens verifies claims with forensic precision
          </p>

          <FaqItem
            q="How does TruthLens verify claims so fast?"
            a="TruthLens uses a hybrid pipeline combining real-time web evidence retrieval (via Tavily Search) with Llama 3 reasoning. It queries live authoritative sources, extracts facts, and synthesizes an explainable verdict in under 1.5 seconds."
            t={t}
          />
          <FaqItem
            q="Can I analyze images, memes, and audio recordings?"
            a="Yes! TruthLens supports multi-modal input. Upload images to extract embedded text via OCR, or record voice claims for spectral audio analysis and speech transcription."
            t={t}
          />
          <FaqItem
            q="How does TruthLens ensure verdicts are unbiased and accurate?"
            a="TruthLens grounds its reasoning strictly in retrieved evidence from primary sources, news agencies (AP, Reuters), and official database entries (WHO, NASA, Government registries), checking subject-predicate relationship directionality."
            t={t}
          />
          <FaqItem
            q="Can I export fact-checking reports?"
            a="Every analysis includes a downloadable PDF report formatted with trust scores, explanation summaries, and verified clickable source citations."
            t={t}
          />
        </div>
      </section>

      <Marquee text="WHO DATABASE • SNOPES • REUTERS FACT CHECK • AP VERIFY • POLITIFACT • FULL FACT •" reverse t={t} speed={19} />

      {/* ══ CTA BANNER ══ */}
      <section className="responsive-cta-section" style={{ padding: "90px 60px 130px", position: "relative", zIndex: 1 }}>
        <TiltCard t={t} glow className="responsive-cta-card" style={{ maxWidth: 680, padding: "64px 56px", margin: "0 auto", textAlign: "center", background: isDark ? "linear-gradient(135deg,rgba(181,123,255,.09),rgba(109,40,217,.05))" : "linear-gradient(135deg,rgba(109,40,217,.07),rgba(181,123,255,.04))" }}>
          <h2 className="responsive-cta-title" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(38px, 9vw, 68px)", letterSpacing: ".04em", color: t.text, lineHeight: .95, marginBottom: 16 }}>Start detecting<br />misinformation</h2>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", color: t.text, fontSize: "clamp(14px, 3.5vw, 17px)", marginBottom: 36, lineHeight: 1.6 }}>Free to try. Instant real-time AI fact-checking across text, voice, and images.</p>
          <Btn t={t} sz="lg" onClick={() => setPage("factcheck")} icon={<Ic.Arr s={18} />}>Start Fact Checking Now</Btn>
        </TiltCard>
      </section>


      <Footer t={t} setPage={setPage} />
    </div>
  );
}


