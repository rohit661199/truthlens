import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import Ic from "../icons";
import { useReveal } from "../hooks/useReveal";
import TiltCard from "../components/TiltCard";
import Btn from "../components/Btn";
import TrustGauge from "../components/TrustGauge";
import Scanner from "../components/Scanner";
import { API, LANGUAGES, saveToHistory, verdictColor, verdictBg, verdictBorder, downloadReport, LOADING_STEPS } from "../utils/factcheckHelpers";
import Footer from "../components/Footer";

// ─── VOICE CHECK PAGE ────────────────────────────────────────────────────────
export default function VoiceCheckPage({ t, setPage }) {
  const [recording, setRecording] = useState(false);
  const [voiceAnalyzing, setVoiceAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [audioResponse, setAudioResponse] = useState(null);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [voiceLang, setVoiceLang] = useState("auto");
  const [detectedLang, setDetectedLang] = useState("");
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const timerRef = useRef(null);
  const audioBlobUrl = useRef(null);
  const [rRef, rVis] = useReveal(0.04);

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

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

      mr.start(250);
      mediaRecorder.current = mr;
      setRecording(true);
      setVoiceDuration(0);
      setResult(null); setError(null); setTranscribedText(""); setAudioResponse(null);
      setDetectedLang("");
      if (audioBlobUrl.current) { URL.revokeObjectURL(audioBlobUrl.current); audioBlobUrl.current = null; }

      timerRef.current = setInterval(() => setVoiceDuration(d => d + 1), 1000);
    } catch (err) {
      setError("Microphone access denied. Please allow mic access.");
    }
  }, []);

  const stopAndSend = useCallback(() => {
    if (!mediaRecorder.current || mediaRecorder.current.state === "inactive") return;
    clearInterval(timerRef.current);

    const mr = mediaRecorder.current;
    const prevOnStop = mr.onstop;

    mr.onstop = async (e) => {
      if (prevOnStop) prevOnStop(e);

      const mime = mr.mimeType || "audio/webm";
      const blob = new Blob(audioChunks.current, { type: mime });
      audioChunks.current = [];
      setRecording(false);

      if (blob.size < 100) {
        setError("Recording too short. Please try again.");
        return;
      }

      setVoiceAnalyzing(true);
      try {
        const ext = mime.includes("webm") ? ".webm" : mime.includes("ogg") ? ".ogg" : mime.includes("mp4") ? ".mp4" : ".webm";
        const fd = new FormData();
        fd.append("file", blob, `recording${ext}`);
        fd.append("language", voiceLang);
        const { data } = await axios.post(`${API}/voice-check`, fd, { timeout: 120000 });
        setTranscribedText(data.transcribed_text || "");
        setResult(data.result);
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

        if (data.audio_response) {
          const raw = atob(data.audio_response);
          const bytes = new Uint8Array(raw.length);
          for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
          const mp3Blob = new Blob([bytes], { type: "audio/mpeg" });
          if (audioBlobUrl.current) URL.revokeObjectURL(audioBlobUrl.current);
          audioBlobUrl.current = URL.createObjectURL(mp3Blob);

          const audio = new Audio(audioBlobUrl.current);
          audio.play().catch(() => {});
        }
      } catch (err) {
        setError(err.response?.data?.detail || err.message || "Voice check failed");
      } finally {
        setVoiceAnalyzing(false);
      }
    };

    mr.stop();
  }, [voiceLang]);

  useEffect(() => () => {
    clearInterval(timerRef.current);
    if (audioBlobUrl.current) URL.revokeObjectURL(audioBlobUrl.current);
  }, []);

  const handleDownload = () => downloadReport({
    inputType: "Voice",
    userInput: transcribedText || "[Voice recording]",
    result,
    isAi: false,
  });

  return (
    <div className="responsive-grid-4" style={{ paddingTop: 84, minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", position: "relative", zIndex: 1 }}>

      {/* ───── LEFT: INPUT PANEL ───── */}
      <div className="responsive-section-padding" style={{ borderRight: `1px solid ${t.line}`, padding: "52px 48px", overflowY: "auto" }}>

        <button onClick={() => setPage("landing")} data-mag style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.muted, fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: ".08em", cursor: "pointer", transition: "all .25s", marginBottom: 20 }} onMouseEnter={e => { e.currentTarget.style.color = t.accent; e.currentTarget.style.borderColor = t.accent + "50"; }} onMouseLeave={e => { e.currentTarget.style.color = t.muted; e.currentTarget.style.borderColor = t.border; }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="19 12 5 12" /><polyline points="12 19 5 12 12 5" /></svg>BACK</button>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 48, letterSpacing: ".03em", color: t.text, lineHeight: .95, marginBottom: 8 }}>
          Voice<br />Fact Check
        </div>
        <p style={{ fontFamily: "'Space Grotesk',sans-serif", color: t.muted, fontSize: 14, marginBottom: 28 }}>
          Record a voice claim and verify it with AI analysis
        </p>

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
              {recording ? <Ic.X s={32} /> : <Ic.Mic s={36} />}
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

        {/* Progress indicator */}
        {voiceAnalyzing && (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: t.muted, letterSpacing: ".1em" }}>AI verifying claim…</span>
            </div>
            <Scanner t={t} />
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              {LOADING_STEPS.map((s, i) => (
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
        {error && (
          <div style={{
            marginTop: 16, padding: "14px 18px", borderRadius: 10,
            background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.25)",
            display: "flex", alignItems: "flex-start", gap: 10,
          }}>
            <Ic.Alert s={16} />
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, color: "#f87171", lineHeight: 1.5 }}>{error}</span>
          </div>
        )}
      </div>

      {/* ───── RIGHT: RESULTS PANEL ───── */}
      <div ref={rRef} style={{ padding: "52px 48px", overflowY: "auto", maxHeight: "calc(100vh - 68px)" }}>

        {/* Empty state */}
        {!result && !voiceAnalyzing && !error && (
          <div style={{ textAlign: "center", paddingTop: 100, color: t.faint }}>
            <Ic.Shield s={52} />
            <p style={{ marginTop: 16, fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, lineHeight: 1.7 }}>
              Record a voice claim<br />to see results here
            </p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div>
            {/* Trust Gauge */}
            <TiltCard t={t} glow style={{
              padding: 28, marginBottom: 16,
              opacity: rVis ? 1 : 0, transform: rVis ? "translateY(0)" : "translateY(28px)",
              transition: "all .9s cubic-bezier(0.16,1,0.3,1)",
            }}>
              <TrustGauge score={result.confidence ?? 0} verdict={result.verdict} t={t} />
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
                  background: verdictBg(result.verdict, t),
                  color: verdictColor(result.verdict, t),
                  border: `1px solid ${verdictBorder(result.verdict, t)}`,
                  letterSpacing: ".06em",
                }}>
                  {result.verdict?.toUpperCase()}
                </span>
              </h4>
              <p style={{
                fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: t.muted,
                lineHeight: 1.7, whiteSpace: "pre-wrap",
              }}>
                {result.explanation}
              </p>
            </TiltCard>

            {/* Transcribed Text */}
            {transcribedText && (
              <TiltCard t={t} style={{
                padding: 24, marginBottom: 16,
                opacity: rVis ? 1 : 0, transform: rVis ? "translateY(0)" : "translateY(28px)",
                transition: "all .9s .15s cubic-bezier(0.16,1,0.3,1)",
              }}>
                <h4 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: ".08em", color: t.text, marginBottom: 12 }}>
                  TRANSCRIBED TEXT
                </h4>
                <div style={{
                  background: t.input, border: `1px solid ${t.border}`, borderRadius: 10,
                  padding: "14px 16px", fontFamily: "'DM Mono',monospace", fontSize: 12,
                  color: t.text, lineHeight: 1.7, whiteSpace: "pre-wrap", maxHeight: 180,
                  overflowY: "auto",
                }}>
                  {transcribedText}
                </div>
              </TiltCard>
            )}

            {/* Sources */}
            {result.sources && result.sources.length > 0 && (
              <TiltCard t={t} style={{
                padding: 24, marginBottom: 16,
                opacity: rVis ? 1 : 0, transform: rVis ? "translateY(0)" : "translateY(28px)",
                transition: "all .9s .2s cubic-bezier(0.16,1,0.3,1)",
              }}>
                <h4 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: ".08em", color: t.text, marginBottom: 16 }}>
                  SOURCES
                </h4>
                {result.sources.map((src, i) => (
                  <a
                    key={i} href={src} target="_blank" rel="noopener noreferrer" data-mag
                    style={{
                      display: "flex", alignItems: "center", gap: 8, marginBottom: i < result.sources.length - 1 ? 12 : 0,
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
            <Btn t={t} sz="lg" icon={<Ic.Download s={16} />} onClick={handleDownload}
              style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
            >
              Download Report (PDF)
            </Btn>
          </div>
        )}
      </div>

      <Footer t={t} setPage={setPage} style={{ gridColumn: "1 / -1" }} />
    </div>
  );
}
