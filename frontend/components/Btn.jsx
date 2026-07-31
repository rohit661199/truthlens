import { useState } from "react";

// ─── BUTTON ──────────────────────────────────────────────────────────────────
export default function Btn({ children, onClick, v = "primary", sz = "md", t, icon, style = {}, disabled }) {
  const [hov, setHov] = useState(false);
  const sz2 = { sm: { p: "8px 20px", fs: 12 }, md: { p: "12px 28px", fs: 14 }, lg: { p: "16px 38px", fs: 15 } }[sz];
  const isPrim = v === "primary";
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={disabled ? undefined : onClick}
      data-mag
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        borderRadius: 10,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        border: "none",
        fontFamily: "'Space Grotesk',sans-serif",
        letterSpacing: ".04em",
        transition: "all .3s cubic-bezier(0.16,1,0.3,1)",
        opacity: disabled ? .45 : 1,
        padding: sz2.p,
        fontSize: sz2.fs,
        position: "relative",
        overflow: "hidden",
        ...(isPrim
          ? {
              background: hov
                ? `linear-gradient(135deg, #d8b4fe 0%, #a855f7 50%, #6b21a8 100%)`
                : `linear-gradient(135deg, ${t.accent} 0%, #7c3aed 100%)`,
              color: "#ffffff",
              boxShadow: hov
                ? `0 10px 36px ${t.glow}, 0 0 20px rgba(181,123,255,0.4)`
                : `0 4px 20px ${t.glow}`,
              transform: hov ? "translateY(-2px) scale(1.01)" : "translateY(0) scale(1)",
            }
          : {
              background: hov ? `${t.accent}14` : t.card,
              color: hov ? t.text : t.muted,
              border: hov ? `1px solid ${t.accent}60` : `1px solid ${t.border}`,
              backdropFilter: "blur(12px)",
              transform: hov ? "translateY(-2px)" : "translateY(0)",
              boxShadow: hov ? `0 6px 20px rgba(0,0,0,0.2)` : "none",
            }),
        ...style,
      }}
    >
      {icon && <span style={{ transition: "transform .3s", transform: hov ? "scale(1.15)" : "scale(1)" }}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

