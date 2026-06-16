import { useEffect, useRef, useState, useMemo } from "react";
import { usePortfolio, normalizePortfolioData } from "../../../../context/PortfolioContext.jsx";

// ─── Pixel Storm Portfolio Template ───────────────────────────────────────────
// A living CRT terminal — pixel rain assembles your identity, then glitches
// into generative art. Scanlines, chromatic aberration, perpetual motion.
const PALETTE = [
  "#00ff41", "#00e5ff", "#ff00ff", "#ffea00",
  "#ff4444", "#7b2fff", "#00ffaa", "#ff6b00",
];
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─── Canvas: Pixel Rain + Glitch Engine ───────────────────────────────────────
function PixelCanvas({ active }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const dropsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      // Re-init drops on resize
      const cols = Math.floor(canvas.width / 14);
      dropsRef.current = Array.from({ length: cols }, () => randomInt(-60, 0));
    };
    resize();
    window.addEventListener("resize", resize);

    let tick = 0;

    const draw = () => {
      tick++;
      const w = canvas.width;
      const h = canvas.height;

      // Fade trail — CRT phosphor persistence
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, w, h);

      const drops = dropsRef.current;
      const cols = drops.length;
      const charH = 14;

      for (let i = 0; i < cols; i++) {
        const y = drops[i] * charH;
        if (y < 0) { drops[i]++; continue; }

        // Chromatic aberration offset on glitch frames
        const glitch = tick % 47 < 3;
        const color = PALETTE[i % PALETTE.length];

        // Draw pixel block (not text — pure pixel art)
        const size = randomInt(4, 10);
        const x = i * 14 + randomInt(-2, 2);

        if (glitch) {
          ctx.fillStyle = "#ff00ff44";
          ctx.fillRect(x - 3, y, size + 6, size);
          ctx.fillStyle = "#00ffff44";
          ctx.fillRect(x + 3, y, size + 6, size);
        }

        ctx.fillStyle = color;
        ctx.globalAlpha = randomInt(6, 10) / 10;
        ctx.fillRect(x, y, size, size);
        ctx.globalAlpha = 1;

        // Bright head pixel
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x + 1, y + 1, 2, 2);

        // Reset drop
        if (y > h && Math.random() > 0.975) drops[i] = randomInt(-30, 0);
        else drops[i]++;
      }

      // Scanlines overlay every 2px
      if (tick % 3 === 0) {
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        for (let y = 0; y < h; y += 4) {
          ctx.fillRect(0, y, w, 1);
        }
      }

      // Random glitch bar
      if (tick % 60 < 2) {
        const barY = randomInt(0, h);
        const barH2 = randomInt(2, 8);
        ctx.fillStyle = `rgba(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)},0.15)`;
        ctx.fillRect(0, barY, w, barH2);
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: active ? 1 : 0,
        transition: "opacity 1.2s ease",
      }}
    />
  );
}

// ─── Glitch Text Component ─────────────────────────────────────────────────────
function GlitchText({ text, size = 48, color = "#00ff41", delay = 0 }) {
  const [displayed, setDisplayed] = useState("");
  const [glitching, setGlitching] = useState(false);
  const CHARS = "█▓▒░▄▀■□▪▫01";

  useEffect(() => {
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i >= text.length) { clearInterval(interval); setDisplayed(text); return; }
      setDisplayed(
        text.slice(0, i) +
        CHARS[randomInt(0, CHARS.length - 1)] +
        text.slice(i + 1)
      );
      i++;
    }, 60);

    const glitchLoop = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 120);
    }, 3000 + randomInt(0, 2000));

    return () => { clearInterval(interval); clearInterval(glitchLoop); };
  }, [text]);

  return (
    <span
      style={{
        fontSize: size,
        fontFamily: "'Courier New', monospace",
        fontWeight: 900,
        color: glitching ? "#ff00ff" : color,
        textShadow: glitching
          ? `3px 0 #ff0000, -3px 0 #00ffff, 0 0 30px ${color}`
          : `0 0 20px ${color}, 0 0 40px ${color}88`,
        letterSpacing: 2,
        display: "inline-block",
        transform: glitching ? `translateX(${randomInt(-4, 4)}px)` : "none",
        transition: "color 0.05s, transform 0.05s",
        animationDelay: `${delay}ms`,
      }}
    >
      {displayed}
    </span>
  );
}

