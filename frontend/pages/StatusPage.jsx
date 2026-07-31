import { useState, useEffect } from "react";
import Ic from "../icons";
import Footer from "../components/Footer";

// ─── STATUS PAGE ─────────────────────────────────────────────────────────────
export default function StatusPage({ t, setPage }) {
  const [pulse, setPulse] = useState(true);
  useEffect(() => { const iv = setInterval(() => setPulse(p => !p), 1500); return () => clearInterval(iv); }, []);

  const services = [
    { name: "Fact-Check API", status: "operational", uptime: "99.98%", latency: "1.8s" },
    { name: "OCR Pipeline", status: "operational", uptime: "99.95%", latency: "2.3s" },
    { name: "Voice Transcription", status: "operational", uptime: "99.91%", latency: "3.1s" },
    { name: "AI Image Detection", status: "operational", uptime: "99.87%", latency: "4.2s" },
    { name: "Knowledge Graph DB", status: "operational", uptime: "99.99%", latency: "45ms" },
    { name: "CDN / Static Assets", status: "operational", uptime: "100%", latency: "12ms" },
    { name: "Authentication Service", status: "operational", uptime: "99.97%", latency: "89ms" },
    { name: "Webhook Delivery", status: "degraded", uptime: "98.4%", latency: "1.2s" },
  ];

  const incidents = [
    { date: "Feb 19, 2026", title: "Webhook delivery delays", desc: "Some webhook deliveries experienced 2-5 minute delays due to queue congestion. Resolved.", severity: "minor" },
    { date: "Feb 10, 2026", title: "Elevated API latency", desc: "Voice transcription latency increased to ~8s for 45 minutes during peak load. Auto-scaled resolving the issue.", severity: "minor" },
    { date: "Jan 30, 2026", title: "Scheduled maintenance", desc: "Database migration completed. All services were restored within the 30-minute maintenance window.", severity: "maintenance" },
  ];

  const statusColor = (s) => s === "operational" ? t.hi || "#4ade80" : s === "degraded" ? t.mid || "#fbbf24" : t.lo || "#f87171";

  return (
    <div style={{ paddingTop: 84, minHeight: "100vh", position: "relative", zIndex: 1 }}>
      <section style={{ padding: "80px 60px 40px", maxWidth: 900, margin: "0 auto" }}>
        <button onClick={() => setPage("landing")} data-mag style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.muted, fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: ".08em", cursor: "pointer", transition: "all .25s", marginBottom: 24 }} onMouseEnter={e => { e.currentTarget.style.color = t.accent; e.currentTarget.style.borderColor = t.accent + "50"; }} onMouseLeave={e => { e.currentTarget.style.color = t.muted; e.currentTarget.style.borderColor = t.border; }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="19 12 5 12" /><polyline points="12 19 5 12 12 5" /></svg>BACK</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 6, height: 32, borderRadius: 3, background: t.hi || "#4ade80" }} />
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: ".3em", color: t.hi || "#4ade80" }}>SYSTEM STATUS</span>
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 64, letterSpacing: ".03em", color: t.text, lineHeight: .95, marginBottom: 16 }}>
          All Systems Operational
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.hi || "#4ade80", boxShadow: `0 0 ${pulse ? 12 : 4}px ${t.hi || "#4ade80"}`, transition: "box-shadow .4s" }} />
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: t.muted }}>Last checked: just now</span>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: "20px 60px 40px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {services.map((s, i) => (
            <div key={i} style={{
              padding: "16px 24px", borderRadius: 10,
              background: t.card, border: `1px solid ${t.border}`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor(s.status) }} />
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: t.text, fontWeight: 500 }}>{s.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: t.faint, letterSpacing: ".06em" }}>{s.latency}</span>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: t.faint, letterSpacing: ".06em" }}>{s.uptime}</span>
                <span style={{
                  fontFamily: "'DM Mono',monospace", fontSize: 9, fontWeight: 700,
                  padding: "2px 8px", borderRadius: 4, letterSpacing: ".08em", textTransform: "uppercase",
                  background: statusColor(s.status) + "15", color: statusColor(s.status), border: `1px solid ${statusColor(s.status)}30`,
                }}>
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent incidents */}
      <section style={{ padding: "20px 60px 60px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: ".06em", color: t.text, marginBottom: 20 }}>RECENT INCIDENTS</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {incidents.map((inc, i) => (
            <div key={i} style={{
              padding: "18px 24px", borderRadius: 10,
              background: t.card, border: `1px solid ${t.border}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: t.faint, letterSpacing: ".1em" }}>{inc.date}</span>
                <span style={{
                  fontFamily: "'DM Mono',monospace", fontSize: 9, fontWeight: 700,
                  padding: "2px 8px", borderRadius: 4, letterSpacing: ".08em", textTransform: "uppercase",
                  background: inc.severity === "minor" ? (t.mid || "#fbbf24") + "15" : t.faint + "15",
                  color: inc.severity === "minor" ? (t.mid || "#fbbf24") : t.muted,
                  border: `1px solid ${inc.severity === "minor" ? (t.mid || "#fbbf24") + "30" : t.faint + "30"}`,
                }}>
                  {inc.severity}
                </span>
              </div>
              <h4 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: t.text, fontWeight: 600, marginBottom: 4 }}>{inc.title}</h4>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, color: t.muted, lineHeight: 1.6 }}>{inc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer t={t} setPage={setPage} />
    </div>
  );
}
