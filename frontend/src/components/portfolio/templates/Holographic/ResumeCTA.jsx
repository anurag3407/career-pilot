import { useEffect, useRef } from "react";
import { Download, Eye } from "lucide-react";

// Update this date periodically to reflect the resume's last update
const RESUME_LAST_UPDATED = new Date()
  .toLocaleDateString("en-US", { month: "short", year: "numeric" })
  .toUpperCase();

// FIX 2: URL sanitizer to prevent javascript: XSS attacks
const safeUrl = (url) =>
  url && (url.startsWith("https://") || url.startsWith("http://") || url === "#")
    ? url
    : "#";

const DEFAULT_DATA = {
  eyebrow: "Download Resume",
  heading: ["Ready to make", "an impression?"],
  body: "Every opportunity starts with a single document. My resume captures the full spectrum of my work — engineered to stand out in any dimension.",
  stats: [
    { value: "5+", label: "Years experience" },
    { value: "40+", label: "Projects shipped" },
    { value: "12", label: "Technologies" },
  ],
  resumeUrl: "#",
  previewUrl: "#",
};

function useParticles(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const colors = ["#7b2fff", "#00e5ff", "#ff4de0", "#ffffff"];
    const particles = [];
    for (let i = 0; i < 22; i++) {
      const p = document.createElement("div");
      const size = Math.random() * 5 + 2;
      Object.assign(p.style, {
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: colors[Math.floor(Math.random() * colors.length)],
        left: `${Math.random() * 100}%`,
        bottom: `${Math.random() * 30}px`,
        pointerEvents: "none",
        opacity: "0",
        animation: `holoFloat ${3 + Math.random() * 4}s linear ${Math.random() * 5}s infinite`,
      });
      el.appendChild(p);
      particles.push(p);
    }
    return () => particles.forEach((p) => p.remove());
  }, [ref]);
}

