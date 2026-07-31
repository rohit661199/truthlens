import { useNavigate } from "react-router-dom";
import Ic from "../icons";

const FALLBACK = {
  bg: "#06060e", text: "#ede8ff", muted: "rgba(237,232,255,.44)",
  faint: "rgba(237,232,255,.16)", accent: "#b57bff", border: "rgba(255,255,255,.07)",
  line: "rgba(255,255,255,.07)", hi: "#4ade80",
};

const PLATFORM = [
  { label: "Text Fact Check", page: "factcheck", route: "/factcheck" },
  { label: "Image OCR Check", page: "imagecheck", route: "/image-check" },
  { label: "Voice Deepfake Check", page: "voicecheck", route: "/voice-check" },
  { label: "AI Detection", page: "aidetect", route: "/ai-detect" },
  { label: "History Log", page: "history", route: "/history" },
];

const RESOURCES = [
  { label: "Documentation", page: "docs", route: "/docs" },
  { label: "API Reference", page: "apireference", route: "/api-reference" },
  { label: "Blog & Insights", page: "blog", route: "/blog" },
  { label: "System Status", page: "status", route: "/status" },
];

const COMPANY = [
  { label: "About Us", page: "about", route: "/about" },
  { label: "Privacy Policy", page: "privacy", route: "/privacy" },
  { label: "Terms of Service", page: "terms", route: "/terms" },
  { label: "Contact Team", page: "contact", route: "/contact" },
];

export default function Footer({ t: _t, setPage, style }) {
  const t = _t || FALLBACK;
  const nav = useNavigate();

  const goHome = () => {
    if (setPage) setPage("landing");
    else nav("/");
  };

  const goPage = (p) => {
    if (setPage) setPage(p.page);
    else nav(p.route);
  };

  const linkStyle = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 13,
    color: t.muted,
    textDecoration: "none",
    cursor: "pointer",
    transition: "all .25s ease",
    lineHeight: 2.2,
    display: "block",
  };

  const headStyle = {
    fontFamily: "'DM Mono', monospace",
    fontSize: 10,
    letterSpacing: ".22em",
    textTransform: "uppercase",
    color: t.accent,
    marginBottom: 16,
    fontWeight: 700,
  };

  return (
    <footer className="responsive-footer-padding" style={{
      position: "relative",
      borderTop: `1px solid ${t.line}`,
      padding: "60px 60px 36px",
      background: "rgba(6, 6, 14, 0.6)",
      backdropFilter: "blur(20px)",
      zIndex: 2,
      ...style,
    }}>
      {/* Top ambient line */}
      <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: `linear-gradient(90deg, transparent, ${t.accent}60, transparent)` }} />

      {/* Back to Home & Live Status */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 44, flexWrap: "wrap", gap: 16 }}>
        <button
          onClick={goHome}
          data-mag
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 22px",
            borderRadius: 10,
            border: `1px solid ${t.accent}40`,
            background: t.accent + "12",
            color: t.accent,
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: ".06em",
            cursor: "pointer",
            transition: "all .3s cubic-bezier(0.16,1,0.3,1)",
            boxShadow: `0 0 16px ${t.glow}`,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = t.accent + "25";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = t.accent + "12";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="19 12 5 12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Home
        </button>

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "8px 16px", borderRadius: 20,
          background: "rgba(74,222,128,.08)", border: "1px solid rgba(74,222,128,.25)",
          fontFamily: "'DM Mono', monospace", fontSize: 10, color: t.hi || "#4ade80",
          letterSpacing: ".15em"
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "statusBlink 2s ease-in-out infinite" }} />
          ALL SYSTEMS OPERATIONAL
        </div>
      </div>

      {/* Link Columns */}
      <div className="responsive-footer-grid" style={{
        display: "grid",
        gridTemplateColumns: "1.8fr 1fr 1fr 1fr",
        gap: 48,
        marginBottom: 48,
      }}>

        {/* Brand Column */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, cursor: "pointer" }} onClick={goHome}>
            <Ic.Logo s={26} />
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 24,
              letterSpacing: ".1em",
              color: t.text,
            }}>
              TRUTH<span style={{ color: t.accent }}>LENS</span>
            </span>
          </div>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 13,
            color: t.muted,
            lineHeight: 1.7,
            maxWidth: 320,
            marginBottom: 20,
          }}>
            Next-generation forensic AI misinformation detection. Real-time claim verification, deepfake audio analysis, OCR text inspection, and AI image detection with explainable verdicts.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { label: "GitHub", href: "https://github.com", d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" },
              { label: "Twitter", href: "https://twitter.com", d: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                style={{
                  width: 34, height: 34, borderRadius: 8,
                  border: `1px solid ${t.border}`,
                  background: t.card,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: t.muted, transition: "all .25s ease", textDecoration: "none",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = t.accent; e.currentTarget.style.borderColor = t.accent + "60"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = t.muted; e.currentTarget.style.borderColor = t.border; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.d} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Platform Links */}
        <div>
          <p style={headStyle}>Platform</p>
          {PLATFORM.map(p => (
            <span
              key={p.label}
              onClick={() => goPage(p)}
              style={linkStyle}
              onMouseEnter={e => { e.currentTarget.style.color = t.text; e.currentTarget.style.paddingLeft = "4px"; }}
              onMouseLeave={e => { e.currentTarget.style.color = t.muted; e.currentTarget.style.paddingLeft = "0"; }}
            >
              {p.label}
            </span>
          ))}
        </div>

        {/* Resources Links */}
        <div>
          <p style={headStyle}>Resources</p>
          {RESOURCES.map(r => (
            <span
              key={r.label}
              onClick={() => goPage(r)}
              style={linkStyle}
              onMouseEnter={e => { e.currentTarget.style.color = t.text; e.currentTarget.style.paddingLeft = "4px"; }}
              onMouseLeave={e => { e.currentTarget.style.color = t.muted; e.currentTarget.style.paddingLeft = "0"; }}
            >
              {r.label}
            </span>
          ))}
        </div>

        {/* Company Links */}
        <div>
          <p style={headStyle}>Company</p>
          {COMPANY.map(c => (
            <span
              key={c.label}
              onClick={() => goPage(c)}
              style={linkStyle}
              onMouseEnter={e => { e.currentTarget.style.color = t.text; e.currentTarget.style.paddingLeft = "4px"; }}
              onMouseLeave={e => { e.currentTarget.style.color = t.muted; e.currentTarget.style.paddingLeft = "0"; }}
            >
              {c.label}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: `1px solid ${t.line}`,
        paddingTop: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 14,
      }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: t.muted,
          letterSpacing: ".08em",
        }}>
          © {new Date().getFullYear()} TruthLens AI Inc. All rights reserved.
        </span>
        <div style={{ display: "flex", gap: 24 }}>
          {[
            { label: "Privacy Policy", page: "privacy", route: "/privacy" },
            { label: "Terms of Service", page: "terms", route: "/terms" },
            { label: "Cookie Settings", page: "terms", route: "/terms" },
          ].map(l => (
            <span
              key={l.label}
              onClick={() => goPage(l)}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                color: t.muted,
                textDecoration: "none",
                letterSpacing: ".06em",
                transition: "color .25s",
                cursor: "pointer",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = t.accent)}
              onMouseLeave={e => (e.currentTarget.style.color = t.muted)}
            >
              {l.label}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

