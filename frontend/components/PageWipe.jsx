// ─── PAGE WIPE ───────────────────────────────────────────────────────────────
export default function PageWipe({ active, t }) {
  return <div style={{ position: "fixed", inset: 0, zIndex: 8500, background: t.bg, pointerEvents: active ? "all" : "none", clipPath: active ? "inset(0 0 0% 0)" : "inset(100% 0 0% 0)", transition: "clip-path .75s cubic-bezier(0.76,0,0.24,1)" }} />;
}
