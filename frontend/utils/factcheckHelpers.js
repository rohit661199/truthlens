import axios from "axios";
import { jsPDF } from "jspdf";
import { serverUrl, backendUrl } from "../src/config";

export const API = serverUrl;   // FastAPI – http://localhost:8000
export const BACKEND = backendUrl; // Express – http://localhost:4000

// ─── VERDICT COLOUR HELPERS ──────────────────────────────────────────────────
export const verdictColor = (v, t) => {
  const vl = (v || "").toLowerCase();
  if (vl === "true") return t.hi;
  if (vl === "false") return t.lo;
  if (vl === "misleading") return t.mid;
  return t.muted;
};
export const verdictBg = (v, t) => verdictColor(v, t) + "15";
export const verdictBorder = (v, t) => verdictColor(v, t) + "35";

// ─── LANGUAGES ───────────────────────────────────────────────────────────────
export const LANGUAGES = [
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

// ─── SAVE TO HISTORY (fire-and-forget) ───────────────────────────────────────
export const saveToHistory = (entry) => {
  axios.post(`${BACKEND}/api/history/save`, entry).catch(() => {});
};

// ─── STEPS SHOWN DURING LOADING ──────────────────────────────────────────────
export const LOADING_STEPS = ["Searching evidence", "Cross-referencing", "AI verification", "Building verdict"];

// ─── PDF REPORT GENERATOR ────────────────────────────────────────────────────
// opts: { inputType, userInput, result, isAi }
export const downloadReport = ({ inputType, userInput, result, isAi = false }) => {
  if (!result) return;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pw = 210, margin = 20, cw = pw - margin * 2;
  let y = margin;
  const now = new Date();
  const timestamp = now.toLocaleString("en-US", { dateStyle: "full", timeStyle: "medium" });

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
  body(userInput); y += 2;

  // ─ Verdict ─
  heading("FINAL VERDICT");
  const verdict = result.verdict;
  doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(109, 40, 217);
  doc.text(String(verdict || "N/A").toUpperCase(), margin, y); y += 8;

  // ─ Confidence ─
  heading("CONFIDENCE SCORE");
  const confidence = isAi ? result.confidence_percentage : result.confidence;
  body(`${confidence ?? "N/A"}%`); y += 2;

  // ─ Analysis ─
  heading("DETAILED ANALYSIS");
  const analysis = isAi ? result.detailed_reasoning : result.explanation;
  body(analysis || "No detailed analysis available."); y += 2;

  // ─ Visual Inconsistencies ─
  heading("VISUAL INCONSISTENCIES");
  if (isAi && result.visual_inconsistencies && result.visual_inconsistencies.length > 0) {
    result.visual_inconsistencies.forEach(item => bullet(item));
  } else {
    body("No significant inconsistencies detected.");
  }
  y += 2;

  // ─ AI Generation Indicators ─
  heading("AI GENERATION INDICATORS");
  if (isAi && result.ai_generation_indicators && result.ai_generation_indicators.length > 0) {
    result.ai_generation_indicators.forEach(item => bullet(item));
  } else {
    body("No AI generation artifacts detected.");
  }
  y += 2;

  // ─ Sources ─
  heading("SOURCES");
  if (!isAi && result.sources && result.sources.length > 0) {
    result.sources.forEach(src => bullet(src));
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
