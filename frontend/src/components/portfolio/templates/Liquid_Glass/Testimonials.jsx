import React from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] ${className}`}
  >
    {children}
  </div>
);

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Testimonials({ data }) {
  return (
    <section className="relative px-6 py-20 text-left">
      <div className="absolute bottom-0 right-1/3 w-72 h-72 rounded-full bg-cyan-500/20 blur-[100px] pointer-events-none" />
      <motion.div
        className="max-w-5xl mx-auto"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10">
          <MessageSquare size={20} className="text-cyan-400" />
          <h2 className="text-3xl font-black text-white">Testimonials</h2>
        </motion.div>

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(data.testimonials || []).map((t, index) => (
            <motion.div key={index} variants={fadeUp}>
              <GlassCard className="p-6 h-full flex flex-col">
                <div className="text-cyan-400 text-3xl mb-3">"</div>
                <p className="text-white/70 text-sm leading-relaxed flex-1 mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  {t.avatar && (
                    <img
                      src={t.avatar}
                      alt={t.name || "Profile Avatar"}
                      className="w-10 h-10 rounded-full object-cover border border-white/20"
                    />
                  )}
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-white/40 text-xs">{t.role}</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
