import { useState } from "react";
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Linkedin, Github } from "lucide-react";

// ── Watercolor blob SVGs used as decorative background splashes ──────────────
const WatercolorBlob = ({ className, color, opacity = 0.18, rotate = 0 }) => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity, transform: `rotate(${rotate}deg)` }}
    aria-hidden="true"
  >
    <path
      fill={color}
      d="M47.5,-62.3C59.3,-53.2,64.9,-36.2,68.1,-19.4C71.3,-2.5,72.1,14.2,65.5,27.3C58.9,40.4,44.9,49.9,30.3,57.1C15.7,64.4,0.5,69.4,-15.5,68.2C-31.5,67,-48.4,59.5,-59.2,47.1C-70,34.7,-74.7,17.3,-72.7,1.2C-70.7,-14.9,-62,-29.8,-50.9,-39.7C-39.8,-49.6,-26.3,-54.5,-12.2,-60.9C1.9,-67.3,35.7,-71.4,47.5,-62.3Z"
      transform="translate(100 100)"
    />
  </svg>
);

const WatercolorBlob2 = ({ className, color, opacity = 0.15, rotate = 0 }) => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ opacity, transform: `rotate(${rotate}deg)` }}
    aria-hidden="true"
  >
    <path
      fill={color}
      d="M38.9,-51.3C50.3,-43.5,59.4,-32,64.2,-18.5C69.1,-5,69.7,10.4,64.2,23.1C58.7,35.9,47.1,46,34.3,53.6C21.5,61.3,7.5,66.5,-7.5,67C-22.5,67.5,-38.5,63.3,-50.2,53.8C-61.9,44.3,-69.3,29.5,-71.1,14C-72.9,-1.5,-69.1,-17.8,-60.4,-30.3C-51.7,-42.8,-38.1,-51.5,-24.4,-57.6C-10.7,-63.7,3.2,-67.2,16.5,-64.3C29.8,-61.4,27.5,-59.1,38.9,-51.3Z"
      transform="translate(100 100)"
    />
  </svg>
);

// ── Ink drip / brush stroke ornament ────────────────────────────────────────
const BrushStroke = ({ className, color }) => (
  <svg viewBox="0 0 120 20" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path
      d="M0,10 Q15,2 30,10 Q45,18 60,10 Q75,2 90,10 Q105,18 120,10"
      stroke={color}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

// ── Social link data ─────────────────────────────────────────────────────────
const socials = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter,   label: "Twitter",   href: "#" },
  { icon: Linkedin,  label: "LinkedIn",  href: "#" },
  { icon: Github,    label: "GitHub",    href: "#" },
];