// ─── Pixel Corner Decoration ───────────────────────────────────────────────────
function PixelCorner({ pos }) {
  const corners = {
    tl: { top: 0, left: 0 },
    tr: { top: 0, right: 0 },
    bl: { bottom: 0, left: 0 },
    br: { bottom: 0, right: 0 },
  };
  const colors = PALETTE.slice(0, 4);
  const pixels = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        bg: Math.random() > 0.4 ? colors[i % colors.length] : "transparent",
        opacity: Math.random() * 0.8 + 0.2,
        duration: randomInt(8, 20) / 10,
        delay: randomInt(0, 10) / 10,
      })),
    []
  );
  return (
    <div style={{ position: "absolute", ...corners[pos], padding: 8, display: "grid", gridTemplateColumns: "repeat(4,8px)", gap: 3 }}>
      {pixels.map((px, i) => (
        <div
          key={i}
          style={{
            width: 8, height: 8,
            background: px.bg,
            opacity: px.opacity,
            animation: `pixelPulse ${px.duration}s ${px.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Social Link ──────────────────────────────────────────────────────────────
function PixelLink({ href, label, color }) {
  const [hov, setHov] = useState(false);
  if (!href) return null;
  return (
    <a
      href={href} target="_blank" rel="noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-block",
        padding: "8px 20px",
        fontFamily: "'Courier New', monospace",
        fontSize: 13,
        fontWeight: 700,
        color: hov ? "#000" : color,
        background: hov ? color : "transparent",
        border: `2px solid ${color}`,
        textDecoration: "none",
        letterSpacing: 2,
        textTransform: "uppercase",
        boxShadow: hov ? `0 0 20px ${color}, 0 0 40px ${color}66` : `0 0 8px ${color}44`,
        transition: "all 0.15s",
        imageRendering: "pixelated",
      }}
    >
      {label}
    </a>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function PixelCard({ children, color = "#00ff41", delay = 0 }) {
  return (
    <a
      style={{
        border: `1px solid ${color}44`,
        padding: "24px 28px",
        position: "relative",
        background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)`,
        animation: `fadeSlideUp 0.7s ${delay}ms both`,
      }}
    >
      {/* Pixel corner accents */}
      {[
        { top: -2, left: -2 }, { top: -2, right: -2 },
        { bottom: -2, left: -2 }, { bottom: -2, right: -2 },
      ].map((pos, i) => (
        <div key={i} style={{ position: "absolute", ...pos, width: 8, height: 8, background: color }} />
      ))}
      {children}
    </a>
  );
}

// ─── Main Template ─────────────────────────────────────────────────────────────
export default function OnePixelMaster({ portfolioData }) {
  const ctx = usePortfolio();
  const raw = portfolioData || ctx?.portfolioData || {};
  const data = normalizePortfolioData(raw);

  const [booted, setBooted] = useState(false);
  const [bootLines, setBootLines] = useState([]);

  const name = data.personal?.name || "YOUR NAME";
  const title = data.personal?.title || "Full Stack Developer";
  const bio = data.personal?.bio || "Building the future, one pixel at a time.";
  const email = data.socials?.email || "";
  const github = data.socials?.github || "";
  const linkedin = data.socials?.linkedin || "";

  const skills = data.skills || [];
  const projects = data.projects || [];
  const experience = data.experience || [];

  // Boot sequence animation
  const BOOT_LINES = [
    "PIXEL_OS v1.0 — INITIALIZING...",
    "Loading neural interface... [OK]",
    "Mounting creative core........ [OK]",
    "Calibrating pixel matrix...... [OK]",
    `Identity resolved: ${name.toUpperCase()}`,
    "Rendering portfolio canvas..... [DONE]",
    ">>> WELCOME TO THE PIXEL STORM <<<",
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= BOOT_LINES.length) {
        clearInterval(interval);
        setTimeout(() => setBooted(true), 400);
        return;
      }
      setBootLines(prev => [...prev, BOOT_LINES[i]]);
      i++;
    }, 350);
    return () => clearInterval(interval);
  }, [name]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#020202",
      color: "#00ff41",
      fontFamily: "'Courier New', monospace",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Keyframe styles injected */}
      <style>{`
        @keyframes pixelPulse {
          from { opacity: 0.2; transform: scale(0.8); }
          to   { opacity: 1;   transform: scale(1.1); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }
        @keyframes borderFlow {
          0%   { border-color: #00ff4188; }
          33%  { border-color: #00e5ff88; }
          66%  { border-color: #ff00ff88; }
          100% { border-color: #00ff4188; }
        }
      `}</style>

      {/* Live pixel rain canvas — always running in background */}
      <PixelCanvas active={true} />

      {/* Moving scanline */}
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: "3px",
        background: "linear-gradient(90deg, transparent, #00ff4133, #00ff41, #00ff4133, transparent)",
        animation: "scanline 8s linear infinite",
        zIndex: 10,
        pointerEvents: "none",
      }} />

      {/* Pixel corner decorations */}
      <PixelCorner pos="tl" />
      <PixelCorner pos="tr" />
      <PixelCorner pos="bl" />
      <PixelCorner pos="br" />

      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 5,
        maxWidth: 960,
        margin: "0 auto",
        padding: "60px 32px",
      }}>

        {/* ── BOOT SEQUENCE ── */}
        {!booted && (
          <div style={{
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 10,
          }}>
            {bootLines.map((line, i) => (
              <div key={i} style={{
                fontSize: 15,
                color: i === bootLines.length - 1 ? "#ffea00" : "#00ff41",
                textShadow: "0 0 10px currentColor",
                animation: "fadeSlideUp 0.3s both",
              }}>
                {"> "}{line}
              </div>
            ))}
            <div style={{
              width: 12, height: 20,
              background: "#00ff41",
              display: "inline-block",
              animation: "blink 0.7s infinite",
              marginTop: 4,
            }} />
          </div>
        )}

        {/* ── MAIN CONTENT — shown after boot ── */}
        {booted && (
          <>
            {/* Hero */}
            <div style={{
              textAlign: "center",
              marginBottom: 80,
              animation: "fadeSlideUp 0.8s both",
            }}>
              <div style={{ fontSize: 11, letterSpacing: 6, color: "#00ff4188", marginBottom: 24 }}>
                ■ ■ ■ &nbsp; PIXEL_PORTFOLIO &nbsp; ■ ■ ■
              </div>

              <div style={{ marginBottom: 16 }}>
                <GlitchText text={name.toUpperCase()} size={56} color="#00ff41" />
              </div>

              <div style={{ marginBottom: 32 }}>
                <GlitchText text={`[ ${title} ]`} size={20} color="#00e5ff" delay={200} />
              </div>

              <p style={{
                maxWidth: 560,
                margin: "0 auto 40px",
                fontSize: 14,
                lineHeight: 1.8,
                color: "#00ff4199",
                letterSpacing: 1,
              }}>
                {bio}
              </p>

              {/* Social Links */}
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                {email && <PixelLink href={`mailto:${email}`} label="EMAIL" color="#00ff41" />}
                {github && <PixelLink href={github.startsWith("http") ? github : `https://github.com/${github}`} label="GITHUB" color="#00e5ff" />}
                {linkedin && <PixelLink href={linkedin.startsWith("http") ? linkedin : `https://linkedin.com/in/${linkedin}`} label="LINKEDIN" color="#ff00ff" />}
              </div>
            </div>

            {/* Divider */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 56,
              animation: "fadeSlideUp 0.8s 200ms both",
            }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #00ff4166)" }} />
              <div style={{ fontSize: 10, letterSpacing: 4, color: "#00ff4166" }}>▓▒░ SYSTEM DATA ░▒▓</div>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #00ff4166, transparent)" }} />
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div style={{ marginBottom: 56, animation: "fadeSlideUp 0.8s 300ms both" }}>
                <div style={{ fontSize: 11, letterSpacing: 4, color: "#ff00ff", marginBottom: 20 }}>
                  &gt; SKILL_MATRIX.exe
                </div>
                <PixelCard color="#ff00ff" delay={300}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    {skills.map((skill, i) => {
                      const sk = typeof skill === "string" ? skill : skill.name || skill;
                      const col = PALETTE[i % PALETTE.length];
                      return (
                        <div key={i} style={{
                          padding: "6px 14px",
                          border: `1px solid ${col}66`,
                          fontSize: 12,
                          color: col,
                          letterSpacing: 1,
                          textShadow: `0 0 8px ${col}`,
                          background: `${col}11`,
                          fontWeight: 700,
                        }}>
                          {sk.toString().toUpperCase()}
                        </div>
                      );
                    })}
                  </div>
                </PixelCard>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div style={{ marginBottom: 56, animation: "fadeSlideUp 0.8s 400ms both" }}>
                <div style={{ fontSize: 11, letterSpacing: 4, color: "#ffea00", marginBottom: 20 }}>
                  &gt; PROJECT_ARCHIVE.db
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                  {projects.map((proj, i) => {
                    const col = PALETTE[(i + 2) % PALETTE.length];
                    const pname = proj.name || proj.title || `Project ${i + 1}`;
                    const pdesc = proj.description || proj.desc || "";
                    const plink = proj.link || proj.url || proj.github || "";
                    return (
                      <PixelCard key={i} color={col} delay={400 + i * 80}>
                        <div style={{
                          fontSize: 10,
                          letterSpacing: 3,
                          color: `${col}88`,
                          marginBottom: 8,
                        }}>
                          PROJECT_{String(i + 1).padStart(3, "0")}
                        </div>
                        <div style={{
                          fontSize: 16,
                          fontWeight: 900,
                          color: col,
                          textShadow: `0 0 12px ${col}`,
                          marginBottom: 10,
                          letterSpacing: 1,
                        }}>
                          {pname}
                        </div>
                        {pdesc && (
                          <p style={{ fontSize: 12, color: "#ffffff88", lineHeight: 1.7, marginBottom: 14 }}>
                            {pdesc}
                          </p>
                        )}
                        {plink && (
                          <a href={plink} target="_blank" rel="noreferrer" style={{
                            fontSize: 11,
                            color: col,
                            textDecoration: "none",
                            letterSpacing: 2,
                            borderBottom: `1px solid ${col}44`,
                          }}>
                            &gt; VIEW_PROJECT
                          </a>
                        )}
                      </PixelCard>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <div style={{ marginBottom: 56, animation: "fadeSlideUp 0.8s 500ms both" }}>
                <div style={{ fontSize: 11, letterSpacing: 4, color: "#00e5ff", marginBottom: 20 }}>
                  &gt; EXPERIENCE_LOG.txt
                </div>
                {experience.map((exp, i) => {
                  const col = PALETTE[(i + 4) % PALETTE.length];
                  const company = exp.company || exp.organization || "";
                  const role = exp.role || exp.position || exp.title || "";
                  const period = exp.period || exp.duration || exp.date || "";
                  const desc = exp.description || exp.desc || "";
                  return (
                    <PixelCard key={i} color={col} delay={500 + i * 80}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 900, color: col, textShadow: `0 0 10px ${col}` }}>
                            {role}
                          </div>
                          <div style={{ fontSize: 13, color: "#ffffff88", marginTop: 4 }}>
                            {company}
                          </div>
                        </div>
                        {period && (
                          <div style={{ fontSize: 11, color: `${col}88`, letterSpacing: 2, paddingTop: 4 }}>
                            {period}
                          </div>
                        )}
                      </div>
                      {desc && (
                        <p style={{ fontSize: 12, color: "#ffffff66", lineHeight: 1.8, marginTop: 12 }}>
                          {desc}
                        </p>
                      )}
                    </PixelCard>
                  );
                })}
              </div>
            )}

            {/* Footer */}
            <div style={{
              textAlign: "center",
              paddingTop: 40,
              borderTop: "1px solid #00ff4122",
              animation: "fadeSlideUp 0.8s 600ms both",
            }}>
              <div style={{ fontSize: 10, letterSpacing: 4, color: "#00ff4144" }}>
                ■ PIXEL_MASTER © {new Date().getFullYear()} ■ BUILT WITH CHAOS ■
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}