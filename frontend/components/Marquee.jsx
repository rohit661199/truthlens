// ─── MARQUEE ─────────────────────────────────────────────────────────────────
export default function Marquee({ text, speed = 22, reverse = false, t }) {
  return (
    <div style={{ overflow: "hidden", borderTop: `1px solid ${t.line}`, borderBottom: `1px solid ${t.line}`, padding: "13px 0" }}>
      <div style={{ display: "flex", gap: 48, whiteSpace: "nowrap", animation: `mq${reverse ? "R" : ""} ${speed}s linear infinite` }}>
        {[...Array(14)].map((_, i) => (
          <span key={i} style={{ fontSize: 11, color: t.faint, letterSpacing: ".42em", textTransform: "uppercase", flexShrink: 0, fontFamily: "'DM Mono',monospace" }}>
            {text}&nbsp;<span style={{ color: t.accent, fontSize: 9 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
