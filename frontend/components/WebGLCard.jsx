import { useRef, useEffect } from "react";
import { VERT, FRAG, lerp } from "../constants";

// ─── WEBGL CARD ──────────────────────────────────────────────────────────────
export default function WebGLCard({ t, isDark }) {
  const canvasRef = useRef(null); const hoverRef = useRef(0); const mouseRef = useRef({ x: .5, y: .5 }); const timeRef = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current; const gl = canvas.getContext("webgl"); if (!gl) return;
    const cmp = (type, src) => { const sh = gl.createShader(type); gl.shaderSource(sh, src); gl.compileShader(sh); return sh; };
    const prog = gl.createProgram(); gl.attachShader(prog, cmp(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, cmp(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(prog); gl.useProgram(prog);
    const S = 32, verts = [], uvs = [], idx = [];
    for (let y = 0; y <= S; y++) for (let x = 0; x <= S; x++) { verts.push((x / S) * 2 - 1, (y / S) * 2 - 1, 0); uvs.push(x / S, y / S); }
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { const a = y * (S + 1) + x, b = a + 1, c = a + (S + 1), d = c + 1; idx.push(a, b, c, b, d, c); }
    const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    const ap = gl.getAttribLocation(prog, "position"); gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 3, gl.FLOAT, false, 0, 0);
    const ub = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, ub); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
    const au = gl.getAttribLocation(prog, "uv"); gl.enableVertexAttribArray(au); gl.vertexAttribPointer(au, 2, gl.FLOAT, false, 0, 0);
    const ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
    const tw = 512, th = 512, cv = document.createElement("canvas"); cv.width = tw; cv.height = th; const cx = cv.getContext("2d");
    const g = cx.createLinearGradient(0, 0, tw, th);
    isDark ? (g.addColorStop(0, "#0d0820"), g.addColorStop(.5, "#1e0a40"), g.addColorStop(1, "#0a0520")) : (g.addColorStop(0, "#ede8f8"), g.addColorStop(.5, "#ddd0f8"), g.addColorStop(1, "#e8e0ff"));
    cx.fillStyle = g; cx.fillRect(0, 0, tw, th);
    cx.strokeStyle = isDark ? "rgba(181,123,255,.07)" : "rgba(109,40,217,.06)"; cx.lineWidth = 1;
    for (let i = 0; i < tw; i += 24) { cx.beginPath(); cx.moveTo(i, 0); cx.lineTo(i, th); cx.stroke(); }
    for (let i = 0; i < th; i += 24) { cx.beginPath(); cx.moveTo(0, i); cx.lineTo(tw, i); cx.stroke(); }
    const rg = cx.createRadialGradient(256, 200, 0, 256, 200, 220); rg.addColorStop(0, isDark ? "rgba(181,123,255,.18)" : "rgba(109,40,217,.12)"); rg.addColorStop(1, "transparent"); cx.fillStyle = rg; cx.fillRect(0, 0, tw, th);
    cx.fillStyle = isDark ? "rgba(181,123,255,.055)" : "rgba(109,40,217,.05)"; cx.font = "900 78px 'Bebas Neue',serif"; cx.textAlign = "center"; cx.textBaseline = "middle"; cx.fillText("TruthLens", 256, 256);
    const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cv); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(gl.getUniformLocation(prog, "uTex"), 0); gl.uniform1f(gl.getUniformLocation(prog, "uAlpha"), 1);
    const id = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; gl.uniformMatrix4fv(gl.getUniformLocation(prog, "projectionMatrix"), false, id); gl.uniformMatrix4fv(gl.getUniformLocation(prog, "modelViewMatrix"), false, id);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const uT = gl.getUniformLocation(prog, "uTime"), uH = gl.getUniformLocation(prog, "uHover"), uM = gl.getUniformLocation(prog, "uMouse");
    let raf;
    const draw = () => { timeRef.current += .013; hoverRef.current = lerp(hoverRef.current, hoverRef._t || 0, .065); gl.viewport(0, 0, canvas.width, canvas.height); gl.clear(gl.COLOR_BUFFER_BIT); gl.uniform1f(uT, timeRef.current); gl.uniform1f(uH, hoverRef.current); gl.uniform2f(uM, mouseRef.current.x, mouseRef.current.y); gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0); raf = requestAnimationFrame(draw); };
    draw(); return () => cancelAnimationFrame(raf);
  }, [isDark]);
  return <canvas ref={canvasRef} width={700} height={360}
    onMouseEnter={() => hoverRef._t = 1} onMouseLeave={() => hoverRef._t = 0}
    onMouseMove={e => { const r = canvasRef.current.getBoundingClientRect(); mouseRef.current = { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height }; hoverRef._t = 1; }}
    style={{ width: "100%", maxWidth: 700, height: 360, borderRadius: 18, border: "1px solid rgba(181,123,255,.18)", boxShadow: "0 0 80px rgba(181,123,255,.12)", cursor: "none", display: "block", margin: "0 auto" }} />;
}
