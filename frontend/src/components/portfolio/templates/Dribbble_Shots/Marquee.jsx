import { motion } from "framer-motion";

export default function Marquee({ texts }) {
  const items = [...texts, ...texts, ...texts, ...texts];
  return (
    <div className="overflow-hidden border-y border-[#ea4c89]/12 py-3 my-0 bg-white/40 backdrop-blur-sm">
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-25%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {items.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-4 text-[10px] tracking-[0.3em] uppercase text-[#ea4c89]/50 font-semibold"
          >
            {t}
            <span className="text-[#ea4c89]/25">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}