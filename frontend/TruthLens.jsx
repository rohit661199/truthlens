import { useState, useEffect, useRef, useCallback } from "react";
import { T, GLOBAL_STYLES } from "./constants";

// System layers
import Particles from "./components/Particles";
import Grain from "./components/Grain";
import MagCursor from "./components/MagCursor";
import ScrollProg from "./components/ScrollProg";
import PageWipe from "./components/PageWipe";
import Loader from "./components/Loader";
import FullMenu from "./components/FullMenu";
import Navbar from "./components/Navbar";

// Pages
import LandingPage from "./pages/LandingPage";
import WorkspacePage from "./pages/WorkspacePage";
import ImagePage from "./pages/ImagePage";
import VoicePage from "./pages/VoicePage";
import HistoryPage from "./pages/HistoryPage";
import Factcheck from "./pages/Factcheck";

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function TruthLens() {
  const [isDark, setIsDark] = useState(true);
  const [page, setPage] = useState("landing");
  const [loaded, setLoaded] = useState(false);
  const [wiping, setWiping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pending = useRef(null);
  const t = T[isDark ? "dark" : "light"];

  const navigate = useCallback(next => {
    if (next === page) { setMenuOpen(false); return; }
    pending.current = next; setWiping(true); setMenuOpen(false);
    setTimeout(() => { setPage(pending.current); setWiping(false); }, 400);
  }, [page]);

  // Lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const pages = { landing: LandingPage, workspace: WorkspacePage, image: ImagePage, voice: VoicePage, history: HistoryPage, factcheck: Factcheck };
  const PageComp = pages[page] || LandingPage;

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Space Grotesk',sans-serif", cursor: "none", transition: "background .5s, color .5s", position: "relative" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* System layers */}
      <Particles isDark={isDark} />
      <Grain />
      <MagCursor t={t} />
      <ScrollProg t={t} />
      <PageWipe active={wiping} t={t} />

      {/* Loader */}
      <Loader onDone={() => setLoaded(true)} />

      {/* Full-screen hamburger menu */}
      <FullMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        page={page}
        setPage={navigate}
        isDark={isDark}
        toggleTheme={() => setIsDark(!isDark)}
        t={t}
      />

      {/* App */}
      {loaded && <>
        <Navbar
          page={page} setPage={navigate}
          isDark={isDark} toggleTheme={() => setIsDark(!isDark)}
          t={t} menuOpen={menuOpen} onMenuToggle={() => setMenuOpen(o => !o)}
        />
        <main><PageComp t={t} setPage={navigate} isDark={isDark} /></main>
      </>}
    </div>
  );
}
