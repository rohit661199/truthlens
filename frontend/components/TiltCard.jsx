import { useRef, useEffect } from "react";
import { lerp } from "../constants";

// ─── TILT CARD ───────────────────────────────────────────────────────────────
export default function TiltCard({ children, t, style = {}, glow = false }) {
  const ref = useRef(null); const cur = useRef({ rx: 0, ry: 0 }); const tgt = useRef({ rx: 0, ry: 0 }); const raf = useRef(null);
  const onMove = e => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    tgt.current = { rx: ((e.clientY - r.top) / r.height - .5) * -12, ry: ((e.clientX - r.left) / r.width - .5) * 12 };
  };
  const onLeave = () => { tgt.current = { rx: 0, ry: 0 }; };

  useEffect(() => {
    const tick = () => {
      cur.current.rx = lerp(cur.current.rx, tgt.current.rx, .1);
      cur.current.ry = lerp(cur.current.ry, tgt.current.ry, .1);
      if (ref.current) ref.current.style.transform = `perspective(1000px) rotateX(${cur.current.rx}deg) rotateY(${cur.current.ry}deg)`;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-mag
      style={{
        background: t.card,
        border: `1px solid ${glow ? t.accent + "40" : t.border}`,
        borderRadius: 16,
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        boxShadow: glow
          ? `0 0 50px ${t.glow}, 0 12px 48px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.1)`
          : `0 8px 32px rgba(0,0,0,.15), inset 0 1px 0 rgba(255,255,255,.05)`,
        willChange: "transform",
        transformStyle: "preserve-3d",
        transition: "border-color .3s, box-shadow .3s",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

