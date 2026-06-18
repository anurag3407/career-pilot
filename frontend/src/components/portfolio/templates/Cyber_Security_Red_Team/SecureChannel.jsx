import { useState, useEffect } from "react";
import { Mail, Github, Linkedin, MapPin, Send, Lock, ArrowUpRight } from "lucide-react";
import { useInView } from "./useInView";
import { usePortfolio } from "../../../../context/PortfolioContext";

const TRANSMISSION_STEPS = [
  "Initializing secure tunnel...",
  "Authenticating headers...",
  "Routing payload to inbox...",
  "Transmission successful.",
];

export function SecureChannel() {
  const { portfolioData } = usePortfolio();
  const personal = portfolioData?.personal || {};
  const socials = portfolioData?.socials || {};

  const CONTACT_LINKS = [
    {
      icon: Mail,
      label: "EMAIL",
      value: socials.email || "Not Available",
      href: socials.email ? `mailto:${socials.email}` : undefined,
    },
    {
      icon: Github,
      label: "GITHUB",
      value: socials.github || "Not Available",
      href: socials.github || undefined,
    },
    {
      icon: Linkedin,
      label: "LINKEDIN",
      value: socials.linkedin || "Not Available",
      href: socials.linkedin || undefined,
    },
    {
      icon: MapPin,
      label: "LOCATION",
      value: personal.location || "Remote",
      href: undefined,
    },
  ];

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("IDLE");
  const [step, setStep] = useState(0);
  const [focusedField, setFocusedField] = useState(null);
  const [leftRef, leftInView] = useInView(0.2);
  const [rightRef, rightInView] = useInView(0.2);

  useEffect(() => {
    if (status !== "SUBMITTING") return;
    setStep(0);
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= TRANSMISSION_STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => setStatus("SUCCESS"), 800);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
    return () => clearInterval(interval);
  }, [status]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("SUBMITTING");
    setTimeout(() => {
      setStatus("IDLE");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 8000);
  };

  const fieldStyle = (name) => ({
    background: "#0B0B0B",
    border: `1px solid ${focusedField === name ? "rgba(255,43,43,0.35)" : "#1A1A1A"}`,
    color: "#F5F5F5",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.78rem",
    outline: "none",
    width: "100%",
    padding: "0.7rem 0.875rem",
    transition: "border-color 0.2s",
  });

  return (
    <section id="contact" className="relative py-32 overflow-hidden bg-[#050505]">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_top_right,rgba(255,43,43,0.04)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,43,43,0.02)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-16">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full bg-[#FF2B2B] opacity-50" />
            <span className="relative inline-flex h-2 w-2 bg-[#FF2B2B]" />
          </div>
          <span className="text-[#FF2B2B] tracking-[0.35em] font-medium font-mono text-[0.7rem]">
            07 // SECURE CHANNEL
          </span>
          <div className="h-px flex-1 bg-[linear-gradient(90deg,#FF2B2B20_0%,transparent_100%)]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-24">
          {/* ── Left: contact info ── */}
          <div
            ref={leftRef}
            className="flex flex-col justify-center"
            style={{
              opacity: leftInView ? 1 : 0,
              transform: leftInView ? "translateX(0)" : "translateX(-20px)",
              transition: "opacity 0.8s, transform 0.8s",
            }}
          >
            <h2
              className="leading-[1.0] text-[#F5F5F5] mb-6"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "clamp(2.5rem,5vw,4rem)", letterSpacing: "-0.01em" }}
            >
              OPEN A<br />
              <span style={{ color: "#FF2B2B" }}>SECURE LINE</span>
            </h2>

            <p className="text-[#888] mb-12 leading-relaxed max-w-md" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem" }}>
              Available for freelance work, full-time opportunities, collaborations, consulting, and exciting projects.
            </p>

            <div className="flex flex-col border-t border-[#1A1A1A]">
              {CONTACT_LINKS.map(({ icon: Icon, label, value, href }) => {
                const Wrapper = href ? "a" : "div";
                return (
                  <Wrapper
                    key={label}
                    href={href}
                    target={href ? "_blank" : undefined}
                    rel={href ? "noopener noreferrer" : undefined}
                    className="group relative flex items-center justify-between py-5 border-b border-[#1A1A1A] hover:border-[#FF2B2B]/40 transition-colors duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF2B2B]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="flex items-center gap-5 relative z-10">
                      <div className="w-10 h-10 bg-[#0A0A0A] border border-[#222] flex items-center justify-center group-hover:bg-[#FF2B2B]/10 group-hover:border-[#FF2B2B]/30 group-hover:text-[#FF2B2B] text-[#666] transition-all duration-300">
                        <Icon size={16} />
                      </div>
                      <div>
                        <span className="text-[#555] block mb-1 tracking-[0.2em] font-mono text-[0.55rem]">{label}</span>
                        <span className="text-[#F5F5F5] font-medium tracking-wide group-hover:text-white transition-colors text-[0.9rem]">{value}</span>
                      </div>
                    </div>
                    {href && (
                      <ArrowUpRight size={16} className="text-[#333] relative z-10 group-hover:text-[#FF2B2B] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                    )}
                  </Wrapper>
                );
              })}
            </div>
          </div>

          {/* ── Right: form ── */}
          <div
            ref={rightRef}
            style={{
              opacity: rightInView ? 1 : 0,
              transform: rightInView ? "translateY(0)" : "translateY(30px)",
              transition: "opacity 0.8s 0.1s, transform 0.8s 0.1s",
            }}
          >
            <div className="bg-[#0A0A0A] border border-[#1A1A1A] p-8 relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF2B2B]/5 blur-[80px] rounded-full pointer-events-none" />

              <div className="flex items-center justify-between mb-8 border-b border-[#1A1A1A] pb-5 relative z-10">
                <div className="flex items-center gap-3">
                  <Lock size={14} className="text-[#FF2B2B]" />
                  <span className="text-[#F5F5F5] tracking-[0.15em] font-mono text-[0.7rem]">TRANSMIT MESSAGE</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" style={{ boxShadow: "0 0 6px rgba(74,222,128,0.8)" }} />
                  <span className="text-[#4ADE80] font-mono text-[0.58rem] tracking-[0.12em]">ENCRYPTED</span>
                </div>
              </div>

              {status === "SUBMITTING" && (
                <div className="flex-1 flex flex-col justify-center gap-3 relative z-10">
                  {TRANSMISSION_STEPS.slice(0, step + 1).map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: i === step ? "#FF2B2B" : "#4ADE80", boxShadow: i === step ? "0 0 6px rgba(255,43,43,0.8)" : "none" }} />
                      <span className="text-[#888] font-mono text-[0.7rem]">{s}</span>
                    </div>
                  ))}
                </div>
              )}

              {status === "SUCCESS" && (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 relative z-10">
                  <div className="w-12 h-12 border border-[#4ADE80]/40 bg-[#4ADE80]/5 flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#4ADE80] rounded-full animate-pulse" style={{ boxShadow: "0 0 10px rgba(74,222,128,0.8)" }} />
                  </div>
                  <span className="text-[#4ADE80] font-mono text-[0.72rem] tracking-[0.1em]">TRANSMISSION SUCCESSFUL</span>
                  <span className="text-[#555] font-mono text-[0.62rem]">Response within 24–48 hours.</span>
                </div>
              )}

              {status === "IDLE" && (
                <form onSubmit={handleSubmit} className="space-y-4 relative z-10 flex-1 flex flex-col">
                  <div className="grid grid-cols-2 gap-4">
                    {(["name", "email"]).map((field) => (
                      <div key={field}>
                        <label htmlFor={field} className="block text-[#333] mb-1.5 tracking-[0.12em] font-mono text-[0.6rem]">
                          {field.toUpperCase()}
                        </label>
                        <input
                          id={field}
                          name={field}
                          type={field === "email" ? "email" : "text"}
                          autoComplete={field === "name" ? "name" : "email"}
                          value={form[field]}
                          onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                          required
                          placeholder={field === "name" ? "John Doe" : "you@org.com"}
                          style={fieldStyle(field)}
                          onFocus={() => setFocusedField(field)}
                          onBlur={() => setFocusedField(null)}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-[#333] mb-1.5 tracking-[0.12em] font-mono text-[0.6rem]">SUBJECT</label>
                    <input
                      id="subject"
                      name="subject"
                      autoComplete="off"
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                      required
                      placeholder="Project Inquiry"
                      style={fieldStyle("subject")}
                      onFocus={() => setFocusedField("subject")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>

                  <div className="flex-1">
                    <label htmlFor="message" className="block text-[#333] mb-1.5 tracking-[0.12em] font-mono text-[0.6rem]">MESSAGE</label>
                    <textarea
                      id="message"
                      name="message"
                      autoComplete="off"
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      required
                      placeholder="Tell me about your project, goals, timeline, and requirements..."
                      rows={5}
                      style={{ ...fieldStyle("message"), resize: "none" }}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 py-3 tracking-[0.15em] transition-all duration-200"
                    style={{
                      background: "#FF2B2B",
                      color: "#F5F5F5",
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      boxShadow: "0 0 30px rgba(255,43,43,0.2)",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.background = "#D60000";
                      el.style.boxShadow = "0 0 40px rgba(255,43,43,0.35)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.background = "#FF2B2B";
                      el.style.boxShadow = "0 0 30px rgba(255,43,43,0.2)";
                    }}
                  >
                    <Send size={13} />
                    TRANSMIT MESSAGE
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}