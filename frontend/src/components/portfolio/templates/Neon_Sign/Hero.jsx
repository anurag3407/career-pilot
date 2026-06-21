import React, { useEffect, useState } from "react";
import { motion as Motion, useAnimation } from "framer-motion";
import { Download, Eye, Zap, ArrowRight } from "lucide-react";

const flickerKeyframes = `
  @keyframes neonFlicker {
    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #ff2bd6, 0 0 82px #ff2bd6, 0 0 92px #ff2bd6, 0 0 102px #ff2bd6; }
    20%, 24%, 55% { opacity: 0.4; text-shadow: none; }
  }
  @keyframes neonFlickerBlue {
    0%, 18%, 22%, 26%, 53%, 57%, 100% { opacity: 1; text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #00d4ff, 0 0 82px #00d4ff, 0 0 92px #00d4ff; }
    19%, 25%, 54% { opacity: 0.5; text-shadow: none; }
  }
  @keyframes neonFlickerYellow {
    0%, 17%, 23%, 27%, 52%, 58%, 100% { opacity: 1; text-shadow: 0 0 7px #fff, 0 0 10px #ffd000, 0 0 21px #ffd000, 0 0 42px #ffd000, 0 0 82px #ffd000; }
    18%, 24%, 53% { opacity: 0.6; text-shadow: none; }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 20px #ff2bd6, 0 0 40px #ff2bd6, 0 0 80px #ff2bd640; }
    50% { box-shadow: 0 0 30px #ff2bd6, 0 0 60px #ff2bd6, 0 0 120px #ff2bd640; }
  }
  @keyframes neonTubeGlow {
    0%, 100% { box-shadow: 0 0 5px #00d4ff, 0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 40px #00d4ff; }
    50% { box-shadow: 0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 40px #00d4ff, 0 0 80px #00d4ff; }
  }
  @keyframes borderFlicker {
    0%, 19%, 21%, 23%, 100% { border-color: #ff2bd6; box-shadow: 0 0 15px #ff2bd6, inset 0 0 15px #ff2bd610; }
    20%, 22% { border-color: transparent; box-shadow: none; }
  }
  @keyframes rotateSlow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  .neon-text-pink { animation: neonFlicker 3s infinite; }
  .neon-text-blue { animation: neonFlickerBlue 2.5s infinite; }
  .neon-text-yellow { animation: neonFlickerYellow 4s infinite; }
  .neon-border-pink { animation: borderFlicker 3s infinite; }
  .neon-pulse { animation: pulseGlow 2s ease-in-out infinite; }
  .neon-tube { animation: neonTubeGlow 1.5s ease-in-out infinite; }
  .float-anim { animation: float 3s ease-in-out infinite; }
`;

