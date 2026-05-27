import { useState, useEffect, useRef } from "react";
import { Mail, MapPin, Linkedin, Send, Instagram, Github } from "lucide-react";

const WatercolorBlob = ({ style, color, opacity = 0.18, size = 400 }) => (
  <svg
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    style={{ position: "absolute", width: size, height: size, opacity, ...style }}
  >
    <path
      fill={color}
      d="M47.7,-63.8C59.6,-54.2,65.6,-37.6,70.3,-20.5C75.1,-3.4,78.6,14.2,72.8,28.2C67,42.3,51.9,52.8,36.4,61.2C20.9,69.6,5,75.9,-12.1,76.2C-29.2,76.5,-47.5,70.8,-59.2,59C-70.9,47.2,-76,29.4,-76.3,11.7C-76.5,-6.1,-71.9,-23.8,-62.1,-37.3C-52.3,-50.8,-37.3,-60.1,-22,-67.2C-6.7,-74.3,9.9,-79.2,24.9,-74.8C39.9,-70.3,53.3,-56.5,47.7,-63.8Z"
      transform="translate(100 100)"
    />
  </svg>
);

const PaintSplatter = ({ style, color }) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    style={{ position: "absolute", width: 80, height: 80, opacity: 0.25, ...style }}
  >
    <circle cx="50" cy="50" r="12" fill={color} />
    <circle cx="30" cy="35" r="6" fill={color} />
    <circle cx="70" cy="30" r="4" fill={color} />
    <circle cx="65" cy="65" r="7" fill={color} />
    <circle cx="28" cy="68" r="5" fill={color} />
    <circle cx="50" cy="20" r="3" fill={color} />
    <circle cx="80" cy="55" r="4" fill={color} />
    <circle cx="20" cy="50" r="3" fill={color} />
  </svg>
);

