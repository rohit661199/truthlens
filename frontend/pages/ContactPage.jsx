import { useState } from "react";
import Footer from "../components/Footer";

// ─── CONTACT PAGE ───────────────────────────────────────────────────────────
export default function ContactPage({ t, setPage }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handle = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  const channels = [
    { label: "General Inquiries", value: "hello@truthlens.ai", icon: "✉" },
    { label: "Technical Support", value: "support@truthlens.ai", icon: "⚙" },
    { label: "Press & Media", value: "press@truthlens.ai", icon: "📰" },
    { label: "Partnerships", value: "partners@truthlens.ai", icon: "🤝" },
  ];

  const inputBase = {
    width: "100%", boxSizing: "border-box",
    fontFamily: "'Space Grotesk',sans-serif", fontSize: 13,
    background: t.input || t.card, color: t.text,
    border: `1px solid ${t.border}`, borderRadius: 8,
    padding: "12px 14px", outline: "none",
    transition: "border-color .2s",
  };

  return (
    <div style={{ paddingTop: 84, minHeight: "100vh", position: "relative", zIndex: 1 }}>
      {/* ── Header ─────────────────────── */}
      <section style={{ padding: "80px 60px 40px", maxWidth: 900, margin: "0 auto" }}>
        <button onClick={() => setPage("landing")} data-mag style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.muted, fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: ".08em", cursor: "pointer", transition: "all .25s", marginBottom: 24 }} onMouseEnter={e => { e.currentTarget.style.color = t.accent; e.currentTarget.style.borderColor = t.accent + "50"; }} onMouseLeave={e => { e.currentTarget.style.color = t.muted; e.currentTarget.style.borderColor = t.border; }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="19 12 5 12" /><polyline points="12 19 5 12 12 5" /></svg>BACK</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 6, height: 32, borderRadius: 3, background: t.accent }} />
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, letterSpacing: ".3em", color: t.accent }}>GET IN TOUCH</span>
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 64, letterSpacing: ".03em", color: t.text, lineHeight: .95, marginBottom: 16 }}>
          Contact Us
        </h1>
        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, color: t.muted, lineHeight: 1.7, maxWidth: 560 }}>
          Have questions, feedback, or partnership ideas? We'd love to hear from you. Reach out through any of the channels below.
        </p>
      </section>

      {/* ── Content ────────────────────── */}
      <section style={{ padding: "20px 60px 60px", maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        {/* Left: channels */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: ".05em", color: t.text }}>Contact Channels</h3>
          {channels.map((c, i) => (
            <div key={i} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 22 }}>{c.icon}</span>
              <div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 600, color: t.text }}>{c.label}</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: t.accent, marginTop: 2 }}>{c.value}</div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 12, background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: "18px 20px" }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 6 }}>Office</div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, color: t.muted, lineHeight: 1.7 }}>
              500 Folsom St, Suite 200<br />San Francisco, CA 94105<br />United States
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div>
          <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: ".05em", color: t.text, marginBottom: 18 }}>Send a Message</h3>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input placeholder="Your Name" value={form.name} onChange={handle("name")} style={inputBase} required />
            <input placeholder="Email Address" type="email" value={form.email} onChange={handle("email")} style={inputBase} required />
            <input placeholder="Subject" value={form.subject} onChange={handle("subject")} style={inputBase} required />
            <textarea placeholder="Your message…" rows={6} value={form.message} onChange={handle("message")}
              style={{ ...inputBase, resize: "vertical" }} required />
            <button type="submit" data-mag style={{
              fontFamily: "'Space Grotesk',sans-serif", fontSize: 13, fontWeight: 600,
              color: "#000", background: t.accent, border: "none", borderRadius: 8,
              padding: "12px 0", cursor: "none", letterSpacing: ".08em",
              transition: "opacity .2s",
            }}>
              {sent ? "MESSAGE SENT ✓" : "SEND MESSAGE →"}
            </button>
          </form>
        </div>
      </section>

      <Footer t={t} setPage={setPage} />
    </div>
  );
}
