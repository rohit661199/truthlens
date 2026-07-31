import { useState, useEffect } from "react";

// ─── LOADER ──────────────────────────────────────────────────────────────────
export default function Loader({ onDone }) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState("in"); // in | counting | out
  const [gone, setGone] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
  const [title, setTitle] = useState("TRUTHLENS");

  useEffect(() => {
    let sTimer;
    const scramble = () => { setTitle([..."TRUTHLENS"].map(c => Math.random() > .6 ? chars[Math.floor(Math.random() * chars.length)] : c).join("")); sTimer = setTimeout(scramble, 30); };
    scramble();
    // Count up — fast ~2-3s total duration
    const iv = setInterval(() => {
      setCount(p => {
        const next = Math.min(p + Math.floor(Math.random() * 3 + 2), 100);
        if (next >= 100) {
          clearInterval(iv); clearTimeout(sTimer); setTitle("TRUTHLENS");
          setTimeout(() => { setPhase("out"); setTimeout(() => { setGone(true); onDone(); }, 700); }, 200);
        }
        return next;
      });
    }, 35);
    return () => { clearInterval(iv); clearTimeout(sTimer); };
  }, []);

  if (gone) return null;

  const statusMsg = count < 20 ? "INITIALIZING NEURAL NETS..." : count < 40 ? "LOADING FACT DATABASES..." : count < 60 ? "CALIBRATING AI MODELS..." : count < 80 ? "SYNCING KNOWLEDGE GRAPH..." : count < 95 ? "VERIFYING DATA INTEGRITY..." : "SYSTEM READY";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, background: "#06060e", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden",
      clipPath: phase === "out" ? "inset(0 100% 0 0)" : "inset(0 0 0 0)",
      transition: phase === "out" ? "clip-path .7s cubic-bezier(0.76,0,0.24,1)" : "none",
    }}>
      {/* Grid overlay */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(181,123,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(181,123,255,.035) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      {/* Corner brackets */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ position: "absolute", ...(i === 0 ? { top: 32, left: 32 } : i === 1 ? { top: 32, right: 32 } : i === 2 ? { bottom: 32, left: 32 } : { bottom: 32, right: 32 }), width: 40, height: 40, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: 12, height: 2, background: "rgba(181,123,255,.4)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, width: 2, height: 12, background: "rgba(181,123,255,.4)" }} />
        </div>
      ))}
      {/* Background glow */}
      <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(181,123,255,.14) 0%,transparent 70%)", pointerEvents: "none" }} />
      {/* Ghost counter behind */}
      <div style={{ position: "absolute", right: 48, bottom: 48, fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(120px,22vw,260px)", letterSpacing: "-.04em", color: "rgba(181,123,255,.05)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>
        {String(count).padStart(3, "0")}
      </div>
      {/* Center content */}
      <div style={{ position: "relative", textAlign: "center", zIndex: 2 }}>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: ".5em", color: "rgba(181,123,255,.3)", textTransform: "uppercase", marginBottom: 16 }}>SYS://TRUTHLENS.AI</div>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(72px,16vw,188px)", letterSpacing: ".05em", color: "#ede8ff", lineHeight: .95, marginBottom: 16 }}>{title}</div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: ".38em", color: "rgba(181,123,255,.45)", textTransform: "uppercase", marginBottom: 32 }}>AI Misinformation Detection</div>
        {/* Progress */}
        <div style={{ width: 320, height: 2, background: "rgba(181,123,255,.1)", borderRadius: 2, margin: "0 auto", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${count}%`, background: "linear-gradient(to right,#b57bff,#6d28d9)", boxShadow: "0 0 16px rgba(181,123,255,.8)", borderRadius: 2, transition: "width .035s linear" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: 320, margin: "10px auto 0", fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: ".22em", color: "rgba(181,123,255,.35)" }}>
          <span style={{ textAlign: "left", maxWidth: 240, overflow: "hidden", whiteSpace: "nowrap" }}>{statusMsg}</span>
          <span>{String(count).padStart(3, "0")}%</span>
        </div>
      </div>
      {/* Side data readouts */}
      <div style={{ position: "absolute", left: 40, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 14, fontFamily: "'DM Mono',monospace", fontSize: 9, color: "rgba(181,123,255,.22)", letterSpacing: ".18em", lineHeight: 1.7 }}>
        {["NEURAL_DEPTH: 48L", "PARAMS: 175B", "CONTEXT: 128K", "LATENCY: 2.1s", "ACCURACY: 98.7%"].map(l => <div key={l}>{l}</div>)}
      </div>
      <div style={{ position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 14, fontFamily: "'DM Mono',monospace", fontSize: 9, color: "rgba(181,123,255,.22)", letterSpacing: ".18em", lineHeight: 1.7, textAlign: "right" }}>
        {["DB_STATUS: ONLINE", "CLAIMS: 140M+", "LANGS: 190+", "CACHE: WARM", "API: READY"].map(l => <div key={l}>{l}</div>)}
      </div>
      {/* Scan line */}
      <div style={{ position: "absolute", left: 0, right: 0, height: 1, background: "linear-gradient(to right,transparent,rgba(181,123,255,.4),transparent)", top: `${count}%`, transition: "top .035s linear", pointerEvents: "none" }} />
    </div>
  );
}
