import { useRef, useEffect } from "react";
import { lerp } from "../constants";

// ─── MAGNETIC CURSOR ──────────────────────────────────────────────────────────
export default function MagCursor({ t }) {
  const dot = useRef(null); const ring = useRef(null);
  const pos = useRef({ x: -300, y: -300 }); const rpos = useRef({ x: -300, y: -300 });
  const hov = useRef(false); const cl = useRef(false);
  useEffect(() => {
    const onM = e => { pos.current = { x: e.clientX, y: e.clientY }; };
    const onO = e => { hov.current = !!e.target.closest("[data-mag]"); };
    const onD = () => cl.current = true; const onU = () => cl.current = false;
    window.addEventListener("mousemove", onM); window.addEventListener("mouseover", onO);
    window.addEventListener("mousedown", onD); window.addEventListener("mouseup", onU);
    let raf;
    const tick = () => {
      rpos.current.x = lerp(rpos.current.x, pos.current.x, .07);
      rpos.current.y = lerp(rpos.current.y, pos.current.y, .07);
      const sc = hov.current ? 2.8 : cl.current ? .5 : 1;
      if (dot.current) dot.current.style.transform = `translate(${pos.current.x - 5}px,${pos.current.y - 5}px) scale(${cl.current ? .4 : 1})`;
      if (ring.current) {
        ring.current.style.transform = `translate(${rpos.current.x - 22}px,${rpos.current.y - 22}px) scale(${sc})`;
        ring.current.style.opacity = hov.current ? ".9" : ".35";
        ring.current.style.borderColor = hov.current ? t.accent : `rgba(181,123,255,.6)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onM); window.removeEventListener("mouseover", onO); window.removeEventListener("mousedown", onD); window.removeEventListener("mouseup", onU); };
  }, [t]);
  return <>
    <div ref={dot} style={{ position: "fixed", top: 0, left: 0, zIndex: 10002, width: 10, height: 10, borderRadius: "50%", background: t.accent, pointerEvents: "none", willChange: "transform", boxShadow: `0 0 14px ${t.glow}` }} />
    <div ref={ring} style={{ position: "fixed", top: 0, left: 0, zIndex: 10001, width: 44, height: 44, borderRadius: "50%", border: "1.5px solid rgba(181,123,255,.6)", pointerEvents: "none", willChange: "transform", transition: "opacity .3s, border-color .3s", mixBlendMode: "difference" }} />
  </>;
}
