import React, { useState, useCallback, useEffect } from "react";

import { useSelector } from "react-redux";
import { Route, Routes, Navigate, useNavigate, useLocation } from "react-router-dom";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import LandingPage from "../pages/LandingPage";
import TextCheckPage from "../pages/TextCheckPage";
import ImageCheckPage from "../pages/ImageCheckPage";
import VoiceCheckPage from "../pages/VoiceCheckPage";
import AIDetectPage from "../pages/AIDetectPage";
import HistoryPage from "../pages/HistoryPage";
import DocsPage from "../pages/DocsPage";
import ApiReferencePage from "../pages/ApiReferencePage";
import BlogPage from "../pages/BlogPage";
import StatusPage from "../pages/StatusPage";
import AboutPage from "../pages/AboutPage";
import PrivacyPage from "../pages/PrivacyPage";
import TermsPage from "../pages/TermsPage";
import ContactPage from "../pages/ContactPage";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import FullMenu from "../components/FullMenu";
import Particles from "../components/Particles";
import Grain from "../components/Grain";
import MagCursor from "../components/MagCursor";
import ScrollProg from "../components/ScrollProg";
import PageWipe from "../components/PageWipe";
import useGetCurrentUser from "../hooks/useGetCurrentUser";
import { T, GLOBAL_STYLES } from "../constants";

// Map route paths to page IDs used by Navbar/FullMenu
const routeToPage = {
  "/": "landing",
  "/factcheck": "factcheck",
  "/image-check": "imagecheck",
  "/voice-check": "voicecheck",
  "/ai-detect": "aidetect",
  "/history": "history",
  "/docs": "docs",
  "/api-reference": "apireference",
  "/blog": "blog",
  "/status": "status",
  "/about": "about",
  "/privacy": "privacy",
  "/terms": "terms",
  "/contact": "contact",
};
const pageToRoute = {
  landing: "/",
  factcheck: "/factcheck",
  imagecheck: "/image-check",
  voicecheck: "/voice-check",
  aidetect: "/ai-detect",
  history: "/history",
  docs: "/docs",
  apireference: "/api-reference",
  blog: "/blog",
  status: "/status",
  about: "/about",
  privacy: "/privacy",
  terms: "/terms",
  contact: "/contact",
};

const App = () => {
  
  const { userData } = useSelector((state) => state.user);
  const [isDark, setIsDark] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [wiping, setWiping] = useState(false);
  const t = T[isDark ? "dark" : "light"];
  const nav = useNavigate();
  const location = useLocation();

  const currentPage = routeToPage[location.pathname] || "landing";

  // Lock scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const setPage = useCallback((page) => {
    if (page === currentPage) { setMenuOpen(false); return; }
    setWiping(true);
    setMenuOpen(false);
    setTimeout(() => {
      nav(pageToRoute[page] || "/");
      window.scrollTo(0, 0);
      setWiping(false);
    }, 400);
  }, [currentPage, nav]);

  // Pages that should show the full chrome (navbar, particles, etc.)
  const isAuthPage = location.pathname === "/signup" || location.pathname === "/login";

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Space Grotesk',sans-serif", cursor: isAuthPage ? "auto" : "none", transition: "background .5s, color .5s", position: "relative" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Loader — shows first, then disappears */}
      <Loader onDone={() => setLoaded(true)} />

      {/* System layers (always active after load, hidden on auth pages) */}
      {loaded && !isAuthPage && (
        <>
          <Particles isDark={isDark} />
          <Grain />
          <MagCursor t={t} />
          <ScrollProg t={t} />
          <PageWipe active={wiping} t={t} />

          <FullMenu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            page={currentPage}
            setPage={setPage}
            isDark={isDark}
            toggleTheme={() => setIsDark(d => !d)}
            t={t}
          />

          <Navbar
            page={currentPage}
            setPage={setPage}
            isDark={isDark}
            toggleTheme={() => setIsDark(d => !d)}
            t={t}
            menuOpen={menuOpen}
            onMenuToggle={() => setMenuOpen(o => !o)}
          />
        </>
      )}

      {/* Routes — render after loader finishes */}
      {loaded && (
        <Routes>
          <Route path="/" element={<LandingPage t={t} setPage={setPage} isDark={isDark} />} />
          <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/login" element={!userData ? <SignIn /> : <Navigate to="/" />} />
          <Route path="/factcheck" element={<TextCheckPage t={t} setPage={setPage} isDark={isDark} />} />
          <Route path="/image-check" element={<ImageCheckPage t={t} setPage={setPage} isDark={isDark} />} />
          <Route path="/voice-check" element={<VoiceCheckPage t={t} setPage={setPage} isDark={isDark} />} />
          <Route path="/ai-detect" element={<AIDetectPage t={t} setPage={setPage} isDark={isDark} />} />
          <Route path="/history" element={<HistoryPage t={t} setPage={setPage} isDark={isDark} />} />
          <Route path="/docs" element={<DocsPage t={t} setPage={setPage} isDark={isDark} />} />
          <Route path="/api-reference" element={<ApiReferencePage t={t} setPage={setPage} isDark={isDark} />} />
          <Route path="/blog" element={<BlogPage t={t} setPage={setPage} isDark={isDark} />} />
          <Route path="/status" element={<StatusPage t={t} setPage={setPage} isDark={isDark} />} />
          <Route path="/about" element={<AboutPage t={t} setPage={setPage} isDark={isDark} />} />
          <Route path="/privacy" element={<PrivacyPage t={t} setPage={setPage} isDark={isDark} />} />
          <Route path="/terms" element={<TermsPage t={t} setPage={setPage} isDark={isDark} />} />
          <Route path="/contact" element={<ContactPage t={t} setPage={setPage} isDark={isDark} />} />
        </Routes>
      )}
    </div>
  );
};

export default App;