const BrushStroke = ({ style, color }) => (
  <svg
    viewBox="0 0 300 40"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: 220, height: 28, opacity: 0.35, ...style }}
  >
    <path
      d="M0,20 Q30,8 70,18 Q110,28 150,16 Q190,6 230,20 Q260,28 300,18"
      stroke={color}
      strokeWidth="10"
      fill="none"
      strokeLinecap="round"
      strokeOpacity="0.7"
    />
    <path
      d="M10,24 Q50,14 90,22 Q130,30 170,18 Q210,8 250,22 Q270,26 300,22"
      stroke={color}
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
      strokeOpacity="0.4"
    />
  </svg>
);

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", message: "" });
    }, 3500);
  };

  // Only non-Tailwind-expressible properties remain here
  const inputBaseStyle = {
    caretColor: "#9a7ab0",
    WebkitTextFillColor: "#4a3a5e",
    colorScheme: "light",
    fontFamily: "'DM Serif Display', serif",
    fontSize: "15px",
    boxSizing: "border-box",
  };

  const inputFocusedStyle = {
    background: "rgba(240,228,250,0.85)",
    border: "1.5px solid rgba(180,130,200,0.7)",
    boxShadow: "0 0 0 4px rgba(180,130,200,0.12)",
  };

  const inputBlurStyle = {
    background: "rgba(255,252,255,0.92)",
    border: "1.5px solid rgba(190,160,210,0.35)",
    boxShadow: "none",
  };

  const inputStyle = (field) => ({
    ...inputBaseStyle,
    ...(focused === field ? inputFocusedStyle : inputBlurStyle),
  });

  return (
    // Root scoping class — ALL selectors in the <style> block are prefixed with .watercolor-contact
    <section className="watercolor-contact relative min-h-screen overflow-hidden" style={{
      background: "linear-gradient(135deg, #fdf6ff 0%, #f0e8f8 30%, #e8f4f8 60%, #fef0f5 100%)",
      padding: "80px 20px 80px",
      fontFamily: "'Caveat', cursive",
    }}>
      {/*
        Scoped styles only:
        - Google Fonts import moved here (should ideally live in index.html or global CSS)
        - All keyframes and class selectors are prefixed with .watercolor-contact
        - input/textarea/placeholder/autofill rules scoped to .watercolor-contact
        - No bare global selectors
      */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500&display=swap');

        @keyframes wc-floatA {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-22px) rotate(6deg); }
        }
        @keyframes wc-floatB {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(18px) rotate(-5deg); }
        }
        @keyframes wc-floatC {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(8deg); }
        }
        @keyframes wc-fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wc-successPop {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }

        .watercolor-contact .wc-blob-a { animation: wc-floatA 7s ease-in-out infinite; }
        .watercolor-contact .wc-blob-b { animation: wc-floatB 9s ease-in-out infinite; }
        .watercolor-contact .wc-blob-c { animation: wc-floatC 6s ease-in-out infinite; }
        .watercolor-contact .wc-fade-in-1 { animation: wc-fadeInUp 0.7s ease forwards; opacity: 0; animation-delay: 0.1s; }
        .watercolor-contact .wc-fade-in-2 { animation: wc-fadeInUp 0.7s ease forwards; opacity: 0; animation-delay: 0.3s; }
        .watercolor-contact .wc-fade-in-3 { animation: wc-fadeInUp 0.7s ease forwards; opacity: 0; animation-delay: 0.5s; }
        .watercolor-contact .wc-fade-in-4 { animation: wc-fadeInUp 0.7s ease forwards; opacity: 0; animation-delay: 0.7s; }
        .watercolor-contact .wc-contact-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(160,100,200,0.18); }
        .watercolor-contact .wc-submit-btn:hover { background: rgba(160,100,200,0.88) !important; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(160,100,200,0.35) !important; }
        .watercolor-contact .wc-submit-btn:active { transform: translateY(0); }
        .watercolor-contact .wc-success-msg { animation: wc-successPop 0.5s ease forwards; }

        .watercolor-contact input,
        .watercolor-contact textarea {
          background-color: rgba(255,252,255,0.92) !important;
          color: #4a3a5e !important;
          -webkit-text-fill-color: #4a3a5e !important;
          color-scheme: light;
          outline: none;
          transition: all 0.4s ease;
          width: 100%;
          padding: 12px 16px;
          border-radius: 14px;
        }
        .watercolor-contact input::placeholder,
        .watercolor-contact textarea::placeholder {
          color: #c0aad0 !important;
          opacity: 1;
        }
        .watercolor-contact input:-webkit-autofill,
        .watercolor-contact input:-webkit-autofill:hover,
        .watercolor-contact input:-webkit-autofill:focus,
        .watercolor-contact textarea:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px rgba(240,228,250,0.95) inset !important;
          -webkit-text-fill-color: #4a3a5e !important;
        }

        @media (max-width: 768px) {
          .watercolor-contact .wc-contact-grid { flex-direction: column !important; }
          .watercolor-contact .wc-form-card { padding: 32px 20px !important; }
          .watercolor-contact .wc-info-col { padding: 0 !important; }
        }
      `}</style>

      {/* Background blobs */}
      <div className="wc-blob-a absolute" style={{ top: "-60px", left: "-80px" }}>
        <WatercolorBlob color="#c9a0dc" opacity={0.22} size={420} />
      </div>
      <div className="wc-blob-b absolute" style={{ bottom: "-80px", right: "-60px" }}>
        <WatercolorBlob color="#87ceeb" opacity={0.18} size={380} />
      </div>
      <div className="wc-blob-c absolute" style={{ top: "40%", left: "50%", transform: "translateX(-50%)" }}>
        <WatercolorBlob color="#f4a7b9" opacity={0.13} size={300} />
      </div>

      {/* Paint splatters */}
      <PaintSplatter style={{ top: "12%", right: "8%" }} color="#c9a0dc" />
      <PaintSplatter style={{ bottom: "18%", left: "5%" }} color="#87ceeb" />
      <PaintSplatter style={{ top: "55%", right: "3%" }} color="#f4a7b9" />

      {/* Header */}
      <div
        className={`text-center mb-5 relative z-10 ${mounted ? "wc-fade-in-1" : ""}`}
      >
        <p className="mb-2.5 font-semibold" style={{
          fontFamily: "'Caveat', cursive",
          fontSize: "20px",
          color: "#b07fc4",
          letterSpacing: "3px",
        }}>
          — let's connect —
        </p>
        <h2
          className="m-0 leading-tight italic"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(40px, 8vw, 72px)",
            color: "#4a3a5e",
          }}
        >
          Say Hello
        </h2>
        <div className="flex justify-center mt-3">
          <BrushStroke color="#c9a0dc" />
        </div>
        <p
          className="mt-4"
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "19px",
            color: "#7a6a8a",
            maxWidth: "480px",
            margin: "16px auto 0",
            lineHeight: 1.6,
          }}
        >
          Every great collaboration starts with a simple message. I'd love to hear from you ✨
        </p>
      </div>

      {/* Main content */}
      <div
        className={`wc-contact-grid flex gap-10 max-w-4xl mx-auto mt-12 items-start relative z-10 ${mounted ? "wc-fade-in-2" : ""}`}
      >
        {/* Contact Form */}
        <div
          className="wc-form-card"
          style={{
            flex: "1.4",
            background: "rgba(255,255,255,0.62)",
            borderRadius: "28px",
            padding: "44px 40px",
            backdropFilter: "blur(16px)",
            border: "1.5px solid rgba(200,170,220,0.3)",
            boxShadow: "0 8px 40px rgba(160,100,200,0.1)",
            transition: "box-shadow 0.3s ease",
          }}
        >
          {submitted ? (
            <div className="wc-success-msg text-center py-10 px-5 flex flex-col items-center gap-4">
              <div
                className="w-[70px] h-[70px] rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #c9a0dc, #87ceeb)" }}
              >
                <Send size={30} color="white" />
              </div>
              <h3
                className="m-0 italic"
                style={{ fontFamily: "'DM Serif Display', serif", fontSize: "28px", color: "#4a3a5e" }}
              >
                Message Sent!
              </h3>
              <p style={{ fontFamily: "'Caveat', cursive", fontSize: "18px", color: "#7a6a8a", margin: 0 }}>
                I'll paint a reply your way soon 🎨
              </p>
            </div>
          ) : (
            <>
              <h3
                className="mt-0 mb-7 italic"
                style={{ fontFamily: "'DM Serif Display', serif", fontSize: "26px", color: "#4a3a5e" }}
              >
                Drop me a note
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
                <div>
                  <label className="block mb-[7px] font-medium uppercase tracking-wide" style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    color: "#7a5a96",
                    letterSpacing: "0.8px",
                  }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="What do they call you?"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("name")}
                  />
                </div>

                <div>
                  <label className="block mb-[7px] font-medium uppercase" style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    color: "#7a5a96",
                    letterSpacing: "0.8px",
                  }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("email")}
                  />
                </div>

                <div>
                  <label className="block mb-[7px] font-medium uppercase" style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    color: "#7a5a96",
                    letterSpacing: "0.8px",
                  }}>
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell me about your project, idea, or just say hi..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    style={{
                      ...inputStyle("message"),
                      resize: "vertical",
                      minHeight: "130px",
                      lineHeight: "1.6",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="wc-submit-btn flex items-center justify-center gap-2.5"
                  style={{
                    padding: "14px 28px",
                    background: "rgba(160,100,200,0.78)",
                    color: "white",
                    border: "none",
                    borderRadius: "50px",
                    fontSize: "18px",
                    fontFamily: "'Caveat', cursive",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    letterSpacing: "1px",
                    boxShadow: "0 4px 20px rgba(160,100,200,0.25)",
                    marginTop: "4px",
                  }}
                >
                  <Send size={18} />
                  Send it off
                </button>
              </form>
            </>
          )}
        </div>

        {/* Info Column */}
        <div
          className={`wc-info-col flex flex-col gap-5 pt-2 ${mounted ? "wc-fade-in-3" : ""}`}
          style={{ flex: "1" }}
        >
          {/* Info Cards */}
          {[
            {
              icon: <Mail size={22} color="#c9a0dc" />,
              label: "Email",
              value: "hello@yourportfolio.com",
              color: "rgba(201,160,220,0.15)",
              border: "rgba(201,160,220,0.35)",
            },
            {
              icon: <MapPin size={22} color="#87ceeb" />,
              label: "Location",
              value: "Mumbai, India 🇮🇳",
              color: "rgba(135,206,235,0.15)",
              border: "rgba(135,206,235,0.4)",
            },
            {
              icon: <Linkedin size={22} color="#f4a7b9" />,
              label: "LinkedIn",
              value: "linkedin.com/in/yourname",
              color: "rgba(244,167,185,0.15)",
              border: "rgba(244,167,185,0.4)",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="wc-contact-card flex items-center gap-4"
              style={{
                padding: "20px 22px",
                background: item.color,
                border: `1.5px solid ${item.border}`,
                borderRadius: "20px",
                backdropFilter: "blur(10px)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "default",
              }}
            >
              <div className="flex items-center justify-center shrink-0 rounded-[14px]" style={{
                width: "46px",
                height: "46px",
                background: "rgba(255,255,255,0.7)",
              }}>
                {item.icon}
              </div>
              <div>
                <p className="m-0 mb-[3px] uppercase tracking-wide" style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: "14px",
                  color: "#9a7ab0",
                  letterSpacing: "1px",
                }}>
                  {item.label}
                </p>
                <p className="m-0" style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "16px",
                  color: "#4a3a5e",
                }}>
                  {item.value}
                </p>
              </div>
            </div>
          ))}

          {/* Availability badge */}
          <div
            className="rounded-[20px] p-[18px_22px]"
            style={{
              background: "rgba(135,206,180,0.2)",
              border: "1.5px solid rgba(100,180,150,0.3)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              <span
                className="inline-block rounded-full w-2.5 h-2.5"
                style={{
                  background: "#4caf83",
                  boxShadow: "0 0 0 3px rgba(76,175,131,0.25)",
                }}
              />
              <span className="font-semibold" style={{
                fontFamily: "'Caveat', cursive",
                fontSize: "15px",
                color: "#3a8a63",
              }}>
                Available for work
              </span>
            </div>
            <p className="m-0 leading-relaxed" style={{
              fontFamily: "'Caveat', cursive",
              fontSize: "15px",
              color: "#5a7a6a",
            }}>
              Open to freelance, collaborations &amp; full-time opportunities ✨
            </p>
          </div>

          {/* Social row */}
          <div className={`flex gap-3 justify-center mt-1.5 ${mounted ? "wc-fade-in-4" : ""}`}>
            {[
              { icon: <Github size={20} />, label: "GitHub", color: "#6e5a82" },
              { icon: <Instagram size={20} />, label: "Instagram", color: "#c9a0dc" },
              { icon: <Linkedin size={20} />, label: "LinkedIn", color: "#87ceeb" },
            ].map((s, i) => (
              <button
                key={i}
                aria-label={s.label}
                className="flex items-center justify-center rounded-[14px] cursor-pointer"
                style={{
                  width: "46px",
                  height: "46px",
                  background: "rgba(255,255,255,0.6)",
                  border: "1.5px solid rgba(200,170,220,0.35)",
                  color: s.color,
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(8px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(200,170,220,0.25)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.6)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {s.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer quote */}
      <div className="text-center mt-[70px] relative z-10">
        <BrushStroke color="#f4a7b9" style={{ margin: "0 auto 18px", display: "block" }} />
        <p
          className="m-0 italic"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "18px",
            color: "#9a7ab0",
          }}
        >
          "Art is not what you see, but what you make others see."
        </p>
        <p
          className="mt-1.5"
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: "15px",
            color: "#b0a0c0",
          }}
        >
          — Edgar Degas
        </p>
      </div>
    </section>
  );
}
