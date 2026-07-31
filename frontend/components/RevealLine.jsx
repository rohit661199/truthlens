// ─── REVEAL LINE ─────────────────────────────────────────────────────────────
export default function RevealLine({ children, inView, delay = 0, style = {} }) {
  return (
    <div style={{ overflow: "hidden" }}>
      <div style={{ transform: inView ? "translateY(0)" : "translateY(110%)", opacity: inView ? 1 : 0, transition: `transform 1.1s ${delay}s cubic-bezier(0.16,1,0.3,1), opacity .5s ${delay}s`, ...style }}>
        {children}
      </div>
    </div>
  );
}
