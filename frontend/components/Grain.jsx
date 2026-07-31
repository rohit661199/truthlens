import { useRef, useEffect } from "react";

// ─── GRAIN OVERLAY ─────────────────────────────────────────────────────────────
export default function Grain() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let timer;
    const draw = () => {
      c.width = window.innerWidth; c.height = window.innerHeight;
      const d = ctx.createImageData(c.width, c.height);
      for (let i = 0; i < d.data.length; i += 4) {
        const v = Math.random() * 255 | 0;
        d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 16;
      }
      ctx.putImageData(d, 0, 0);
      timer = setTimeout(() => requestAnimationFrame(draw), 70);
    };
    draw();
    return () => clearTimeout(timer);
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 9998, pointerEvents: "none" }} />;
}
