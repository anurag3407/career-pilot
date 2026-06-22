import React from "react";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-950">

      {/* NOISE GRID (premium texture) */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)",
          backgroundSize: "42px 42px",
        }}
      />

      {/* ========================= */}
      {/* FULL SCREEN MESH LAYERS */}
      {/* ========================= */}

      {/* TOP LEFT MASS */}
      <div className="absolute w-[700px] h-[700px] bg-pink-500/30 blur-[160px] top-[-250px] left-[-250px]" />

      {/* TOP CENTER SHIFT */}
      <div className="absolute w-[600px] h-[600px] bg-purple-500/25 blur-[170px] top-[-200px] left-[35%]" />

      {/* TOP RIGHT MASS */}
      <div className="absolute w-[750px] h-[750px] bg-cyan-400/25 blur-[180px] top-[-300px] right-[-300px]" />

      {/* LEFT MID FILL */}
      <div className="absolute w-[650px] h-[650px] bg-indigo-500/20 blur-[170px] top-[30%] left-[-300px]" />

      {/* CENTER CORE GLOW */}
      <div className="absolute w-[800px] h-[800px] bg-white/5 blur-[200px] top-[30%] left-[50%] -translate-x-1/2" />

      {/* RIGHT MID FILL */}
      <div className="absolute w-[650px] h-[650px] bg-pink-400/20 blur-[170px] top-[35%] right-[-250px]" />

      {/* BOTTOM LEFT MASS */}
      <div className="absolute w-[750px] h-[750px] bg-purple-600/20 blur-[190px] bottom-[-300px] left-[-250px]" />

      {/* BOTTOM CENTER SHIFT */}
      <div className="absolute w-[600px] h-[600px] bg-cyan-500/20 blur-[180px] bottom-[-250px] left-[40%]" />

      {/* BOTTOM RIGHT MASS */}
      <div className="absolute w-[800px] h-[800px] bg-indigo-500/25 blur-[200px] bottom-[-320px] right-[-320px]" />

      {/* VIGNETTE (FOCUS CONTROL) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.35)_55%,rgba(0,0,0,0.85)_100%)]" />

    </div>
  );
}