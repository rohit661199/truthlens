import { useState, useEffect } from "react";

// ─── SCROLL PROGRESS ──────────────────────────────────────────────────────────
export default function ScrollProg({ t }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const f = () => setP(window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return <div style={{ position: "fixed", top: 0, left: 0, width: `${p * 100}%`, height: 2, background: `linear-gradient(to right,${t.accent},#7c3aed)`, zIndex: 9997, transition: "width .06s", boxShadow: `0 0 12px ${t.glow}` }} />;
}
