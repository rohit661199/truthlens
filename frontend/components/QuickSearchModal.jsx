import { useState, useEffect } from "react";
import axios from "axios";
import Ic from "../icons";
import TrustGauge from "./TrustGauge";
import { API, verdictColor, verdictBg, verdictBorder } from "../utils/factcheckHelpers";

export default function QuickSearchModal({ isOpen, onClose, t, setPage }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else openModal();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const openModal = () => {
    setQuery("");
    setResult(null);
    setLoading(false);
  };

  const handleVerify = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const { data } = await axios.post(`${API}/fact-check`, { claim: query.trim() });
      setResult(data);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(6, 6, 14, 0.75)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      paddingTop: 120,
    }} onClick={onClose}>
      <div
        style={{
          width: "90%", maxWidth: 640,
          background: "rgba(18, 18, 30, 0.95)",
          border: `1px solid ${t.accent}40`,
          borderRadius: 20,
          boxShadow: `0 0 40px ${t.accent}25`,
          padding: 24,
          position: "relative",
          animation: "modalSlideDown .3s cubic-bezier(0.16,1,0.3,1)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Ic.Search s={18} />
            <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: ".08em", color: t.text }}>
              QUICK FACT-CHECK // COMMAND PALETTE
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent", border: "none", color: t.muted,
              cursor: "pointer", padding: 6, display: "flex", alignItems: "center",
            }}
          >
            <Ic.X s={18} />
          </button>
        </div>

        {/* Input bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          background: t.input, border: `1px solid ${t.border}`,
          borderRadius: 12, padding: "12px 18px", marginBottom: 16,
        }}>
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleVerify()}
            placeholder="Type any claim and press Enter..."
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: t.text, fontFamily: "'Space Grotesk',sans-serif", fontSize: 16,
            }}
          />
          <button
            onClick={handleVerify}
            disabled={!query.trim() || loading}
            style={{
              padding: "8px 16px", borderRadius: 8,
              background: `linear-gradient(135deg, ${t.accent}, ${t.accent}cc)`,
              color: "#fff", border: "none", cursor: "pointer",
              fontFamily: "'DM Mono',monospace", fontSize: 12, fontWeight: 700,
            }}
          >
            {loading ? "CHECKING…" : "VERIFY"}
          </button>
        </div>

        {/* Results section inside modal */}
        {result && (
          <div style={{ marginTop: 20, borderTop: `1px solid ${t.line}`, paddingTop: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{
                padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                fontFamily: "'DM Mono',monospace",
                background: verdictBg(result.verdict, t),
                color: verdictColor(result.verdict, t),
                border: `1px solid ${verdictBorder(result.verdict, t)}`,
              }}>
                {result.verdict?.toUpperCase()}
              </span>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: t.muted }}>
                Confidence: {result.confidence}%
              </span>
            </div>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, color: t.text, lineHeight: 1.6, marginBottom: 16 }}>
              {result.explanation}
            </p>
            <button
              onClick={() => {
                onClose();
                if (setPage) setPage("factcheck");
              }}
              style={{
                width: "100%", padding: "10px", borderRadius: 10,
                background: t.accent + "15", border: `1px solid ${t.accent}40`,
                color: t.accent, fontFamily: "'Space Grotesk',sans-serif",
                fontSize: 13, fontWeight: 600, cursor: "pointer"
              }}
            >
              Open Full Analysis & Export PDF →
            </button>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontFamily: "'DM Mono',monospace", fontSize: 10, color: t.faint }}>
          <span>Press ENTER to verify</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