// ── Contact info items ────────────────────────────────────────────────────────
const contactItems = [
  { icon: Mail,    label: "Email",    value: "hello@yourportfolio.com" },
  { icon: Phone,   label: "Phone",    value: "+1 (555) 234-5678"       },
  { icon: MapPin,  label: "Location", value: "San Francisco, CA"       },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden py-24 px-4"
      style={{ background: "linear-gradient(135deg, #fdf6f0 0%, #fce8f3 40%, #e8f3fc 100%)" }}
    >
      {/* ── Watercolor background splashes ── */}
      <WatercolorBlob
        className="absolute -top-16 -left-16 w-80 h-80 pointer-events-none"
        color="#f687b3"
        opacity={0.22}
        rotate={15}
      />
      <WatercolorBlob2
        className="absolute top-1/3 -right-20 w-96 h-96 pointer-events-none"
        color="#7dd3fc"
        opacity={0.18}
        rotate={-20}
      />
      <WatercolorBlob
        className="absolute -bottom-10 left-1/4 w-72 h-72 pointer-events-none"
        color="#a78bfa"
        opacity={0.15}
        rotate={40}
      />
      <WatercolorBlob2
        className="absolute bottom-20 right-1/3 w-56 h-56 pointer-events-none"
        color="#6ee7b7"
        opacity={0.13}
        rotate={-10}
      />

      {/* ── Floating paint-dot accents ── */}
      {[
        { top: "12%",  left: "8%",  size: 10, color: "#f472b6", delay: "0s"   },
        { top: "22%",  left: "88%", size: 7,  color: "#60a5fa", delay: "0.4s" },
        { top: "60%",  left: "5%",  size: 12, color: "#c084fc", delay: "0.8s" },
        { top: "75%",  left: "92%", size: 8,  color: "#34d399", delay: "0.2s" },
        { top: "88%",  left: "20%", size: 6,  color: "#fbbf24", delay: "0.6s" },
      ].map((dot, i) => (
        <span
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: dot.top,
            left: dot.left,
            width: dot.size,
            height: dot.size,
            background: dot.color,
            opacity: 0.45,
            animation: `floatDot 4s ease-in-out ${dot.delay} infinite alternate`,
          }}
        />
      ))}

      {/* ── CSS keyframes injected inline ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

        @keyframes floatDot {
          from { transform: translateY(0px) scale(1); }
          to   { transform: translateY(-14px) scale(1.2); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes inkSpread {
          from { clip-path: circle(0% at 50% 50%); opacity: 0; }
          to   { clip-path: circle(120% at 50% 50%); opacity: 1; }
        }
        .wc-fade { animation: fadeSlideUp 0.8s ease both; }
        .wc-fade-1 { animation-delay: 0.1s; }
        .wc-fade-2 { animation-delay: 0.25s; }
        .wc-fade-3 { animation-delay: 0.4s; }
        .wc-fade-4 { animation-delay: 0.55s; }
        .wc-fade-5 { animation-delay: 0.7s; }
        .ink-in    { animation: inkSpread 0.6s ease both; }

        .wc-input {
          font-family: 'Lora', serif;
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(6px);
          border: 1.5px solid rgba(200,180,220,0.4);
          border-radius: 0.75rem;
          transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
          width: 100%;
          padding: 0.75rem 1rem;
          outline: none;
          color: #4a3f5c;
          font-size: 0.95rem;
        }
        .wc-input:focus {
          border-color: #c084fc;
          box-shadow: 0 0 0 3px rgba(192,132,252,0.18), 0 2px 16px rgba(192,132,252,0.12);
          background: rgba(255,255,255,0.78);
        }
        .wc-input::placeholder { color: #b9a8cc; }

        .wc-btn {
          font-family: 'Caveat', cursive;
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          background: linear-gradient(135deg, #e879f9 0%, #818cf8 50%, #38bdf8 100%);
          background-size: 200% 200%;
          background-position: 0% 50%;
          color: white;
          border: none;
          border-radius: 999px;
          padding: 0.85rem 2.5rem;
          cursor: pointer;
          transition: background-position 0.5s, transform 0.2s, box-shadow 0.3s;
          box-shadow: 0 4px 20px rgba(168,85,247,0.25);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .wc-btn:hover {
          background-position: 100% 50%;
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 8px 28px rgba(168,85,247,0.38);
        }
        .wc-btn:active { transform: translateY(0) scale(0.98); }

        .card-glass {
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(14px);
          border: 1.5px solid rgba(255,255,255,0.7);
          border-radius: 1.5rem;
          box-shadow: 0 8px 40px rgba(180,140,220,0.13), 0 2px 8px rgba(0,0,0,0.04);
        }

        .social-btn {
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.7);
          border: 1.5px solid rgba(192,132,252,0.25);
          color: #a855f7;
          transition: background 0.3s, transform 0.25s, box-shadow 0.3s;
          cursor: pointer;
          text-decoration: none;
        }
        .social-btn:hover {
          background: linear-gradient(135deg, #f0abfc, #818cf8);
          color: white;
          transform: translateY(-4px) rotate(-6deg);
          box-shadow: 0 6px 20px rgba(168,85,247,0.3);
          border-color: transparent;
        }
      `}</style>

      {/* ── Content wrapper ── */}
      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ── Section heading ── */}
        <div className="text-center mb-14 wc-fade wc-fade-1">
          <p
            style={{ fontFamily: "'Caveat', cursive", color: "#c084fc", fontSize: "1.1rem", letterSpacing: "0.1em" }}
            className="uppercase mb-1"
          >
            Let's connect
          </p>
          <h2
            style={{ fontFamily: "'Caveat', cursive", fontSize: "clamp(2.6rem, 6vw, 4rem)", color: "#4a3f5c", lineHeight: 1.1 }}
          >
            Say Hello 👋
          </h2>
          <BrushStroke className="w-36 mx-auto mt-2" color="#f0abfc" />
          <p
            style={{ fontFamily: "'Lora', serif", color: "#7c6d8a", maxWidth: "38ch", margin: "1rem auto 0" }}
            className="text-base italic leading-relaxed"
          >
            Whether you have a project in mind, a question, or just want to chat about art — my inbox is always open.
          </p>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ── LEFT: contact info + socials ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Info card */}
            <div className="card-glass p-7 wc-fade wc-fade-2">
              <h3
                style={{ fontFamily: "'Caveat', cursive", fontSize: "1.5rem", color: "#7c3aed" }}
                className="mb-5"
              >
                Find me here
              </h3>
              <div className="flex flex-col gap-5">
                {contactItems.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <span
                      className="flex items-center justify-center rounded-xl flex-shrink-0"
                      style={{
                        width: 42, height: 42,
                        background: "linear-gradient(135deg, #f5d0fe 0%, #ddd6fe 100%)",
                        color: "#9333ea",
                      }}
                    >
                      <Icon size={18} strokeWidth={1.8} />
                    </span>
                    <div>
                      <p style={{ fontFamily: "'Caveat', cursive", color: "#c084fc", fontSize: "0.85rem", letterSpacing: "0.08em" }} className="uppercase">
                        {label}
                      </p>
                      <p style={{ fontFamily: "'Lora', serif", color: "#4a3f5c", fontSize: "0.95rem" }}>
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social card */}
            <div className="card-glass p-7 wc-fade wc-fade-3">
              <h3
                style={{ fontFamily: "'Caveat', cursive", fontSize: "1.4rem", color: "#7c3aed" }}
                className="mb-4"
              >
                Follow my work
              </h3>
              <div className="flex gap-3 flex-wrap">
                {socials.map(({ icon: Icon, label, href }) => (
                  <a key={label} href={href} aria-label={label} className="social-btn">
                    <Icon size={18} strokeWidth={1.8} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: contact form ── */}
          <div className="lg:col-span-3 card-glass p-8 wc-fade wc-fade-4">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 ink-in">
                {/* Sent confirmation */}
                <svg viewBox="0 0 80 80" className="w-24 h-24" aria-hidden="true">
                  <circle cx="40" cy="40" r="38" fill="url(#sentGrad)" opacity="0.2" />
                  <circle cx="40" cy="40" r="28" fill="url(#sentGrad)" opacity="0.35" />
                  <defs>
                    <radialGradient id="sentGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#e879f9" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </radialGradient>
                  </defs>
                  <path d="M26,42 L36,52 L54,30" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 style={{ fontFamily: "'Caveat', cursive", fontSize: "2rem", color: "#7c3aed" }}>
                  Message sent! 🎨
                </h3>
                <p style={{ fontFamily: "'Lora', serif", color: "#7c6d8a", textAlign: "center", maxWidth: "28ch" }} className="italic text-sm">
                  Thank you for reaching out. I'll get back to you soon with a splash of creativity!
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}
                  className="wc-btn mt-2"
                  style={{ fontSize: "1rem", padding: "0.65rem 2rem" }}
                >
                  Send another
                </button>
              </div>
            ) : (
              <>
                <h3
                  style={{ fontFamily: "'Caveat', cursive", fontSize: "1.7rem", color: "#7c3aed" }}
                  className="mb-6"
                >
                  Send a message ✉️
                </h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      style={{ fontFamily: "'Caveat', cursive", color: "#9333ea", fontSize: "1rem" }}
                      className="block mb-1"
                    >
                      Your Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Monet Renoir"
                      value={form.name}
                      onChange={handleChange}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused(null)}
                      className="wc-input"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      style={{ fontFamily: "'Caveat', cursive", color: "#9333ea", fontSize: "1rem" }}
                      className="block mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="hello@example.com"
                      value={form.email}
                      onChange={handleChange}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      className="wc-input"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      style={{ fontFamily: "'Caveat', cursive", color: "#9333ea", fontSize: "1rem" }}
                      className="block mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell me about your project or just say hi..."
                      value={form.message}
                      onChange={handleChange}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                      className="wc-input"
                      style={{ resize: "vertical", minHeight: "120px" }}
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end pt-1">
                    <button type="submit" className="wc-btn">
                      <Send size={18} strokeWidth={2} />
                      Send Message
                    </button>
                  </div>

                </form>
              </>
            )}
          </div>

        </div>

        {/* ── Footer note ── */}
        <p
          className="text-center mt-12 wc-fade wc-fade-5"
          style={{ fontFamily: "'Caveat', cursive", color: "#b9a8cc", fontSize: "1rem" }}
        >
          crafted with watercolors &amp; code 🎨
        </p>

      </div>
    </section>
  );
}
