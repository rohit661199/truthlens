import { useState } from "react";
import Ic from "../icons";
import ScrambleTxt from "./ScrambleTxt";

// ─── FULLSCREEN MENU ─────────────────────────────────────────────────────────
export default function FullMenu({ open, onClose, page, setPage, isDark, toggleTheme, t }) {
  const items = [
    { id: "landing", label: "HOME", num: "01" },
    { id: "factcheck", label: "TEXT CHECK", num: "02" },
    { id: "imagecheck", label: "IMAGE OCR", num: "03" },
    { id: "voicecheck", label: "VOICE CHECK", num: "04" },
    { id: "aidetect", label: "AI DETECT", num: "05" },
    { id: "history", label: "HISTORY", num: "06" },
  ];
  const [hovIdx, setHovIdx] = useState(null);
  const go = (id) => { onClose(); setTimeout(() => setPage(id), 420); };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 7000,
      background: t.menuBg,
      clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
      transition: "clip-path .85s cubic-bezier(0.76,0,0.24,1)",
      pointerEvents: open ? "all" : "none",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
      marginTop:"38px"
    }}>
      {/* Grain on menu */}
      <div style={{ position: "absolute", inset: 0, background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E\")", pointerEvents: "none", zIndex: 1 }} />
      {/* Accent glow blob */}
      <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle,${t.glow} 0%,transparent 70%)`, pointerEvents: "none" }} />
      {/* Top bar */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", height: 72, borderBottom: `1px solid ${t.line}` }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, letterSpacing: ".1em", color: t.text }}>
          TRUTH<span style={{ color: t.accent }}>LENS</span>
        </div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: t.faint, letterSpacing: ".3em" }}>NAVIGATION</div>
      </div>
      {/* Nav items */}
      <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 48px" }}>
        {items.map((it, i) => {
          const isHov = hovIdx === i;
          return (
            <div key={it.id}
              onMouseEnter={() => setHovIdx(i)}
              onMouseLeave={() => setHovIdx(null)}
              onClick={() => go(it.id)}
              data-mag
              style={{
                display: "flex", alignItems: "center", gap: 24,
                padding: "20px 0",
                borderBottom: `1px solid ${t.line}`,
                cursor: "pointer",
                transform: open ? `translateY(0)` : `translateY(${60 + i * 20}px)`,
                opacity: open ? 1 : 0,
                transition: `transform .9s ${.15 + i * .07}s cubic-bezier(0.16,1,0.3,1), opacity .7s ${.1 + i * .07}s`,
                overflow: "hidden",
              }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: t.faint, letterSpacing: ".12em", minWidth: 28 }}>{it.num}</span>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: "clamp(52px,8vw,96px)",
                  letterSpacing: ".03em",
                  color: page === it.id ? t.accent : isHov ? t.text : t.muted,
                  lineHeight: .95,
                  transform: isHov ? "translateX(16px)" : "translateX(0)",
                  transition: "color .3s, transform .5s cubic-bezier(0.16,1,0.3,1)",
                }}>
                  <ScrambleTxt text={it.label} active={isHov} />
                </div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: "50%", border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", transform: isHov ? "rotate(45deg) scale(1.15)" : "rotate(0) scale(1)", transition: "transform .4s cubic-bezier(0.16,1,0.3,1), color .3s", color: isHov ? t.accent : t.faint }}>
                <Ic.Arr s={14} />
              </div>
            </div>
          );
        })}
      </div>
      {/* Footer */}
      <div style={{
        position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 48px", borderTop: `1px solid ${t.line}`,
        transform: open ? "translateY(0)" : "translateY(30px)", opacity: open ? 1 : 0, transition: "transform .9s .5s cubic-bezier(0.16,1,0.3,1), opacity .7s .5s"
      }}>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: t.faint, letterSpacing: ".25em" }}>AI-POWERED MISINFORMATION DETECTION</div>
        <button onClick={toggleTheme} data-mag style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: `1px solid ${t.border}`, borderRadius: 8, padding: "7px 14px", cursor: "pointer", color: t.muted, fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: ".15em" }}>
          {isDark ? <Ic.Sun /> : <Ic.Moon />}{isDark ? "LIGHT" : "DARK"}
        </button>
      </div>
    </div>
  );
}
