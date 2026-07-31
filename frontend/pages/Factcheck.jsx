import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import Ic from "../icons";
import { useReveal } from "../hooks/useReveal";
import TiltCard from "../components/TiltCard";
import Btn from "../components/Btn";
import TrustGauge from "../components/TrustGauge";
import Scanner from "../components/Scanner";
import { serverUrl, backendUrl } from "../src/config";

const API = serverUrl; // e.g. http://localhost:8000
const BACKEND = backendUrl; // e.g. http://localhost:4000

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const verdictColor = (v, t) => {
  const vl = (v || "").toLowerCase();
  if (vl === "true") return t.hi;
  if (vl === "false") return t.lo;
  if (vl === "misleading") return t.mid;
  return t.muted; // unverified
};

const verdictBg = (v, t) => verdictColor(v, t) + "15";
const verdictBorder = (v, t) => verdictColor(v, t) + "35";

const LANGUAGES = [
  { code: "auto", label: "Auto-detect" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "hi", label: "हिन्दी" },
  { code: "pt", label: "Português" },
  { code: "ru", label: "Русский" },
  { code: "it", label: "Italiano" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "zh", label: "中文" },
  { code: "ar", label: "العربية" },
  { code: "tr", label: "Türkçe" },
  { code: "nl", label: "Nederlands" },
  { code: "pl", label: "Polski" },
  { code: "sv", label: "Svenska" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "bn", label: "বাংলা" },
  { code: "ur", label: "اردو" },
];

