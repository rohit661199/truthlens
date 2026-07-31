// ─── SPLIT CHAR REVEAL ───────────────────────────────────────────────────────
export default function SplitReveal({ text, inView, delay = 0, style = {}, tag = "div" }) {
  const Tag = tag;
  return (
    <Tag style={{ display: "flex", flexWrap: "wrap", overflow: "hidden", ...style }}>
      {[...text].map((ch, i) => (
        <span key={i} style={{
          display: "inline-block",
          transform: inView ? "translateY(0) skewY(0)" : "translateY(115%) skewY(3deg)",
          opacity: inView ? 1 : 0,
          transition: `transform 1.15s ${(delay + i * 0.038).toFixed(3)}s cubic-bezier(0.16,1,0.3,1), opacity .4s ${(delay + i * 0.038).toFixed(3)}s`,
          whiteSpace: ch === " " ? "pre" : "normal",
          transformOrigin: "bottom left",
        }}>{ch === " " ? "\u00A0" : ch}</span>
      ))}
    </Tag>
  );
}
