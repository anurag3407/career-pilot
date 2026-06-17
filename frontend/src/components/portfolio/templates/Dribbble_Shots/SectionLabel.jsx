import { motion } from "framer-motion";

export default function SectionLabel({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3 mb-3"
    >
      <span className="h-px w-8 bg-[#ea4c89]" />
      <span className="text-[#ea4c89] text-[10px] tracking-[0.3em] uppercase font-semibold">{children}</span>
    </motion.div>
  );
}