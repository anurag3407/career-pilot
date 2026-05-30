import { useEffect, useRef, useState, useCallback } from "react";
import { Download, Mail, FileText, ExternalLink } from "lucide-react";

/* ─── Global styles injected once ─────────────────────────── */
const STYLES = `
  @keyframes glitch-main {
    0%,100% { transform: translate(0);      filter: blur(0px); }
    30%      { transform: translate(-1px,0); filter: blur(0.4px); }
    60%      { transform: translate(1px, 0); filter: blur(0.4px); }
  }
  @keyframes glitch-r {
    0%,100% { transform: translate(0);     opacity: 0.7; filter: blur(0.5px); }
    40%      { transform: translate(2px,0); opacity: 0.9; filter: blur(0px); }
    70%      { transform: translate(-1px,0);opacity: 0.6; filter: blur(1px); }
  }
  @keyframes glitch-g {
    0%,100% { transform: translate(0);      opacity: 0.7; filter: blur(0.5px); }
    40%      { transform: translate(-2px,0); opacity: 0.9; filter: blur(0px); }
    70%      { transform: translate(1px, 0); opacity: 0.6; filter: blur(1px); }
  }
  @keyframes blink {
    0%,100% { opacity: 1; } 50% { opacity: 0; }
  }
  @keyframes fade-up {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes glow-green {
    0%,100% { box-shadow: 0 0 6px #00ff4166; }
    50%      { box-shadow: 0 0 18px #00ff41aa; }
  }
  @keyframes glow-red {
    0%,100% { box-shadow: 0 0 6px #ff004466; }
    50%      { box-shadow: 0 0 18px #ff0044aa; }
  }
  .rcta-btn-dl {
    display: inline-flex; align-items: center; gap: 9px;
    padding: 13px 26px;
    border: 1px solid #00ff41; color: #00ff41; background: transparent;
    font-size: 12px; font-weight: 700; letter-spacing: 0.12em;
    text-decoration: none; cursor: pointer;
    font-family: 'Courier New', monospace;
    transition: background 0.15s, color 0.15s, box-shadow 0.15s;
    animation: glow-green 3s ease-in-out infinite;
  }
  .rcta-btn-dl:hover {
    background: #00ff41; color: #000;
    box-shadow: 0 0 22px #00ff41, 0 0 44px #00ff4155;
  }
  .rcta-btn-contact {
    display: inline-flex; align-items: center; gap: 9px;
    padding: 13px 26px;
    border: 1px solid #ff0044; color: #ff0044; background: transparent;
    font-size: 12px; font-weight: 700; letter-spacing: 0.12em;
    text-decoration: none; cursor: pointer;
    font-family: 'Courier New', monospace;
    transition: background 0.15s, color 0.15s, box-shadow 0.15s;
    animation: glow-red 3s ease-in-out infinite 1.5s;
  }
  .rcta-btn-contact:hover {
    background: #ff0044; color: #fff;
    box-shadow: 0 0 22px #ff0044, 0 0 44px #ff004455;
  }
  .rcta-stat:hover {
    border-color: #00ff41 !important;
    box-shadow: 0 0 10px #00ff4133 !important;
  }
`;

/* ─── Matrix Rain ──────────────────────────────────────────── */
const MatrixRain = () => {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const stateRef  = useRef({ drops: [], cols: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const FONT_SIZE = 13;
    const CHARS =
      "アイウエオカキクケコサシスセソ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>[]{}|\\!@#$";

    ctx.font = `${FONT_SIZE}px monospace`; // set once

    const init = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const cols = Math.floor(canvas.width / FONT_SIZE);
      stateRef.current = { drops: Array(cols).fill(1), cols };
    };

    let lastTime = 0;
    const INTERVAL = 42; // ~24 fps — smooth but cheap

    const draw = (timestamp) => {
      if (timestamp - lastTime >= INTERVAL) {
        lastTime = timestamp;
        const { drops, cols } = stateRef.current;
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < cols; i++) {
          const char = CHARS[Math.floor(Math.random() * CHARS.length)];
          const isRed    = Math.random() < 0.04;
          const isBright = Math.random() < 0.1;
          ctx.fillStyle = isRed
            ? (isBright ? "#ff0044" : "#880022")
            : (isBright ? "#00ff41" : "#007a1f");
          ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);

          if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975)
            drops[i] = 0;
          drops[i]++;
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    init();
    const onResize = () => init();
    window.addEventListener("resize", onResize);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        opacity: 0.38, display: "block",
      }}
    />
  );
};