// ─── FACT CHECK PAGE ─────────────────────────────────────────────────────────
export default function Factcheck({ t }) {
  const [tab, setTab] = useState("text"); // "text" | "image"

  // Text claim state
  const [claim, setClaim] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Image state
  const [img, setImg] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [imgAnalyzing, setImgAnalyzing] = useState(false);
  const [imgResult, setImgResult] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [imgError, setImgError] = useState(null);
  const fileRef = useRef(null);

  // Voice state
  const [recording, setRecording] = useState(false);
  const [voiceAnalyzing, setVoiceAnalyzing] = useState(false);
  const [voiceResult, setVoiceResult] = useState(null);
  const [voiceError, setVoiceError] = useState(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [audioResponse, setAudioResponse] = useState(null);   // base64 mp3
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [voiceLang, setVoiceLang] = useState("auto");          // selected language
  const [detectedLang, setDetectedLang] = useState("");        // language Whisper detected
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const timerRef = useRef(null);
  const audioBlobUrl = useRef(null);                            // for reliable replay

  // AI Detect state
  const [aiImg, setAiImg] = useState(null);
  const [aiImgFile, setAiImgFile] = useState(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState(null);
  const aiFileRef = useRef(null);

  const [rRef, rVis] = useReveal(0.04);

  // ── Async-safe history save (never blocks main flow) ──
  const saveToHistory = (entry) => {
    axios.post(`${BACKEND}/api/history/save`, entry).catch(() => {});
  };

  // ── Text fact-check ──
  const runTextCheck = async () => {
    if (!claim.trim()) return;
    setAnalyzing(true); setResult(null); setError(null);
    try {
      const { data } = await axios.post(`${API}/fact-check`, { claim: claim.trim() });
      setResult(data);
      saveToHistory({
        input_type: "text",
        original_input: claim.trim(),
        verdict: data.verdict,
        confidence: data.confidence,
        explanation: data.explanation,
        sources: data.sources || [],
      });
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Something went wrong");
    } finally {
      setAnalyzing(false);
    }
  };

  // ── Image OCR ──
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) { setImg(URL.createObjectURL(f)); setImgFile(f); setImgResult(null); setExtractedText(""); setImgError(null); }
  };

  const runImageCheck = async () => {
    if (!imgFile) return;
    setImgAnalyzing(true); setImgResult(null); setExtractedText(""); setImgError(null);
    try {
      const fd = new FormData();
      fd.append("file", imgFile);
      const { data } = await axios.post(`${API}/ocr`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setExtractedText(data.extracted_text || "");
      setImgResult(data.result);
      saveToHistory({
        input_type: "image",
        original_input: data.extracted_text || "[Image uploaded]",
        verdict: data.result.verdict,
        confidence: data.result.confidence,
        explanation: data.result.explanation,
        sources: data.result.sources || [],
      });
    } catch (err) {
      setImgError(err.response?.data?.detail || err.message || "Something went wrong");
    } finally {
      setImgAnalyzing(false);
    }
  };

  // ── Voice helpers ──
  const getSupportedMime = () => {
    const types = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"];
    for (const t of types) { if (MediaRecorder.isTypeSupported(t)) return t; }
    return "";
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = getSupportedMime();
      const opts = mime ? { mimeType: mime } : {};
      const mr = new MediaRecorder(stream, opts);
      audioChunks.current = [];

      mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunks.current.push(e.data); };
      mr.onstop = () => { stream.getTracks().forEach(t => t.stop()); };

      mr.start(250); // timeslice for reliable data
      mediaRecorder.current = mr;
      setRecording(true);
      setVoiceDuration(0);
      setVoiceResult(null); setVoiceError(null); setTranscribedText(""); setAudioResponse(null);
      setDetectedLang("");
      if (audioBlobUrl.current) { URL.revokeObjectURL(audioBlobUrl.current); audioBlobUrl.current = null; }

      timerRef.current = setInterval(() => setVoiceDuration(d => d + 1), 1000);
    } catch (err) {
      setVoiceError("Microphone access denied. Please allow mic access.");
    }
  }, []);

  const stopAndSend = useCallback(() => {
    if (!mediaRecorder.current || mediaRecorder.current.state === "inactive") return;
    clearInterval(timerRef.current);

    // Wrap in a promise so we wait for onstop to fire before reading chunks
    const mr = mediaRecorder.current;
    const prevOnStop = mr.onstop;

    mr.onstop = async (e) => {
      if (prevOnStop) prevOnStop(e);

      const mime = mr.mimeType || "audio/webm";
      const blob = new Blob(audioChunks.current, { type: mime });
      audioChunks.current = [];
      setRecording(false);

      if (blob.size < 100) {
        setVoiceError("Recording too short. Please try again.");
        return;
      }

      // Send to backend
      setVoiceAnalyzing(true);
      try {
        const ext = mime.includes("webm") ? ".webm" : mime.includes("ogg") ? ".ogg" : mime.includes("mp4") ? ".mp4" : ".webm";
        const fd = new FormData();
        fd.append("file", blob, `recording${ext}`);
        fd.append("language", voiceLang);
        const { data } = await axios.post(`${API}/voice-check`, fd, { timeout: 120000 });
        setTranscribedText(data.transcribed_text || "");
        setVoiceResult(data.result);
        setAudioResponse(data.audio_response || null);
        setDetectedLang(data.detected_language || "");
        saveToHistory({
          input_type: "voice",
          original_input: data.transcribed_text || "[Voice recording]",
          verdict: data.result.verdict,
          confidence: data.result.confidence,
          explanation: data.result.explanation,
          sources: data.result.sources || [],
        });

        // Build a Blob URL for reliable replay (data URIs can fail on large audio)
        if (data.audio_response) {
          const raw = atob(data.audio_response);
          const bytes = new Uint8Array(raw.length);
          for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
          const mp3Blob = new Blob([bytes], { type: "audio/mpeg" });
          if (audioBlobUrl.current) URL.revokeObjectURL(audioBlobUrl.current);
          audioBlobUrl.current = URL.createObjectURL(mp3Blob);

          // Auto-play the TTS response
          const audio = new Audio(audioBlobUrl.current);
          audio.play().catch(() => {});
        }
      } catch (err) {
        setVoiceError(err.response?.data?.detail || err.message || "Voice check failed");
      } finally {
        setVoiceAnalyzing(false);
      }
    };

    mr.stop();
  }, []);

  // Cleanup timer & blob URL on unmount
  useEffect(() => () => {
    clearInterval(timerRef.current);
    if (audioBlobUrl.current) URL.revokeObjectURL(audioBlobUrl.current);
  }, []);

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ── AI Image Detect ──
  const handleAiFile = (e) => {
    const f = e.target.files[0];
    if (f) { setAiImg(URL.createObjectURL(f)); setAiImgFile(f); setAiResult(null); setAiError(null); }
  };

  const runAiDetect = async () => {
    if (!aiImgFile) return;
    setAiAnalyzing(true); setAiResult(null); setAiError(null);
    try {
      const fd = new FormData();
      fd.append("file", aiImgFile);
      const { data } = await axios.post(`${API}/detect-ai-image`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });
      setAiResult(data);
      saveToHistory({
        input_type: "ai_image",
        original_input: "[Image uploaded for AI detection]",
        verdict: data.verdict,
        confidence: data.confidence_percentage,
        explanation: data.detailed_reasoning,
        visual_inconsistencies: data.visual_inconsistencies || [],
        ai_generation_indicators: data.ai_generation_indicators || [],
      });
    } catch (err) {
      setAiError(err.response?.data?.detail || err.message || "AI detection failed");
    } finally {
      setAiAnalyzing(false);
    }
  };

  const activeResult = tab === "text" ? result : tab === "image" ? imgResult : tab === "voice" ? voiceResult : aiResult;
  const isLoading = tab === "text" ? analyzing : tab === "image" ? imgAnalyzing : tab === "voice" ? voiceAnalyzing : aiAnalyzing;
  const activeError = tab === "text" ? error : tab === "image" ? imgError : tab === "voice" ? voiceError : aiError;

  const steps = ["Searching evidence", "Cross-referencing", "AI verification", "Building verdict"];

  // ── PDF Report Generator ──
  const downloadReport = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pw = 210, margin = 20, cw = pw - margin * 2;
    let y = margin;
    const now = new Date();
    const timestamp = now.toLocaleString("en-US", { dateStyle: "full", timeStyle: "medium" });
    const inputType = tab === "text" ? "Text Claim" : tab === "image" ? "Image OCR" : tab === "voice" ? "Voice" : "AI Image Detection";
    const isAi = tab === "ai";
    const res = isAi ? aiResult : activeResult;
    if (!res) return;

    // Helpers
    const addLine = (x1, x2) => { doc.setDrawColor(180); doc.setLineWidth(0.3); doc.line(x1, y, x2, y); y += 4; };
    const heading = (text) => {
      if (y > 265) { doc.addPage(); y = margin; }
      doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(40, 40, 40);
      doc.text(text, margin, y); y += 6;
      addLine(margin, pw - margin);
    };
    const body = (text) => {
      doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(60, 60, 60);
      const lines = doc.splitTextToSize(String(text || ""), cw);
      lines.forEach(ln => { if (y > 280) { doc.addPage(); y = margin; } doc.text(ln, margin, y); y += 5; });
      y += 2;
    };
    const bullet = (text) => {
      doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(60, 60, 60);
      const lines = doc.splitTextToSize(String(text || ""), cw - 6);
      lines.forEach((ln, idx) => {
        if (y > 280) { doc.addPage(); y = margin; }
        doc.text(idx === 0 ? `  - ${ln}` : `    ${ln}`, margin, y); y += 5;
      });
    };

    // ─ Title ─
    doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.setTextColor(109, 40, 217);
    doc.text("TruthLens AI Verification Report", pw / 2, y, { align: "center" }); y += 10;
    addLine(margin, pw - margin); y += 2;

    // ─ Metadata ─
    heading("REPORT METADATA");
    body(`Date and Time: ${timestamp}`);
    body(`Input Type: ${inputType}`); y += 2;

    // ─ User Input ─
    heading("USER INPUT");
    const userInput = tab === "text" ? claim
      : tab === "image" ? (extractedText || "[Image uploaded for OCR]")
      : tab === "voice" ? (transcribedText || "[Voice recording]")
      : "[Image uploaded for AI detection]";
    body(userInput); y += 2;

    // ─ Verdict ─
    heading("FINAL VERDICT");
    const verdict = isAi ? res.verdict : res.verdict;
    doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(109, 40, 217);
    doc.text(String(verdict || "N/A").toUpperCase(), margin, y); y += 8;

    // ─ Confidence ─
    heading("CONFIDENCE SCORE");
    const confidence = isAi ? res.confidence_percentage : res.confidence;
    body(`${confidence ?? "N/A"}%`); y += 2;

    // ─ Analysis ─
    heading("DETAILED ANALYSIS");
    const analysis = isAi ? res.detailed_reasoning : res.explanation;
    body(analysis || "No detailed analysis available."); y += 2;

    // ─ Visual Inconsistencies ─
    heading("VISUAL INCONSISTENCIES");
    if (isAi && res.visual_inconsistencies && res.visual_inconsistencies.length > 0) {
      res.visual_inconsistencies.forEach(item => bullet(item));
    } else {
      body("No significant inconsistencies detected.");
    }
    y += 2;

    // ─ AI Generation Indicators ─
    heading("AI GENERATION INDICATORS");
    if (isAi && res.ai_generation_indicators && res.ai_generation_indicators.length > 0) {
      res.ai_generation_indicators.forEach(item => bullet(item));
    } else {
      body("No AI generation artifacts detected.");
    }
    y += 2;

    // ─ Sources ─
    heading("SOURCES");
    if (!isAi && res.sources && res.sources.length > 0) {
      res.sources.forEach(src => bullet(src));
    } else {
      body("No external sources available.");
    }
    y += 2;

    // ─ Conclusion ─
    heading("CONCLUSION");
    const vStr = String(verdict || "Uncertain");
    const cStr = String(confidence ?? "N/A");
    body(
      `Based on the TruthLens AI verification analysis, the submitted content has been assessed as "${vStr}" with a confidence score of ${cStr}%. ` +
      `This report was generated automatically using forensic AI analysis and cross-referenced evidence. ` +
      `It is intended for informational purposes and should be considered alongside other verification methods.`
    );
    y += 6;

    // ─ Footer ─
    addLine(margin, pw - margin);
    doc.setFont("helvetica", "italic"); doc.setFontSize(8); doc.setTextColor(140, 140, 140);
    doc.text("Generated by TruthLens AI  |  Automated Forensic Verification Platform", pw / 2, y + 2, { align: "center" });

    doc.save(`TruthLens_Report_${now.toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div style={{ paddingTop: 84, minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", position: "relative", zIndex: 1 }}>

      {/* ───── LEFT: INPUT PANEL ───── */}
      <div style={{ borderRight: `1px solid ${t.line}`, padding: "52px 48px", overflowY: "auto", maxHeight: "calc(100vh - 68px)" }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 48, letterSpacing: ".03em", color: t.text, lineHeight: .95, marginBottom: 8 }}>
          Fact<br />Checker
        </div>
        <p style={{ fontFamily: "'Space Grotesk',sans-serif", color: t.muted, fontSize: 14, marginBottom: 28 }}>
          Verify claims with AI-powered evidence analysis
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
          {[{ id: "text", label: "Text Claim", icon: <Ic.Search s={14} /> }, { id: "image", label: "Image OCR", icon: <Ic.Img s={14} /> }, { id: "voice", label: "Voice", icon: <Ic.Mic s={14} /> }, { id: "ai", label: "AI Detect", icon: <Ic.Eye s={14} /> }].map(tb => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              data-mag
              style={{
                display: "flex", alignItems: "center", gap: 7, padding: "9px 20px", borderRadius: 8,
                border: `1px solid ${tab === tb.id ? t.accent + "50" : t.border}`,
                background: tab === tb.id ? t.accent + "12" : "transparent",
                color: tab === tb.id ? t.accent : t.muted,
                fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 600,
                cursor: "pointer", transition: "all .25s", letterSpacing: ".03em",
              }}
            >
              {tb.icon}{tb.label}
            </button>
          ))}
        </div>

        {/* ── TEXT TAB ── */}
        {tab === "text" && (
          <>
            <textarea
              value={claim} onChange={e => setClaim(e.target.value)}
              placeholder={'Enter a claim to fact-check...\n\nExample: "The Great Wall of China is visible from space."'}
              style={{
                width: "100%", height: 200, background: t.input, border: `1px solid ${t.border}`,
                borderRadius: 12, padding: "16px 18px", color: t.text, fontSize: 14, lineHeight: 1.7,
                resize: "vertical", outline: "none", fontFamily: "'Space Grotesk',sans-serif",
                boxSizing: "border-box", transition: "border-color .25s",
              }}
              onFocus={e => (e.target.style.borderColor = t.accent)}
              onBlur={e => (e.target.style.borderColor = t.border)}
            />
            <Btn t={t} sz="lg" onClick={runTextCheck} disabled={!claim.trim() || analyzing}
              style={{ width: "100%", justifyContent: "center", marginTop: 14 }}
              icon={<Ic.Search s={16} />}
            >
              {analyzing ? "Checking…" : "Verify Claim"}
            </Btn>
          </>
        )}

        {/* ── IMAGE TAB ── */}
        {tab === "image" && (
          <>
            <div
              onClick={() => fileRef.current.click()} data-mag
              style={{
                borderRadius: 16, border: `2px dashed ${img ? t.accent + "55" : t.border}`,
                minHeight: 220, display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", cursor: "pointer", overflow: "hidden",
                background: img ? "transparent" : t.card, transition: "all .3s",
              }}
            >
              {img
                ? <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 14 }} />
                : (
                  <>
                    <div style={{ color: t.faint, marginBottom: 12 }}><Ic.Img s={44} /></div>
                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", color: t.muted, fontSize: 14, fontWeight: 600 }}>Click to upload an image</p>
                    <p style={{ fontFamily: "'DM Mono',monospace", color: t.faint, fontSize: 10, marginTop: 4, letterSpacing: ".12em" }}>JPG, PNG, WebP — text will be extracted via OCR</p>
                  </>
                )
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
            {img && (
              <Btn t={t} sz="lg" icon={<Ic.Search s={16} />} onClick={runImageCheck}
                disabled={imgAnalyzing}
                style={{ width: "100%", justifyContent: "center", marginTop: 14 }}
              >
                {imgAnalyzing ? "Extracting & Checking…" : "Extract & Verify"}
              </Btn>
            )}
          </>
        )}

        {/* ── VOICE TAB ── */}
        {tab === "voice" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>

            {/* Language selector */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{
                fontFamily: "'DM Mono',monospace", fontSize: 10, color: t.faint,
                letterSpacing: ".12em", textTransform: "uppercase",
              }}>
                Language
              </label>
              <select
                value={voiceLang}
                onChange={e => setVoiceLang(e.target.value)}
                disabled={recording || voiceAnalyzing}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10,
                  background: t.input, border: `1px solid ${t.border}`,
                  color: t.text, fontFamily: "'Space Grotesk',sans-serif", fontSize: 13,
                  outline: "none", cursor: "pointer", transition: "border-color .25s",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                }}
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.label} {l.code !== "auto" ? `(${l.code})` : ""}</option>
                ))}
              </select>
            </div>

            {/* Mic button with pulse animation */}
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {recording && (
                <>
                  <div style={{
                    position: "absolute", width: 130, height: 130, borderRadius: "50%",
                    background: t.accent + "12", animation: "voicePulse 1.5s ease-in-out infinite",
                  }} />
                  <div style={{
                    position: "absolute", width: 160, height: 160, borderRadius: "50%",
                    background: t.accent + "08", animation: "voicePulse 1.5s .3s ease-in-out infinite",
                  }} />
                </>
              )}
              <button
                onClick={recording ? stopAndSend : startRecording}
                disabled={voiceAnalyzing}
                data-mag
                style={{
                  width: 100, height: 100, borderRadius: "50%",
                  background: recording ? "#ef4444" : voiceAnalyzing ? t.faint : `linear-gradient(135deg, ${t.accent}, ${t.accent}cc)`,
                  border: "none", cursor: voiceAnalyzing ? "wait" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", transition: "all .3s", position: "relative", zIndex: 1,
                  boxShadow: recording ? "0 0 30px rgba(239,68,68,.35)" : `0 0 30px ${t.accent}25`,
                }}
              >
                {recording
                  ? <Ic.X s={32} />
                  : <Ic.Mic s={36} />}
              </button>
            </div>

            {/* Status text */}
            <div style={{ textAlign: "center" }}>
              <p style={{
                fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 600,
                color: recording ? "#ef4444" : voiceAnalyzing ? t.accent : t.muted,
              }}>
                {recording ? "Recording…" : voiceAnalyzing ? "Processing…" : "Tap to record"}
              </p>
              {recording && (
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 22, color: t.text, marginTop: 6, letterSpacing: ".1em" }}>
                  {fmtTime(voiceDuration)}
                </p>
              )}
              {!recording && !voiceAnalyzing && (
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: t.faint, marginTop: 6, letterSpacing: ".12em" }}>
                  Speak your claim clearly, then tap again to verify
                </p>
              )}
              {detectedLang && !recording && !voiceAnalyzing && (
                <p style={{
                  fontFamily: "'DM Mono',monospace", fontSize: 10, marginTop: 8,
                  color: t.accent, letterSpacing: ".06em",
                  padding: "3px 10px", borderRadius: 12,
                  background: t.accent + "10", border: `1px solid ${t.accent}30`,
                  display: "inline-block",
                }}>
                  Detected: {(LANGUAGES.find(l => l.code === detectedLang) || {}).label || detectedLang}
                </p>
              )}
            </div>

            {/* Waveform bars while recording */}
            {recording && (
              <div style={{ display: "flex", alignItems: "center", gap: 3, height: 40 }}>
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} style={{
                    width: 3, borderRadius: 2, background: t.accent,
                    animation: `waveBar .8s ${i * 0.05}s ease-in-out infinite alternate`,
                  }} />
                ))}
              </div>
            )}

            {/* Transcribed text */}
            {transcribedText && !voiceAnalyzing && (
              <div style={{
                width: "100%", background: t.input, border: `1px solid ${t.border}`,
                borderRadius: 10, padding: "14px 16px",
              }}>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: t.faint, marginBottom: 6, letterSpacing: ".12em" }}>
                  TRANSCRIBED
                </p>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: t.text, lineHeight: 1.7 }}>
                  "{transcribedText}"
                </p>
              </div>
            )}

            {/* Replay TTS button */}
            {audioResponse && !voiceAnalyzing && (
              <Btn t={t} sz="md"
                icon={<Ic.Zap s={14} />}
                onClick={() => {
                  if (audioBlobUrl.current) {
                    const a = new Audio(audioBlobUrl.current);
                    a.play().catch(() => {});
                  }
                }}
                style={{ width: "100%", justifyContent: "center" }}
              >
                Replay Voice Response
              </Btn>
            )}

            {/* CSS keyframes for voice animations */}
            <style>{`
              @keyframes voicePulse {
                0%, 100% { transform: scale(1); opacity: .6; }
                50% { transform: scale(1.15); opacity: .2; }
              }
              @keyframes waveBar {
                0% { height: 6px; }
                100% { height: 32px; }
              }
            `}</style>
          </div>
        )}

        {/* ── AI DETECT TAB ── */}
        {tab === "ai" && (
          <>
            <div
              onClick={() => aiFileRef.current.click()} data-mag
              style={{
                borderRadius: 16, border: `2px dashed ${aiImg ? t.accent + "55" : t.border}`,
                minHeight: 220, display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", cursor: "pointer", overflow: "hidden",
                background: aiImg ? "transparent" : t.card, transition: "all .3s",
              }}
            >
              {aiImg
                ? <img src={aiImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 14 }} />
                : (
                  <>
                    <div style={{ color: t.faint, marginBottom: 12 }}><Ic.Eye s={44} /></div>
                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", color: t.muted, fontSize: 14, fontWeight: 600 }}>Click to upload an image</p>
                    <p style={{ fontFamily: "'DM Mono',monospace", color: t.faint, fontSize: 10, marginTop: 4, letterSpacing: ".12em" }}>JPG, PNG, WebP — AI vs Real forensic analysis</p>
                  </>
                )
              }
            </div>
            <input ref={aiFileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAiFile} />
            {aiImg && (
              <Btn t={t} sz="lg" icon={<Ic.Eye s={16} />} onClick={runAiDetect}
                disabled={aiAnalyzing}
                style={{ width: "100%", justifyContent: "center", marginTop: 14 }}
              >
                {aiAnalyzing ? "Analyzing Forensics…" : "Detect AI Image"}
              </Btn>
            )}
          </>
        )}

        {/* Progress indicator */}
        {isLoading && (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: t.muted, letterSpacing: ".1em" }}>AI verifying claim…</span>
            </div>
            <Scanner t={t} />
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              {steps.map((s, i) => (
                <span key={s} style={{
                  fontFamily: "'DM Mono',monospace", fontSize: 10, padding: "4px 10px", borderRadius: 20,
                  letterSpacing: ".06em", color: t.accent, background: t.accent + "10",
                  border: `1px solid ${t.accent}30`, transition: "all .35s",
                  animation: `floatGlow 1.5s ${i * 0.3}s ease-in-out infinite`,
                }}>
                  ○ {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {activeError && (
          <div style={{
            marginTop: 16, padding: "14px 18px", borderRadius: 10,
            background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.25)",
            display: "flex", alignItems: "flex-start", gap: 10,
          }}>
            <Ic.Alert s={16} />
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, color: "#f87171", lineHeight: 1.5 }}>{activeError}</span>
          </div>
        )}
      </div>

      {/* ───── RIGHT: RESULTS PANEL ───── */}
      <div ref={rRef} style={{ padding: "52px 48px", overflowY: "auto", maxHeight: "calc(100vh - 68px)" }}>

        {/* Empty state */}
        {!activeResult && !isLoading && !activeError && (
          <div style={{ textAlign: "center", paddingTop: 100, color: t.faint }}>
            <Ic.Shield s={52} />
            <p style={{ marginTop: 16, fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, lineHeight: 1.7 }}>
              {tab === "text" ? "Enter a claim and verify\nto see results here" : tab === "image" ? "Upload an image to extract\ntext and verify it" : tab === "voice" ? "Record a voice claim\nto see results here" : "Upload an image to detect\nif it's AI-generated or real"}
            </p>
          </div>
        )}

        {/* Results */}
        {activeResult && tab !== "ai" && (
          <div>
            {/* Trust Gauge */}
            <TiltCard t={t} glow style={{
              padding: 28, marginBottom: 16,
              opacity: rVis ? 1 : 0, transform: rVis ? "translateY(0)" : "translateY(28px)",
              transition: "all .9s cubic-bezier(0.16,1,0.3,1)",
            }}>
              <TrustGauge score={activeResult.confidence ?? 0} t={t} />
            </TiltCard>

            {/* Verdict + Explanation */}
            <TiltCard t={t} style={{
              padding: 24, marginBottom: 16,
              opacity: rVis ? 1 : 0, transform: rVis ? "translateY(0)" : "translateY(28px)",
              transition: "all .9s .1s cubic-bezier(0.16,1,0.3,1)",
            }}>
              <h4 style={{
                fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: ".08em",
                color: t.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 10,
              }}>
                VERDICT
                <span style={{
                  padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  fontFamily: "'DM Mono',monospace",
                  background: verdictBg(activeResult.verdict, t),
                  color: verdictColor(activeResult.verdict, t),
                  border: `1px solid ${verdictBorder(activeResult.verdict, t)}`,
                  letterSpacing: ".06em",
                }}>
                  {activeResult.verdict?.toUpperCase()}
                </span>
              </h4>
              <p style={{
                fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: t.muted,
                lineHeight: 1.7, whiteSpace: "pre-wrap",
              }}>
                {activeResult.explanation}
              </p>
            </TiltCard>

            {/* Extracted / Transcribed text (image & voice tabs) */}
            {((tab === "image" && extractedText) || (tab === "voice" && transcribedText)) && (
              <TiltCard t={t} style={{
                padding: 24, marginBottom: 16,
                opacity: rVis ? 1 : 0, transform: rVis ? "translateY(0)" : "translateY(28px)",
                transition: "all .9s .15s cubic-bezier(0.16,1,0.3,1)",
              }}>
                <h4 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: ".08em", color: t.text, marginBottom: 12 }}>
                  {tab === "voice" ? "TRANSCRIBED TEXT" : "EXTRACTED TEXT"}
                </h4>
                <div style={{
                  background: t.input, border: `1px solid ${t.border}`, borderRadius: 10,
                  padding: "14px 16px", fontFamily: "'DM Mono',monospace", fontSize: 12,
                  color: t.text, lineHeight: 1.7, whiteSpace: "pre-wrap", maxHeight: 180,
                  overflowY: "auto",
                }}>
                  {tab === "voice" ? transcribedText : extractedText}
                </div>
              </TiltCard>
            )}

            {/* Sources */}
            {activeResult.sources && activeResult.sources.length > 0 && (
              <TiltCard t={t} style={{
                padding: 24, marginBottom: 16,
                opacity: rVis ? 1 : 0, transform: rVis ? "translateY(0)" : "translateY(28px)",
                transition: "all .9s .2s cubic-bezier(0.16,1,0.3,1)",
              }}>
                <h4 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: ".08em", color: t.text, marginBottom: 16 }}>
                  SOURCES
                </h4>
                {activeResult.sources.map((src, i) => (
                  <a
                    key={i} href={src} target="_blank" rel="noopener noreferrer" data-mag
                    style={{
                      display: "flex", alignItems: "center", gap: 8, marginBottom: i < activeResult.sources.length - 1 ? 12 : 0,
                      fontFamily: "'DM Mono',monospace", fontSize: 12, color: t.accent,
                      textDecoration: "none", transition: "opacity .2s", lineHeight: 1.5,
                      wordBreak: "break-all",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = ".7")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >
                    <Ic.Arr s={12} />
                    {src}
                  </a>
                ))}
              </TiltCard>
            )}

            {/* Download Report */}
            <Btn t={t} sz="lg" icon={<Ic.Download s={16} />} onClick={downloadReport}
              style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
            >
              Download Report (PDF)
            </Btn>
          </div>
        )}

        {/* AI Detection Results */}
        {tab === "ai" && aiResult && (
          <div>
            {/* Confidence Gauge */}
            <TiltCard t={t} glow style={{
              padding: 28, marginBottom: 16,
              opacity: rVis ? 1 : 0, transform: rVis ? "translateY(0)" : "translateY(28px)",
              transition: "all .9s cubic-bezier(0.16,1,0.3,1)",
            }}>
              <TrustGauge score={aiResult.confidence_percentage ?? 0} t={t} />
            </TiltCard>

            {/* Verdict */}
            <TiltCard t={t} style={{
              padding: 24, marginBottom: 16,
              opacity: rVis ? 1 : 0, transform: rVis ? "translateY(0)" : "translateY(28px)",
              transition: "all .9s .1s cubic-bezier(0.16,1,0.3,1)",
            }}>
              <h4 style={{
                fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: ".08em",
                color: t.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 10,
              }}>
                VERDICT
                <span style={{
                  padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  fontFamily: "'DM Mono',monospace", letterSpacing: ".06em",
                  background: aiResult.verdict === "AI-Generated" ? t.lo + "15" : aiResult.verdict === "Real Photograph" ? t.hi + "15" : t.mid + "15",
                  color: aiResult.verdict === "AI-Generated" ? t.lo : aiResult.verdict === "Real Photograph" ? t.hi : t.mid,
                  border: `1px solid ${aiResult.verdict === "AI-Generated" ? t.lo + "35" : aiResult.verdict === "Real Photograph" ? t.hi + "35" : t.mid + "35"}`,
                }}>
                  {aiResult.verdict?.toUpperCase()}
                </span>
              </h4>
              <p style={{
                fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: t.muted,
                lineHeight: 1.7, whiteSpace: "pre-wrap",
              }}>
                {aiResult.detailed_reasoning}
              </p>
            </TiltCard>

            {/* Visual Inconsistencies */}
            {aiResult.visual_inconsistencies && aiResult.visual_inconsistencies.length > 0 && (
              <TiltCard t={t} style={{
                padding: 24, marginBottom: 16,
                opacity: rVis ? 1 : 0, transform: rVis ? "translateY(0)" : "translateY(28px)",
                transition: "all .9s .15s cubic-bezier(0.16,1,0.3,1)",
              }}>
                <h4 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: ".08em", color: t.text, marginBottom: 16 }}>
                  VISUAL INCONSISTENCIES
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {aiResult.visual_inconsistencies.map((item, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      padding: "10px 14px", borderRadius: 10,
                      background: t.lo + "08", border: `1px solid ${t.lo}20`,
                    }}>
                      <Ic.Alert s={14} />
                      <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, color: t.text, lineHeight: 1.6 }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </TiltCard>
            )}

            {/* AI Generation Indicators */}
            {aiResult.ai_generation_indicators && aiResult.ai_generation_indicators.length > 0 && (
              <TiltCard t={t} style={{
                padding: 24, marginBottom: 16,
                opacity: rVis ? 1 : 0, transform: rVis ? "translateY(0)" : "translateY(28px)",
                transition: "all .9s .2s cubic-bezier(0.16,1,0.3,1)",
              }}>
                <h4 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: ".08em", color: t.text, marginBottom: 16 }}>
                  AI GENERATION INDICATORS
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {aiResult.ai_generation_indicators.map((ind, i) => (
                    <span key={i} style={{
                      fontFamily: "'DM Mono',monospace", fontSize: 11, padding: "6px 14px", borderRadius: 20,
                      letterSpacing: ".04em", lineHeight: 1.5,
                      color: t.accent, background: t.accent + "10", border: `1px solid ${t.accent}30`,
                    }}>
                      {ind}
                    </span>
                  ))}
                </div>
              </TiltCard>
            )}

            {/* Download Report */}
            <Btn t={t} sz="lg" icon={<Ic.Download s={16} />} onClick={downloadReport}
              style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
            >
              Download Report (PDF)
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}