export default function Hero({ data }) {
  const { personal, socials } = data;
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden py-16 px-4 md:px-8">
      <style>{flickerKeyframes}</style>

      {/* Brick Wall Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "#050505",
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 28px,
                rgba(0,0,0,0.8) 28px,
                rgba(0,0,0,0.8) 32px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 58px,
                rgba(0,0,0,0.6) 58px,
                rgba(0,0,0,0.6) 62px
              )
            `,
          }}
        />
        {/* Even-row brick offset */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 60px,
                transparent 60px,
                transparent 64px
              )
            `,
            backgroundSize: "120px 64px",
          }}
        />
        {/* Brick texture overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 20% 50%, #00d4ff15 0%, transparent 50%),
              radial-gradient(ellipse at 80% 30%, #ff2bd620 0%, transparent 50%),
              radial-gradient(ellipse at 50% 80%, #b026ff10 0%, transparent 40%)
            `,
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.9) 100%)",
          }}
        />
      </div>

      {/* Scanline effect */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.3) 2px, rgba(0,212,255,0.3) 4px)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Ambient neon spill lights */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full blur-[100px] bg-pink-600 opacity-10 pointer-events-none" />
      <div className="absolute top-40 right-20 w-80 h-80 rounded-full blur-[120px] bg-cyan-500 opacity-10 pointer-events-none" />
      <div className="absolute bottom-20 left-1/2 w-96 h-48 rounded-full blur-[80px] bg-purple-600 opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">

        {/* LEFT — Text Content */}
        <Motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-6 lg:col-span-1"
        >
          {/* HELLO I'M neon sign */}
          <div className="relative inline-block">
            <div
              className="inline-block px-4 py-2 rounded border-2 border-cyan-400 text-cyan-300 font-black text-sm md:text-base tracking-[0.3em] uppercase neon-tube"
              style={{
                fontFamily: "'Courier New', monospace",
                textShadow: "0 0 7px #00d4ff, 0 0 15px #00d4ff, 0 0 30px #00d4ff",
              }}
            >
              ⚡ HELLO, I'M
            </div>
          </div>

          {/* Name — big neon sign */}
          <div className="relative">
            <h1
              className={`text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-none tracking-tight neon-text-pink transition-all duration-75 ${glitchActive ? "translate-x-1 skew-x-1" : ""}`}
              style={{
                fontFamily: "'Courier New', monospace",
                color: "#fff",
                textShadow:
                  "0 0 7px #fff, 0 0 10px #fff, 0 0 21px #ff2bd6, 0 0 42px #ff2bd6, 0 0 82px #ff2bd6",
              }}
            >
              {personal.name.split(" ")[0]}
            </h1>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-none tracking-tight neon-text-blue mt-1"
              style={{
                fontFamily: "'Courier New', monospace",
                color: "#fff",
                textShadow:
                  "0 0 7px #fff, 0 0 10px #00d4ff, 0 0 21px #00d4ff, 0 0 42px #00d4ff, 0 0 82px #00d4ff",
              }}
            >
              {personal.name.split(" ").slice(1).join(" ")}
            </h1>
          </div>

          {/* Title neon strip */}
          <div
            className="relative px-5 py-3 border-2 border-yellow-400 rounded inline-block neon-text-yellow"
            style={{
              background: "rgba(255,208,0,0.05)",
              boxShadow: "0 0 15px #ffd000, inset 0 0 15px rgba(255,208,0,0.05)",
            }}
          >
            <p
              className="text-yellow-300 font-bold text-sm md:text-base tracking-wider uppercase"
              style={{
                fontFamily: "'Courier New', monospace",
                textShadow: "0 0 8px #ffd000, 0 0 16px #ffd000",
              }}
            >
              {personal.title}
            </p>
          </div>

          {/* Tagline */}
          <p
            className="text-gray-400 text-sm md:text-base leading-relaxed"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            {personal.tagline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mt-2">
            <Motion.a
              href={`#projects`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded border-2 border-pink-500 text-pink-300 font-black text-sm uppercase tracking-widest cursor-pointer transition-all"
              style={{
                fontFamily: "'Courier New', monospace",
                background: "rgba(255,43,214,0.08)",
                boxShadow: "0 0 15px #ff2bd640",
                textShadow: "0 0 8px #ff2bd6",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 30px #ff2bd6, inset 0 0 20px rgba(255,43,214,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 15px #ff2bd640";
              }}
            >
              <Eye size={16} />
              VIEW MY WORK
            </Motion.a>

            <Motion.a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 rounded border-2 border-cyan-400 text-cyan-300 font-black text-sm uppercase tracking-widest cursor-pointer transition-all"
              style={{
                fontFamily: "'Courier New', monospace",
                background: "rgba(0,212,255,0.08)",
                boxShadow: "0 0 15px #00d4ff40",
                textShadow: "0 0 8px #00d4ff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 30px #00d4ff, inset 0 0 20px rgba(0,212,255,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 15px #00d4ff40";
              }}
            >
              <Download size={16} />
              DOWNLOAD CV
            </Motion.a>
          </div>
        </Motion.div>

        {/* CENTER — Circular Avatar */}
        <Motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, type: "spring", stiffness: 100 }}
          className="flex flex-col items-center justify-center gap-6 lg:col-span-1"
        >
          {/* Neon frame ring around avatar */}
          <div className="relative flex items-center justify-center float-anim">
            {/* Outer spinning ring */}
            <div
              className="absolute w-72 h-72 rounded-full border-4 border-dashed border-pink-500 opacity-40"
              style={{ animation: "rotateSlow 12s linear infinite" }}
            />
            {/* Middle glowing ring */}
            <div
              className="absolute w-60 h-60 rounded-full border-2 border-cyan-400 neon-pulse"
            />
            {/* Inner neon frame */}
            <div
              className="relative w-52 h-52 rounded-full border-4 border-pink-400 overflow-hidden"
              style={{
                boxShadow:
                  "0 0 20px #ff2bd6, 0 0 40px #ff2bd6, 0 0 80px #ff2bd640, inset 0 0 20px #ff2bd610",
              }}
            >
              <img
                src={personal.avatar}
                alt={personal.name || "Profile Avatar"}
                className="w-full h-full object-cover"
              />
              {/* Neon overlay on avatar */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,43,214,0.15) 0%, transparent 50%, rgba(0,212,255,0.15) 100%)",
                }}
              />
            </div>

            {/* Decorative neon dots around avatar */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: i % 2 === 0 ? "#ff2bd6" : "#00d4ff",
                  boxShadow: `0 0 8px ${i % 2 === 0 ? "#ff2bd6" : "#00d4ff"}`,
                  transform: `rotate(${deg}deg) translateX(148px)`,
                  animation: `neonFlicker ${2 + i * 0.3}s infinite`,
                }}
              />
            ))}
          </div>

          {/* Name badge below avatar */}
          <div
            className="px-6 py-2 rounded border border-yellow-400 text-yellow-300 text-xs font-black tracking-[0.25em] uppercase text-center"
            style={{
              background: "rgba(255,208,0,0.05)",
              boxShadow: "0 0 12px #ffd00050",
              fontFamily: "'Courier New', monospace",
              textShadow: "0 0 8px #ffd000",
            }}
          >
            ✦ AVAILABLE FOR WORK ✦
          </div>
        </Motion.div>

        {/* RIGHT — Neon Billboard decorations */}
        <Motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col items-center gap-6 lg:col-span-1"
        >
          {/* Arrow billboard sign */}
          <div
            className="w-full max-w-xs p-5 rounded-lg border-2 border-orange-400 relative"
            style={{
              background: "rgba(255,140,0,0.05)",
              boxShadow: "0 0 20px #ff8c00, 0 0 40px #ff8c0040",
            }}
          >
            <div
              className="text-orange-300 font-black text-lg uppercase tracking-widest text-center"
              style={{
                fontFamily: "'Courier New', monospace",
                textShadow: "0 0 10px #ff8c00, 0 0 20px #ff8c00",
              }}
            >
              ➤ PORTFOLIO ➤
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <ArrowRight className="text-orange-400" size={20} />
              <span
                className="text-orange-400 text-xs font-bold tracking-widest"
                style={{ textShadow: "0 0 8px #ff8c00" }}
              >
                OPEN 24/7
              </span>
            </div>
          </div>

          {/* Cactus neon sign */}
          <div
            className="w-full max-w-xs p-5 rounded-lg border-2 border-green-400 text-center"
            style={{
              background: "rgba(57,255,20,0.05)",
              boxShadow: "0 0 20px #39ff14, 0 0 40px #39ff1440",
            }}
          >
            <div
              className="text-5xl float-anim"
              style={{ filter: "drop-shadow(0 0 10px #39ff14)" }}
            >
              🌵
            </div>
            <div
              className="text-green-300 font-black text-xs uppercase tracking-widest mt-2"
              style={{
                fontFamily: "'Courier New', monospace",
                textShadow: "0 0 8px #39ff14",
              }}
            >
              CODE IS ART
            </div>
          </div>

          {/* Lightning sign */}
          <div
            className="w-full max-w-xs p-4 rounded-lg border-2 border-purple-400 flex items-center justify-center gap-3"
            style={{
              background: "rgba(176,38,255,0.05)",
              boxShadow: "0 0 20px #b026ff, 0 0 40px #b026ff40",
            }}
          >
            <Zap
              size={28}
              className="text-purple-300 float-anim"
              style={{ filter: "drop-shadow(0 0 8px #b026ff)" }}
            />
            <div>
              <div
                className="text-purple-300 font-black text-sm uppercase tracking-widest"
                style={{
                  fontFamily: "'Courier New', monospace",
                  textShadow: "0 0 8px #b026ff",
                }}
              >
                POWERED BY
              </div>
              <div
                className="text-purple-400 font-black text-xs tracking-widest"
                style={{ textShadow: "0 0 5px #b026ff" }}
              >
                CREATIVITY
              </div>
            </div>
          </div>

          {/* Location indicator */}
          <div
            className="w-full max-w-xs px-4 py-3 rounded border border-cyan-500 flex items-center gap-2"
            style={{
              background: "rgba(0,212,255,0.04)",
              boxShadow: "0 0 10px #00d4ff30",
            }}
          >
            <span
              className="text-cyan-400 text-lg"
              style={{ filter: "drop-shadow(0 0 6px #00d4ff)" }}
            >
              📍
            </span>
            <span
              className="text-cyan-300 text-xs font-bold tracking-widest uppercase"
              style={{
                fontFamily: "'Courier New', monospace",
                textShadow: "0 0 6px #00d4ff",
              }}
            >
              {personal.location}
            </span>
          </div>
        </Motion.div>
      </div>
    </section>
  );
}
