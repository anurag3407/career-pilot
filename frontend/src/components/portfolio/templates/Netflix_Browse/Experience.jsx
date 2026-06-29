import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";

export default function Experience({ experience }) {
  return (
    <section id="experience" className="py-10 px-4 md:px-12">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-white text-xl md:text-2xl font-bold tracking-wide mb-8"
      >
        💼 Experience
      </motion.h2>

      {/* Horizontal scroll row */}
      <div
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {experience.map((exp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="flex-shrink-0 w-80 md:w-96 bg-[#1f1f1f] rounded-xl p-5 border border-white/5 hover:border-[#E50914]/40 transition-all duration-300 group"
          >
            {/* Top: number badge + company */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-[#E50914]" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">{exp.company}</p>
                  <p className="text-[#E50914] text-xs font-semibold mt-0.5">{exp.role}</p>
                </div>
              </div>
              {/* Episode number style */}
              <span className="text-[#737373] text-3xl font-black leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Period */}
            <div className="flex items-center gap-1.5 text-[#737373] text-xs mb-3">
              <Calendar className="w-3 h-3" />
              {exp.period}
            </div>

            {/* Description */}
            <p className="text-[#a3a3a3] text-sm leading-relaxed">{exp.description}</p>

            {/* Bottom red bar on hover */}
            <div className="mt-4 h-0.5 bg-[#E50914]/0 group-hover:bg-[#E50914]/60 transition-all duration-300 rounded-full" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
