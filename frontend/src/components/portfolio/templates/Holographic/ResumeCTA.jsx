import { useEffect, useRef } from "react";
import { Download, Eye } from "lucide-react";

/* ─── default data ──────────────────────────────────────────── */
const DEFAULT_DATA = {
  eyebrow: "Download Resume",
  heading: ["Ready to make", "an impression?"],
  body:
    "Every opportunity starts with a single document. My resume captures the full spectrum of my work — engineered to stand out in any dimension.",
  stats: [
    { value: "5+", label: "Years experience" },
    { value: "40+", label: "Projects shipped" },
    { value: "12", label: "Technologies" },
  ],
  resumeUrl: "#",
  previewUrl: "#",
};

/* ─── tiny particle hook ────────────────────────────────────── */
function useParticles(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const colors = ["#7b2fff", "#00e5ff", "#ff4de0", "#ffffff"];
    const particles = [];

    for (let i = 0; i < 20; i++) {
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
        animation: `holo-float ${3 + Math.random() * 4}s linear ${
          Math.random() * 5
        }s infinite`,
      });
      el.appendChild(p);
      particles.push(p);
    }

    return () => particles.forEach((p) => p.remove());
  }, [ref]);
}

/* ─── main component ────────────────────────────────────────── */
export default function ResumeCTA({ data = DEFAULT_DATA }) {
  const particleRef = useRef(null);
  useParticles(particleRef);

  const {
    eyebrow,
    heading,
    body,
    stats,
    resumeUrl,
    previewUrl,
  } = { ...DEFAULT_DATA, ...data };

  return (
    <>
      {/* ── keyframes injected once ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600&display=swap');

        @keyframes holo-border {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes holo-shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes holo-float {
          0%   { transform: translateY(0) scale(0);   opacity: 0; }
          10%  { opacity: 0.85; }
          90%  { opacity: 0.55; }
          100% { transform: translateY(-260px) scale(1.6); opacity: 0; }
        }

        .holo-border-anim {
          animation: holo-border 4s ease infinite;
        }
        .holo-bar-anim {
          animation: holo-border 3s ease infinite;
        }
        .holo-shimmer-text {
          background: linear-gradient(135deg,
            #ffffff 0%, #c4b5fd 38%, #00e5ff 65%, #ff4de0 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: holo-shimmer 3s linear infinite;
        }
        .holo-btn-primary:hover  { transform: translateY(-2px); opacity: 0.88; }
        .holo-btn-primary:active { transform: scale(0.97); }
        .holo-btn-secondary:hover {
          background: rgba(0,229,255,0.08);
          border-color: rgba(0,229,255,0.9);
          transform: translateY(-2px);
        }
        .holo-btn-secondary:active { transform: scale(0.97); }
      `}</style>

      {/* ── section wrapper ── */}
      <section
        className="relative flex items-center justify-center overflow-hidden px-4 py-16 sm:py-20 min-h-[520px]"
        style={{
          background: "#050510",
          fontFamily: "'Rajdhani', sans-serif",
        }}
      >
        {/* background grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(120,220,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(120,220,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "44px 44px",
          }}
        />

        {/* ambient orbs */}
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 360, height: 360,
            background: "#7b2fff",
            top: -80, left: -80,
            filter: "blur(80px)",
            opacity: 0.22,
          }}
        />
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 300, height: 300,
            background: "#00e5ff",
            bottom: -60, right: -60,
            filter: "blur(80px)",
            opacity: 0.2,
          }}
        />
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 200, height: 200,
            background: "#ff4de0",
            top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            filter: "blur(80px)",
            opacity: 0.12,
          }}
        />

        {/* ── animated gradient border card ── */}
        <div
          className="relative w-full max-w-2xl rounded-[20px] p-[3px] holo-border-anim"
          style={{
            background:
              "linear-gradient(135deg,rgba(123,47,255,0.9),rgba(0,229,255,0.9),rgba(255,77,224,0.9),rgba(123,47,255,0.9))",
            backgroundSize: "300% 300%",
          }}
        >
          {/* inner card */}
          <div
            className="relative rounded-[18px] px-8 py-12 sm:px-12 overflow-hidden"
            style={{ background: "rgba(5,5,22,0.93)" }}
            ref={particleRef}
          >
            {/* scanlines */}
            <div
              className="absolute inset-0 rounded-[18px] pointer-events-none"
              style={{
                background:
                  "repeating-linear-gradient(0deg,rgba(255,255,255,0.015) 0px,rgba(255,255,255,0.015) 1px,transparent 1px,transparent 4px)",
              }}
            />

            {/* corner brackets */}
            <div
              className="absolute top-5 left-5 w-9 h-9 pointer-events-none"
              style={{
                borderTop: "2px solid rgba(0,229,255,0.6)",
                borderLeft: "2px solid rgba(0,229,255,0.6)",
              }}
            />
            <div
              className="absolute bottom-5 right-5 w-9 h-9 pointer-events-none"
              style={{
                borderBottom: "2px solid rgba(123,47,255,0.6)",
                borderRight: "2px solid rgba(123,47,255,0.6)",
              }}
            />

            {/* ── content ── */}

            {/* eyebrow */}
            <div
              className="flex items-center gap-3 mb-5"
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: 11,
                fontWeight: 400,
                letterSpacing: "5px",
                textTransform: "uppercase",
                color: "#00e5ff",
              }}
            >
              <span
                className="flex-1 max-w-[80px] h-px"
                style={{ background: "linear-gradient(90deg,#00e5ff,transparent)" }}
              />
              {eyebrow}
              <span
                className="flex-1 max-w-[80px] h-px"
                style={{ background: "linear-gradient(90deg,transparent,#00e5ff)" }}
              />
            </div>

            {/* heading */}
            <h2
              className="holo-shimmer-text mb-4 leading-tight"
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: "clamp(26px, 5vw, 46px)",
                fontWeight: 900,
              }}
            >
              {Array.isArray(heading) ? heading.join("\n") : heading}
            </h2>

            {/* body */}
            <p
              className="mb-8"
              style={{
                fontSize: 17,
                fontWeight: 300,
                color: "rgba(200,210,255,0.75)",
                lineHeight: 1.65,
                maxWidth: 520,
              }}
            >
              {body}
            </p>

            {/* prism bar */}
            <div
              className="w-full rounded-sm mb-8 holo-bar-anim"
              style={{
                height: 3,
                background:
                  "linear-gradient(90deg,#7b2fff,#00e5ff,#ff4de0,#7b2fff)",
                backgroundSize: "200% 100%",
                opacity: 0.6,
              }}
            />

            {/* stats */}
            <div className="flex flex-wrap gap-6 sm:gap-8 mb-10">
              {stats.map(({ value, label }, i) => (
                <div key={label} className="flex items-stretch gap-6 sm:gap-8">
                  {i > 0 && (
                    <div
                      className="w-px self-stretch"
                      style={{
                        background:
                          "linear-gradient(180deg,transparent,rgba(0,229,255,0.4),transparent)",
                      }}
                    />
                  )}
                  <div>
                    <div
                      style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: "clamp(22px,3.5vw,30px)",
                        fontWeight: 700,
                        lineHeight: 1,
                        background: "linear-gradient(135deg,#00e5ff,#7b2fff)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {value}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 400,
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: "rgba(150,160,200,0.7)",
                        marginTop: 4,
                      }}
                    >
                      {label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* primary */}
              <a
                href={resumeUrl}
                download
                className="holo-btn-primary inline-flex items-center gap-2.5 no-underline transition-all duration-200"
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  padding: "14px 32px",
                  borderRadius: 8,
                  border: "none",
                  background: "linear-gradient(135deg,#7b2fff,#00e5ff)",
                  color: "#ffffff",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                {/* sheen */}
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg,rgba(255,255,255,0.15),transparent)",
                    borderRadius: 8,
                  }}
                />
                <Download size={18} strokeWidth={2} />
                Download PDF
              </a>

              {/* secondary */}
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="holo-btn-secondary inline-flex items-center gap-2.5 no-underline transition-all duration-200"
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: 13,
                  fontWeight: 400,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  padding: "13px 28px",
                  borderRadius: 8,
                  background: "transparent",
                  color: "#00e5ff",
                  border: "1px solid rgba(0,229,255,0.5)",
                  cursor: "pointer",
                }}
              >
                <Eye size={16} strokeWidth={2} />
                Preview Online
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
