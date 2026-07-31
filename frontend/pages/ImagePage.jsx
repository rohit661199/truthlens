import { useState, useRef } from "react";
import Ic from "../icons";
import { useReveal } from "../hooks/useReveal";
import Btn from "../components/Btn";
import Scanner from "../components/Scanner";

// ─── IMAGE PAGE ──────────────────────────────────────────────────────────────
export default function ImagePage({ t }) {
  const [img, setImg] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [prog, setProg] = useState(0);
  const fileRef = useRef(null);
  const [pRef, pVis] = useReveal(.04);

  const handleFile = e => { const f = e.target.files[0]; if (f) { setImg(URL.createObjectURL(f)); setResults(null); } };
  const analyze = () => {
    setAnalyzing(true); setResults(null); setProg(0); let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 9 + 2; setProg(Math.min(p, 95));
      if (p >= 95) { clearInterval(iv); setTimeout(() => { setProg(100); setResults(true); setAnalyzing(false); }, 500); }
    }, 110);
  };
  const inds = [{ l: "Pixel Authenticity", s: 72 }, { l: "Metadata Integrity", s: 85 }, { l: "AI Generation Prob.", s: 18 }, { l: "Clone Detection", s: 62 }, { l: "Lighting Consistency", s: 79 }];

  return (
    <div ref={pRef} style={{ paddingTop: 84, minHeight: "100vh", padding: "90px 60px 80px", position: "relative", zIndex: 1 }}>
      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(48px,7vw,80px)", letterSpacing: ".03em", color: t.text, lineHeight: .95, marginBottom: 10, transform: pVis ? "translateY(0)" : "translateY(40px)", opacity: pVis ? 1 : 0, transition: "all 1s .05s cubic-bezier(0.16,1,0.3,1)" }}>Image Verification</div>
      <p style={{ fontFamily: "'Space Grotesk',sans-serif", color: t.muted, fontSize: 15, marginBottom: 44, transform: pVis ? "translateY(0)" : "translateY(30px)", opacity: pVis ? 1 : 0, transition: "all 1s .12s cubic-bezier(0.16,1,0.3,1)" }}>Detect manipulation, AI generation, and metadata anomalies</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
        <div style={{ opacity: pVis ? 1 : 0, transform: pVis ? "translateX(0)" : "translateX(-30px)", transition: "all .9s .18s cubic-bezier(0.16,1,0.3,1)" }}>
          <div onClick={() => fileRef.current.click()} data-mag style={{ borderRadius: 16, border: `2px dashed ${img ? t.accent + "55" : t.border}`, minHeight: 280, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", background: img ? "transparent" : t.card, transition: "all .3s" }}>
            {img ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 14 }} />
              : <><div style={{ color: t.faint, marginBottom: 12 }}><Ic.Img s={44} /></div><p style={{ fontFamily: "'Space Grotesk',sans-serif", color: t.muted, fontSize: 14, fontWeight: 600 }}>Click to upload image</p><p style={{ fontFamily: "'DM Mono',monospace", color: t.faint, fontSize: 10, marginTop: 4, letterSpacing: ".12em" }}>JPG, PNG, WebP</p></>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
          {img && <Btn t={t} sz="md" icon={<Ic.Search s={15} />} onClick={analyze} style={{ width: "100%", justifyContent: "center", marginTop: 14 }}>{analyzing ? "Analyzing..." : "Verify Image"}</Btn>}
          {analyzing && <div style={{ marginTop: 14 }}><Scanner t={t} /><div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: t.muted, marginTop: 6, textAlign: "right", letterSpacing: ".1em" }}>{Math.round(prog)}%</div></div>}
        </div>
        <div style={{ opacity: pVis ? 1 : 0, transform: pVis ? "translateX(0)" : "translateX(30px)", transition: "all .9s .24s cubic-bezier(0.16,1,0.3,1)" }}>
          {results ? inds.map((ind, i) => {
            const c = ind.s >= 70 ? t.hi : ind.s >= 40 ? t.mid : t.lo;
            return (
              <div key={ind.l} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: t.text }}>{ind.l}</span><span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: c }}>{ind.s}%</span></div>
                <div style={{ height: 3, borderRadius: 2, background: t.border, overflow: "hidden" }}><div style={{ height: "100%", width: `${ind.s}%`, background: c, borderRadius: 2, transition: `width 1.3s ${i * .1}s ease` }} /></div>
              </div>
            );
          }) : (<div style={{ textAlign: "center", paddingTop: 80, color: t.faint }}><Ic.Img s={48} /><p style={{ marginTop: 14, fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, lineHeight: 1.7 }}>Upload and verify<br />an image to see results</p></div>)}
        </div>
      </div>
    </div>
  );
}
