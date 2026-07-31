import { useState } from "react";

// ─── CYBERPUNK HAMBURGER / EXIT BUTTON ───────────────────────────────────────
// Palette: off-white #f0ece4, purple #b57bff / #6d28d9, black #0a0a0a, beige #d4c9a8, white #ffffff

export default function Hamburger({ open, onToggle, t }) {
  const [hovered, setHovered] = useState(false);

  // Cyberpunk palette
  const CP = {
    purple: "#b57bff",
    deepPurple: "#6d28d9",
    black: "#0a0a0a",
    offWhite: "#f0ece4",
    beige: "#d4c9a8",
    white: "#ffffff",
  };

  const barColor = open ? CP.purple : hovered ? CP.offWhite : CP.beige;
  const borderClr = open ? CP.purple + "70" : hovered ? CP.purple + "50" : CP.beige + "30";
  const bgClr = open ? CP.purple + "12" : hovered ? CP.deepPurple + "18" : "transparent";
  const shadowClr = open
    ? `0 0 14px ${CP.purple}50, inset 0 0 12px ${CP.purple}15`
    : hovered
      ? `0 0 10px ${CP.purple}30`
      : "none";

  return (
    <>
      <style>{`
        @keyframes cpGlitch1 {
          0%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); }
          20% { clip-path: inset(20% 0 60% 0); transform: translate(-2px, 1px); }
          40% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
          60% { clip-path: inset(40% 0 30% 0); transform: translate(-1px, 0); }
          80% { clip-path: inset(10% 0 80% 0); transform: translate(1px, 1px); }
        }
        @keyframes cpScanline {
          0% { top: -2px; }
          100% { top: calc(100% + 2px); }
        }
        @keyframes cpCornerPulse {
          0%, 100% { opacity: .4; }
          50% { opacity: 1; }
        }
        @keyframes cpRotateIn {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(200deg) scale(.85); }
          100% { transform: rotate(180deg) scale(1); }
        }
        @keyframes cpExitFlicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: .3; }
          95% { opacity: 1; }
          96% { opacity: .5; }
          98% { opacity: 1; }
        }
      `}</style>

      <button
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-mag
        style={{
          position: "relative",
          width: 44, height: 44,
          flexShrink: 0,
          background: bgClr,
          border: `1px solid ${borderClr}`,
          borderRadius: 8,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          transition: "all .4s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: shadowClr,
          zIndex: 9000,
        }}
      >

        {/* Scanline overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden",
          opacity: hovered || open ? 1 : 0,
          transition: "opacity .3s",
        }}>
          <div style={{
            position: "absolute", left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg, transparent, ${CP.purple}40, transparent)`,
            animation: "cpScanline 1.2s linear infinite",
          }} />
        </div>

        {/* Corner accents */}
        {[
          { top: 2, left: 2, borderTop: `2px solid ${CP.purple}`, borderLeft: `2px solid ${CP.purple}` },
          { top: 2, right: 2, borderTop: `2px solid ${CP.purple}`, borderRight: `2px solid ${CP.purple}` },
          { bottom: 2, left: 2, borderBottom: `2px solid ${CP.purple}`, borderLeft: `2px solid ${CP.purple}` },
          { bottom: 2, right: 2, borderBottom: `2px solid ${CP.purple}`, borderRight: `2px solid ${CP.purple}` },
        ].map((s, i) => (
          <div key={i} style={{
            position: "absolute", width: 6, height: 6, pointerEvents: "none",
            ...s,
            opacity: open ? 1 : hovered ? .6 : 0,
            transition: "opacity .4s",
            animation: open ? `cpCornerPulse 1.5s ${i * .15}s ease-in-out infinite` : "none",
          }} />
        ))}

        {/* Glitch ghost layer (on hover/open) */}
        {(hovered || open) && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "cpGlitch1 .6s steps(1) infinite",
            opacity: .3, pointerEvents: "none",
            filter: `drop-shadow(2px 0 ${CP.purple}) drop-shadow(-2px 0 ${CP.deepPurple})`,
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "center" }}>
              {open ? (
                <>
                  <span style={{ width: 22, height: 2, borderRadius: 1, background: CP.purple, transform: "translateY(7px) rotate(45deg)" }} />
                  <span style={{ width: 22, height: 2, borderRadius: 1, background: CP.purple, opacity: 0 }} />
                  <span style={{ width: 22, height: 2, borderRadius: 1, background: CP.purple, transform: "translateY(-7px) rotate(-45deg)" }} />
                </>
              ) : (
                <>
                  <span style={{ width: 22, height: 2, borderRadius: 1, background: CP.beige }} />
                  <span style={{ width: 14, height: 2, borderRadius: 1, background: CP.beige }} />
                  <span style={{ width: 22, height: 2, borderRadius: 1, background: CP.beige }} />
                </>
              )}
            </div>
          </div>
        )}

        {/* Main bars */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
          position: "relative", zIndex: 2,
          animation: open ? "cpExitFlicker 2s steps(1) infinite" : "none",
        }}>
          {/* Top bar */}
          <span style={{
            width: open ? 24 : 22, height: 2, borderRadius: 1,
            background: barColor,
            transform: open
              ? "translateY(7px) rotate(45deg)"
              : hovered
                ? "translateX(3px)"
                : "none",
            transition: "transform .5s cubic-bezier(0.16, 1, 0.3, 1), background .3s, width .3s",
            boxShadow: open ? `0 0 8px ${CP.purple}80` : "none",
          }} />

          {/* Middle bar */}
          <span style={{
            width: open ? 0 : hovered ? 10 : 14,
            height: 2, borderRadius: 1,
            background: barColor,
            opacity: open ? 0 : 1,
            transform: open ? "scaleX(0) rotate(90deg)" : "scaleX(1)",
            transition: "all .4s cubic-bezier(0.16, 1, 0.3, 1)",
          }} />

          {/* Bottom bar */}
          <span style={{
            width: open ? 24 : 22, height: 2, borderRadius: 1,
            background: barColor,
            transform: open
              ? "translateY(-7px) rotate(-45deg)"
              : hovered
                ? "translateX(-3px)"
                : "none",
            transition: "transform .5s cubic-bezier(0.16, 1, 0.3, 1), background .3s, width .3s",
            boxShadow: open ? `0 0 8px ${CP.purple}80` : "none",
          }} />
        </div>

        {/* EXIT label when open */}
        <span style={{
          position: "absolute",
          bottom: open ? 3 : -10,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "'DM Mono', monospace",
          fontSize: 6,
          fontWeight: 600,
          letterSpacing: ".25em",
          color: CP.purple,
          opacity: open ? .8 : 0,
          transition: "all .4s .1s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: "none",
          textShadow: `0 0 6px ${CP.purple}60`,
          animation: open ? "cpExitFlicker 3s steps(1) infinite" : "none",
        }}>
          EXIT
        </span>
      </button>
    </>
  );
}
