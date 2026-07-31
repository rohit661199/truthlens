import { useState, useEffect } from "react";

// ─── TRUST GAUGE ─────────────────────────────────────────────────────────────
export default function TrustGauge({ score = 0, verdict = "", size = 220, t }) {
  const vLower = (verdict || "").toLowerCase();

  // Determine effective display score & color based on verdict
  let effectiveScore = score;
  let col = t.hi;
  let lbl = "VERIFIED TRUE";

  if (vLower === "false" || vLower === "ai-generated") {
    // If claim is False or Image is AI-Generated, Truth Score is low (0-15%)
    effectiveScore = vLower === "ai-generated" ? score : Math.max(0, 100 - score);
    col = t.lo; // Neon Red / Crimson
    lbl = vLower === "ai-generated" ? `AI-GENERATED (${score}%)` : "VERIFIED FALSE";
  } else if (vLower === "misleading") {
    effectiveScore = Math.min(score, 45);
    col = t.mid; // Amber
    lbl = "MISLEADING / EXAGGERATED";
  } else if (vLower === "unverified" || vLower === "uncertain") {
    effectiveScore = Math.min(score, 35);
    col = t.mid; // Amber
    lbl = "UNVERIFIED / NO EVIDENCE";
  } else if (vLower === "real photograph" || vLower === "true") {
    effectiveScore = score;
    col = t.hi; // Emerald Green
    lbl = vLower === "real photograph" ? `REAL PHOTO (${score}%)` : "VERIFIED TRUE";
  } else {
    col = score >= 70 ? t.hi : score >= 40 ? t.mid : t.lo;
    lbl = score >= 70 ? "HIGH CONFIDENCE" : score >= 40 ? "SUSPICIOUS" : "LOW CONFIDENCE";
  }

  const [disp, setDisp] = useState(0);
  useEffect(() => {
    let v = 0;
    const go = () => {
      v = Math.min(v + 3, effectiveScore);
      setDisp(Math.round(v));
      if (v < effectiveScore) requestAnimationFrame(go);
    };
    const id = setTimeout(() => requestAnimationFrame(go), 300);
    return () => clearTimeout(id);
  }, [effectiveScore]);

  const r = (size - 36) / 2, C = 2 * Math.PI * r;

  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id={`gaugeGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={col} stopOpacity="1" />
            <stop offset="100%" stopColor={col} stopOpacity="0.7" />
          </linearGradient>
          <filter id={`gaugeGlow-${size}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Arc */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={col + "15"} strokeWidth="12"
          strokeDasharray={`${C * .75} ${C}`} strokeLinecap="round"
          style={{ transform: "rotate(135deg)", transformOrigin: `${size / 2}px ${size / 2}px` }}
        />

        {/* Dynamic Score Arc */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={`url(#gaugeGrad-${size})`} strokeWidth="12"
          strokeDasharray={`${(disp / 100) * C * .75} ${C}`} strokeLinecap="round"
          filter={`url(#gaugeGlow-${size})`}
          style={{ transform: "rotate(135deg)", transformOrigin: `${size / 2}px ${size / 2}px`, transition: "stroke-dasharray .05s" }}
        />
      </svg>

      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: size * .28, color: col, lineHeight: 1, textShadow: `0 0 20px ${col}60` }}>
          {disp}<span style={{ fontSize: size * .14, opacity: 0.8 }}>%</span>
        </div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: t.muted, letterSpacing: ".18em", marginTop: 2 }}>
          TRUTH SCORE
        </div>
        <div style={{
          marginTop: 10, padding: "5px 14px", borderRadius: 20,
          background: col + "15", border: `1px solid ${col}45`,
          boxShadow: `0 0 16px ${col}25`,
          fontFamily: "'DM Mono',monospace", fontSize: 9, color: col, fontWeight: 700, letterSpacing: ".1em"
        }}>
          {lbl}
        </div>
      </div>
    </div>
  );
}


