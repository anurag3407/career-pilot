import { motion } from "framer-motion";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Warm white base */}
      <div className="absolute inset-0 bg-[#faf9f7]" />

      {/* Soft pink/peach floating orbs */}
      {[
        { cx: "10%",  cy: "15%", r: 380, delay: 0,   dur: 16, color: "rgba(234,76,137,0.07)" },
        { cx: "85%",  cy: "8%",  r: 300, delay: 2,   dur: 20, color: "rgba(255,180,210,0.09)" },
        { cx: "65%",  cy: "70%", r: 420, delay: 4,   dur: 13, color: "rgba(234,76,137,0.06)" },
        { cx: "5%",   cy: "75%", r: 240, delay: 1,   dur: 22, color: "rgba(255,150,195,0.08)" },
        { cx: "90%",  cy: "50%", r: 280, delay: 3,   dur: 17, color: "rgba(234,76,137,0.05)" },
        { cx: "45%",  cy: "30%", r: 200, delay: 1.5, dur: 19, color: "rgba(255,100,170,0.06)" },
      ].map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: b.cx, top: b.cy,
            width: b.r * 2, height: b.r * 2,
            translateX: "-50%", translateY: "-50%",
            background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
          animate={{
            scale: [1, 1.18, 0.93, 1.12, 1],
            x: [0, 25, -18, 12, 0],
            y: [0, -20, 18, -8, 0],
          }}
          transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, #ea4c89 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Faint horizontal lines */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, #ea4c89 0px, #ea4c89 1px, transparent 1px, transparent 80px)",
        }}
      />
    </div>
  );
}