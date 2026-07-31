import { useState, useEffect } from "react";

// ─── SCRAMBLE TEXT ───────────────────────────────────────────────────────────
export default function ScrambleTxt({ text, active }) {
  const [out, setOut] = useState(text);
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";
  useEffect(() => {
    if (!active) { setOut(text); return; }
    let frame = 0, raf;
    const tick = () => {
      setOut([...text].map((ch, i) => i < frame / 2 ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]).join(""));
      frame++;
      if (frame < text.length * 2 + 8) raf = requestAnimationFrame(tick); else setOut(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, text]);
  return <>{out}</>;
}
