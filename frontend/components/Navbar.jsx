import { useState, useEffect } from "react";
import Ic from "../icons";
import Hamburger from "./Hamburger";
import QuickSearchModal from "./QuickSearchModal";

const NAV_LINKS = [
  { id: "factcheck", label: "TEXT", icon: (s) => <Ic.Search s={s} /> },
  { id: "imagecheck", label: "IMAGE", icon: (s) => <Ic.Img s={s} /> },
  { id: "voicecheck", label: "VOICE", icon: (s) => <Ic.Mic s={s} /> },
  { id: "aidetect", label: "AI DETECT", icon: (s) => <Ic.Eye s={s} /> },
  { id: "history", label: "HISTORY", icon: (s) => <Ic.Clock s={s} /> },
];

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
export default function Navbar({ page, setPage, isDark, toggleTheme, t, menuOpen, onMenuToggle }) {
  const [scrolled, setScrolled] = useState(false);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <>
      <QuickSearchModal
        isOpen={quickSearchOpen}
        onClose={() => setQuickSearchOpen(false)}
        t={t}
        setPage={setPage}
      />
      <nav className="navbar-container" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 8000, height: 84,
        background: scrolled || menuOpen ? (isDark ? "rgba(6,6,14,.88)" : "rgba(246,243,239,.9)") : "rgba(6,6,14,.4)",
        backdropFilter: "blur(28px) saturate(180%)",
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
        borderBottom: `1px solid ${scrolled || menuOpen ? t.line : "rgba(255,255,255,.05)"}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", transition: "all .4s ease"
      }}>
        {/* Top ambient glow bar */}
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: `linear-gradient(90deg, transparent, ${t.accent}aa, transparent)` }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", userSelect: "none" }} onClick={() => setPage("landing")} data-mag>
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Ic.Logo s={32} />
            <div style={{ position: "absolute", inset: -4, borderRadius: "50%", background: t.accent, opacity: 0.15, filter: "blur(8px)", pointerEvents: "none" }} />
          </div>
          <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontWeight: 400, fontSize: 32, color: t.text, letterSpacing: ".12em", display: "flex", alignItems: "center" }}>
            TRUTH<span style={{ color: t.accent, textShadow: `0 0 16px ${t.accent}80` }}>LENS</span>
          </span>
          <span className="responsive-hide-mobile" style={{ fontSize: 9, background: `linear-gradient(135deg, ${t.accent}, #7c3aed)`, color: "#fff", padding: "2px 8px", borderRadius: 4, letterSpacing: ".15em", fontWeight: 700, fontFamily: "'DM Mono',monospace", boxShadow: `0 0 12px ${t.glow}` }}>PRO AI</span>
        </div>

        {/* Inline Navigation Links (Desktop Only) */}
        <div className="desktop-nav-links" style={{ display: "flex", alignItems: "center", gap: 6, background: isDark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.03)", padding: "4px 6px", borderRadius: 12, border: `1px solid ${t.line}` }}>

          {NAV_LINKS.map(link => {
            const active = page === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setPage(link.id)}
                data-mag
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 18px", borderRadius: 8,
                  background: active ? (isDark ? "rgba(181,123,255,.18)" : "rgba(109,40,217,.12)") : "transparent",
                  border: active ? `1px solid ${t.accent}50` : "1px solid transparent",
                  color: active ? t.accent : t.muted,
                  fontFamily: "'DM Mono',monospace", fontSize: 11, fontWeight: 700,
                  letterSpacing: ".12em", cursor: "pointer",
                  boxShadow: active ? `0 0 16px ${t.glow}` : "none",
                  transition: "all .3s cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = t.text; e.currentTarget.style.background = isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)"; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = t.muted; e.currentTarget.style.background = "transparent"; } }}
              >
                <span style={{ color: active ? t.accent : t.muted, transition: "color .2s" }}>{link.icon(14)}</span>
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="navbar-right-controls" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {/* Quick Search Button */}
          <button
            onClick={() => setQuickSearchOpen(true)}
            data-mag
            className="navbar-search-btn"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 12px", borderRadius: 10,
              background: isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)",
              border: `1px solid ${t.border}`, color: t.muted, cursor: "pointer",
              fontFamily: "'DM Mono',monospace", fontSize: 11, fontWeight: 700,
              transition: "all .3s ease", flexShrink: 0
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.muted; }}
          >
            <Ic.Search s={14} />
            <span className="responsive-hide-mobile">Search</span>
            <span className="responsive-hide-mobile" style={{ fontSize: 9, background: t.accent + "20", color: t.accent, padding: "2px 6px", borderRadius: 4, border: `1px solid ${t.accent}30` }}>
              ⌘K
            </span>
          </button>

          <button
            onClick={toggleTheme}
            data-mag
            style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: isDark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.04)",
              border: `1px solid ${t.border}`, color: t.text, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .3s ease"
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.boxShadow = `0 0 14px ${t.glow}`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.boxShadow = "none"; }}
          >
            {isDark ? <Ic.Sun s={16} /> : <Ic.Moon s={16} />}
          </button>

          <Hamburger open={menuOpen} onToggle={onMenuToggle} t={t} />
        </div>
      </nav>

    </>
  );
}