export default function ResumeCTA({ data = DEFAULT_DATA }) {
  const particleRef = useRef(null);
  useParticles(particleRef);

  const { eyebrow, heading, body, stats, resumeUrl, previewUrl } = {
    ...DEFAULT_DATA,
    ...data,
  };

  // FIX 1: Normalize stats to array to prevent .map crash
  const safeStats = Array.isArray(stats) ? stats : DEFAULT_DATA.stats;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600&display=swap');

        @keyframes holoBorder {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes holoShimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes holoFloat {
          0%   { transform: translateY(0) scale(0);   opacity: 0; }
          10%  { opacity: 0.85; }
          90%  { opacity: 0.55; }
          100% { transform: translateY(-280px) scale(1.8); opacity: 0; }
        }
        @keyframes scanlineMove {
          0%   { transform: translateY(-100%); opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 0.6; }
          100% { transform: translateY(600px); opacity: 0; }
        }
        @keyframes pulseRing {
          0%,100% { transform: scale(0.95); opacity: 0.5; }
          50%     { transform: scale(1.05); opacity: 0.15; }
        }
        @keyframes orb1 {
          0%,100% { transform: translate(0,0); }
          50%     { transform: translate(40px,-30px); }
        }
        @keyframes orb2 {
          0%,100% { transform: translate(0,0); }
          50%     { transform: translate(-30px,40px); }
        }
        @keyframes orb3 {
          0%,100% { transform: translate(0,0); }
          33%     { transform: translate(25px,25px); }
          66%     { transform: translate(-15px,-20px); }
        }
        @keyframes cornerPulse {
          0%,100% { opacity: 0.6; }
          50%     { opacity: 1; }
        }
        @keyframes badgeFloat {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-5px); }
        }
        @keyframes prismBar {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes btnShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes glitch {
          0%,95%,100% { clip-path: none; transform: none; }
          96% { clip-path: inset(20% 0 50% 0); transform: translate(-3px,0); }
          97% { clip-path: inset(60% 0 10% 0); transform: translate(3px,0); }
          98% { clip-path: inset(40% 0 30% 0); transform: translate(-2px,0); }
        }

        .holo-btn-primary:hover  { opacity: 0.88; transform: translateY(-2px); }
        .holo-btn-primary:active { transform: scale(0.97); }
        .holo-btn-secondary:hover {
          background: rgba(0,229,255,0.08) !important;
          border-color: rgba(0,229,255,0.9) !important;
          transform: translateY(-2px);
        }
        .holo-btn-secondary:active { transform: scale(0.97); }
      `}</style>

      <section
        className="relative flex items-center justify-center overflow-hidden px-5 py-16 sm:py-20 min-h-[560px]"
        style={{ background: "#050510", fontFamily: "'Rajdhani', sans-serif" }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,229,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.04) 1px,transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        {/* Ambient orbs */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 380, height: 380,
            background: "#7b2fff",
            top: -80, left: -80,
            filter: "blur(80px)", opacity: 0.22,
            animation: "orb1 9s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 320, height: 320,
            background: "#00e5ff",
            bottom: -60, right: -60,
            filter: "blur(80px)", opacity: 0.2,
            animation: "orb2 11s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 220, height: 220,
            background: "#ff4de0",
            top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            filter: "blur(80px)", opacity: 0.14,
            animation: "orb3 13s ease-in-out infinite",
          }}
        />

        {/* Pulse rings */}
        {[
          { size: 500, delay: "0s" },
          { size: 750, delay: "0.8s" },
        ].map(({ size, delay }, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: size, height: size,
              top: "50%", left: "50%",
              marginTop: -size / 2, marginLeft: -size / 2,
              border: "1px solid rgba(0,229,255,0.12)",
              animation: `pulseRing 3.5s ease-in-out ${delay} infinite`,
            }}
          />
        ))}

        {/* Scanline */}
        <div
          className="absolute left-0 right-0 h-[2px] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(0,229,255,0.25),rgba(123,47,255,0.25),transparent)",
            animation: "scanlineMove 8s linear infinite",
          }}
        />

        {/* Card with animated holographic border */}
        <div
          className="relative w-full max-w-2xl rounded-[22px] z-10"
          style={{
            padding: "3px",
            background:
              "linear-gradient(135deg,rgba(123,47,255,0.9),rgba(0,229,255,0.9),rgba(255,77,224,0.9),rgba(123,47,255,0.9))",
            backgroundSize: "300% 300%",
            animation: "holoBorder 4s ease infinite",
          }}
        >
          <div
            className="relative rounded-[20px] px-8 py-12 sm:px-11 overflow-hidden"
            style={{ background: "rgba(5,5,22,0.95)" }}
            ref={particleRef}
          >
            {/* Scanlines inner */}
            <div
              className="absolute inset-0 rounded-[20px] pointer-events-none"
              style={{
                background:
                  "repeating-linear-gradient(0deg,rgba(255,255,255,0.012) 0px,rgba(255,255,255,0.012) 1px,transparent 1px,transparent 4px)",
              }}
            />

            {/* Corner brackets */}
            {[
              { cls: "top-4 left-4", style: { borderTop: "2px solid rgba(0,229,255,0.7)", borderLeft: "2px solid rgba(0,229,255,0.7)", animationDelay: "0s" } },
              { cls: "top-4 right-4", style: { borderTop: "2px solid rgba(255,77,224,0.5)", borderRight: "2px solid rgba(255,77,224,0.5)", animationDelay: "0.6s" } },
              { cls: "bottom-4 left-4", style: { borderBottom: "2px solid rgba(255,77,224,0.5)", borderLeft: "2px solid rgba(255,77,224,0.5)", animationDelay: "1.2s" } },
              { cls: "bottom-4 right-4", style: { borderBottom: "2px solid rgba(0,229,255,0.7)", borderRight: "2px solid rgba(0,229,255,0.7)", animationDelay: "1.8s" } },
            ].map(({ cls, style }, i) => (
              <div
                key={i}
                className={`absolute w-10 h-10 pointer-events-none ${cls}`}
                style={{ ...style, animation: `cornerPulse 2.5s ease-in-out ${style.animationDelay} infinite` }}
              />
            ))}

            {/* Eyebrow */}
            <div
              className="flex items-center gap-3 mb-5"
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: 11, fontWeight: 400,
                letterSpacing: "5px", textTransform: "uppercase",
                color: "#00e5ff",
                animation: "badgeFloat 4s ease-in-out infinite",
              }}
            >
              <span className="flex-1 max-w-[80px] h-px" style={{ background: "linear-gradient(90deg,#00e5ff,transparent)" }} />
              {eyebrow}
              <span className="flex-1 max-w-[80px] h-px" style={{ background: "linear-gradient(90deg,transparent,#00e5ff)" }} />
            </div>

            {/* Headline with glitch overlay */}
            <div className="relative mb-4">
              <h2
                className="leading-tight"
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "clamp(28px,5vw,48px)", fontWeight: 900,
                  background: "linear-gradient(135deg,#fff 0%,#c4b5fd 35%,#00e5ff 60%,#ff4de0 100%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "holoShimmer 3s linear infinite",
                }}
              >
                {Array.isArray(heading) ? heading.map((line, i) => (
                  <span key={i}>{line}{i < heading.length - 1 && <br />}</span>
                )) : heading}
              </h2>
              {/* Glitch ghost */}
              <div
                aria-hidden="true"
                className="absolute inset-0 leading-tight pointer-events-none"
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "clamp(28px,5vw,48px)", fontWeight: 900,
                  background: "linear-gradient(135deg,#ff4de0,#7b2fff)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "glitch 6s infinite", opacity: 0.7,
                }}
              >
                {Array.isArray(heading) ? heading.map((line, i) => (
                  <span key={i}>{line}{i < heading.length - 1 && <br />}</span>
                )) : heading}
              </div>
            </div>

            {/* Body */}
            <p className="mb-7" style={{ fontSize: 17, fontWeight: 300, color: "rgba(200,210,255,0.75)", lineHeight: 1.65, maxWidth: 520 }}>
              {body}
            </p>

            {/* Prism bar */}
            <div
              className="w-full rounded-sm mb-7"
              style={{
                height: 3,
                background: "linear-gradient(90deg,#7b2fff,#00e5ff,#ff4de0,#7b2fff)",
                backgroundSize: "200% 100%",
                opacity: 0.65,
                animation: "prismBar 3s linear infinite",
              }}
            />

            {/* Stats — FIX 1: using safeStats instead of stats */}
            <div className="flex flex-wrap gap-0 mb-9">
              {safeStats.map(({ value, label }, i) => (
                <div key={label} className="flex items-stretch">
                  {i > 0 && (
                    <div className="w-px mx-6 self-stretch" style={{ background: "linear-gradient(180deg,transparent,rgba(0,229,255,0.4),transparent)" }} />
                  )}
                  <div>
                    <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "clamp(22px,3.5vw,30px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,#00e5ff,#7b2fff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                      {value}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 400, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(150,160,200,0.7)", marginTop: 5 }}>
                      {label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Primary button */}
              <div
                className="relative rounded-[10px]"
                style={{
                  padding: "2px",
                  background: "linear-gradient(135deg,#7b2fff,#00e5ff,#ff4de0,#7b2fff)",
                  backgroundSize: "300% 300%",
                  animation: "holoBorder 3s ease infinite",
                }}
              >
                <a
                  href={resumeUrl}
                  download
                  className="holo-btn-primary relative inline-flex items-center gap-2.5 no-underline transition-all duration-200"
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: 12, fontWeight: 700,
                    letterSpacing: "2px", textTransform: "uppercase",
                    padding: "14px 32px", borderRadius: 9,
                    background: "linear-gradient(135deg,#7b2fff,#00e5ff)",
                    color: "#ffffff", overflow: "hidden",
                  }}
                >
                  <span className="absolute inset-0 pointer-events-none rounded-[9px]" style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.18),transparent)" }} />
                  <span className="absolute top-0 bottom-0 w-[40%] pointer-events-none" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)", animation: "btnShimmer 3s ease-in-out infinite" }} />
                  <Download size={18} strokeWidth={2} />
                  Download PDF
                </a>
              </div>

              {/* Secondary button — FIX 2: safeUrl sanitizes previewUrl */}
              <a
                href={safeUrl(previewUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="holo-btn-secondary inline-flex items-center gap-2.5 no-underline transition-all duration-200"
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: 12, fontWeight: 400,
                  letterSpacing: "2px", textTransform: "uppercase",
                  padding: "13px 28px", borderRadius: 9,
                  background: "transparent", color: "#00e5ff",
                  border: "1px solid rgba(0,229,255,0.5)",
                }}
              >
                <Eye size={16} strokeWidth={2} />
                Preview Online
              </a>
            </div>

            {/* Footnote — FIX 3: dynamic date */}
            <div
              className="mt-6 flex items-center gap-2"
              style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, letterSpacing: "2px", color: "rgba(120,130,160,0.65)" }}
            >
              <span className="w-[5px] h-[5px] rounded-full" style={{ background: "#00e5ff", opacity: 0.5 }} />
              PDF · UPDATED {RESUME_LAST_UPDATED} · 1 PAGE
            </div>
          </div>
        </div>
      </section>
    </>
  );
}