/* ─── Glitch Heading ───────────────────────────────────────── */
const GlitchHeading = ({ text, color }) => {
  const [on, setOn] = useState(false);
  const timerRef = useRef(null);

  const start = useCallback(() => {
    setOn(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOn(false), 550);
  }, []);

  return (
    <span
      onMouseEnter={start}
      style={{
        position: "relative", display: "inline-block",
        cursor: "default", userSelect: "none",
        animation: on ? "glitch-main 0.25s ease-in-out infinite" : "none",
        transition: "filter 0.1s",
        color, textShadow: `0 0 18px ${color}55`,
      }}
    >
      {text}
      {on && (
        <>
          <span aria-hidden style={{
            position: "absolute", inset: 0, color: "#ff0044",
            animation: "glitch-r 0.3s ease-in-out infinite",
            clipPath: "polygon(0 25%, 100% 25%, 100% 45%, 0 45%)",
          }}>{text}</span>
          <span aria-hidden style={{
            position: "absolute", inset: 0, color: "#00ff41",
            animation: "glitch-g 0.35s ease-in-out infinite 0.05s",
            clipPath: "polygon(0 60%, 100% 60%, 100% 78%, 0 78%)",
          }}>{text}</span>
        </>
      )}
    </span>
  );
};

/* ─── Typewriter ───────────────────────────────────────────── */
const Typewriter = ({ text, delay = 0 }) => {
  const [display, setDisplay] = useState("");
  const [done, setDone]       = useState(false);

  useEffect(() => {
    let t1, t2;
    t1 = setTimeout(() => {
      let i = 0;
      t2 = setInterval(() => {
        i++;
        setDisplay(text.slice(0, i));
        if (i >= text.length) { clearInterval(t2); setDone(true); }
      }, 40);
    }, delay);
    return () => { clearTimeout(t1); clearInterval(t2); };
  }, [text, delay]);

  return (
    <span>
      {display}
      {!done && (
        <span style={{ animation: "blink 0.7s infinite", color: "#00ff41" }}>_</span>
      )}
    </span>
  );
};

