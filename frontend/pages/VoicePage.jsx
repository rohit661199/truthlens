import { useState } from "react";
import Ic from "../icons";
import { useReveal } from "../hooks/useReveal";
import TiltCard from "../components/TiltCard";

// ─── VOICE PAGE ──────────────────────────────────────────────────────────────
export default function VoicePage({ t }) {
  const [recording, setRecording] = useState(false);
  const [done, setDone] = useState(false);
  const [prog, setProg] = useState(0);
  const [vRef, vVis] = useReveal(.04);

  const toggle = () => {
    if (done) { setDone(false); setRecording(false); setProg(0); return; }
    if (!recording) {
      setRecording(true); let p = 0;
      const iv = setInterval(() => {
        p += .7; setProg(Math.min(p, 100));
        if (p >= 100) { clearInterval(iv); setRecording(false); setDone(true); }
      }, 60);
    }
  };
  const bars = [...Array(32)].map((_, i) => ({ h: Math.random() * 75 + 12, d: i * .055 }));

  return (
    <div ref={vRef} style={{ paddingTop: 84, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 60px", position: "relative", zIndex: 1 }}>
      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(48px,7vw,80px)", letterSpacing: ".03em", color: t.text, lineHeight: .95, marginBottom: 10, textAlign: "center", transform: vVis ? "translateY(0)" : "translateY(40px)", opacity: vVis ? 1 : 0, transition: "all 1s cubic-bezier(0.16,1,0.3,1)" }}>Voice Analysis</div>
      <p style={{ fontFamily: "'Space Grotesk',sans-serif", color: t.muted, fontSize: 15, marginBottom: 56, textAlign: "center", transform: vVis ? "translateY(0)" : "translateY(30px)", opacity: vVis ? 1 : 0, transition: "all 1s .08s cubic-bezier(0.16,1,0.3,1)" }}>Detect deepfakes, emotional manipulation, and speaker credibility</p>
      <TiltCard t={t} glow style={{ padding: "56px 52px", maxWidth: 560, width: "100%", textAlign: "center", opacity: vVis ? 1 : 0, transform: vVis ? "translateY(0)" : "translateY(36px)", transition: "all 1s .16s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, height: 88, marginBottom: 36 }}>
          {bars.map((b, i) => (
            <div key={i} style={{
              width: 3, borderRadius: 3, background: done ? t.hi : t.accent,
              height: recording ? `${b.h}%` : "12%",
              animation: recording ? `vB${i % 4} ${.45 + Math.random() * .4}s ${b.d}s ease-in-out infinite alternate` : "none",
              transition: "height .5s ease, background .4s", opacity: recording ? .9 : done ? .7 : .22
            }} />
          ))}
        </div>
        <div onClick={toggle} data-mag style={{
          width: 88, height: 88, borderRadius: "50%",
          background: recording ? "linear-gradient(135deg,#f87171,#dc2626)" : done ? `linear-gradient(135deg,${t.hi},#15803d)` : `linear-gradient(135deg,${t.accent},#6d28d9)`,
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", margin: "0 auto 28px",
          boxShadow: `0 0 48px ${recording ? "rgba(248,113,113,.45)" : done ? "rgba(74,222,128,.35)" : t.glow}`,
          animation: recording ? "micBlink 1s ease-in-out infinite" : "none", transition: "all .35s", transform: "scale(1)"
        }}>
          <Ic.Mic s={30} />
        </div>
        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, color: t.muted, marginBottom: 10 }}>
          {recording ? "Recording in progress…" : done ? "Analysis complete — click to reset" : "Click to record audio"}
        </p>
        {(recording || done) && <div style={{ height: 3, borderRadius: 2, background: t.border, overflow: "hidden", marginTop: 16 }}><div style={{ height: "100%", width: `${prog}%`, background: recording ? "linear-gradient(to right,#f87171,#dc2626)" : done ? `linear-gradient(to right,${t.hi},#15803d)` : "none", transition: "width .06s linear" }} /></div>}
        {done && <div style={{ marginTop: 26, padding: 20, background: t.input, borderRadius: 12, textAlign: "left", border: `1px solid ${t.border}` }}>
          <p style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, letterSpacing: ".1em", color: t.accent, marginBottom: 10 }}>VERDICT</p>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: t.text, lineHeight: 1.75 }}>Human voice detected. <span style={{ color: t.hi }}>Low deepfake probability (8%).</span> Natural prosody patterns. Speaker credibility: <span style={{ color: t.hi }}>High.</span></p>
        </div>}
      </TiltCard>
    </div>
  );
}
