import { useState } from "react";
import Ic from "../icons";
import { useReveal } from "../hooks/useReveal";
import TiltCard from "../components/TiltCard";
import Btn from "../components/Btn";
import TrustGauge from "../components/TrustGauge";
import Scanner from "../components/Scanner";

// ─── WORKSPACE DATA ──────────────────────────────────────────────────────────
const CLAIMS = [
  { claim: "5G towers emit harmful radiation above safety limits", conf: 94, v: "Misleading", ev: "WHO & ICNIRP confirm 5G is non-ionizing, well within safety thresholds." },
  { claim: "Studies link 5G to cancer rates", conf: 88, v: "Misleading", ev: "No peer-reviewed evidence. Claims originate from fringe pseudoscience sources." },
  { claim: "Health agencies are covering up 5G risks", conf: 97, v: "Misleading", ev: "Framing matches conspiracy rhetoric. No institutional cover-up found." },
];
const BIAS = [
  { l: "Emotional Language", s: 78, c: "#f87171" }, { l: "Source Credibility", s: 22, c: "#4ade80" },
  { l: "Factual Accuracy", s: 18, c: "#4ade80" }, { l: "Sensationalism", s: 84, c: "#f87171" }, { l: "Political Bias", s: 55, c: "#fbbf24" },
];

// ─── WORKSPACE PAGE ──────────────────────────────────────────────────────────
export default function WorkspacePage({ t }) {
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [prog, setProg] = useState(0);
  const [rRef, rVis] = useReveal(.04);

  const run = () => {
    if (!text.trim()) return;
    setAnalyzing(true); setResults(null); setProg(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 12 + 2; setProg(Math.min(p, 95));
      if (p >= 95) { clearInterval(iv); setTimeout(() => { setProg(100); setResults(true); setAnalyzing(false); }, 500); }
    }, 100);
  };
  const steps = ["Cross-referencing sources", "Semantic analysis", "Bias detection", "Fact verification"];

  return (
    <div style={{ paddingTop: 84, minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", position: "relative", zIndex: 1 }}>
      <div style={{ borderRight: `1px solid ${t.line}`, padding: "52px 48px", overflowY: "auto", maxHeight: "calc(100vh - 68px)" }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 48, letterSpacing: ".03em", color: t.text, lineHeight: .95, marginBottom: 8 }}>Analysis<br />Workspace</div>
        <p style={{ fontFamily: "'Space Grotesk',sans-serif", color: t.muted, fontSize: 14, marginBottom: 32 }}>Submit content for AI-powered misinformation detection</p>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder={"Paste the news article, social media post, or claim...\n\nExample: \"Scientists discover 5G towers are causing health issues...\""}
          style={{ width: "100%", height: 210, background: t.input, border: `1px solid ${t.border}`, borderRadius: 12, padding: "16px 18px", color: t.text, fontSize: 14, lineHeight: 1.7, resize: "vertical", outline: "none", fontFamily: "'Space Grotesk',sans-serif", boxSizing: "border-box", transition: "border-color .25s" }}
          onFocus={e => e.target.style.borderColor = t.accent} onBlur={e => e.target.style.borderColor = t.border} />
        <Btn t={t} sz="lg" onClick={run} disabled={!text.trim()} style={{ width: "100%", justifyContent: "center", marginTop: 14 }} icon={<Ic.Search s={16} />}>
          {analyzing ? "Analyzing..." : "Run Analysis"}
        </Btn>
        {analyzing && (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: t.muted, letterSpacing: ".1em" }}>AI scanning content…</span>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: t.accent }}>{Math.round(prog)}%</span>
            </div>
            <Scanner t={t} />
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              {steps.map((s, i) => (
                <span key={s} style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, padding: "4px 10px", borderRadius: 20, letterSpacing: ".06em", color: prog > i * 25 ? t.accent : t.faint, background: prog > i * 25 ? t.accent + "10" : "transparent", border: `1px solid ${prog > i * 25 ? t.accent + "30" : "transparent"}`, transition: "all .35s" }}>
                  {prog > i * 25 ? "✓ " : "○ "}{s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div ref={rRef} style={{ padding: "52px 48px", overflowY: "auto", maxHeight: "calc(100vh - 68px)" }}>
        {!results && !analyzing && (
          <div style={{ textAlign: "center", paddingTop: 100, color: t.faint }}>
            <Ic.Shield s={52} />
            <p style={{ marginTop: 16, fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, lineHeight: 1.7 }}>Submit content to see<br />analysis results here</p>
          </div>
        )}
        {results && (
          <div>
            <TiltCard t={t} glow style={{ padding: 28, marginBottom: 16, opacity: rVis ? 1 : 0, transform: rVis ? "translateY(0)" : "translateY(28px)", transition: "all .9s cubic-bezier(0.16,1,0.3,1)" }}>
              <TrustGauge score={12} t={t} />
            </TiltCard>
            <TiltCard t={t} style={{ padding: 24, marginBottom: 16, opacity: rVis ? 1 : 0, transform: rVis ? "translateY(0)" : "translateY(28px)", transition: "all .9s .1s cubic-bezier(0.16,1,0.3,1)" }}>
              <h4 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: ".08em", color: t.text, marginBottom: 16 }}>CLAIM ANALYSIS</h4>
              {CLAIMS.map((c, i) => (
                <div key={i} style={{ marginBottom: i < CLAIMS.length - 1 ? 18 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 5 }}>
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, color: t.text, lineHeight: 1.5, flex: 1 }}>"{c.claim}"</span>
                    <span style={{ flexShrink: 0, padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, fontFamily: "'DM Mono',monospace", background: "rgba(248,113,113,.1)", color: "#f87171", border: "1px solid rgba(248,113,113,.25)" }}>{c.v}</span>
                  </div>
                  <div style={{ height: 2, borderRadius: 2, background: "rgba(248,113,113,.08)", overflow: "hidden", marginBottom: 5 }}><div style={{ height: "100%", width: `${c.conf}%`, background: "linear-gradient(to right,#f87171,#dc2626)", borderRadius: 2 }} /></div>
                  <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, color: t.muted, lineHeight: 1.6 }}>{c.ev}</p>
                </div>
              ))}
            </TiltCard>
            <TiltCard t={t} style={{ padding: 24, opacity: rVis ? 1 : 0, transform: rVis ? "translateY(0)" : "translateY(28px)", transition: "all .9s .18s cubic-bezier(0.16,1,0.3,1)" }}>
              <h4 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: ".08em", color: t.text, marginBottom: 16 }}>BIAS INDICATORS</h4>
              {BIAS.map(b => (
                <div key={b.l} style={{ marginBottom: 13 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, color: t.muted }}>{b.l}</span>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: b.c }}>{b.s}%</span>
                  </div>
                  <div style={{ height: 3, borderRadius: 2, background: t.border, overflow: "hidden" }}><div style={{ height: "100%", width: `${b.s}%`, background: b.c, borderRadius: 2, transition: "width 1.2s ease" }} /></div>
                </div>
              ))}
            </TiltCard>
          </div>
        )}
      </div>
    </div>
  );
}