/* ─── ResumeCTA ────────────────────────────────────────────── */
const ResumeCTA = ({
  resumeUrl   = "/resume.pdf",
  contactHref = "#contact",
  linkedInUrl = "#",
  stats = [
    { label: "Projects Built",  value: "20+",    color: "#00ff41" },
    { label: "Bugs Squashed",   value: "500+",   color: "#ff0044" },
    { label: "GitHub Commits",  value: "1.2k+",  color: "#00aaff" },
    { label: "CTF Challenges",  value: "80+",    color: "#ffaa00" },
  ],
}) => (
  <section style={{
    position: "relative", width: "100%", overflow: "hidden",
    minHeight: "100vh", background: "#000",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "4rem 5vw",
    fontFamily: "'Courier New', Courier, monospace",
  }}>
    {/* inject global keyframes once */}
    <style>{STYLES}</style>

    <MatrixRain />

    {/* scanline texture */}
    <div aria-hidden style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      background: "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)",
    }} />

    {/* card */}
    <div style={{
      position: "relative", zIndex: 2, width: "100%", maxWidth: "1100px",
      animation: "fade-up 0.7s ease forwards",
    }}>
      <div style={{
        border: "1px solid #00ff41",
        background: "rgba(0,0,0,0.82)",
        backdropFilter: "blur(6px)",
      }}>

        {/* title bar */}
        <div style={{
          borderBottom: "1px solid #1a3a1a",
          padding: "8px 16px",
          display: "flex", alignItems: "center", gap: "8px",
          background: "rgba(0,255,65,0.04)",
        }}>
          {["#ff0044","#ffaa00","#00ff41"].map((c) => (
            <div key={c} style={{
              width: 9, height: 9, borderRadius: "50%",
              background: c, boxShadow: `0 0 5px ${c}`,
            }} />
          ))}
          <span style={{ marginLeft: 8, color: "#00ff41", fontSize: 11, letterSpacing: "0.14em", opacity: 0.7 }}>
            portfolio.sh
          </span>
        </div>

        {/* body */}
        <div style={{ padding: "2.5rem 3rem 3rem" }}>

          {/* prompt line */}
          <p style={{ color: "#555", fontSize: 12, margin: "0 0 1.25rem", letterSpacing: "0.04em" }}>
            <span style={{ color: "#ff0044" }}>user@portfolio</span>
            <span style={{ color: "#666" }}>:~$</span>{" "}
            <Typewriter text="open resume.pdf" delay={300} />
          </p>

          {/* heading */}
          <h2 style={{
            fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
            fontWeight: 900, lineHeight: 1.05,
            letterSpacing: "0.06em", margin: "0 0 0.2rem",
          }}>
            <GlitchHeading text="GET MY" color="#00ff41" />
          </h2>
          <h2 style={{
            fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
            fontWeight: 900, lineHeight: 1.05,
            letterSpacing: "0.06em", margin: "0 0 1.25rem",
          }}>
            <GlitchHeading text="RESUME" color="#ff0044" />
          </h2>

          {/* subtitle */}
          <p style={{ color: "#666", fontSize: 14, margin: "0 0 2.25rem", letterSpacing: "0.08em" }}>
            <span style={{ color: "#333" }}>// </span>
            <Typewriter text="full-stack developer · security enthusiast · open to work" delay={900} />
          </p>

          {/* stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 12, marginBottom: "2rem",
          }}>
            {stats.map(({ label, value, color }) => (
              <div key={label} className="rcta-stat" style={{
                border: "1px solid rgba(0,255,65,0.2)",
                padding: "16px 12px", textAlign: "center",
                background: "rgba(0,255,65,0.025)",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}>
                <div style={{
                  fontSize: "clamp(1.2rem, 2vw, 1.9rem)",
                  fontWeight: 900, color,
                  textShadow: `0 0 10px ${color}55`,
                  letterSpacing: "0.04em",
                }}>
                  {value}
                </div>
                <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.14em", marginTop: 5 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* bio block */}
          <div style={{
            border: "1px solid rgba(0,255,65,0.15)",
            background: "rgba(0,255,65,0.02)",
            padding: "1.25rem 1.5rem", marginBottom: "2rem",
            fontSize: 14, lineHeight: 1.85, color: "#999",
          }}>
            <div style={{ color: "#333", fontSize: 11, letterSpacing: "0.1em", marginBottom: 8 }}>
              $ cat about.txt
            </div>
            <p style={{ margin: 0, color: "#ccc" }}>
              CSE student passionate about{" "}
              <span style={{ color: "#00ff41" }}>full-stack development</span> and{" "}
              <span style={{ color: "#00ff41" }}>cybersecurity</span>. I build fast,
              ship often, and break things intentionally — so users don't have to
              find out the hard way.
            </p>
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: "1.75rem" }}>
            <a href={resumeUrl} download className="rcta-btn-dl">
              <Download size={16} />
              Download Resume
            </a>
            <a href={contactHref} className="rcta-btn-contact">
              <Mail size={16} />
              Get in Touch
            </a>
          </div>

          {/* footer links */}
          <div style={{
            borderTop: "1px solid rgba(0,255,65,0.12)",
            paddingTop: "1.1rem",
            display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap",
          }}>
            <a href={linkedInUrl} target="_blank" rel="noreferrer" style={{
              display: "flex", alignItems: "center", gap: 6,
              color: "#00aaff", fontSize: 12, letterSpacing: "0.1em",
              textDecoration: "none", opacity: 0.8,
              transition: "opacity 0.15s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
            >
              <ExternalLink size={13} /> LinkedIn
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" style={{
              display: "flex", alignItems: "center", gap: 6,
              color: "#00aaff", fontSize: 12, letterSpacing: "0.1em",
              textDecoration: "none", opacity: 0.8,
              transition: "opacity 0.15s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
            >
              <ExternalLink size={13} /> GitHub
            </a>
            <span style={{ marginLeft: "auto", color: "#2a2a2a", fontSize: 11, letterSpacing: "0.08em" }}>
              <FileText size={10} style={{ display: "inline", marginRight: 4 }} />
              v2.0 · available for internships &amp; freelance
            </span>
          </div>

        </div>
      </div>
    </div>
  </section>
);

export default ResumeCTA;