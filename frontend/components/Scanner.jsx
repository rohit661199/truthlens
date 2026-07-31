// ─── SCANNER BAR ─────────────────────────────────────────────────────────────
export default function Scanner({ t }) {
  return (
    <div style={{ height: 4, borderRadius: 4, background: t.border, overflow: "hidden", position: "relative", boxShadow: `0 0 10px ${t.glow}` }}>
      <div style={{
        position: "absolute", top: 0, left: "-40%", width: "40%", height: "100%",
        background: `linear-gradient(to right, transparent, ${t.accent}, #e9d5ff, ${t.accent}, transparent)`,
        boxShadow: `0 0 16px ${t.accent}, 0 0 8px #fff`,
        animation: "scanMove 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        borderRadius: 4
      }} />
    </div>
  );
}

